import { IMG_CDN } from '../../constants/common';
import create from '../../utils/create';
import store from '../../store/index';
import { showModal, showToast, throttle } from '../../utils/tools';
import goodApi from '../../apis/good';
import router from '../../utils/router';

let markersData = [];
const defLocation = {
  longitude: 116.39731407,
  latitude: 39.90874867,
};
const deflocationIcon = `${IMG_CDN}miniprogram/location/def_location.png?V=465656`;

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
  },

  onShow() {
    const that = this;
    const takeSpot = wx.getStorageSync("TAKE_SPOT") || {};
    const searchSpot = wx.getStorageSync("SEARCH_SPOT");
    let spotData = "";
    if(takeSpot && !searchSpot) {
      spotData = takeSpot;
    }
    if(searchSpot) {
      spotData = searchSpot;
    }
    if(spotData && spotData.latitude) {
      that.setData({
        currentSpot: takeSpot,
        latitude: spotData.latitude,
        longitude: spotData.longitude,
      }, () => {
        that.getNearbyStore({
          latitude: spotData.latitude,
          longitude: spotData.longitude,
        });
      });
      wx.removeStorage({
        key: 'SEARCH_SPOT',
      });
      that.location = spotData;
      that.openLocation = true;
    } else if(this.location.latitude) {
      that.getNearbyStore(this.location);
    }
    if(this.fristLoad && !spotData.latitude) {
      wx.getLocation({
        type: 'gps84',
        altitude: false,
        success(result) {
          console.log("success ~ 1", 1111)
          that.fristLoad = false;
          let data = {
            latitude: result.latitude,
            longitude: result.longitude,
          }
          that.location = data;
          that.openLocation = true;
          that.setData(data);
          !spotData.latitude && that.getNearbyStore(data);
        },
        fail(err) {
          console.log("success ~ 1", 2222)
          that.openLocation = false;
          that.openLocationTip();
          that.location = defLocation;
          !spotData.latitude && that.getNearbyStore(defLocation);
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
          // 计算距离
          // item.distance = +item.distance;
          // if(item.distance > 1000) {
          //   item.distanceText = `${(item.distance / 1000).toFixed(1)}KM`;
          // } else {
          //   item.distanceText = `${item.distance.toFixed(0)}M`;
          // }
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
        // list[0] = {
        //   ...list[0],
        //   iconPath: list[0].storeLogo,
        //   width: 28,
        //   height: 28,
        //   selected: true,
        // }
        this.location = currentSpot;
        this.setData({
          markers: list,
          listIsLoad: true,
          currentSpot,
          // latitude: list[0].latitude,
          // longitude: list[0].longitude,
        });
      } else {
        this.setData({
          markers: [],
          listIsLoad: true,
          currentSpot: {},
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
        item.width = 28;
        item.height = 28;
        item.selected = true;
      } else {
        item.iconPath = deflocationIcon;
        item.width = 23;
        item.height = 32;
        item.selected = false;
      }
    });
    this.setData({
      currentSpot,
      markers,
    });
  },

  // 点击列表自提点
  onTakeSpot({
    detail
  }) {
    if(!detail.isCurrent) {
      this.setMarket(detail.id);
    }
  },

  // 设置market
  setMarket(id) {
    const {
      markers,
      currentSpot,
    } = this.data;
    const idx = id - 10;
    markers.forEach((item, index) => {
      if(idx === index) {
        item.iconPath = item.storeLogo;
        item.width = 28;
        item.height = 28;
        item.selected = true;
        if(item.storeNo != currentSpot.storeNo) {
          currentSpot.selected = false;
        } else {
          currentSpot.selected = true;
        }
      } else {
        item.iconPath = deflocationIcon;
        item.width = 23;
        item.height = 32;
        item.selected = false;
      }
    });
    this.setData({
      currentSpot,
      markers,
    });
  },
  
  // 确认自提点
  onConfirm() {
    const {
      markers,
      currentSpot,
    } = this.data;
    let marketSelect = {};
    if (currentSpot.selected) {
      marketSelect = currentSpot;
    } else {
      markers.forEach(item => {
        if(item.selected) {
          marketSelect = item;
        }
      });
    }
    if(!marketSelect.storeNo) {
      showToast({ title: "请选择自提点" });
      return;
    }
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

})