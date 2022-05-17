import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import util from '../../../utils/util'
import goodApi from '../../../apis/good';
import { objToParamStr } from '../../../utils/tools'
import { getPayInfo, onOrderPay } from '../../../utils/orderPay'
import dayjs from '../../../miniprogram_npm/dayjs/index'
import { IMG_CDN, PAY_TYPE_KEY } from '../../../constants/common'
import commonApi from '../../../apis/common'
import cartApi from '../../../apis/order'
import homeApi from '../../../apis/home'
const shareBack = '../../../images/good/share_bg.png'
const shareBtn = '../../../images/good/btn.png'
const defaultList = [

]

const app = getApp();
create.Page(store, {
// Page({
  canvasImg: '',
  id: "",
  goodPage: {
    hasNext: false,
    next: "",
    size: 20,
  },
  loading: false,
  payType: 7,
  orderInfo: {},

  data: {
    showPopupIsPT: false,
    isPay: false,
    chooseIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    defChooseIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    payList: defaultList,
    disableChoose: false,
    payType: 2,
    payAmount: 0,
    downTime: 0,
    timeData: {},
    redTime: {},
    payData: {},
    teamPopup: false,
    hotGood: [],
    orderCreateTime: "",
    redData: {
      isShow: 0
    },
    showSharePopup: false,
    groupInfo: null,
  },

  onLoad(options) {
    this.orderInfo = options;
    console.log("🚀 ~ file: index.js ~ line 49 ~ onLoad ~ options", options)
    // id: 1390912161480564700
    // orderSn: "16204542762334404122"
    // payAmount: 1
    // payDeadline: 1620454876068
    this.id = options.id
    let downTime = options.payDeadline - options.currentTime;
    const sysEnv = wx.getStorageSync("SYS_ENV") || "pro";
    const payData = wx.getStorageSync("pay_data") || {};
    let orderCreateTime = "";
    if(payData && payData.orderCreateTime && options.isPay) {
      orderCreateTime = dayjs(payData.orderCreateTime).format("YYYY-MM-DD HH:mm:ss");
      wx.removeStorage({
        key: 'pay_data'
      });
    }
    this.setData({
      payAmount: util.divide(options.payAmount, 100),
      downTime,
      sysEnv,
      payData,
      orderCreateTime,
      isPay: options.isPay,
      orderType: options.orderType,
    })
    // 获取支付类型
    !options.loadedPay && commonApi.getResourceDetail({
      resourceKey: PAY_TYPE_KEY,
    }, {
      showLoading: false,
    }).then(res => {
      let list = res.data.records;
      let payList = [];
      list.forEach((item, index) => {
        if(item.payType === 2 || item.payType === 7 || item.payType === 0) {
          // item.default = index === 0 ? 1 : 0;
          if(item.state === 1) {
            payList.push(item);
          }
          if(item.default === 1) {
            this.payType = item.payType;
          }
        }
      });
      this.setData({
        payList,
      })
      if(this.payType !== 0) {
        this.getPayInfo();
      }
    });
    // if(options.orderType == 3 && options.orderType == 4) {
    // if(options.orderType == 3) {
    this.getHotGood();
    // }
    app.trackEvent('shopping_cashier');
  },
  // 获取海报信息
  getPoster() {
    const {
      id,
    } = this.orderInfo;
    let data = wx.getStorageSync("CREATE_INTENSIVE");
    const goodsInfo = data.storeGoodsInfos[0].goodsInfos[0]
    const {
      objectId,
    } = this.orderInfo;
    const param = {
      activityType: 3,
      groupId:objectId,
      objectId,
      ...this.orderInfo,
      ...goodsInfo
    }
    param.orderId = id
    goodApi.getPosterDetail(param).then((res) => {
      const groupInfo = res;
      groupInfo.distancetime *= 1000;
      this.setData({
        groupInfo,
      }, () => {
        if (groupInfo.groupState) {
          this.setData({showPopupIsPT: true})
        }
      });
    })
  },
  closePopup() {
    this.setData({showPopupIsPT: !this.data.showPopupIsPT})
  },
  // 获取单约详情
  getPosterDetail() {
    let data = wx.getStorageSync("CREATE_INTENSIVE");
    const goodsInfo = data.storeGoodsInfos[0].goodsInfos[0]
    const {
      objectId,
      groupId,
      spuId,
      skuId,
    } = this.orderInfo;
    goodApi.getTeamDetail({
      activityType: 3,
      groupId:objectId,
      objectId,
      ...this.orderInfo,
      ...goodsInfo
    }).then(res => {
      const groupInfo = res;
      groupInfo.distancetime *= 1000;
      this.setData({
        groupInfo,
      }, () => {
        console.log('this.....', this.data.groupInfo)
        if (groupInfo.groupState) {
          this.setData({showPopupIsPT: true})
        }
      });
    });
  },
  /**
   * 获取支付信息
   * isNotPayment boolean 是否是模拟支付
   * */ 
  getPayInfo(isNotPayment = false) {
    console.log()
    getPayInfo({
      id: this.id,
      payType: this.payType,
      isNotPayment,
    }).then(res => {
      const {
        payData,
        isPay,
      } = res;
      if(isPay) {
        this.setData({
          isPay
        })
        // 模拟支付
        this.getFaterRed();
      }
      this.setData({
        payData,
        orderCreateTime: dayjs(payData.orderCreateTime).format("YYYY-MM-DD HH:mm:ss"),
      });
      app.trackEvent('goods_pay_success', {
        pay_method_name: isNotPayment ? '模拟支付' : '微信支付'
      });
    });
  },

  // 获取热销商品
  getHotGood() {
    if(this.loading) return;
    this.loading = true;
    homeApi.getHotGood({next:0, size: 99}).then(res => {
      this.setData({
        hotGood: res.records,
      });
      this.loading = false;
    }).catch(err => {
      this.loading = false;
    });
  },

  // 获取每日红包
  getFaterRed() {
    const {
      id,
      orderSn,
    } = this.orderInfo;
    cartApi.getFaterRed({
      orderSn,
      orderId: id,
    }).then(res => {
      res.freeAmount = util.divide(res.freeAmount, 100);
      this.setData({
        redData: res
      })
    })
  },

  // 关闭每日红包
  onCloseRed() {
    const {
      redData,
    } = this.data;
    redData.isShow = 0;
    this.setData({
      redData,
    });
  },

  // 打开下载APP
  onOpenSharePopup() {
    const {
      redData,
    } = this.data;
    redData.isShow = 0;
    this.setData({
      redData,
      showSharePopup: true,
    })
  },

  // 关闭下载APP
  onHideSharePopup() {
    this.setData({
      showSharePopup: false
    })
  },

  // 处理金额
  handleListPrice(list = []) {
    list.forEach(item => {
      item.marketPrice = util.divide(item.marketPrice, 100);
      item.salePrice = util.divide(item.salePrice, 100);
    })
    return list;
  },

  // 监听倒计时
  handleChangeTime(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  handleRedTime(e) {
    this.setData({
      redTime: e.detail,
    });
  },

  // 选择支付方式
  onChangeType({
    currentTarget
  }) {
    let payList = this.data.payList;
    let index = currentTarget.dataset.index;
    payList.forEach((item, idx) => {
      if(index === idx) {
        item.default = 1;
        this.payType = item.payType;
      } else {
        item.default = 0;
      }
    });
    if(this.payType !== 0) {
      this.getPayInfo();
    }
    this.setData({
      payList,
    })
  },

  // 点击确定支付
  onPay() {
    const that = this;
    const { orderType } = this.orderInfo
    if(this.payType === 0) {
      this.getPayInfo(true)
      if (orderType == 3) {
        setTimeout(() => {
          this.getPoster()
          // this.getPosterDetail()
          this.getPersonalDetail()
        }, 1000)
      }
      return ;
    }
    const payData = this.data.payData;
    const data = {
      payType: this.payType,
    };
    onOrderPay({
      data,
      payData,
    }).then(res => {
      that.setData({
        isPay: true,
      })
      that.getFaterRed();
      if (orderType == 3) {
        setTimeout(() => {
          that.getPoster()
          // that.getPosterDetail()
          that.getPersonalDetail()
        }, 1000)
      }
    }).catch(err => {

    });
  },

  getOrderDetail() {
    cartApi.getOrderDetail()
  },

  onSuccess() {
    router.goTabbar();
  },

  handleCloseTeam() {
    this.setData({
      teamPopup: false
    })
  },

  handleToDetail({ detail }) {
    let params = {
      spuId: detail.spuId,
      skuId: detail.skuId,
      orderType: detail.orderType,
    }
    if(!!detail.activityId) params.activityId = detail.activityId;
    if(!!detail.objectId) params.objectId = detail.objectId;
    router.replace({
      name: "detail",
      data: params,
    });
  },

  // 分享
  onShareAppMessage() {
    const {
      id,
      objectId
    } = this.orderInfo;
    let data = wx.getStorageSync("CREATE_INTENSIVE");
    const goodsInfo = data.storeGoodsInfos[0].goodsInfos[0]
    let param = {
      activityType: 3,
      groupId:objectId,
      ...this.orderInfo,
      ...goodsInfo
    }
    param.orderId = id
    const pathParam = objToParamStr(param);
    let pathUrl = `/subpages/cart/teamDetail/index?${pathParam}`
    return {
      title: goodsInfo?.goodsName || '',
      path: pathUrl,
      imageUrl: this.canvasImg || '',
    };
  },

  // 获取单约详情
  getPersonalDetail() {
    let data = wx.getStorageSync("CREATE_INTENSIVE");
    const goodsInfo = data.storeGoodsInfos[0].goodsInfos[0]
    const param = {
      ...this.orderInfo,
      ...goodsInfo,
    }
    goodApi.getPersonalDetail(param).then(res => {
      const good = res;
      good.salePrice = util.divide(good.salePrice, 100);
      good.marketPrice = util.divide(good.marketPrice, 100);
      good.activityPrice = util.divide(good.activityPrice, 100);
      this.setData({
        good,
      }, () => {
        this.downShareImg()
      });
    });
  },

  // 绘制分享图片
  downShareImg() {
    const {
      good,
    } = this.data;
    const that = this;
    let img = good.imageUrl;
    img = img?.replace(/^http:\/\//i,'https://');
    let tmpImg = '../../../images/good/logo.png';
    wx.downloadFile({
      url: img,
      success(result) {
        console.log("download img", result.tempFilePath)
        that.drawShareImg(result.tempFilePath)
      },
      fail(err) {
        that.drawShareImg(tmpImg);
      },
    });
  },
  // 绘制分享图片
  drawShareImg(tmpImg) {
    const {
      good,
      groupInfo,
    } = this.data;
    const that = this;
    const salePrice = '¥' + parseFloat(good.activityPrice).toFixed(2);
    const marketPrice = '¥' + parseFloat(good.marketPrice).toFixed(2);
    const marketlength = marketPrice.length;
    const textWidth = marketlength * 8;
    const text = `差${groupInfo.distanceNum}人成团`;
    const ctx = wx.createCanvasContext('shareCanvasc');
    // ctx.setFillStyle('#f5f5f5')
    // ctx.fillRect(0, 0, 250, 200)

    // ctx.drawImage(shareBack, 0, 0, 218, 174);
    ctx.drawImage(shareBack, 0, 0, 208, 183);
    ctx.drawImage(shareBtn,  128, 132, 66, 28);
    this.handleBorderRect(ctx, 10, 50, 110, 110, 8, tmpImg);
    ctx.setTextAlign('center')
    ctx.setFillStyle('#FF0000')

    ctx.setFontSize(17)
    ctx.fillText(salePrice, 161, 70)
    ctx.setFillStyle('#999999')

    ctx.setFontSize(14)
    ctx.fillText(marketPrice, 161, 92)
    ctx.setStrokeStyle('#999999')

    ctx.setFontSize(14)
    ctx.fillText(text, 161, 118)
    ctx.setStrokeStyle('#666666')

    ctx.beginPath();
    ctx.moveTo(172-textWidth/2, 87)
    ctx.lineTo(170+textWidth/2, 87)
    ctx.closePath();
    ctx.stroke()
    // ctx.strokeRect(171-(textWidth/2), 87, textWidth, 0)
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        // destWidth: 436,
        // destHeight: 348,
        canvasId: 'shareCanvasc',
        success(res) {
          console.log('res.tempFilePath', res.tempFilePath)
          that.canvasImg = res.tempFilePath;
        },
        fail(err) {
          console.log('err', err)
        },
        complete(res) {
          console.log('complete', res)
        }
      })
    });
  },

  handleBorderRect(ctx, x, y, w, h, r, img, color) {
    ctx.save();
    ctx.beginPath();
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);
    // 右上角
    ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);
    // 左下角
    ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);

    // ctx.setFillStyle(color);
    // ctx.fill();
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore()
  },

  // onReachBottom() {
  //   const {
  //     hasNext
  //   } = this.goodPage;
  //   if(!this.loading && hasNext) {
  //     this.getHotGood();
  //   }
  // },
})