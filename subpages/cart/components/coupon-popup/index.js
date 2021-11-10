

Component({

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    unusefulCoupon: {
      type: Array,
      value: [],
    },
    usefulCoupon: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        if(newVal.length) {
          newVal.forEach(item => {
            if(item.isDefault) {
              this.setData({
                currCoupon: item
              })
            }
          })
        }
      },
    },
  },


  data: {
    active: 1,
    currCoupon: {},
  },

  methods: {

    onClose() {
      this.triggerEvent("close", {})
    },

    onClickTab({
      currentTarget
    }) {
      let type = currentTarget.dataset.type;
      this.setData({
        active: type
      })
    },

    handleChooseCoupon({
      detail
    }) {
      const {
        usefulCoupon
      } = this.data;
      let currCoupon = {};
      usefulCoupon.forEach(item => {
        if(item.memberCouponId == detail.memberCouponId) {
          if(detail.isDefault) {
            currCoupon = detail;
          }
          this.setData({
            currCoupon,
          })
        } else {
          item.isDefault = 0;
        }
      });
    },

    onConfirm() {
      const {
        currCoupon,
        active,
      } = this.data;
      if(active == 1) {
        this.onClose();
        this.triggerEvent("confirm", currCoupon);
      }
    },
  }
})
