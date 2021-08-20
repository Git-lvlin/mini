import homeApi from "../../../apis/home"
import router from "../../../utils/router";
import create from "../../../utils/create";
import store from "../../../store/index";
import { objToParamStr, strToParamObj, mapNum } from "../../../utils/tools";

create.Component(store, {
  use: [
    "systemInfo"
  ],

  properties: {
    floor: {
      type: Object,
      value: {},
      observer(now, old) {
        const nowStr = JSON.stringify(now);
        const oldStr = JSON.stringify(old);
        if(nowStr != oldStr) {
          this.setClassList(now.content);
        }
      }
    },
    scrollBottom: {
      type: Boolean,
      value: false,
      observer(nowVal, oldVal) {
        if(nowVal !== oldVal && nowVal) {
          this.handleScroll();
        }
      }
    },
    topSearchHeight: {
      type: Number,
      value: 0,
      observer(nowVal, oldVal) {
      }
    },
    isFixedTop: {
      type: Boolean,
      value: false,
      observer(nowVal, oldVal) {
      }
    },
  },

  data: {
    hotGoodList: [],
    classTabList: [],
    indexData: 0,
    classIndex: 0,
    pageData: {
      next: 0,
      size: 10,
      hasNext: false,
    },
    param: {
      index: 0,
      size: 10,
      next: 0,
      isTab: false,
    }
  },

  methods: {
    tabHandle({currentTarget}) {
      // 更新当前tab数据
      const index = currentTarget.dataset.index;
      const indexData = this.data.classTabList[index];
      this.setData({
        indexData: indexData,
        classIndex: index
      }, () => {
        // 请求当前tab列表数据
        // this.data.isFixedTop&&this.triggerEvent("setScroll", {});
        this.getListData({index:index, isTab: true})
      })
    },

    // 设置商品分类数据
    setClassList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.classTabList && !!homeCache.classTabList.length) {
          this.setData({
            classTabList: homeCache.classTabList,
          })
        }
        this.getCustomData(1);
      } else {
        this.setData({
          classTabList: content.data
        })
        if(homeCache.classTabList) {
          delete homeCache.classTabList;
          wx.setStorage({
            key: "HOME_CACHE",
            data: homeCache,
          })
        }
      }
    },

    // 获取商品列表数据
    getListData({index=0, size=10, next=0, isTab=false, paging=false}) {
      // 先判断缓存
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      // 有缓存直接用缓存更新数据
      console.log('index', index)
      console.log('有缓存!', homeCache.classTabAllCache)
      if (homeCache.classTabAllCache && homeCache.classTabAllCache[index] && !paging) {
        // 当前分类最近一次的商品列表
        const nowData = homeCache.classTabAllCache[index].hotGoodList;
        // 当前分类最近一次的列表分页信息
        const pageData = homeCache.classTabAllCache[index].pageData;
        this.setData({
          hotGoodList: nowData,
          pageData: pageData
        })
        return
      }
      console.log('请求数据并加缓存')
      // 没缓存请求数据并加缓存
      const {
        classTabList,
      } = this.data;
      if(!classTabList[index]) return;
      const init = classTabList[index];
      const urlData = init.actionUrl?.split('?');
      const initUrl = urlData[0];
      const initTabData = urlData[1];
      const param = strToParamObj(initTabData)
      const newParam = {
        ...param,
        size: size,
        next: next
      }
      const lastParam = objToParamStr(newParam)
      const verifyVersionStr = '&verifyVersionId=1' // 修正为配置1数据(与app同步，默认配置为3)
      const requestUrl = initUrl + '?' + lastParam
      homeApi.getFloorCustom(requestUrl).then(res => {
        const {
          hotGoodList,
        } = this.data;
        let bigArr = mapNum(res.records) || [];
        if (!isTab) {
          bigArr = hotGoodList.concat(bigArr)
        }
        const itemData = {
          next: res.next,
          size: size,
          hasNext: res.hasNext
        }
        this.setData({
          hotGoodList: bigArr,
          pageData: itemData
        })
        homeCache.classTabAllCache = {
          ...homeCache.classTabAllCache,
          [index]: {
            pageData: itemData,
            hotGoodList: bigArr
          },
        }
        wx.setStorage({
          key: "HOME_CACHE",
          data: homeCache,
        })
      })
    },
    // 获取classtab数据
    getCustomData(page, pageSize = 15) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      const content = this.data.floor.content;
      homeApi.getFloorCustom(content.dataUrl, {
        page,
        pageSize,
      }).then(res => {
        let list = res;
        this.setData({
          classTabList: list
        }, () => {
          this.getListData(this.data.param)
        });
        homeCache.classTabList = list
        wx.setStorage({
          key: "HOME_CACHE",
          data: homeCache,
        })
      });
    },

    // 滚动到底
    handleScroll() {
      const {
        pageData,
      } = this.data;
      if(pageData.hasNext) {
        this.getListData({index: this.data.classIndex, size: pageData.size, next: pageData.next, paging: true});
      }
    },
    // 跳转详情
    onGood({
      currentTarget
    }) {
      let {
        spuId,
        skuId,
        activityId,
        objectId,
        orderType,
      } = currentTarget.dataset.data;
      router.push({
        name: 'detail',
        data: {
          spuId,
          skuId,
          activityId,
          objectId,
          orderType,
        }
      });
    },
  },

})
