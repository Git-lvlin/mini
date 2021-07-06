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
      } = data;
      if(specType === "add") {
        const cartList = store.data.cartList;
        console.log("🚀  ~ cartList", cartList)
        // const goodId = options.spuId;
        // cartList.forEach(item => {
        //   if(item.spuId === goodId) {
        //     quantity = item.quantity
        //   }
        // })
      }
      return quantity
    }
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
        good,
        stock,
        quantity,
        specType
      } = this.data;
      let {
        buyMinNum,
      } = good;
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
        good,
        stock,
        quantity,
        specType,
      } = this.data;
      const {
        buyMaxNum,
      } = good;
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
