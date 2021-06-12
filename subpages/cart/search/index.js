import goodApi from "../../../apis/good"
import { getStorageUserInfo } from "../../../utils/tools";

Page({

  data: {
    searchText: "",
    showAssociation: false,
    hotSearch: [],
    historySearch: [],
  },

  onLoad(options) {
    this.getHotSearch();
    this.getHistorySearch();
  },

  onShow() {

  },

  // 历史搜索
  getHistorySearch() {
    const userInfo = getStorageUserInfo();
    if(!userInfo.id) return;
    goodApi.getSearchHistory({
      requestMemberId: userInfo.id,
    }).then(res => {
      console.log(res)
      this.setData({
        historySearch: res.records,
      });
    });
  },

  // 清空历史记录
  clearSearchHistory() {
    const userInfo = getStorageUserInfo();
    if(!userInfo.id) return;
    goodApi.clearSearchHistory({
      requestMemberId: userInfo.id,
    }).then(res => {
      this.setData({
        historySearch: [],
      });
    });
  },

  // 热门搜索
  getHotSearch() {
    goodApi.getHotSearch().then(res => {
      this.setData({
        hotSearch: res
      })
    });
  },

  onSearch() {
    console.log("search")
    this.setData({
      showAssociation: false,
    })
  },

  handleSearchFocus() {
    this.setData({
      showAssociation: true,
    })
  },
  
  onCloseAssociation({
    currentTarget
  }) {
    this.setData({
      showAssociation: false,
      searchText: currentTarget.dataset.text,
    })
  }
})