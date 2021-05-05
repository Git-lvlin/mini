import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import homeApi from '../../apis/home'

create.Page(store, {
  touchTimer: null,
  onTimeTimer: null,
  isScroll: false,
  scrollLock: false,

  use: [
    "userInfo",
    "systemInfo"
  ],
  
  data: {
    fixationTop: 600,
    isOnGoods: false,
    scrolling: false,
  },

  onLoad: function (options) {
    console.log("home", this.data.$)
    let query = wx.createSelectorQuery();
    query.select('#fixation').boundingClientRect((rect) => {
      this.setData({
        fixationTop: rect.top
      })
    }).exec();
  },

  onShow: function () {

  },

  onShareAppMessage: function () {

  },

  onToSearch() {
    router.push({
      name: 'search',
    });
  },

  onToDetail() {
    router.push({
      name: 'detail',
    });
  },

  handleTouchMove(event) {
    if(this.isScroll) return;
    this.isScroll = true;
    this.setData({
      scrolling: true,
    }); 
    clearTimeout(this.touchTimer);
    this.touchTimer = null;
  },

  handleTouchEnd(event) {
    this.touchTimer = setTimeout(() => {
      this.isScroll = false;
      this.setData({
        scrolling: false,
      });
    }, 400);
  },

  onPageScroll: function (e) {
    // this.setData({
    //     scrollTop: e.scrollTop
    // })
    
    let {
      fixationTop,
      isOnGoods,
    } = this.data;
    
    if(this.scrollLock) return;
    let goodTop = 1000;
    let query = wx.createSelectorQuery();
    query.select('#hotGoods').boundingClientRect((rect) => {
      goodTop = rect.top;
      isOnGoods = goodTop < fixationTop + 20 ? true : false;
      this.setData({
        isOnGoods,
      });
    }).exec();
    this.onTimeTimer = setTimeout(() => {
      this.scrollLock = false;
      clearTimeout(this.onTimeTimer)
    }, 200);
  },
})