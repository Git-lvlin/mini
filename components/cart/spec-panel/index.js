import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'


create.Component(store, {
  use: [
    "systemInfo",
    "showSpecPopup"
  ],
  
  properties: {
    good: {
      type: Object,
      value: {},
      observer(now, old) {
        if(now.id !== old.id && now.isMultiSpec == 1) {
          this.getSkuList(now.id);
        }
      }
    },
  },

  data: {
    stock: 1,
    skuList: [],
  },

  ready() {
    
  },

  methods: {
    // 获取sku列表
    getSkuList(id) {
      return ;
      goodApi.getSkuList({
        spuId: id
      }).then(res => {
        console.log("🚀 ~ file: index.js ~ line 49 ~ ready ~ res", res)
        this.setData({
          skuList: res.records
        })
      })
    },

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
