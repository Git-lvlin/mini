import { IMG_CDN } from '../../constants/common';
import create from '../../utils/create';
import store from '../../store/index';
import { debounce, showModal, showToast, throttle } from '../../utils/tools';
import goodApi from '../../apis/good';
import commonApi from '../../apis/common';
import router from '../../utils/router';
import amapFile from '../../libs/amap-wx';
import { MAP_KEY } from '../../constants/index';

const myAmapFun = new amapFile.AMapWX({
  key: MAP_KEY,
});
let markersData = [];
const defLocation = {
  longitude: 116.39731407,
  latitude: 39.90874867,
};
const deflocationIcon = `${IMG_CDN}miniprogram/location/def_location.png?V=465656`;

const app = getApp();
create.Page(store, {
  use: [
    "systemInfo",
  ],

  // 当前位置经纬度
  location: {},
  openLocation: false,
  fristLoad: true,

  // 值单位 px
  touchMove: {
    start: 0,
    max: 60,
  },

  data: {
    markers: [],
    latitude: defLocation.latitude,
    longitude: defLocation.longitude,
    textData: {},
    showPopup: false,
    spotBottom: 0,
    barState: true,
    currentSpot: {},
    listIsLoad: false,
    // 当前定位城市
    cityData: {},
    // 搜索地址列表
    addMarkers: [],
    // 显示搜索地址
    showAddress: false,
    mapScale: 13,
    inputText: '',
  },

  onShow() {
    const that = this;
    const takeSpot = wx.getStorageSync("TAKE_SPOT") || "";
    if(takeSpot && takeSpot.latitude) {
      that.setData({
        currentSpot: takeSpot,
        latitude: takeSpot.latitude,
        longitude: takeSpot.longitude,
      }, () => {
        that.getNearbyStore({
          latitude: takeSpot.latitude,
          longitude: takeSpot.longitude,
        });
      });
      that.location = takeSpot;
      this.getRegeo();
      that.openLocation = true;
    } else {
      wx.getLocation({
        type: 'gps84',
        altitude: false,
        success(result) {
          that.fristLoad = false;
          let data = {
            latitude: result.latitude,
            longitude: result.longitude,
          }
          that.openLocation = true;
          that.setData(data);
          !takeSpot && that.getNearbyStore(data);
        },
        fail(err) {
          that.openLocation = false;
          that.openLocationTip();
          !takeSpot && that.getNearbyStore(defLocation);
        },
      });
    }
  },

  // 定位提示
  openLocationTip(goBack = false) {
    showModal({
      content: "获取不到您的位置呢，请确认手机定位是否开始",
      showCancel: goBack,
      cancel() {
        router.go();
      },
    });
  },

  // 附近店铺
  getNearbyStore(data) {
    let {
      currentSpot,
    } = this.data;
    goodApi.getNearbyStore({
      radius: 50000,
      unit: 'm',
      limit: 200,
      ...data,
    }).then(res => {
      let list = [];
      let fullAddress = "";
      let selected = false;
      let tempData = {};
      if(res.length > 0) {
        res.forEach((item, index) => {
          // 遍历地址
          fullAddress = "";
          selected = false;
          for(let str in item.areaInfo) {
            fullAddress += item.areaInfo[str];
          }
          fullAddress += item.address;
          item.fullAddress = fullAddress;
          tempData = {
            ...item,
            width: 23,
            height: 32,
            id: 10 + index,
            selected,
            iconPath: deflocationIcon,
          }
          if(currentSpot.storeNo == item.storeNo) {
            tempData.selected = true;
            currentSpot = tempData;
            wx.setStorage({
              key: "TAKE_SPOT",
              data: tempData,
            });
          }

          list.push(tempData)
        })
        this.location = data;
        this.getRegeo();
        this.setData({
          markers: list,
          listIsLoad: true,
          currentSpot,
        }, () => {
          if(list.length) {
            this.onCurrentSpot();
          }
        });
      } else {
        this.setData({
          markers: [],
          listIsLoad: true,
        });
      }
    })
  },

  // 点击搜索框
  onSearchInput() {
    if(!this.openLocation) {
      this.openLocationTip(true);
      return;
    }
    router.push({
      name: 'locationSearch',
      data: this.location
    })
  },

  // 点击地图自提点
  makertap(e) {
    this.setMarket(e.markerId);
  },

  // 点击当前自提点
  onCurrentSpot() {
    const {
      markers,
      currentSpot,
    } = this.data;
    currentSpot.selected = true;
    markers.forEach(item => {
      if(item.storeNo == currentSpot.storeNo) {
        item.iconPath = item.storeLogo;
        item.width = 36;
        item.height = 36;
        item.selected = true;
        item.zIndex = 5;
      } else {
        item.iconPath = deflocationIcon;
        item.width = 23;
        item.height = 32;
        item.selected = false;
        item.zIndex = 0;
      }
    });
    this.setData({
      currentSpot,
      markers,
      latitude: currentSpot.latitude,
      longitude: currentSpot.longitude,
    });
  },

  // 点击列表自提点
  onTakeSpot({
    detail
  }) {
    if(!detail.isCurrent) {
      this.setMarket(detail.id);
      this.setData({
        latitude: detail.latitude,
        longitude: detail.longitude,
      });
    }
  },

  // 设置market
  setMarket(id) {
    let {
      markers,
      currentSpot,
      selectSpot,
    } = this.data;
    const idx = id - 10;
    markers.forEach((item, index) => {
      if(idx === index) {
        item.iconPath = item.storeLogo;
        item.width = 36;
        item.height = 36;
        item.selected = true;
        item.zIndex = 5;
        selectSpot = item;
      } else {
        item.iconPath = deflocationIcon;
        item.width = 23;
        item.height = 32;
        item.selected = false;
        item.zIndex = 0;
      }
    });
    currentSpot.selected = false;
    this.setData({
      currentSpot,
      selectSpot,
      markers,
    });
  },
  
  // 确认自提点
  onConfirm() {
    const {
      currentSpot,
      selectSpot,
    } = this.data;
    let marketSelect = {};
    if (currentSpot.selected) {
      marketSelect = currentSpot;
    } else if(selectSpot.selected) {
      marketSelect = selectSpot;
    }
    if(!marketSelect.storeNo) {
      showToast({ title: "请选择自提点" });
      return;
    }
    app.trackEvent('goods_selected_pick_up_point', {
      storeNo: marketSelect.storeNo
    });
    wx.setStorageSync("TAKE_SPOT", marketSelect);
    router.go();
  },

  // 点击列表bar
  onClickBarLine() {
    const {
      barState,
    } = this.data;
    this.setData({
      barState: !barState,
    })
  },

  // 监听移动bar
  handleTouchStart({ changedTouches }) {
    let data = changedTouches[0];
    this.touchMove.start = data.pageY;
  },

  // 监听移动bar
  handleTouchMove({ changedTouches }) {
    const data = changedTouches[0];
    let spotBottom = 0;
    const move = data.pageY;
    const {
      start,
      max,
    } = this.touchMove;
    const {
      systemInfo,
    } = this.store.data;
    if(move >= start) {
      const num = move - start;
      spotBottom = num > max ? max : num;
      spotBottom = spotBottom * systemInfo.rpxRatio;
      throttle(() => {
        this.setData({
          spotBottom
        });
      }, 100)();
    }
  },

  // 监听移动bar
  handleTouchEnd({ changedTouches }) {
    let data = changedTouches[0];
    let spotBottom = 0;
    const end = data.pageY;
    const {
      start,
      max,
    } = this.touchMove;
    const {
      systemInfo,
    } = this.store.data;
    if(end >= start) {
      const num = end - start;
      spotBottom = num > max ? max : num;
      spotBottom = spotBottom * systemInfo.rpxRatio;
    } else {
      spotBottom = 0;
    }
    this.setData({
      spotBottom
    })
  },

  // =============================  搜索地址
  handleInput({
    detail
  }) {
    const inputText = detail.value;
    debounce(() => {
      this.setData({
        inputText
      });
      if(inputText == '') {
        this.setData({
          showAddress: false
        })
        return;
      }
      this.getPoiAround(inputText);
    }, 500)();
  },

  // 根据经纬度获取地址信息
  getRegeo() {
    const that = this;
    const {
      longitude,
      latitude,
    } = this.location;
    myAmapFun.getRegeo({
      location: `${longitude},${latitude}`,
      success(data){
        if(data.length > 0) {
          const {
            addressComponent,
          } = data[0].regeocodeData;
          this.selectLocation = addressComponent.streetNumber.location;
          that.setData({
            cityData: addressComponent,
          });
        }
      },
    })
  },

  // 获取附近的点
  getPoiAround(inputText) {
    let that = this;
    let tempCity = "";
    const {
      cityData,
    } = this.data;
    const {
      city,
      province,
    } = cityData;
    // if(province == city || province != city && city != "县") {
    //   tempCity = province;
    // } else {
    //   tempCity = `${province}${city}${inputText}`
    // }
    let querykeywords = inputText;
    console.log('querykeywords', querykeywords)
    myAmapFun.getPoiAround({
      querykeywords,
      location: this.selectLocation,
      success(data) {
        const addMarkers = data.markers;
        addMarkers.length && addMarkers.forEach(item => {
          item.nameArr = that.getTextKey(item.name, querykeywords);
        });
        const sdata = {
          addMarkers,
        };
        if(addMarkers.length) {
          sdata.showAddress = true
        }
        that.setData(sdata, () => {
          if(!addMarkers.length) {
            showToast({ title: "没有结果呢" });
          }
        });
      },
      fail(info) {
        showToast({ title: info.errMsg });
      }
    })
  },

  handleCloseAddress() {
    this.setData({
      showAddress: false
    })
  },

  // 获取高亮文字
  getTextKey(str) {
    const {
      inputText,
    } = this.data;
    const arr = [];
    if(str.indexOf(inputText) > -1) {
      const textArr = str.split(inputText);
      const len = textArr.length - 1;
      textArr.forEach((item, index) => {
        if(!!item) {
          arr.push({
            text: item,
            // 1 默认文字  2 高亮文字
            type: 1,
          })
        }
        if(index == 0 && !item || index != len) {
          arr.push({
            text: inputText,
            type: 2,
          })
        }
      });
    } else {
      arr.push({
        text: str,
        type: 1,
      })
    }
    return arr;
  },

  // 打开选择城市
  onOpenCity() {
    this.setData({
      showAddress: false,
      showPopup: true,
    })
  },

  // 关闭地址弹窗
  onCloseAddress({
    detail
  }) {
    let {
      cityData,
    } = this.data;
    if(detail && detail.selectAddress) {
      cityData = {
        district: detail.selectAddress.area.name,
        city: detail.selectAddress.city.name,
        province: detail.selectAddress.province.name,
      };
      // 获取地址经纬度
      commonApi.getCoordinate({
        address: `${cityData.province}${cityData.city}${cityData.district}`
      }).then(res => {
        this.selectLocation = res.geocodes[0].location;
        this.setData({
          inputText: cityData.district,
        });
        this.getPoiAround(cityData.district);
      });
    }
    this.setData({
      cityData,
      inputText: "",
      showPopup: false,
    })
  },

  // 选择地址
  onSelectAddress({
    currentTarget,
  }) {
    const {
      data,
    } = currentTarget.dataset;
    this.getNearbyStore({
      latitude: data.latitude,
      longitude: data.longitude,
    });
    this.location = {
      latitude: data.latitude,
      longitude: data.longitude,
    };
    this.getRegeo();
    this.setData({
      mapScale: 13,
      latitude: data.latitude,
      longitude: data.longitude,
      showAddress: false
    })
  },

})