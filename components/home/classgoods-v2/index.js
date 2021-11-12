import homeApi from '../../../apis/home';
import router from '../../../utils/router'
import Request from '../../../utils/request'
import create from '../../../utils/create'
import store from '../../../store/index'
import { mapNum, strToParamObj } from '../../../utils/tools';

const defPage = {
 next: 0,
 size: 20,
 hasNext: false,
}
const requestOption = {
  hasBase: true,
  showLoading: false,
};

create.Component(store, {
  use: [
    "homeData"
  ],
  options: {
    addGlobalClass: true,
  },

  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        if(now && now.content && this.data.fristLoad) {
          this.setClassList(now.content);
        }
      }
    },
    scrollBottom: {
      type: Boolean,
      value: false,
      observer(nowVal, oldVal) {
        if(nowVal !== oldVal && nowVal) {
          this.handleScrollBottom();
        }
      }
    },
    isFixedTop: {
      type: Boolean,
      value: false,
    },
    refreshering: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    fristLoad: false,
    scrollListWidth: 0,
    classList: [],
    actClassIdx: "",
    goodList: [],
    pageData: {
      ...defPage
    },
    secondClass: [],
    cacheData: {},
  },

  ready() {
    const {
      floor,
    } = this.data;
    if(floor && floor.content) {
      this.setClassList(floor.content);
      this.setData({
        fristLoad: true,
      })
    }
  },

  methods: {
    // 设置豆腐块
    setClassList(content) {
      let actClassIdx = 0;
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.classList && !!homeCache.classList.length) {
          this.setData({
            classList: homeCache.classList,
            actClassIdx,
          })
        }
        homeApi.getFloorCustom(content.dataUrl, {
          parentId: 0
        }).then(res => {
          let list = res.records;
          homeCache.classList = list;
          this.setData({
            classList: list,
            actClassIdx,
          }, () => {
            if(list.length) {
              this.getGoodList();
              this.getSecondClass();
            }
          });
          wx.setStorageSync("HOME_CACHE", homeCache);
        });
      } else {
        let list = content.data;
        this.setData({
          classList: list,
          actClassIdx,
        }, () => {
          if(list.length) {
            this.getGoodList();
            this.getSecondClass();
          }
        });
        if(homeCache.classList) {
          delete homeCache.classList;
          wx.setStorageSync("HOME_CACHE", homeCache);
        }
      }
    },

    // 获取二级分类
    getSecondClass() {
      const {
        classList,
        actClassIdx,
        cacheData,
      } = this.data;
      const {
        classGoodV2
      } = this.store.data.homeData;
      const actData = classList[actClassIdx];
      if(!!actData.actionCGUrl) {
        let urlParam = actData.actionUrl.split('?')[1];
        urlParam = strToParamObj(urlParam);
        urlParam = homeApi.getExamine(urlParam);
        Request.post(actData.actionCGUrl, urlParam, requestOption).then(res => {
          const list = res.records;
          classGoodV2.className = actData.gcName;
          classGoodV2.secondClass = list;
          cacheData[actClassIdx] = {
            ...cacheData[actClassIdx],
            secondClass: list,
          };
          this.store.setHomeData({
            classGoodV2
          });
          this.setData({
            secondClass: list,
            cacheData,
          })
          
        });
      }
    },

    // 获取商品列表
    getGoodList() {
      const {
        classList,
        actClassIdx,
        pageData,
        goodList,
        cacheData,
      } = this.data;
      const actData = classList[actClassIdx];
      if(!actData.actionUrl) {
        this.setData({
          goodList: []
        })
        return;
      }
      let resData = null;
      let url = actData.actionUrl.split('?')[0];
      let urlParam = actData.actionUrl.split('?')[1];
      urlParam = strToParamObj(urlParam);
      let postData = {
        ...urlParam,
        next: pageData.next,
        size: pageData.size,
      };
      if(postData.gcId1) {
        postData.gcId1 = +postData.gcId1;
      }
      postData = homeApi.getExamine(postData);
      // 请求
      if(!!actData.actionCGUrl) {
        resData = Request.post(url, postData, requestOption);
      } else {
        resData = Request.get(url, postData, requestOption);
      }
      !!resData && resData.then(res => {
        let list = res.records || [];
        list = mapNum(list);
        list = goodList.concat(list);
        cacheData[actClassIdx] = {
          ...cacheData[actClassIdx],
          pageData: {
            hasNext: res.hasNext,
            next: res.next,
            size: +res.size,
          },
          goodList: list,
        };
        pageData.next = res.next,
        pageData.hasNext = res.hasNext,
        this.setData({
          goodList: list,
          cacheData,
          pageData,
        });
      });
    },

    // 滚动到底部，获取分页数据
    handleScrollBottom() {
      const {
        pageData
      } = this.data;
      if(pageData.hasNext) {
        this.getGoodList();
      }
    },

    // 打开二级分类弹窗
    onOpenClass() {
      const {
        classGoodV2
      } = this.store.data.homeData;
      classGoodV2.showHomePopup = true;
      this.store.setHomeData({
        classGoodV2
      });
    },

    // 跳转
    onClass({
      currentTarget
    }) {
      const {
        actClassIdx,
        cacheData,
      } = this.data;
      let {
        data,
        idx,
      } = currentTarget.dataset;
      if(!!cacheData[idx]) {
        if(idx == actClassIdx) {
          return
        }
        let {
          secondClass = [],
          goodList,
          pageData,
        } = cacheData[idx];
        this.setData({
          actClassIdx: idx,
          secondClass,
          goodList,
          pageData,
        })
      } else {
        let pageData = {
          ...defPage
        };
        this.setData({
          actClassIdx: idx,
          secondClass: [],
          goodList: [],
          pageData,
        }, () => {
          this.getGoodList();
          this.getSecondClass();
        })
      }
    },

    // 点击二级分类
    onSecondClass({
      currentTarget,
    }) {
      const {
        data,
      } = currentTarget.dataset;
      router.push({
        name: "classGood",
        data: {
          id: data.gcId,
          pid: data.gcParentId,
          name: data.gcName,
        }
      })
    },
  }
})
