import create from '../../../../utils/create'
import store from '../../../../store/index'
import dataFormat from '../../../../utils/format'
import { showToast } from '../../../../utils/tools'


create.Component(store, {
  use: [
    'skuNumPopup',
    'skuNumData',
  ],
  
  computed: {
    skuNum() {
      return this.skuNumData.data && this.skuNumData.data.skuNum ? this.skuNumData.data.skuNum : 1;
    },
    batchNumber() {
      const {
        data,
      } = this.skuNumData;
      const good = data || {};
      return good.batchNumber > 0 ? good.batchNumber : 1;
    },
  },

  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    good: {
      type: Object,
      value: {},
    },
  },

  data: {

  },

  methods: {
    handleInput({
      detail
    }) {
      const {
        skuNumData,
      } = this.store.data;
      let {
        skuNum,
        batchNumber,
      } = this.data;
      const good = skuNumData.data || {};
      if(!dataFormat.checkVerifyCode(+detail.value)) {
        this.setData({
          skuNum
        })
        return;
      }
      if(detail.value == '') {
        return;
      }
      skuNum = +detail.value;
      // let remainder = (skuNum - good.buyMinNum) % batchNumber
      // if(remainder != 0) {
      //   skuNum += batchNumber - remainder;
      // }
      if(skuNum < good.buyMinNum) {
        skuNum = good.buyMinNum;
      }
      if(skuNum > good.buyMaxNum) {
        skuNum = good.buyMaxNum;
      }
      // good.skuNum = skuNum;
      // this.store.data.skuNumData.data = good;
      this.setData({
        skuNum
      })
    },

    handleChangeInput({
      detail
    }) {
      let {
        skuNum,
      } = this.data;
      if(detail.value == '') {
        const {
          skuNumData,
        } = this.store.data;
        const good = skuNumData.data || {};
        let buyMinNum = good.buyMinNum < 1 ? 1 : good.buyMinNum;
        skuNum = skuNum < buyMinNum ? buyMinNum : skuNum;
        this.setData({
          skuNum,
        });
      }
    },

    onReduceNum(){
      const {
        skuNumData,
      } = this.store.data;
      let {
        skuNum,
        batchNumber,
      } = this.data;
      const good = skuNumData.data || {};
      let buyMinNum = good.buyMinNum < 1 ? 1 : good.buyMinNum;
      skuNum = skuNum - batchNumber;
      if(skuNum >= buyMinNum) {
        this.setData({
          skuNum,
        })
      }
    },

    onAddNum(){
      const {
        skuNumData,
      } = this.store.data;
      let {
        skuNum,
        batchNumber,
      } = this.data;
      const good = skuNumData.data || {};
      skuNum = skuNum + batchNumber;
      if(skuNum <= good.buyMaxNum) {
        this.setData({
          skuNum,
        })
      }
    },

    onClose() {
      this.store.setSkuNumPopup(false);
    },

    onConfirm() {
      const {
        skuNumData,
      } = this.store.data;
      let {
        skuNum
      } = this.data;
      if(!dataFormat.checkVerifyCode(+skuNum)) {
        showToast({ title: "请输入数字"});
        return;
      }
      const good = skuNumData.data || {};
      let buyMinNum = good.buyMinNum < 1 ? 1 : good.buyMinNum;
      skuNum = skuNum < buyMinNum ? buyMinNum : skuNum;
      skuNumData.data.skuNum = skuNum;
      this.store.setSkuNumPopup(false);
      this.triggerEvent("confirm", skuNumData);
    },
  }
})
