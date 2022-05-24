import homeApi from "../../../apis/home";
import router from "../../../utils/router";

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
          this.setMsgList(now.content);
        }
      }
    },
  },

  data: {
    msgList: [],
  },

  methods: {
    // 设置商品列表数据
    setMsgList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.msgList && !!homeCache.msgList.length) {
          this.setData({
            msgList: homeCache.msgList
          })
        }
        homeApi.getFloorCustom(content.dataUrl).then(res => {
          this.setData({
            msgList: res
          });
          homeCache.msgList = res;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        });
      } else {
        this.setData({
          msgList: content.data
        })
        if(homeCache.msgList) {
          delete homeCache.msgList;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        }
      }
    },
    // 跳转详情
    onMsg({
      currentTarget
    }) {
      let data = currentTarget.dataset.data;
      if(data.actionUrl) {
        router.getUrlRoute(data.actionUrl);
      }
    },
  }
})
