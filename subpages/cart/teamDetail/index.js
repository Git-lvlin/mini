import create from '../../../utils/create'
import goodApi from '../../../apis/good';
import store from '../../../store/good'
import homeApi from '../../../apis/home';
import router from '../../../utils/router';
import util from '../../../utils/util';
import { objToParamStr } from '../../../utils/tools';
import { H5_HOST } from '../../../constants/common'
import commonApis from '../../../apis/common'
const shareBack = '../../../images/good/share_bg.png'
const shareBtn = '../../../images/good/btn.png'
create.Page(store, {
  goodParams: {},
  hotGoodPage: {
    hasNext: false,
    next: "",
    size: 20,
  },
  loading: false,
  canvasImg: '',
  data: {
    good: {},
    hotGood: [],
    groupInfo: {},
    isNull: false,
  },

  onLoad(options) {
    console.log('onLoad-options', options)
    // if (options) {
    //   wx.setStorageSync("TEAMDETAIL_OPTIONS", options)
    // }
    // this.goodParams = options;
    // const {objectId} = options;
    // this.goodParams.groupId = objectId
    // this.getPersonalDetail();
    // this.getTeamDetail();
    // this.getHotGood();
  },
  onShow() {
    let currentPages = getCurrentPages()
    let indexPage = currentPages[currentPages.length - 1]
    let options = indexPage.options
    console.log('onShow-options', options)
    this.getShareParam(options)
    // // const options = wx.getStorageSync("TEAMDETAIL_OPTIONS") || '';
    // const token = wx.getStorageSync("ACCESS_TOKEN") || '';
    // if (!token) {
    //   this.init(options)
    // } else {
    //   const flag = wx.getStorageSync("TEAMDETAIL_FLAG") || ''
    //   if (!flag) {
    //     wx.setStorageSync("TEAMDETAIL_FLAG", 1)
    //     this.reloadThisPage(options)
    //   } else {
    //     this.init(options)
    //   }
    // }
  },
  // 解析分享配置
  getShareParam(data) {
    commonApis.getShareParam({
      scene: data.scene,
    }).then(res => {
      // const param = strToParamObj(res);
      const param = res;
      this.init(param)
    }).catch(err => {
      this.init(data)
    });
  },
  init(options) {
    this.goodParams = options;
    const {objectId} = options;
    this.goodParams.groupId = objectId
    this.getPersonalDetail();
    this.getTeamDetail();
    this.getHotGood();
  },
  // reloadThisPage() {
  //   let currentPages = getCurrentPages()
  //   let lastRoute = currentPages[currentPages.length - 1].route
  //   let options = currentPages[currentPages.length - 1].options
  //   let optionsStr = ""
  //   for (let key in options) {
  //     optionsStr += '?' + key + '=' + options[key]
  //   }
  //   wx.redirectTo({
  //     url: '/' + lastRoute + optionsStr,
  //   })
  // },
  onReachBottom() {
    // const {
    //   hasNext
    // } = this.hotGoodPage;
    // if(!this.loading && hasNext) {
    //   this.getHotGood();
    // }
  },

  getTeamDetail() {
    goodApi.getTeamDetail({...this.goodParams}).then(res => {
      const groupInfo = res;
      groupInfo.distancetime *= 1000;
      this.setData({
        groupInfo,
      },() => {
        this.downShareImg()
      });
    });
  },

  // 分享
  onShareAppMessage() {
    const {
      good,
    } = this.data;
    const pathParam = objToParamStr(this.goodParams);
    console.log('pathParam', pathParam)
    return {
      title: good.goodsName,
      path: `/subpages/cart/teamDetail/index?${pathParam}`,
      imageUrl: this.canvasImg || '',
    };
  },
  // 跳转拼团规则
  onOpenRule() {
    const {activityId, spuId, skuId} = this.goodParams;
    const str = `/web/group-rule?activityId=${activityId}&spuId=${spuId}&skuId=${skuId}`;
    const url = H5_HOST + str;
    router.getUrlRoute(url);
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
    const ctx = wx.createCanvasContext('shareCanvas');
    // ctx.setFillStyle('#f5f5f5')
    // ctx.fillRect(0, 0, 250, 200)
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
        canvasId: 'shareCanvas',
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

  // 获取单约详情
  getPersonalDetail() {
    goodApi.getPersonalDetail({...this.goodParams}).then(res => {
      const good = res;
      good.salePrice = util.divide(good.salePrice, 100);
      good.marketPrice = util.divide(good.marketPrice, 100);
      good.activityPrice = util.divide(good.activityPrice, 100);
      this.setData({
        good,
      }, () => {
        if (this.data.good&&!this.data.good.imageUrl) {
          this.setData({isNull: true})
        }
      });
    });
  },

  // 获取热销商品
  getHotGood() {
    if(this.loading) return;
    this.loading = true;
    homeApi.getMoreList({page:1,size:100}).then(res => {
      this.setData({
        hotGood: res.records,
      });
      this.loading = false;
    });
  },
  onToDetail(e) {
    const token = wx.getStorageSync("ACCESS_TOKEN") || '';
    if (!token) {
      router.push({
        name: "mobile"
      })
      return
    }
    const {spuId, skuId, activityId, objectId, orderType} = e.currentTarget.dataset.data
    let params = {
      spuId: spuId,
      skuId: skuId,
      activityId: activityId || 0,
      objectId: objectId || 0,
    };
    if(!!orderType) params.orderType = orderType;
    console.log('更多商品列表跳转前参数', params)
    router.push({
      name: "detail",
      data: params
    })
  },
  onHome() {
    router.goTabbar();
  },
  // 跳转下单
  onToCreate() {
    const {
      groupInfo,
      good,
    } = this.data;
    const {
      spuId,
      skuId,
      groupId,
    } = groupInfo;
    const {
      activityId,
      orderType,
      objectId
    } = this.goodParams;
    let data = {
      orderType,
      storeGoodsInfos: [{
        storeNo: good.storeNo,
        goodsInfos: [{
          spuId,
          skuId,
          skuNum: good.buyMinNum,
          orderType,
          activityId,
          objectId,
        }]
      }]
    };
    if(!!activityId && activityId != undefined) data.activityId = activityId;
    data.objectId = objectId;
    data.groupId = groupId;
    wx.setStorageSync("CREATE_INTENSIVE", data);
    const token = wx.getStorageSync("ACCESS_TOKEN") || '';
    if (!token) {
      router.push({
        name: "mobile"
      })
      return
    }
    router.push({
      name: "createOrder",
      data: {
        orderType: 3,
        activityId,
        objectId,
      }
    });
  },

  // 跳转下单
  onToCreateNew(gId) {
    let objectIdNew = gId;
    const {
      good,
      groupInfo,
    } = this.data;
    const {
      spuId,
      skuId,
      groupId,
    } = groupInfo;
    const {
      activityId,
      orderType,
    } = this.goodParams;
    let data = {
      orderType,
      storeGoodsInfos: [{
        storeNo: good.storeNo,
        goodsInfos: [{
          spuId,
          skuId,
          skuNum: good.buyMinNum,
          orderType,
          activityId,
          objectId: objectIdNew,
        }]
      }]
    };
    if(!!activityId && activityId != undefined) data.activityId = activityId;
    data.objectId = objectIdNew;
    data.groupId = !!gId ? gId : groupId;
    wx.setStorageSync("CREATE_INTENSIVE", data);
    const token = wx.getStorageSync("ACCESS_TOKEN") || '';
    if (!token) {
      router.push({
        name: "mobile"
      })
      return
    }
    router.push({
      name: "createOrder",
      data: {
        orderType: 3,
        activityId,
        objectId: objectIdNew,
      }
    });
  },

  toGoodsDetail() {
    const token = wx.getStorageSync("ACCESS_TOKEN") || '';
    if (!token) {
      router.push({
        name: "mobile"
      })
      return
    }
    const {spuId, skuId, activityId, objectId} = this.goodParams
    let params = {
      spuId: spuId,
      skuId: skuId,
      activityId: activityId || 0,
      objectId: objectId || 0,
      orderType: 3
    };
    console.log('params', params)
    router.push({
      name: "detail",
      data: params
    })
  },

  // 发起拼单
  onPushTogether() {
    const {
      activityId,
      spuId,
      skuId,
    } = this.goodParams;
    goodApi.pushTogether({
      activityId,
      spuId,
      skuId,
    }).then(res => {
      this.onToCreateNew(res.groupId);
    });
  },
  
})
