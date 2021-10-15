import homeApi from "../../../apis/home";
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
  },

  data: {
    secGoodList: [],
    time: 30 * 60 * 60 * 1000,
    timeData: {},
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
        let time = 0;
        let endTime = 0;
        if(homeCache.secGood) {
          time = new Date().getTime();
          endTime = homeCache.secGood.countDown < 1000000000000 ? homeCache.secGood.countDown * 100 : homeCache.secGood.countDown;
          time = endTime - time;
          this.setData({
            secGoodList: homeCache.secGood.list,
            time,
          })
        }
        this.getCustomData(1);
      } else {
        this.setData({
          secGoodList: mapNum(content.data)
        })
        if(homeCache.secGood) {
          delete homeCache.secGood;
          wx.setStorageSync("HOME_CACHE", homeCache);
        }
      }
    },
    // 获取数据
    getCustomData(page, pageSize = 15) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      let time = 0;
      const content = this.data.floor.content;
      homeApi.getFloorCustom(content.dataUrl, {
        page,
        pageSize,
      }).then(res => {
        let list = [];
        let pageData = this.data.pageData;
        time = res.deadlineTime - res.currentTime;
        time = !!time && time > 0 ? time : 0;
        if(page < 2) {
          list = mapNum(res.records);
        } else {
          list = homeCache.secGood.list;
          list = list.concat(mapNum(res.records));
        }
        pageData.totalPage = res.totalPage;
        pageData.page = page;
        this.setData({
          secGoodList: list,
          time,
          pageData,
        });
        homeCache.secGood = { 
          list,
          countDown: res.countdown,
        }
        wx.setStorageSync("HOME_CACHE", homeCache);
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
  
    handleTimeChange(e) {
      this.setData({
        timeData: e.detail,
      });
    },
  }
})
