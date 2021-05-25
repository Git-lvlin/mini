
Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    size: {
      type: String,
      value: "344rpx"
    },
    data: {
      type: Object,
      value: {},
    },
  },

  data: {

  },

  methods: {
    onToDetail() {
      let data = this.data.data;
      this.triggerEvent("click", data);
    }
  }
})
