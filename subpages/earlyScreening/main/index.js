import create from '../../../utils/create.js'
import store from '../../../store/index'
import earlyScreeningApi from '../../../apis/earlyScreening'
import router from '../../../utils/router'
import { showToast, getStorageUserInfo } from "../../../utils/tools"
import amapFile from '../../../libs/amap-wx';
import { MAP_KEY } from '../../../constants/index';
import area from '../../../utils/area'

const myAmapFun = new amapFile.AMapWX({
  key: MAP_KEY,
});

create.Page(store, {
  use: [
    "systemInfo"
  ],
  // 当前位置经纬度
  location: {},
  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    selectAddress: {
     isAct: "province",
     province: {},
     city: {},
     area: {},
     areaStr: "",
    },
    editData: {},
    // 是否是编辑状态
    isEdit: false,
    genderShow: false,
    checkAddress: {
        provinceName: '',
        cityName: '',
        areaName: '',
        address: ''
    },
  },

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.options=options
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = getStorageUserInfo(true, true)
    if (!userInfo) {
      return
    }
    wx.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success(result) {
          let data = {
            latitude: result.latitude,
            longitude: result.longitude,
          }
          that.location = data;
          that.setData(data);
          that.getRegeo()
        }
    });
    let that=this
    earlyScreeningApi.subCompanyInfo({ subOrderSn:this.options.code }).then(res=>{
        that.setData({
          checkAddress: res
        })
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
          if(data.length){
            const addres=data[0].regeocodeData.addressComponent
            that.setData({
                editData:{
                    provinceId,
                    cityId,
                    districtId
                },
                selectAddress:{
                    areaStr: `${addres.province}${addres.city}${addres.district}`,
                }
            })
            const provinceId=area.filter(item=>item.name==addres.province)[0].id
            const cityId=area.filter(item=>item.name==addres.city)[0].id
            const districtId=area.filter(item=>item.name==addres.district)[0].id
            wx.setStorageSync('EARLY_ADDRESS',{
                areaStr: `${addres.province}${addres.city}${addres.district}`,
                area: {id: districtId, name:addres.district},
                city: {id: cityId, name: addres.city},
                isAct: "area",
                province: {id: provinceId, name: addres.province},
            })
          }
      },
    })
  },
 // 打开省市区弹窗
 onOpenAddress() {
    this.setData({
        showPopup: true,
    })
 },
   // 关闭省市区弹窗
   onCloseAddress({
    detail
  }) {
    const {
      selectAddress,
      areaData,
    } = detail;
    const data = {
      showPopup: false
    };
    if(!!selectAddress && selectAddress.area.name) {
      selectAddress.areaStr = `${selectAddress.province.name}${selectAddress.city.name}${selectAddress.area.name}`
      data.selectAddress = selectAddress;
      data.areaData = areaData;
    }
    this.setData(data);
    wx.setStorageSync('EARLY_ADDRESS',data.selectAddress)
  },
  // 保存编辑地址区域
    handleEditAddress({
     detail
    }) {

    const {
        selectAddress,
        areaData,
    } = detail;
    this.setData(detail);
    },
    //进入问卷
    entranceQuestionnaire() {
        const { selectAddress } = this.data
        if(selectAddress.areaStr){
            router.replace({
                name: 'earlyScreeningFillout',
                data: this.options
            })
        }else{
            showToast({ title: "请选择您所在地区" });
        }
    }
})
