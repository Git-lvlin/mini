import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    data: {
      type: Object,
      value: {}
    },
    idx: {
      type: Number,
      value: 0
    },
  },

  data: {

  },

  methods: {

    onReduceNum({
      currentTarget,
    }){
      let {
        data,
        idx
      } = this.data;
      let index = currentTarget.dataset.index;
      if(data.goodsInfos[index].skuNum < 2) {
        Toast({
          message:"至少添加一个商品",
          context: this,
        });
        return
      }
      data.goodsInfos[index].skuNum -= 1;
      // this.setData({
      //   data,
      // })
      this.triggerEvent("changeNum", { data, idx});
    },

    onAddNum({
      currentTarget,
    }){
      let {
        data,
        idx
      } = this.data;
      let index = currentTarget.dataset.index;
      // if(data.goodsInfos[index].skuNum >= data.goodsInfos[index].stock) {
      //   Toast({
      //     message:"哎呀，没有库存啦",
      //     context: this,
      //   });
      //   return
      // }
      data.goodsInfos[index].skuNum += 1;
      // this.setData({
      //   data,
      // })
      this.triggerEvent("changeNum", { data, idx});
    }
  }
})
