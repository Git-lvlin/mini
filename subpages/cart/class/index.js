import create from '../../../utils/create'
import store from '../../../store/good'
import goodApi from '../../../apis/good'
import util from '../../../utils/util'

const defaultSecondCategory = [{
  id: 9999999999999999,
  gcName: "推荐",
  gcIcon: ""
}];

const app = getApp();
create.Page(store, {
  use: [
    "systemInfo",
    "cartList",
  ],

  categoryId: "",

  data: {
    classPopupState: false,
    classScrollHeight: 521,
    showClassPopup: false,
    selectFristClass: 0,
    selectSecondClass: 0,
    fristCategory: [],
    secondCategory: [],
    goodsList: [],
    recommendsNext: '',
    goodsBanner: "",
  },

  onLoad(options) {
    const {
      screenHeight,
      rpxRatio,
      navTotalHeight,
      bottomBarHeight,
    } = this.data.$.systemInfo;
    let classScrollHeight = screenHeight * rpxRatio - navTotalHeight - bottomBarHeight - 172 - 16;
    if(!!options.category_id) {
      this.categoryId = options.category_id;
    }
    this.setData({
      classScrollHeight
    });
    this.getCategory({
      params: {
        gcParentId: 0
      }
    });
    app.trackEvent('goods_category_level_three');
  },

  onUnload() {
    this.setData({
      fristCategory: [],
      secondCategory: [],
      goodsList: [],
    })
  },

  // 获取一级二级分类
  getCategory({
    second,
    params
  }) {
    goodApi.getCategory(params, { showLoading: !!second ? true : false }).then(res => {
      const classId = this.categoryId ? this.categoryId : res.records[0].id
      if(!second) {
        this.setData({
          fristCategory: res.records,
          selectFristClass: classId,
        }, () => {
          this.getRecommends();
        })
        this.getCategory({
          params: {
            gcParentId: classId
          },
          second: true
        })
        return ;
      }
      let secondCategory = defaultSecondCategory.concat(res.records);
      this.setData({
        secondCategory,
        selectSecondClass: defaultSecondCategory[0].id,
      })
    })
  },

  // 获取分类推荐列表
  getRecommends(next) {
    const {
      selectFristClass,
    } = this.data;
    const params = {
      gcId1: selectFristClass,
      size: 10,
      next: ""
    }
    if(!!next) params.next = next;
    goodApi.getRecommends(params).then(res => {
      let goodsList = this.goodListMap(res.records);
      this.setData({
        recommendsNext: res.hasNext ? res.next : "",
        goodsList,
      })
    })
  },

  // 获取商品列表
  getGoodsList(next) {
    const {
      selectFristClass,
      selectSecondClass,
    } = this.data;
    const params = {
      gcId1: selectFristClass,
      gcId2: selectSecondClass,
      size: 10,
    }
    if(!!next) params.next = next;
    if(selectSecondClass === defaultSecondCategory[0].id ) {
      this.getRecommends(!!next ? next : '');
      return
    }
    goodApi.getGoodsList(params).then(res => {
      let goodsList = this.goodListMap(res.records);
      this.setData({
        goodsList,
        goodsNext: res.hasNext ? res.next : "",
      })
    });
  },

  // 格式化商品数据 - 字段映射
  goodListMap(list) {
    let goodsList = [];
    list.forEach(item => {
      goodsList.push({
        ...item,
        spuId: item.id,
        skuId: item.defaultSkuId,
        goodsName: item.goodsName,
        skuName: item.goodsDesc,
        marketPrice: util.divide(item.goodsMarketPrice, 100),
        salePrice: util.divide(item.goodsSaleMinPrice, 100),
        quantity: 0,
        thumbnail: item.goodsImageUrl,
        goodsSaleNum: item.goodsSaleNum,
        isMultiSpec: item.isMultiSpec,
        goodsState: item.goodsState,
        goodsVerifyState: item.goodsVerifyState,
        isFreeFreight: item.isFreeFreight,
      })
    })
    return goodsList;
  },

  // 打开分类下拉
  onOpenClass() {
    this.setData({
      showClassPopup: true,
    })
  },

  // 关闭分类下拉
  onCloseClass() {
    this.setData({
      showClassPopup: false,
    })
  },

  // 监听选择一级分类
  handleSelectFristClass({
    detail
  }) {
    this.getCategory({
      params: {
        gcParentId: detail.classId
      },
      second: true
    })
    this.setData({
      selectFristClass: detail.classId,
    }, () => {
      this.getRecommends();
    })
  },

  // 选择二级分类分类
  onSelectClass(event) {
    let {
      showClassPopup
    } = this.data;
    if(showClassPopup) showClassPopup = false;
    this.setData({
      showClassPopup,
      selectSecondClass: event.currentTarget.dataset.id,
    }, () => {
      this.getGoodsList();
    })
  },

  handleClassPopupShow({ detail }) {
    this.setData({
      classPopupState: detail.state
    })
  }
})