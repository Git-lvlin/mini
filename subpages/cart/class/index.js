import create from '../../../utils/create'
import store from '../../../store/index'
import goodApi from '../../../apis/good'

const defaultSecondCategory = [{
  id: 999999999,
  gcName: "推荐",
  gcIcon: ""
}];

create.Page(store, {
  use: [
    "systemInfo",
  ],

  /**
   * 页面的初始数据
   */
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
    let classScrollHeight = screenHeight * rpxRatio - navTotalHeight - bottomBarHeight - 172 - 16 - 104;
    this.setData({
      classScrollHeight
    });
    this.getCategory({
      params: {
        gcParentId: 0
      }
    });
  },

  onShow() {

  },

  // 获取一级二级分类
  getCategory({
    second,
    params
  }) {
    goodApi.getCategory(params, { showloading: !!second ? true : false }).then(res => {
      const classId = res.records[0].id
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
    }
    if(!!next) params.next = next;
    goodApi.getRecommends(params).then(res => {
      this.setData({
        recommendsNext: res.hasNext ? res.next : "",
        goodsList: res.records
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
      this.setData({
        goodsList: res.records,
        goodsNext: res.hasNext ? res.next : "",
      })
    });
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

  handleNum({ detail }) {
  // console.log("🚀 ~ file: index.js ~ line 139 ~ handleNum ~ detail", detail)

  },

  handleClassPopupShow({ detail }) {
    this.setData({
      classPopupState: detail.state
    })
  }
})