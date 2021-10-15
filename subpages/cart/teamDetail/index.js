import commonApi from '../../../apis/common';
import goodApi from '../../../apis/good';
import homeApi from '../../../apis/home';
import router from '../../../utils/router';
import util from '../../../utils/util';
import { objToParamStr } from '../../../utils/tools';

Page({
  goodParam: {},
  hotGoodPage: {
    hasNext: false,
    next: "",
    size: 20,
  },
  loading: false,

  data: {
    good: {},
    hotGood: [],
    groupInfo: {},
  },

  onLoad(options) {
    this.goodParam = options;
    this.getPosterDetail();
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

  // 分享
  onShareAppMessage() {
    const {
      good,
    } = this.data;
    const {
      spuId,
    } = this.goodParams;
    let promise = null;
    const pathParam = objToParamStr(this.goodParams);
    const shareInfo = {
      title: good.goodsName,
      path: `/subpages/cart/teamDetail/index?${pathParam}`,
      imageUrl: good.imageList[0],
    }
    const userInfo = getStorageUserInfo();
    if(userInfo) {
      let params = {
        shareType: 1,
        contentType: 1,
        shareObjectNo: spuId,
        paramId: 3,
        shareParams: this.goodParams,
        ext: this.goodParams,
      };
      promise = commonApi.getShareInfo(params);
      shareInfo.promise = promise;
    }
    return shareInfo;
  },

  // 获取单约详情
  getPosterDetail() {
    const {
      objectId,
      groupId,
      spuId,
      skuId,
    } = this.goodParam;
    goodApi.getPosterDetail({
      activityType: 3,
      groupId,
      objectId,
    }).then(res => {
      const good = res.curGoods;
      const groupInfo = res;
      good.salePrice = util.divide(good.salePrice, 100);
      good.marketPrice = util.divide(good.marketPrice, 100);
      good.activityPrice = util.divide(good.activityPrice, 100);
      groupInfo.distancetime *= 1000;
      this.setData({
        good,
        groupInfo,
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
      if(page > 1) {
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
  onToCreate(gId) {
    const {
      groupInfo,
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
    } = this.goodParam;
    const objectId = !!gId ? gId : groupId;
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
          objectId,
        }]
      }]
    };
    if(!!activityId && activityId != undefined) data.activityId = activityId;
    data.objectId = objectId;
    data.groupId = !!gId ? gId : groupId;
    wx.setStorageSync("CREATE_INTENSIVE", data);
    router.push({
      name: "createOrder",
      data: {
        orderType: 3,
        activityId,
        objectId: !!gId ? gId : groupId,
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
      this.onToCreate(res.groupId);
    });
  },
  
})
