import { MAP_KEY } from '../../constants/index';
import amapFile from '../../libs/amap-wx';
import { debounce, showToast } from '../../utils/tools'
import create from '../../utils/create'
import commonApi from '../../apis/common'
import store from '../../store/index'
import router from '../../utils/router';

const myAmapFun = new amapFile.AMapWX({
  key: MAP_KEY,
});

create.Page(store, {
  use: [
    "systemInfo",
  ],

  selectLocation: "",

  data: {
    showPopup: false,
    selectCity: "",
    cityData: {},
  },

  onLoad(options) {
    this.location = options;
    this.getRegeo();
  },
  
  // 监听输入
  handleInput({
    detail
  }) {
    const inputText = detail.value;
    debounce(() => {
      this.getPoiAround(inputText);
    }, 500)();
    this.setData({
      inputText,
    })
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
    myAmapFun.getPoiAround({
      querykeywords,
      location: this.selectLocation,
      success(data) {
        const markers = data.markers;
        markers.length && markers.forEach(item => {
          item.nameArr = that.getTextKey(item.name, querykeywords);
        });
        that.setData({
          markers,
        }, () => {
          if(!markers.length) {
            showToast({ title: "没有结果呢" });
          }
        });
      },
      fail(info) {
        showToast({ title: info.errMsg });
      }
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
        console.log(this.selectLocation)
      });
    }
    this.setData({
      cityData,
      showPopup: false,
    })
  },

  // 选择自提点
  onSelectSpot({
    currentTarget,
  }) {
    const {
      data,
    } = currentTarget.dataset;
    wx.setStorageSync("SEARCH_SPOT", data);
    router.go();
  },
})