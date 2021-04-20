import router from "../../../utils/router"

Page({

  data: {
    isDefault: false,
  },

  onLoad: function (options) {

  },

  handleSwitch() {
    this.setData({
      isDefault: !this.data.isDefault
    })
  },

  onSave() {
    router.go();
  }

})