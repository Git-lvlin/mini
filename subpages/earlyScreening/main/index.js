import create from '../../../utils/create.js'
import store from '../../../store/index'
import earlyScreeningApi from '../../../apis/earlyScreening'
import router from '../../../utils/router'
import { showToast } from "../../../utils/tools"


create.Page(store, {
  use: [
    "systemInfo"
  ],

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
    }
  },

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('options',options)
      let that=this
      earlyScreeningApi.subCompanyInfo({ subOrderSn:options.code }).then(res=>{
          console.log('res',res)
          that.setData({
            checkAddress: res.data
          })
      })
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
    console.log('detail',detail)
    wx.setStorageSync('EARLY_ADDRESS',detail.selectAddress)
    const {
      selectAddress,
      areaData,
    } = detail;
    const data = {
      showPopup: false
    };
    if(!!selectAddress && selectAddress.area.name) {
    //   selectAddress.province = {};
    //   selectAddress.city = {};
    // } else {
      selectAddress.areaStr = `${selectAddress.province.name} ${selectAddress.city.name} ${selectAddress.area.name}`
      data.selectAddress = selectAddress;
      data.areaData = areaData;
    }
    this.setData(data);
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
        console.log('this.options',this.options)
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
