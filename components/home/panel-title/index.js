
Component({
  options: {
    // 在组件定义时的选项中启用多slot支持
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: "",
    },
    desc: {
      type: String,
      value: "",
    },
    color: {
      type: String,
      value: "#333",
    },
    moreColor: {
      type: String,
      value: "#333",
    },
    center: {
      type: Boolean,
      value: false,
    },
    useTitleSlot: {
      type: Boolean,
      value: false,
    },
    more: {
      type: Boolean,
      value: false,
    }
  },

  data: {

  },

  methods: {

  }
})
