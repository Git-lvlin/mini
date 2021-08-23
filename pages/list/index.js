const img = "https://scpic.chinaz.net/files/pic/pic9/202103/apic31388.jpg"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [img, img, img],
    // list: [img, img, img, img, img, img, img],
    sData: {
      text: "12354769678sdfnsdjkhdklfgkljklxcmvklj"
    },
    sList: [
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
      "价格的方式快乐就是长得像风口浪尖电风扇价格的方式快乐就是长得像风口浪尖电风扇",
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  onReady() {
    const _self = this;
    let selQuery = wx.createSelectorQuery();
  },

  // 数据加载接口
  fetchFunction(params) {
    return {
      data: {
        text: "sdfasdfasdfpolkaweoprtj234534"
      }
    }
  },

  handleRes({
    detail
  }) {
    let {
      sList,
    } = this.data;
    if(detail.isFrist){
      sList = detail.list
    } else {
      sList = sList.concat(detail.list)
    }
    console.log(sList);
    this.setData({
      sList
    })
  },

  hanldeScroll({
    detail
  }) {
    console.log(detail);
  }

})