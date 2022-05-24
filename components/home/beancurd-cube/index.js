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
        const nowStr = JSON.stringify(now);
        const oldStr = JSON.stringify(old);
        if(now && now.content) {
          this.setClassList(now.content);
        }
      }
    },
  },

  data: {
    scrollListWidth: 0,
    goodTypeList: [],
  },

  methods: {
    // 设置豆腐块
    setClassList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.goodTypeList && !!homeCache.goodTypeList.length) {
          this.setData({
            goodTypeList: homeCache.goodTypeList
          })
        }
        homeApi.getFloorCustom(content.dataUrl).then(res => {
          // let list = this.mapTypeList(res);
          let list = res;
          homeCache.goodTypeList = list;
          this.setData({
            goodTypeList: list
          });
          wx.setStorageSync("HOME_CACHE", homeCache);
        });
      } else {
        // let list = this.mapTypeList(content.data);
        let list = content.data;
        this.setData({
          goodTypeList: list
        })
        if(homeCache.goodTypeList) {
          delete homeCache.goodTypeList;
          wx.setStorageSync("HOME_CACHE", homeCache);
        }
      }
    },

    // 重构数组
    mapTypeList(list) {
      let arr = [];
      let arrCild = [];
      list.forEach((item, index) => {
        arrCild.push(item)
        if(index % 10 === 9) {
          arr.push(arrCild);
          arrCild = [];
        }
      });
      if(!!arrCild.length) {
        arr.push(arrCild);
      }
      return arr;
    },

    // 监听滚动
    handleScroll({
      detail
    }) {
      let {
        scrollListWidth,
      } = this.data;
      const {
        scrollLeft,
        scrollWidth,
      } = detail;
      scrollListWidth = parseInt(44 * (scrollLeft / (scrollWidth / 2)));
      // scrollListWidth = 44 * (scrollLeft / (scrollWidth / 2));
      this.setData({
        scrollListWidth,
      })
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
