import homeApi from '../../../apis/home';
import router from '../../../utils/router'

Component({
  timer: null,

  options: {
    addGlobalClass: true,
  },

  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        if(now && now.content) {
          this.setClassList(now.content);
          if(now.header.style.fontColor || now.header.style.appletFontColor) {
            this.setData({
              fontColor: now.header.style.appletFontColor || now.header.style.fontColor
            })
          }
        }
      }
    },
  },

  data: {
    scrollListWidth: 0,
    activityCube: [],
    fontColor: '',
  },

  methods: {
    // 设置豆腐块
    setClassList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.activityCube && !!homeCache.activityCube.length) {
          this.setData({
            activityCube: homeCache.activityCube
          })
        }
        const takeSpot = wx.getStorageSync("TAKE_SPOT");
        const data = {
          useType: 2,
        }
        if(takeSpot && takeSpot.storeNo) {
          data.storeNo = takeSpot.storeNo
        }
        homeApi.getFloorCustom(content.dataUrl, data).then(res => {
          let list = res;
          homeCache.activityCube = list;
          this.setData({
            activityCube: list
          });
          wx.setStorageSync("HOME_CACHE", homeCache);
        });
      } else {
        let list = content.data;
        this.setData({
          activityCube: list
        })
        if(homeCache.activityCube) {
          delete homeCache.activityCube;
          wx.setStorageSync("HOME_CACHE", homeCache);
        }
      }
    },

    // 跳转
    onToClass({
      currentTarget
    }) {
      let data = currentTarget.dataset.data;
      if(!!data.actionUrl) {
        router.getUrlRoute(data.actionUrl);
      }
    },
  }
})
