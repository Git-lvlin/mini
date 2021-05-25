
Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    data: {
      type: Object,
      value: {},
    },
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
    },
    onToOrder() {
      this.triggerEvent("jump", false);
    },
  }
})
