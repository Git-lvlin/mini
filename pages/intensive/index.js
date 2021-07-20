import homeApi from '../../apis/home'
import create from '../../utils/create'
import store from '../../store/good'
import util from '../../utils/util'

const defaultPage = {
  page: 1,
  pageSize: 10,
  totalPage: 1,
};

create.Page(store, {
  use: [
    "userOtherInfo",
    "cartList",
  ],

  intensivePage: {
    ...defaultPage
  },
  intensiveLoading: false,
  hotPage: {
    ...defaultPage
  },

  data: {
    bannerList: [],
    intensiveGood: [],
    intensiveBanner: '',
    hotGood: [],
  },

  onLoad: function (options) {
    // store.updateCart();
    this.getBannerList();
    if(!store.data.userOtherInfo.isShopMaster) {
      this.getIntensiveList();
    }
    this.getHotGood();
  },

  onReachBottom: function () {
    const {
      page,
      totalPage,
    } = this.hotPage;
    if(!this.intensiveLoading && page < totalPage) {
      this.hotPage.page = page + 1;
      this.getHotGood();
    }
  },

  // 获取banner 
  getBannerList() {
    homeApi.getBannerList({
      useType: 5,
      location: 2
    }).then(res => {
      this.setData({
        bannerList: res
      })
    });
  },

  // 获取集约商品
  getIntensiveList() {
    const {
      page,
      pageSize,
    } = this.intensivePage;
    let {
      intensiveGood
    } = this.data;
    homeApi.getIntensiveGood({
      storeNo: "store_m_1",
      page,
      pageSize,
    }).then(res => {
      this.intensivePage.totalPage = res.totalPage;
      let list = this.mapNum(res.records);
      if(page > 1) {
        intensiveGood = intensiveGood.concat(list);
      } else {
        intensiveGood = list;
      }
      this.setData({
        intensiveBanner: res.wholesaleImageUrl,
        intensiveGood,
      })
    });
  },

  // 集约商品遍历价格
  mapNum(list) {
    list.forEach(item => {
      if(!!item.goodsSalePrice) {
        item.goodsSalePrice = util.divide(item.goodsSalePrice, 100);
      }
      if(!!item.goodsMarketPrice) {
        item.goodsMarketPrice = util.divide(item.goodsMarketPrice, 100);
      }
      if(!!item.salePrice) {
        item.salePrice = util.divide(item.salePrice, 100);
      }
      if(!!item.marketPrice) {
        item.marketPrice = util.divide(item.marketPrice, 100);
      }
    });
    return list;
  },

  // 监听集约商品滚动到底
  handleIntensiveBottom() {
    const {
      page,
      totalPage,
    } = this.intensivePage;
    if(!this.intensiveLoading && page < totalPage) {
      this.intensivePage.page = page + 1;
      this.getIntensiveList();
    }
  },

  // 今日必约
  getHotGood() {
    const {
      page,
      pageSize,
    } = this.hotPage;
    let {
      hotGood
    } = this.data;
    homeApi.getHotGood({
      page,
      pageSize,
      tagCode: "day_yeahgo",
    }).then(res => {
      this.hotPage.totalPage = res.totalPage;
      let list = this.mapHotNum(res.records);
      if(page > 1) {
        hotGood = hotGood.concat(list);
      } else {
        hotGood = list;
      }
      this.setData({
        hotGood,
      })
    });
  },

  // 必约商品遍历价格
  mapHotNum(list) {
    list.forEach(item => {
      item.salePrice = util.divide(item.salePrice, 100);
      item.marketPrice = util.divide(item.marketPrice, 100);
      item.thumbnail = item.image;
      item.goodsName = item.title;
      item.skuName = item.subtitle;
      // item.goodsSaleNum = item.saleNum;
    });
    return list;
  },

  // 点击banner 
  onBanner({
    currentTarget
  }) {
    let url = currentTarget.dataset.data.actionUrl;
    console.log("跳转", url);
  }
})