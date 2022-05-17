import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'
import util from '../../../utils/util';
import { debounce, showToast } from '../../../utils/tools';

create.Component(store, {
  use: [
    "systemInfo",
    "showSpecPopup",
  ],

  computed: {
    // 购物车商品用
    // quantity(scope) {
    //   const {
    //     data,
    //     store,
    //   } = scope;
    //   let quantity = 0;
    //   const {
    //     specType,
    //     good,
    //   } = data;
    //   if(specType === "add") {
    //     const cartList = store.data.cartList;
    //     // const currentCart = [];
    //     // cartList.forEach(item => {
    //     //   if(item.spuId == good.id) {
    //     //     currentCart.push({
    //     //       skuId: item.skuId,
    //     //       quantity: item.quantity,
    //     //       stockNum: item.stockNum,
    //     //       buyMinNum: item.buyMinNum,
    //     //       buyMaxNum: item.buyMaxNum,
    //     //     })
    //     //   }
    //     // });
    //     // scope.setData({
    //     //   currentCart,
    //     // });
    //   }
    //   return quantity
    // },
  },

  properties: {
    good: {
      type: Object,
      value: {},
      observer(now, old) {
        if(now.isMultiSpec == 1) {
          const skuId = this.data.skuId;
          this.getCheckSku({
            skuId,
          });
        }
      }
    },
    skuId: {
      type: String,
      value: "",
    },
    // add 加入购物车 || buy 立即购买
    specType: {
      type: String,
      value: "",
    },
  },

  data: {
    skuNum: 1,
    skuList: [],
    checkSpec: [],
    curSku: {},
    // currentCart: [],
  },
  lifetimes: {
    ready() {
      console.log('ready')
      if (this.data.good.isMultiSpec === 1) {
        this.getCheckSku({
          skuId: this.data.good.skuId,
        });
      }
    }
  },
  methods: {
    // 获取sku列表
    getCheckSku(data, fristLoad = true) {
      const {
        good,
        checkSpec,
      } = this.data;
      const postData = {
        id: good.id,
        orderType: good.orderType,
        objectId: good.objectId,
        activityId: good.activityId,
        ...data,
      };
      goodApi.getCheckSku(postData).then(res => {
        const curSku = res.curSku;
        curSku.salePrice = util.divide(curSku.salePrice, 100);
        curSku.stockOver = 0;
        if(curSku.stockNum <= 0) {
          curSku.stockOver = 1;
          curSku.stockOverText = "已售罄";
        } else {
          if(curSku.stockNum < curSku.buyMinNum) {
            curSku.stockOver = 2;
            curSku.stockOverText = "库存不足";
          }
        }
        if(fristLoad) {
          res.specList.forEach((item, index) => {
            item.specValue.forEach(child => {
              if(child.isCheck) {
                checkSpec[index] = child.specValueId;
              }
            });
          });
        }
        if(fristLoad) {
          this.triggerEvent("setSku", {
            skuId: curSku.id,
            skuName: curSku.skuName,
            stockNum: good.stockNum,
            buyMaxNum: curSku.buyMaxNum,
            skuNum: curSku.buyMinNum > 0 ? curSku.buyMinNum : 1,
          });
        }
        this.setData({
          skuData: res,
          skuList: res.specList,
          curSku,
          skuNum: curSku.buyMinNum > 0 ? curSku.buyMinNum : 1,
          checkSpec,
        })
      })
    },

    // 切换规格
    onChangeSpec({
      currentTarget,
    }) {
      const {
        good,
        pidx,
      } = currentTarget.dataset;
      const {
        checkSpec
      } = this.data;
      checkSpec[pidx] = good.specValueId;
      let data = {
        checkSpec,
      };
      // checkSpec.forEach((item, index) => {
      //   data[`checkSpec[${index}]`] = item;
      // });
      this.setData({
        checkSpec,
      })
      this.getCheckSku(data, false);
    },

    onClose() {
      store.onChangeSpecState(false)
      this.setData({
        skuNum: 1,
      })
    },

    onReduceNum() {
      let {
        curSku,
        skuNum,
      } = this.data;
      let {
        buyMinNum,
      } = curSku;
      const batchNumber = curSku.batchNumber > 0 ? curSku.batchNumber : 1;
      buyMinNum = buyMinNum < 1 ? 1 : buyMinNum;
      skuNum = skuNum - batchNumber;
      if(skuNum >= buyMinNum) {
        this.setData({
          skuNum
        })
      }
    },

    onAddNum() {
      let {
        curSku,
        skuNum,
      } = this.data;
      const batchNumber = curSku.batchNumber > 0 ? curSku.batchNumber : 1;
      const {
        buyMaxNum,
      } = curSku;
      skuNum = skuNum + batchNumber;
      if(skuNum <= buyMaxNum && skuNum <= curSku.stockNum) {
        this.setData({
          skuNum
        })
      }
    },

    onConfirm() {
      const {
        good,
        specType,
        curSku,
        skuNum,
      } = this.data;
      if(specType === "buy") {
        this.triggerEvent("setSku", {
          skuId: curSku.id,
          skuName: curSku.skuName,
          skuNum,
          stockNum: curSku.stockNum,
          buyMaxNum: curSku.buyMaxNum,
          buyMinNum: curSku.buyMinNum,
        });
        this.triggerEvent("specBuy", {
          skuId: curSku.id,
          skuNum,
        });
      } else if(specType === "add") {
        this.triggerEvent("setSku", {
          skuId: curSku.id,
          skuName: curSku.skuName,
          skuNum,
        });
        this.triggerEvent("specAdd", {
          skuId: curSku.id,
          quantity,
        });
      }
      this.onClose();
    },
  }
})
