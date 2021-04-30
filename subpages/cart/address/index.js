import router from '../../../utils/router'
import cartApi from '../../../apis/cart'

Page({

  data: {
    addressList: [],
    listLoad: false,
  },

  onLoad: function (options) {
  },

  onShow: function () {
    cartApi.getAddressList().then(res => {
    console.log("🚀 ~ file: index.js ~ line 15 ~ this.getAddressList ~ res", res)
      this.setData({
        addressList: res,
        listLoad: true,
      })
    })
  },

  
  onHide: function () {

  },

  onToEditAddress() {
    router.push({
      name: "editAddress"
    })
  },
})