import util from "./util";

// 转为浮点数
export const mapNum = (list = []) => {
  list.forEach(item => {
    if(item.marketPrice) {
      item.marketPrice = util.divide(item.marketPrice, 100);
    }
    if(item.salePrice) {
      item.salePrice = util.divide(item.salePrice, 100);
    }
    if(item.freeAmount) {
      item.freeAmount = util.divide(item.freeAmount, 100);
    }
    if(item.usefulAmount) {
      item.usefulAmount = util.divide(item.usefulAmount, 100);
    }
  })
  return list
};



export const getFloorData = (content, letter, dataLetter) => {
  if(content.dataType === 1) {
    homeApi.getFloorCustom(content.dataUrl).then(res => {
      homeCache[letter] = res.goodsInfo;
      wx.setStorage({
        key: "HOME_CACHE",
        data: homeCache,
      })
    });
  } else {
    this.setData({
      goodList: content.data
    })
    if(homeCache.goodList) {
      delete homeCache.goodList;
      wx.setStorage({
        key: "HOME_CACHE",
        data: homeCache,
      })
    }
  }
}