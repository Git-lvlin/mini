import { IMG_CDN } from '../../constants/common';
import create from '../../utils/create';
import store from '../../store/index';
import { throttle } from '../../utils/tools';
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
    barState: false,
    currentSpot: {},
  },

  onShow() {
    const that = this;
    // this.getPoiAround();
    if(this.location.latitude) {
      that.getNearbyStore(this.location);
    } else {
      wx.getLocation({
        type: 'gps84',
        altitude: false,
        success(result) {
          let data = {
            latitude: result.latitude,
            longitude: result.longitude,
          }
          that.location = data;
          that.setData(data);
          that.getNearbyStore(data);
        },
        fail() {
          // that.location = defLocation;
          // that.getNearbyStore(defLocation);
        },
      });
    }
  },

  // 附近店铺
  getNearbyStore(data) {
    goodApi.getNearbyStore({
      radius: 50000,
      unit: 'm',
      ...data,
    }).then(res => {
      let list = [];
      let fullAddress = "";
      if(res.length > 0) {
        res.forEach((item, index) => {
          // 遍历地址
          fullAddress = "";
          for(let str in item.areaInfo) {
            fullAddress += item.areaInfo[str];
          }
          fullAddress += item.address;
          item.fullAddress = fullAddress;
          // 计算距离
          item.distance = +item.distance;
          if(item.distance > 1000) {
            item.distanceText = `${(item.distance / 1000).toFixed(1)}KM`;
          } else {
            item.distanceText = `${item.distance.toFixed(0)}M`;
          }
          list.push({
            ...item,
            width: 23,
            height: 32,
            id: 10 + index,
            selected: false,
            iconPath: deflocationIcon,
          })
        })
        // list[0] = {
        //   ...list[0],
        //   iconPath: list[0].storeLogo,
        //   width: 28,
        //   height: 28,
        //   selected: true,
        // }
        this.setData({
          markers: list,
          latitude: list[0].latitude,
          longitude: list[0].longitude,
        });
      }
    })
  },

  // 点击搜索框
  onSearchInput() {
    router.push({
      name: 'locationSearch',
      data: this.location
    })
  },

  // 点击自提点
  makertap(e) {
    this.setMarket(e.markerId);
  },

  // 点击列表自提点
  onTakeSpot({
    detail
  }) {
    console.log("onTakeSpot ~ detail", detail)
    if(!detail.isCurrent) {
      this.setMarket(detail.id);
    }
  },

  // 设置market
  setMarket(id) {
    const {
      markers
    } = this.data;
    const idx = id - 10;
    markers.forEach((item, index) => {
      if(idx === index) {
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
      markers: markers
    });
  },
  
  // 确认自提点
  onConfirm() {

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
    console.log("start", changedTouches[0]);
    let data = changedTouches[0];
    this.touchMove.start = data.pageY;
  },

  // 监听移动bar
  handleTouchMove({ changedTouches }) {
    console.log("move", changedTouches[0]);
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
    console.log("end", changedTouches[0]);
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