import amapFile from '../../libs/amap-wx';
import { IMG_CDN } from '../../constants/common';
import create from '../../utils/create';
import store from '../../store/index';
import { throttle } from '../../utils/tools';

let markersData = [];

create.Page(store, {
  use: [
    "systemInfo",
  ],

  // 值单位 px
  touchMove: {
    start: 0,
    max: 60,
  },

  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    showPopup: false,
    spotBottom: 0,
    barState: false,
  },

  onLoad() {
    this.getPoiAround();
  },

  // 获取附近的点
  getPoiAround() {
    let that = this;
    let myAmapFun = new amapFile.AMapWX({
      key: '2755064499f1d1ff7f7bc61154a112b2'
    });
    myAmapFun.getPoiAround({
      iconPathSelected: `${IMG_CDN}miniprogram/location/def_location.png?V=465656`,
      iconPath: `${IMG_CDN}miniprogram/location/def_location.png?V=465656`,
      success(data) {
        markersData = data.markers;
        console.log("line 31 ~ markersData", markersData)
        that.setData({
          markers: markersData,
          latitude: markersData[0].latitude,
          longitude: markersData[0].longitude,
        });
        that.showMarkerInfo(markersData,0);
      },
      fail(info) {
        wx.showModal({title:info.errMsg})
      }
    })
    // myAmapFun.getRegeo({
      // success(data){
      // console.log("🚀 ~ file: index.js ~ line 49 ~ data", data)
        // markersData = data.markers;
        // that.setData({
        //   markers: markersData,
        //   latitude: markersData[0].latitude,
        //   longitude: markersData[0].longitude,
        // });
        // that.showMarkerInfo(markersData,0);
      // },
    // })
  },
  
  // 点击搜索结果
  makertap(e) {
    let id = e.markerId;
    let that = this;
    that.showMarkerInfo(markersData,id);
    that.changeMarkerColor(markersData,id);
  },

  // 设置搜索结果信息
  showMarkerInfo(data,i) {
    let that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },

  // 设置选中图标
  changeMarkerColor(data,i) {
    let that = this;
    let markers = [];
    for(let j = 0; j < data.length; j++){
      if(j==i){
        //如：..­/..­/img/marker_checked.png
        // data[j].iconPath = "选中 marker 图标的相对路径";
      }else{
        //如：..­/..­/img/marker.png
        // data[j].iconPath = "未选中 marker 图标的相对路径";
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
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

  // 关闭地址弹窗
  onCloseAddress({
    detail
  }) {
    const {
      selectAddress,
    } = detail;
    console.log("🚀 ~ file: index.js ~ line 95 ~ detail", detail)
    this.setData({
      showPopup: false,
    })
  },

})