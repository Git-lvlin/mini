import router from '../../../utils/router'
import cartApi from '../../../apis/order'

Page({
  isChoose: false,

  data: {
    addressList: [],
    listLoad: false,
  },

  onLoad: function (options) {
    if(options.isChoose) {
      this.isChoose = true;
    }
  },

  onShow: function () {
    this.getAddressList();
  },

  
  onHide: function () {

  },

  // 地址列表
  getAddressList() {
    cartApi.getAddressList().then(res => {
      this.setData({
        addressList: res,
        listLoad: true,
      })
    })
  },

  onChooseAddress({
    currentTarget
  }) {
    const data = currentTarget.dataset.data;
    if(this.isChoose) {
      wx.setStorageSync("CHOOSE_ADDRESS", data);
      router.go();
    }
  },

  // 设为默认地址
  onUpdateAddress({
    currentTarget
  }) {
    const data = currentTarget.dataset.data;
    const postData = {
      id: data.id,
      consignee: data.consignee,
      phone: data.phone,
      address: data.address,
      provinceName: data.provinceName,
      cityName: data.cityName,
      districtName: data.districtName,
      isDefault: true,
    }
    cartApi.updateAddress(postData).then(res => {
      this.getAddressList();
    })
  },
  
  // 跳转编辑添加地址
  onToEditAddress({
    currentTarget
  }) {
    let data = currentTarget.dataset.data;
    let params = {};
    if(!!data) {
      //   wx.setStorageSync("EDIT_ADDRESS", data);
      params.data = JSON.stringify(data);
    }
    router.push({
      name: "editAddress",
      data: params,
    })
  },
})