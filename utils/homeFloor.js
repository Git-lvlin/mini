import util from "./util";

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