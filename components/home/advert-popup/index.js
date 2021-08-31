
Component({
  timer: null,

  properties: {
    advert: {
      type: Object,
      value: {},
      observer(now, oldVal) {
        if(now && now.content) {
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
