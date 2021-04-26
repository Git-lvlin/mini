// components/common/coupon-item/index.js
Component({
  options: {
    addGlobalClass: true
  },
  
  properties: {

  },

  data: {
    choose: false
  },

  methods: {
    onChoose() {
      this.setData({
        choose: !this.data.choose
      })
    }
  }
})
