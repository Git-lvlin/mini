import { MAP_KEY } from '../../constants/index';
import amapFile from '../../libs/amap-wx';
import { debounce, showToast } from '../../utils/tools'
import create from '../../utils/create'
import store from '../../store/index'

const myAmapFun = new amapFile.AMapWX({
  key: MAP_KEY,
});

create.Page(store, {
  use: [
    "systemInfo",
  ],

  data: {
    showPopup: false,
    selectCity: "",
    cityData: {},
  },

  onLoad(options) {
    this.location = options;
    this.getRegeo();
    // this.getPoiAround("店)");
  },
  
  // 监听输入
  handleInput({
    detail
  }) {
    const inputText = detail.value;
    const {
      cityData,
    } = this.data;
    debounce(() => {
      this.getPoiAround(`${cityData.province}${cityData.city}${inputText}`);
    }, 500)();
    // this.setData({
    //   inputText,
    // })
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
          console.log("addressComponent", addressComponent)
          that.setData({
            cityData: addressComponent,
          });
        }
      },
    })
  },

  // 获取附近的点
  getPoiAround(querykeywords) {
    let that = this;
    myAmapFun.getPoiAround({
      querykeywords,
      success(data) {
        const markers = data.markers;
        markers.forEach(item => {
          item.nameArr = that.getTextKey(item.name, querykeywords);
        });
        console.log("🚀 ~ file: index.js ~ line 39 ~ success ~ markers", markers)
        that.setData({
          markers,
        });
      },
      fail(info) {
        showToast({ title: info.errMsg });
      }
    })
  },

  // 获取高亮文字
  getTextKey(str, key) {
    const arr = [];
    if(str.indexOf(key) > -1) {
      const textArr = str.split(key);
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
            text: key,
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
    console.log(arr)
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
        city: detail.selectAddress.city.name,
        province: detail.selectAddress.province.name,
      };
    }
    this.setData({
      cityData,
      showPopup: false,
    })
  },
})