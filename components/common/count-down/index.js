
Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    time: {
      type: Number,
      value: 100,
    },
    isFull: {
      type: Boolean,
      value: false,
    },
    color: {
      type: String,
      value: "#000",
    },
    fontSize: {
      type: Number,
      value: 28,
    },
    needDay: {
      type: Boolean,
      value: false
    }
  },

  data: {
    timeData: {}
  },

  methods: {
    // 监听拼团剩余时间
    onChangeTime(e) {
      this.setData({
        timeData: e.detail,
      });
    },
  }
})
