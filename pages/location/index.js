import amapFile from '../../libs/amap-wx';

let markersData = [];

Page({

  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {}
  },
  makertap: function(e) {
    let id = e.markerId;
    let that = this;
    that.showMarkerInfo(markersData,id);
    that.changeMarkerColor(markersData,id);
  },
  onLoad: function() {
    let that = this;
    let myAmapFun = new amapFile.AMapWX({
      key: '2755064499f1d1ff7f7bc61154a112b2'
    });
    myAmapFun.getPoiAround({
      //如：..­/..­/img/marker_checked.png
      //如：..­/..­/img/marker.png
      // iconPathSelected: '选中 marker 图标的相对路径', 
      // iconPath: '未选中 marker 图标的相对路径', 
      success: function(data){
        markersData = data.markers;
        console.log("🚀 ~ file: index.js ~ line 31 ~ markersData", markersData)
        that.setData({
          markers: markersData
        });
        that.setData({
          latitude: markersData[0].latitude
        });
        that.setData({
          longitude: markersData[0].longitude
        });
        that.showMarkerInfo(markersData,0);
      },
      fail: function(info){
        wx.showModal({title:info.errMsg})
      }
    })
    // myAmapFun.getRegeo({
      // success: function(data){
      // console.log("🚀 ~ file: index.js ~ line 49 ~ data", data)
        // markersData = data.markers;
        // that.setData({
        //   markers: markersData
        // });
        // that.setData({
        //   latitude: markersData[0].latitude
        // });
        // that.setData({
        //   longitude: markersData[0].longitude
        // });
        // that.showMarkerInfo(markersData,0);
      // },
    // })
  },
  showMarkerInfo: function(data,i){
    let that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  changeMarkerColor: function(data,i){
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
  }

})