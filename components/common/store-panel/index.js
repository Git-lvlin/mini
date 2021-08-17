import util from "../../../utils/util"
import router from "../../../utils/router"

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    good: {
      type: Object,
      value: {},
      observer(nVal, oVal) {
        if(nVal.topPriceList && nVal.topPriceList.length) {
          nVal.topPriceList.forEach(item => {
            item.price = util.divide(item.price, 100);
            item.marketPrice = util.divide(item.marketPrice, 100);
          });
          this.setData({
            storeGood: nVal.topPriceList,
          });
        }
      },
    }
  },

  data: {
    storeGood: [],
  },

  methods: {
    onStore() {
      const {
        good,
      } = this.data;
      let id = good.storeNo.slice(8, good.storeNo.length);
      id = +id;
      if(id < 123580) return;
      router.push({
        name: "store",
        data: {
          storeNo: good.storeNo,
        },
      })
    },

    
    // 跳转商详
    onToDetail({
      currentTarget
    }) {
      const {
        good,
      } = currentTarget.dataset;
      router.push({
        name: "detail",
        data: {
          activityId: good.activityId || 0,
          objectId: good.objectId,
          orderType: good.orderType,
          skuId: good.skuId,
          spuId: good.spuId,
        },
      })
    },
  }
})
