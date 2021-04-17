import create from '../../../utils/create'
import store from '../../../store/good'


create.Component(store, {
  use: [
    "systemInfo",
    "showSpecPopup"
  ],
  
  properties: {
    show: {
      type: Boolean,
      value: true
    }
  },

  data: {
    show: true,
    stock: 1,
  },

  ready() {
    // console.log("🚀 systemInfo", this.data.$.systemInfo)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      store.onChangeSpecState(false)
    },

    onReduceNum() {
      if(this.data.stock < 2) return
      this.setData({
        stock: this.data.stock - 1
      })
    },

    onAddNum() {
      this.setData({
        stock: this.data.stock + 1
      })
    }
  }
})
