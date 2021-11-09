
Component({
  options: {
    addGlobalClass: true
  },
  
  properties: {
    coupon: {
      type: Object,
      value: {},
    },
    canUse: {
      type: Boolean,
      value: true,
    }
  },

  data: {

  },

  methods: {
    onChoose() {
      const {
        coupon,
        canUse,
      } = this.data;
      if(canUse) {
        coupon.isDefault = !coupon.isDefault;
        this.setData({
          coupon,
        })
        this.triggerEvent('choose', coupon);
      }
    }
  }
})
