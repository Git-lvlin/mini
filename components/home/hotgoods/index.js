import homeApi from "../../../apis/home"
import { mapNum } from "../../../utils/tools";
import router from "../../../utils/router";

Component({

  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        const nowStr = JSON.stringify(now);
        const oldStr = JSON.stringify(old);
        if(now && now.content) {
          this.setGoodList(now.content);
        }
      }
    },
    scrollBottom: {
      type: Boolean,
      value: false,
      observer(nowVal, oldVal) {
        if(nowVal !== oldVal && nowVal) {
          this.handleScroll();
        }
      }
    }
  },

  data: {
    hotGoodList: [],
    pageData: {
      pageSize: 15,
      page: 1,
      totalPage: 1,
    },
  },

  methods: {
    // 设置商品列表数据
    setGoodList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.hotGoodList && !!homeCache.hotGoodList.length) {
          this.setData({
            hotGoodList: homeCache.hotGoodList,
          })
        }
        this.getCustomData(1);
      } else {
        this.setData({
          hotGoodList: mapNum(content.data)
        })
        if(homeCache.hotGoodList) {
          delete homeCache.hotGoodList;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        }
      }
    },
    // 获取数据
    getCustomData(page, pageSize = 15) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      const content = this.data.floor.content;
      homeApi.getFloorCustom(content.dataUrl, {
        page,
        pageSize,
      }).then(res => {
        let list = [];
        let pageData = this.data.pageData;
        if(page < 2) {
          list = mapNum(res.records);
        } else {
          list = homeCache.hotGoodList;
          list = list.concat(mapNum(res.records));
        }
        pageData.totalPage = res.totalPage;
        pageData.page = page;
        this.setData({
          hotGoodList: list,
          pageData,
        });
        homeCache.hotGoodList = list
        wx.setStorage({
          key: "HOME_CACHE",
          data: homeCache,
        })
      });
    },

    // 滚动到底
    handleScroll() {
      const {
        pageData,
      } = this.data;
      if(pageData.page < pageData.totalPage) {
        this.getCustomData(pageData.page + 1);
      }
    },
    // 跳转详情
    onGood({
      currentTarget
    }) {
      let {
        spuId,
        skuId,
        activityId,
        objectId,
        orderType,
      } = currentTarget.dataset.data;
      router.push({
        name: 'detail',
        data: {
          spuId,
          skuId,
          activityId,
          objectId,
          orderType,
        }
      });
    },
  }
})
