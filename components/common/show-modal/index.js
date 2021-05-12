
Component({

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    content: {
      type: String,
      value: "您确定进行该操作？",
    },
    cancelText: {
      type: String,
      value: "取消"
    },
    confirmText: {
      type: String,
      value: "确定"
    },
  },

  methods: {
    onOk() {
      this.triggerEvent("ok", true);
    },
    onClose() {
      this.triggerEvent("close", false);
    },
  }
})
