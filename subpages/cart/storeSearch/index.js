import goodApi from "../../../apis/good"
import { debounce, getStorageUserInfo, showToast } from "../../../utils/tools";
import util from "../../../utils/util";
import intensiveApi from '../../../apis/intensive'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import cartApi from "../../../apis/cart";
const app = getApp();
Page({
  searchPage: {
    page: 1,
    size: 10,
    totalPage: 1,
  },
  loading: false,
  sort: "",

  data: {
    searchText: "",
    showAssociation: false,
    hotSearch: [],
    historySearch: [],
    keyList: [],
    goodList: [],
    showDeleteSearch: false,
    // 显示清楚按钮
    showClear: false,
    // 是否已搜索 
    isSearch: false,
    scrollBottom: false,
    recommendList: null,
    cartAllData: null,
    cartList: null,
  },

  onLoad() {
    app.trackEvent('home_search');
  },

  async onShow() {
    // this.getHotSearch();
    this.getHistorySearch();
    await this.getRecommendList()
    this.getSummaryByCartData()
    // this.clearCartAll();
  },
  // 刷新数据
  handleUpdate() {
    this.getRecommendList()
  },

  // 购物车商品列表汇总
  getSummaryByCartData() {
    cartApi.summaryByCartData().then((res) => {
      console.log('购物车汇总数据', res)
      this.setData({
        cartAllData: res
      })
    })
  },

  // 清空购物车
  clearCartAll() {
    cartApi.clearCart().then((res) => {
      console.log('清空购物车', res)
      this.setData({
        cartList: null
      })
    })
  },

  // 购物车商品列表
  getCartList() {
    return new Promise((resolve) => {
      cartApi.cartList().then((res) => {
        console.log('购物车商品列表', res)
        this.setData({
          cartList: res
        })
        resolve(res)
      })
    })
  },

  // 设置购物车商品数量
  setCartNum(itemInfo) {
    const { value, skuId, objectId } = itemInfo;
    const params = {
      skuId: skuId,
      objectId: objectId,
      quantity: value,
    }
    cartApi.setCartNum(params).then((res) => {
      console.log('设置购物车商品数量', res)
      if (res.value) {
        this.getSummaryByCartData()
      }
    })
  },
  onStepChangeAdd(e) {
    // Toast.loading({ forbidClick: true });
    let {index, item, search} = e.currentTarget.dataset;
    let {buyMaxNum, value, unit, stockNum} = item;
    if (buyMaxNum > stockNum) {
      buyMaxNum = stockNum
    }
    let {recommendList, goodList, cartAllData} = this.data;
    if (cartAllData.checkedSkuQuantity > 20) {
      Toast(`购物车已满`);
      return
    }
    if (value + 1 > buyMaxNum) {
      Toast(`该商品最多购买${buyMaxNum}${unit}`);
      return
    }
    if (search) {
      goodList[index].value = value + 1
    } else {
      recommendList[index].value = value + 1
    }
    let param = search?goodList[index]:recommendList[index]
    this.setCartNum(param);
    setTimeout(() => {
      Toast.clear();
      if (search) {
        this.setData({
          goodList: goodList
        });
        return
      }
      this.setData({
        recommendList: recommendList
      });
    }, 300);
  },
  onStepChangeDelete(e) {
    // Toast.loading({ forbidClick: true });
    let {index, item, search} = e.currentTarget.dataset;
    let {buyMinNum, value, unit} = item;
    let {recommendList, goodList} = this.data;
    if (value == 0) {
      return
    }
    let num = value - 1;
    if (search) {
      goodList[index].value = num
    } else {
      recommendList[index].value = num
    }
    let param = search?goodList[index]:recommendList[index]
    this.setCartNum(param);
    if ((buyMinNum>1) && (value - 1 < buyMinNum)) {
      Toast(`该商品${buyMinNum}${unit}起购`);
    }
    setTimeout(() => {
      Toast.clear();
      if (search) {
        this.setData({
          goodList: goodList
        });
        return
      }
      this.setData({
        recommendList: recommendList,
      });
    }, 300);
  },

  async getRecommendList() {
    const resolveData = await this.getCartList();
    intensiveApi.getRecGoods().then((res) => {
      if (!res.records.length) {
        this.setData({
          recommendList: []
        })
      }
      let list = res.records.map((item) => {
        let p = (item.skuSalePrice/100).toString();
        let a = '';
        let z = '';
        let v = 0;
        if (p.includes('.')) {
          a = p.split('.')[0]
          z = p.split('.')[1]
        } else {
          a = p
        }
        resolveData.map(cartItem => {
          if (cartItem.objectId == item.objectId) {
            v = cartItem.quantity
          }
        })
        return {
          ...item,
          aPrice: a,
          zPrice: z,
          value: v,
        }
      })
      this.setData({
        recommendList: list
      })
    })
  },

  // 历史搜索
  getHistorySearch() {
    const userInfo = getStorageUserInfo();
    if(!userInfo.id) return;
    goodApi.getSearchHistory({
      requestMemberId: userInfo.id,
      searchType: 1,
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
        showDeleteSearch: false,
        historySearch: [],
      });
    });
  },

  // 确认清楚历史
  onOpenDeleteHistory() {
    this.setData({
      showDeleteSearch: true,
    });
  },

  // 关闭搜索弹窗
  handleCloseDeleteSearch() {
    this.setData({
      showDeleteSearch: false,
    });
  },

  // 热门搜索
  // getHotSearch() {
  //   goodApi.getHotSearch({}, {
  //     showLoading: false
  //   }).then(res => {
  //     this.setData({
  //       hotSearch: res
  //     })
  //   });
  // },

  // input输入
  handleSearchInput({
    detail
  }) {
    this.setData({
      searchText: detail.value,
      isSearch: false,
    })
    debounce(this.getAssociation, 500)();
  },

  // input 失焦
  handleInputBlur() {
    // setdata 冲突
    // const timer = setTimeout(() => {
      // clearTimeout(timer);
      // const {
      //   showAssociation
      // } = this.data;
      // if(showAssociation) {
      //   this.setData({
      //     showAssociation: false
      //   })
      // }
    // }, 300);
    
    this.setData({
      showClear: false,
    })
  },

  // input 聚焦
  onFocus() {
    const {
      searchText,
    } = this.data;
    if(!!searchText) {
      this.getAssociation();
    }
    this.setData({
      showClear: true,
    })
  },

  // 清除搜索信息
  onClearSearch() {
    this.setData({
      searchText: "",
      showAssociation: false,
    })
  },

  // 关键词联想
  getAssociation() {
    const userInfo = getStorageUserInfo() || {};
    const {
      searchText,
      showAssociation,
    } = this.data;
    goodApi.getAssociationList({
      keyword: searchText,
      requestMemberId: userInfo.id,
      searchType: 1,
    }, {
      showLoading: false
    }).then(res => {
      const list = res || [];
      let tempList = [];
      const keyList = [];
      list.forEach((item, index) => {
        // if(index > 4) return; 
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
      if(res && res.length) {
        if(!showAssociation) {
          this.setData({
            showAssociation: true,
          });
        }
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

  // 点击搜索
  async onSearch(event) {
    if(event) {
      this.searchPage.page = 1;
    }
    if(this.loading) return;
    this.loading = true;
    let {
      searchText,
      goodList,
    } = this.data;
    let {
      page,
      size,
    } = this.searchPage;
    const userInfo = getStorageUserInfo();
    const param = {
      storeNo: 'store_m_123942',
      page,
      size,
      keyword: searchText,
      requestMemberId: userInfo.id,
    }
    if(!!this.sort) {
      param.sort = this.sort;
    }
    const resolveData = await this.getCartList();
    // goodApi.getSearchList(param, {
    cartApi.getStoreSearchList(param, {
      showLoading: !goodList.length
    }).then(res => {
      this.getHistorySearch();
      this.loading = false;
      this.searchPage.totalPage = res.totalpage;
      let list = res.records.map((item, index) => {
        let p = (item.goodsSaleMinPrice/100).toString();
        let a = '';
        let z = '';
        let v = 0;
        if (p.includes('.')) {
          a = p.split('.')[0]
          z = p.split('.')[1]
        } else {
          a = p
        }
        resolveData.map(cartItem => {
          if (cartItem.skuId == item.skuId) {
            v = cartItem.quantity
          }
        })
        return {
          ...item,
          aPrice: a,
          zPrice: z,
          value: v,
        }
      })
      // let list = res.records;
      // list.forEach(item => {
      //   item.image = item.goodsImageUrl;
      //   item.title = item.goodsName;
      //   item.subtitle = item.goodsDesc;
      //   item.salePrice = util.divide(item.goodsSaleMinPrice, 100);
      //   item.marketPrice = util.divide(item.skuMarketPrice, 100);
      // });
      console.log("🚀 ~ file: index.js ~ line 277 ~ onSearch ~ page", page)
      if(page > 1) {
        list = goodList.concat(list);
        // list = list.concat(list);
      }
      this.setData({
        goodList: list,
        showAssociation: false,
        isSearch: true,
      })
    }).catch(() => {
      this.loading = false;
      this.setData({
        isSearch: true,
      })
    })
  },

  // 点击筛选
  onScreenItem({
    detail
  }) {
    this.searchPage.page = 1;
    this.sort = detail.sort;
    this.onSearch();
  },

  // 监听滚动到底部
  handleListBottom() {
    const {
      page,
      totalPage,
    } = this.searchPage;
    if(!this.loading && page < totalPage) {
      this.searchPage.page += 1;
      this.onSearch();
    }
  },

  // onPageScroll(e) {
  //   let {
  //     scrollBottom,
  //   } = this.data;

  //   if(scrollBottom) {
  //     this.setData({
  //       scrollBottom: false,
  //     })
  //   }
  // },

  // 页面滚动到底部
  // onReachBottom() {
  //   this.setData({
  //     scrollBottom: true,
  //   })
  // }
})