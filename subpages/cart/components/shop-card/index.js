import create from '../../../../utils/create'
import store from '../../../../store/index'

create.Component(store, {
  options: {
    addGlobalClass: true
  },

  properties: {
    data: {
      type: Object,
      value: {},

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
      const good = data.goodsInfos[index];
      let buyMinNum = good.buyMinNum < 1 ? 1 : good.buyMinNum;
      const batchNumber = good.batchNumber > 0 ? good.batchNumber : 1;
      const skuNum = good.skuNum - batchNumber;
      if(skuNum >= buyMinNum) {
        data.goodsInfos[index].skuNum -= batchNumber;
        this.triggerEvent("changeNum", { data, idx});
      }
    },

    onAddNum({
      currentTarget,
    }){
      let {
        data,
        idx
      } = this.data;
      let index = currentTarget.dataset.index;
      const good = data.goodsInfos[index];
      const batchNumber = good.batchNumber > 0 ? good.batchNumber : 1;
      const skuNum = good.skuNum + batchNumber;
      // if(skuNum <= good.buyMaxNum && skuNum <= good.stockNum) {
      if(skuNum <= good.buyMaxNum) {
        data.goodsInfos[index].skuNum += batchNumber;
        this.triggerEvent("changeNum", { data, idx});
      }
    },

    onOpenSetSku({
      currentTarget
    }) {
      let {
        data,
        idx
      } = this.data;
      let index = currentTarget.dataset.index;
      const good = data.goodsInfos[index];
      this.store.data.skuNumData = {
        data: good,
        index,
        pidx: idx,
      }
      this.store.setSkuNumPopup(true)
    },

    handleInput({
      detail,
    }) {
      let {
        data,
        idx
      } = this.data;
      data.note = detail.value;
      this.triggerEvent("changeNot", { data, idx});
    },
  }
})
