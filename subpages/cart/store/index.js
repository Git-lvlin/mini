import goodApi from '../../../apis/good'
import router from '../../../utils/router';
import { mapNum, showToast } from '../../../utils/tools';
import util from '../../../utils/util';

const app = getApp();
Page({
  storeNo: "",
  id: "",
  sort: "",
  goodPage: {
    page: 1,
    size: 10,
    totalPage: 1,
  },
  loading: false,

  data: {
    storeDetail: {},
    goodList: [],
  },

  onLoad(options) {
    if(!options.storeNo) {
      showToast({
        title: "没有找到店铺",
        ok() {
          const timer = setTimeout(() => {
            router.go();
            clearTimeout(timer);
          }, 1500);
        },
      })
    }
    this.storeNo = options.storeNo;
    this.id = options.storeNo.slice(8, options.storeNo.length);
    this.getStoreDetail();
    this.getStoreGood();
    app.trackEvent('shopping_storeDetail');
  },

  onShareAppMessage() {

  },

  // 获取店铺信息
  getStoreDetail() {
    goodApi.getStoreDetail({
      storeNo: this.storeNo,
    }).then(res => {
      this.setData({
        storeDetail: res,
      })
    });
  },

  // 获取商品列表
  getStoreGood() {
    if(this.loading) return;
    let {
      goodList
    } = this.data;
    const {
      page,
      size,
    } = this.goodPage;
    this.loading = true;
    const data = {
      storeNo: this.storeNo,
      page,
      size,
    }
    if(!!this.sort) {
      data.sort = this.sort;
    }
    goodApi.getStoreGood(data).then(res => {
      this.loading = false;
      this.goodPage.totalPage = res.totalPage;
      let list = res.records || [];
      list.forEach(item => {
        item.salePrice = util.divide(item.salePrice, 100);
        item.marketPrice = util.divide(item.marketPrice, 100);
        item.image = item.goodsImageUrl;
        item.title = item.goodsName;
        item.goodsSaleNumDesc = item.saleNum;
      });
      if(page > 1) {
        goodList = goodList.concat(list);
      } else {
        goodList = list;
      }
      this.setData({
        goodList,
      })
    }).catch(() => {
      this.loading = false;
    });
  },

  // 点击筛选
  onScreenItem({
    detail,
  }) {
    this.goodPage.page = 1;
    this.goodPage.totalPage = 1;
    this.sort = detail.sort || "";
    this.getStoreGood();
  },

  // 滚动到底部 
  onReachBottom() {
    const {
      page,
      totalPage,
    } = this.goodPage;
    if(page < totalPage && !this.loading) {
      this.goodPage.page += 1;
      this.getStoreGood();
    }
  },
})