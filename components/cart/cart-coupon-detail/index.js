import create from "../../../utils/create"
import store from "../../../store/index"

create.Component(store, {
  use: [
    "systemInfo",
  ],

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    total: {
      type: Object,
      value: {}
    }
  },

  data: {
    bottomBarHeight: 210,
  },

  ready() {
    const {
      bottomBarHeight,
      $,
    } = this.data;
    this.setData({
      bottomBarHeight: bottomBarHeight + $.systemInfo.bottomBarHeight
    });
  },

  methods: {
    onClose() {
      this.triggerEvent("close", false);
    }
  }
})
