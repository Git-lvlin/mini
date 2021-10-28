

Component({

  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  data: {
    active: 1,
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
  }
})
