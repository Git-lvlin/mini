import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'
import util from '../../../utils/util';
import { showToast } from '../../../utils/tools';

let fristLoad = true;

create.Component(store, {
  use: [
    "systemInfo",
    "showSpecPopup",
    "cartList",
  ],

  computed: {
    // 购物车商品用
    quantity(scope) {
      const {
        data,
        store,
      } = scope;
      let quantity = 0;
      const {
        specType,
        good,
      } = data;
      if(specType === "add") {
        const cartList = store.data.cartList;
        // console.log("🚀  ~ cartList", cartList)
        // const currentCart = [];
        // cartList.forEach(item => {
        //   if(item.spuId == good.id) {
        //     currentCart.push({
        //       skuId: item.skuId,
        //       quantity: item.quantity,
        //       stockNum: item.stockNum,
        //       buyMinNum: item.buyMinNum,
        //       buyMaxNum: item.buyMaxNum,
        //     })
        //   }
        // });
        // scope.setData({
        //   currentCart,
        // });
      }
      return quantity
    },
  },
  
  properties: {
    good: {
      type: Object,
      value: {},
      observer(now, old) {
        if(now.id !== old.id && now.isMultiSpec == 1) {
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
    specType: {
      type: String,
      value: "",
    },
  },

  data: {
    stock: 1,
    skuList: [],
    checkSpec: [],
    curSku: {},
    // currentCart: [],
  },

  methods: {
    // 获取sku列表
    getCheckSku(data) {
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
        curSku.stockOver = curSku.stockNum <= 0 ? true : false;
        if(fristLoad) {
          res.specList.forEach((item, index) => {
            item.specValue.forEach(child => {
              if(child.isCheck) {
                checkSpec[index] = child.specValueId;
              }
            });
          });
        }
        fristLoad = false;
        this.setData({
          skuData: res,
          skuList: res.specList,
          curSku,
          stock: curSku.buyMinNum,
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
      this.getCheckSku(data);
    },

    onClose() {
      store.onChangeSpecState(false)
      this.setData({
        stock: 1,
      })
    },

    onReduceNum() {
      const {
        curSku,
        stock,
        quantity,
        specType
      } = this.data;
      let {
        buyMinNum,
      } = curSku;
      buyMinNum = buyMinNum < 1 ? 1 : buyMinNum;
      let totalNum = specType === "buy" ? stock : stock + quantity;
      if(totalNum > buyMinNum) {
        this.setData({
          stock: stock - 1
        })
      } else {
        showToast({ title: `至少购买${buyMinNum}件` });
      }
    },

    onAddNum() {
      const {
        curSku,
        stock,
        quantity,
        specType,
      } = this.data;
      const {
        buyMaxNum,
      } = curSku;
      if(stock >= buyMaxNum) {
        showToast({ title: "没有足够库存啦" });
        return ;
      }
      let totalNum = specType === "buy" ? stock : stock + quantity;
      if(totalNum < buyMaxNum) {
        this.setData({
          stock: stock + 1
        })
      } else {
        showToast({ title: `最多购买${buyMaxNum}件` });
      }
    },

    onConfirm() {
      const {
        good,
        specType,
        curSku,
        stock,
        quantity,
      } = this.data;
      console.log(quantity, stock)
      if(specType === "buy") {
        this.triggerEvent("specBuy", {
          skuId: curSku.id,
          skuNum: stock,
        });
      } else if(specType === "add") {
        this.triggerEvent("specAdd", {
          skuId: curSku.id,
          quantity: stock + quantity,
        });
      }
      this.onClose();
    },
  }
})
