import util from "../../../utils/util"
import router from "../../../utils/router"
import { haveStore } from "../../../utils/tools";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    storeInfo: {
      type: Object,
      value: {},
      observer(nVal, oVal) {
        if(nVal && nVal.topPriceList && nVal.topPriceList.length) {
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
        storeInfo,
      } = this.data;
      const storeNo = storeInfo.storeAddress.storeNo;
      const isStore = haveStore(storeNo);
      if(!isStore) return;
      router.push({
        name: "store",
        data: {
          storeNo,
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
