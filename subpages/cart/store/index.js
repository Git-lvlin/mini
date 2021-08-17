import goodApi from '../../../apis/good'
import router from '../../../utils/router';
import { showToast } from '../../../utils/tools';

Page({
  storeNo: "",
  id: "",
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
  },

  onShareAppMessage() {

  },

  // 获取店铺信息
  getStoreDetail() {
    goodApi.getStoreDetail({
      storeNo: this.id,
    }).then(res => {
      this.setData({
        storeDetail: res,
      })
    });
  },

  // 获取商品列表
  getStoreGood(sort = "") {
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
      storeNo: this.id,
      page,
      size,
    }
    if(!!sort) {
      data.sort = sort;
    }
    goodApi.getStoreGood(data).then(res => {
      this.loading = false;
      this.goodPage.totalPage = res.totalPage;
      let list = res.records;
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
    this.getStoreGood(detail.sort || "");
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