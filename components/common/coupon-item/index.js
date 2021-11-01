// components/common/coupon-item/index.js
Component({
  options: {
    addGlobalClass: true
  },
  
  properties: {
    coupon: {
      type: Object,
      value: {},
    }
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
