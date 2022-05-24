import homeApi from '../../../apis/home';
import router from '../../../utils/router';

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        const nowStr = JSON.stringify(now);
        const oldStr = JSON.stringify(old);
        if(now && now.content) {
          let vipGood = {
            shopTagList: {},
            userTagList: {},
          };
          if(now.content.dataType === 1) {
            this.setGoodList(now.content);
          } else {
            let homeCache = wx.getStorageSync("HOME_CACHE") || {};
            vipGood.userTagList.subtitle = now.header.subTitle[0].name || "";
            vipGood.userTagList.tap = now.header.title[0].action || "",
            vipGood.userTagList.title = now.header.title[0].name || "",
            vipGood.shopTagList.subtitle = now.header.subTitle[1].name || "";
            vipGood.shopTagList.tap = now.header.title[1].action || "",
            vipGood.shopTagList.title = now.header.title[1].name || "",
            this.setData({
              vipGood,
            })
            if(homeCache.vipGood) {
              delete homeCache.vipGood;
              wx.setStorageSync("HOME_CACHE", homeCache);
            }
          }
        }
      }
    },
  },

  data: {
    titleList: [],
    vipGood: {},
  },

  methods: {
    // 设置商品列表数据
    setGoodList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(homeCache.vipGood) {
        this.setData({
          vipGood: homeCache.vipGood
        })
      }
      homeApi.getFloorCustom(content.dataUrl).then(res => {
        this.setData({
          vipGood: res
        });
        homeCache.vipGood = res;
        wx.setStorageSync("HOME_CACHE", homeCache);
      });
    },
    // 跳转详情
    onGood({
      currentTarget
    }) {
      let data = currentTarget.dataset.data;
      console.log("跳转链接", data);
      // router.getUrlRoute(data.actionUrl);
    },
  }
})
