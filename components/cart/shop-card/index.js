import { showToast } from '../../../utils/tools';

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
      let buyMinNum = data.goodsInfos[index].buyMinNum;
      buyMinNum = buyMinNum < 1 ? 1 : buyMinNum;
      if(data.goodsInfos[index].skuNum <= buyMinNum) {
        Toast({
          message: `至少添加 ${data.goodsInfos[index].buyMinNum} 个商品`,
          context: this,
        });
        return ;
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
      if(data.goodsInfos[index].skuNum >= data.goodsInfos[index].buyMaxNum) {
        showToast( {
          title: "哎呀，库存不够啦",
        });
      }
      data.goodsInfos[index].skuNum += 1;
      // this.setData({
      //   data,
      // })
      this.triggerEvent("changeNum", { data, idx});
    }
  }
})
