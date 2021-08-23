import create from "../../../utils/create";
import store from "../../../store/good";
import { showToast } from "../../../utils/tools";

Component({

  properties: {
    num: {
      type: Number,
      value: 0,
    },
    good: {
      type: Object,
      value: {}
    }
  },

  data: {

  },

  methods: {
    addNum() {
      let {
        num,
        good,
      } = this.data;
      if (num < good.buyMinNum) {
        num = good.buyMinNum - num;
      } else {
        num = 1
      }
      if (num >= good.buyMaxNum) {
        showToast({ title: `最多购买${good.buyMaxNum}` })
        return;
      }
      this.triggerEvent("change", { type:"add", good, num})
      // const good = {
      //   skuId,
      //   quantity: 1,
      // }
      // this.store.addCart(good);
    },

    reduceNum() {
      let {
        num,
        good,
      } = this.data;
      let min = good.buyMinNum > 0 ? good.buyMinNum : 1;
      if(num <= min) return;
      this.triggerEvent("change", { type:"add", good, num: -1})
    },

    handleInput({
      detail
    }) {
      let {
        num,
        good,
      } = this.data;
      let nowValue = Number(detail.value) || num;
      if (nowValue < good.buyMinNum) {
        nowValue = good.buyMinNum - nowValue;
      }
      if (num >= good.buyMaxNum) {
        showToast({ title: `最多购买${good.buyMaxNum}` })
        return;
      }
      // if(nowValue === num || nowValue < 1) return;
      // nowValue = nowValue - num;
      this.triggerEvent("change", { type: "set", good, num: nowValue})
    },
  }
})
