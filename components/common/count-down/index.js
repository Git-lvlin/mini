
Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    time: {
      type: Number,
      value: 100,
      observer(n, o) {
      console.log("🚀 ~ file: index.js ~ line 12 ~ observer ~ o", o)
      console.log("🚀 ~ file: index.js ~ line 12 ~ observer ~ n", n)
        
      }
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
