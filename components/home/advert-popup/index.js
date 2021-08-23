
Component({
  timer: null,

  properties: {
    advert: {
      type: Object,
      value: {},
      observer(newVal, oldVal) {
        if(JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.onClose();
          }, +newVal.stayTime * 1000)
        }
      },
    },
  },

  data: {
    show: true
  },

  methods: {
    onClose() {
      this.setData({
        show: false
      })
    },
  }
})
