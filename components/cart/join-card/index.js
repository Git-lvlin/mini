import router from '../../../utils/router'

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    good: {
      type: Object,
      value: {},
    },
    border: {
      type: Boolean,
      value: false,
    },
    width: {
      type: String,
      value: "542rpx"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    stock: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addStock() {
      let stock = this.data.stock;
      stock += 1;
      this.setData({
        stock
      });
      this.handleChangeNum(stock);
    },
    reduceStock() {
      let stock = this.data.stock;
      stock -= 1;
      this.setData({
        stock
      })
      this.handleChangeNum(stock);
    },
    handleChangeNum(num) {
      this.triggerEvent("handleNum", { num });
    },

    handleInputNum(event) {
      let value = event.detail.value;
    },

    onToDetail() {
      const {
        good
      } = this.data;
      router.push({
        name: "detail",
        data: {
          id: good.id,
        }
      })
    },
  }
})
