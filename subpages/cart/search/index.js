import goodApi from "../../../apis/good"
import { debounce, getStorageUserInfo } from "../../../utils/tools";
import util from "../../../utils/util";

Page({
  searchPage: {
    page: 1,
    size: 10,
    totalpage: 1,
  },

  data: {
    searchText: "",
    showAssociation: false,
    hotSearch: [],
    historySearch: [],
    keyList: [],
    goodList: [],
  },

  onShow() {
    this.getHotSearch();
    this.getHistorySearch();
  },

  // 历史搜索
  getHistorySearch() {
    const userInfo = getStorageUserInfo();
    if(!userInfo.id) return;
    goodApi.getSearchHistory({
      requestMemberId: userInfo.id,
    }, {
      showLoading: false
    }).then(res => {
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
    }, {
      showLoading: false
    }).then(res => {
      this.setData({
        historySearch: [],
      });
    });
  },

  // 热门搜索
  getHotSearch() {
    goodApi.getHotSearch({}, {
      showLoading: false
    }).then(res => {
      this.setData({
        hotSearch: res
      })
    });
  },

  // 点击搜索
  onSearch() {
    let {
      searchText,
      goodList,
    } = this.data;
    const {
      page,
      size,
    } = this.searchPage;
    const userInfo = getStorageUserInfo();
    goodApi.getSearchList({
      page,
      size,
      keyword: searchText,
      requestMemberId: userInfo.id,
    }).then(res => {
      this.searchPage.totalpage = res.totalpage;
      const list = res.records;
      list.forEach(item => {
        item.image = item.goodsImageUrl;
        item.title = item.goodsName;
        item.subtitle = item.goodsDesc;
        item.spuId = item.id;
        item.salePrice = util.divide(item.goodsSaleMinPrice, 100);
      });
      if(page > 1) {
        list = goodList.concat(list);
      }
      this.setData({
        goodList: list,
      })
    })
  },

  // input输入
  handleSearchInput({
    detail
  }) {
    this.setData({
      searchText: detail.value,
    })
    debounce(this.getAssociation, 500)();
  },

  // input 失焦
  handleInputBlur() {
    // setdata 冲突
    const timer = setTimeout(() => {
      clearTimeout(timer);
      const {
        showAssociation
      } = this.data;
      if(showAssociation) {
        this.setData({
          showAssociation: false
        })
      }
    }, 200);
  },

  // input 聚焦
  onFocus() {
    const {
      searchText,
    } = this.data;
    if(!!searchText) {
      this.getAssociation();
    }
  },

  // 关键词联想
  getAssociation() {
    console.log(this.data);
    const userInfo = getStorageUserInfo() || {};
    const {
      searchText,
    } = this.data;
    goodApi.getAssociationList({
      keyword: searchText,
      requestMemberId: userInfo.id,
    }, {
      showLoading: false
    }).then(res => {
      const list = res;
      let tempList = [];
      const keyList = [];
      list.forEach((item, index) => {
        if(index > 4) return; 
        tempList = item.split("<em>");
        item = [];
        tempList.forEach(child => {
          if(child.indexOf("</em>") != -1) {
            let text = child.split("</em>");
            item.push({
              text: text[0],
              type: true,
            });
            if(text[1]) {
              item.push({
                text: text[1],
                type: false,
              });
            }
          } else {
            if(child) {
              item.push({
                text: child,
                type: false,
              });
            }
          }
        })
        keyList.push(item);
      });
      if(res.length) {
        this.setData({
          showAssociation: true,
        });
      }
      this.setData({
        keyList,
      });
    });
  },
  
  // 关闭联想
  onCloseAssociation({
    currentTarget
  }) {
    const data = {
      showAssociation: false,
    };
    const {
      association,
    } = currentTarget.dataset;
    let str = "";
    if(association) {
      association.forEach(item => {
        str += item.text;
      })
      data.searchText = str;
    };
    this.setData(data, () => {
      if(!!str) {
        this.onSearch();
      }
    });
  },

  // 点击搜索推荐
  onSearchLabel({
    currentTarget,
  }) {
    const {
      keyword,
    } = currentTarget.dataset;
    this.setData({
      searchText: keyword
    }, () => {
      this.onSearch();
    })
  },
})