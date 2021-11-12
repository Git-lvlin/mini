
Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },

  data: {

  },

  methods: {
    onClose() {
      this.triggerEvent("close", false);
    }
  }
})
