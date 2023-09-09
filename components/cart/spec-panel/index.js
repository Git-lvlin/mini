import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'
import cartApi from "../../../apis/cart";
import util from '../../../utils/util';
import router from '../../../utils/router'
import { debounce, showToast } from '../../../utils/tools';
import { H5_HOST,IMG_CDN } from '../../../constants/common'

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
      },
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
    // 是否显示托管协议 1 是  0 否
    escrowAgreement: {
      type: Number,
      value: 0,
    },
    create: {
      type: Number,
      value: 0,
      observer(now, old) {
        console.log('create-now', now)
      }
    },
    isAlone: {
      type: Number,
      value: 0,
      observer(now, old) {
        console.log('now', now)
        if(now != old) {
          this.getCheckSku({
            orderType: now?2:this.data.good.orderType
          });
        }
      }
    }
  },

  data: {
    skuNum: 1,
    skuList: [],
    checkSpec: [],
    curSku: {},
    selectIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    selectedIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    checked: false,
    agreementTitle1: '',
    agreementTitle2: '',
    // currentCart: [],
  },
  lifetimes: {
    ready() {
      console.log('ready')
      console.log('isAlone', this.data.good)
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
        spuId: good.spuId,
        orderType: good.orderType,
        objectId: good.objectId,
        activityId: good.activityId,
        ...data,
      };
      // console.log('getCheckSku postData ', postData)
      goodApi.getCheckSku(postData, {showLoading: false}).then(res => {
        let curSku = res.curSku;
        if (curSku && curSku?.entrustInfoNew?.length) {
          const titleStr = curSku.entrustInfoNew[0].agreementTitle
          const textIndex = titleStr.indexOf('《');
          this.setData({
            agreementTitle1: titleStr.slice(0,textIndex),
            agreementTitle2: titleStr.slice(textIndex, titleStr.length),
          })
        }
        if (!curSku) {
          curSku = {}
          curSku.stockOver = 1;
          curSku.stockOverText = "已售罄";
          console.log('curSku', curSku)
          this.setData({
            curSku: {
              ...this.data.curSku,
              ...curSku,
            },
            skuList: res.specList
          })
          return
        }
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

        this.triggerEvent("setSku", {
          skuId: curSku.id,
          skuName: curSku.skuName,
          stockNum: good.stockNum,
          buyMaxNum: curSku.buyMaxNum,
          skuNum: curSku.buyMinNum > 0 ? curSku.buyMinNum : 1,
        });
        
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

    async onConfirm() {
      const {
        good,
        specType,
        escrowAgreement,
        curSku,
        skuNum,
        isAlone,
        create,
      } = this.data;
      console.log(" escrowAgreement ", escrowAgreement, '; specType ', specType)
      if (escrowAgreement == 1 && (!this.data.checked)) {
          showToast({
            title: '请先阅读并勾选合同',
          })
        return
      }
      if (this.data.curSku && this?.data?.curSku?.entrustInfoNew?.length && (!this.data.checked)) {
        showToast({
          title: '请先阅读并勾选协议',
        })
        return
      }
      if(specType === "buy") {
        if (good.checkType>0) {
          await cartApi.confirmOrderCheck({
            checkType: good.checkType,
            orderType: good.orderType,
            subType: good.subType,
            buyType: good.buyType,
            skuId: good.skuId,
            spuId: good.spuId
          })
        }
        this.triggerEvent("setSku", {
          skuId: curSku.id,
          skuName: curSku.skuName,
          skuNum,
          stockNum: curSku.stockNum,
          buyMaxNum: curSku.buyMaxNum,
          buyMinNum: curSku.buyMinNum,
        });

        let param = {
          skuId: curSku.id,
          skuNum,
          isAlone,
          create,
          escrowAgreement,
        }
        this.triggerEvent("specBuy", param);

      } else if(specType === "add") {
        this.triggerEvent("setSku", {
          skuId: curSku.id,
          skuName: curSku.skuName,
          skuNum,
        });
        this.triggerEvent("specAdd", {
          skuId: curSku.id,
          quantity: skuNum,
          skuName: curSku.skuName
        });
      }
      this.onClose();
    },

    // 勾选条件
    onChangeRadio(event) {
      var check = this.data.checked;
      if (check) {
        this.data.checked = false;
        console.log("已取消选中");
      } else {
        this.data.checked = true;
        console.log("已选中");
      }
      this.setData({
        checked: this.data.checked,
      });
    },
    // 协议跳转
    onClickAgreement(event) {
      const {
        agreement
      } = event.currentTarget.dataset;
      // console.log('agreement ', agreement)
      // return
      if (agreement == 'escrow-agreement') {
        if (this.data.curSku && this.data.curSku.entrustInfoNew.length) {
          router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(this.data.curSku.entrustInfoNew[0].agreementUrl),
            },
          })
        } else {
          //  《托管代运营合同》
          router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(H5_HOST + '/web/escrow-agreement'),
            },
          })
        }
        
      } else {
          showToast({
            title: '协议类型有误',
          })
      }
    },

    //预览图片，放大预览
    previewSelf(e) {
      var that = this
      console.log(e.currentTarget.dataset.src)
      let currentUrl = e.currentTarget.dataset.src
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: [currentUrl] // 需要预览的图片http链接列表
      })
    },
  }
})
