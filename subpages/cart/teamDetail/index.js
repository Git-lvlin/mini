import commonApi from '../../../apis/common';
import goodApi from '../../../apis/good';
import homeApi from '../../../apis/home';
import router from '../../../utils/router';
import util from '../../../utils/util';
import { objToParamStr, getStorageUserInfo } from '../../../utils/tools';
const shareBack = '../../../images/good/good_share_back.png'
const shareBtn = '../../../images/good/good_share_btn.png'
Page({
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
  },

  onLoad(options) {
    this.goodParams = options;
    console.log('options', options)
    this.getPersonalDetail();
    this.getTeamDetail();
    this.getHotGood();
    const a = objToParamStr(options);
  },

  onReachBottom() {
    const {
      hasNext
    } = this.hotGoodPage;
    if(!this.loading && hasNext) {
      this.getHotGood();
    }
  },

  getTeamDetail() {
    goodApi.getTeamDetail({groupId:this.goodParams.objectId,...this.goodParams}).then(res => {
      console.log('res', res)
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
    return {
      title: good.goodsName,
      path: `/subpages/cart/teamDetail/index?${pathParam}`,
      imageUrl: this.canvasImg || '',
    };
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
    console.log('tmpImg', tmpImg)
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
    ctx.drawImage(shareBack, 0, 0, 218, 174);
    ctx.drawImage(shareBtn,  131, 132, 11, 23);
    this.handleBorderRect(ctx, 10, 43, 120, 120, 8, tmpImg);
    ctx.setTextAlign('center')
    ctx.setFillStyle('#FF0000')

    ctx.setFontSize(17)
    ctx.fillText(salePrice, 171, 50)
    ctx.setFillStyle('#999999')

    ctx.setFontSize(14)
    ctx.fillText(marketPrice, 171, 72)
    ctx.setStrokeStyle('#999999')

    ctx.setFontSize(14)
    ctx.fillText(text, 171, 98)
    ctx.setStrokeStyle('#666666')

    ctx.beginPath();
    ctx.moveTo(172-textWidth/2, 87)
    ctx.lineTo(170+textWidth/2, 87)
    ctx.closePath();
    ctx.stroke()
    // ctx.strokeRect(171-(textWidth/2), 87, textWidth, 0)
    console.log('draw')
    ctx.draw(true, () => {
      console.log('draw2')
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
      });
    });
  },

  // 获取热销商品
  getHotGood() {
    if(this.loading) return;
    const {
      next,
      size,
    } = this.hotGoodPage;
    let {
      hotGood,
    } = this.data;
    this.loading = true;
    const postData = {
      size,
    };
    if(!!next) {
      postData.next = next;
    }
    homeApi.getHotGood(postData).then(res => {
      this.hotGoodPage.hasNext = res.hasNext;
      this.hotGoodPage.next = res.next;
      const list = res.records;
      if(next > 1) {
        hotGood = hotGood.concat(list);
      } else {
        hotGood = list;
      }
      this.setData({
        hotGood,
      });
      this.loading = false;
    });
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
      curGoods,
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
          skuNum: 1,
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
    console.log('gId', gId)
    const {
      groupInfo,
    } = this.data;
    const { objectId } = this.goodParams;
    const {
      spuId,
      skuId,
      groupId,
      curGoods,
    } = groupInfo;
    const {
      activityId,
      orderType,
    } = this.goodParams;
    let objectIdNew = !!gId ? gId : objectId;
    let data = {
      orderType,
      storeGoodsInfos: [{
        storeNo: curGoods.storeNo,
        goodsInfos: [{
          spuId,
          skuId,
          skuNum: 1,
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
    router.push({
      name: "createOrder",
      data: {
        orderType: 3,
        activityId,
        objectId: objectIdNew,
      }
    });
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
