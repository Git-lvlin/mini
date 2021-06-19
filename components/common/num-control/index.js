import create from "../../../utils/create";
import store from "../../../store/good";

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
      this.triggerEvent("change", { type:"add", good, num: 1})
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
      if(num < 2) return;
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
      // if(nowValue === num || nowValue < 1) return;
      // nowValue = nowValue - num;
      this.triggerEvent("change", { type: "set", good, num: nowValue})
    },
  }
})
