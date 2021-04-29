import router from '../../../utils/router'
import cartApi from '../../../apis/cart'

Page({

  data: {

  },

  onLoad: function (options) {

  },

  onShow: function () {
    cartApi.getAddressList().then(res => {
    console.log("🚀 ~ file: index.js ~ line 15 ~ this.getAddressList ~ res", res)
      
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