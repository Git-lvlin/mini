import homeApi from "../../../apis/home"
import router from "../../../utils/router";
import create from "../../../utils/create";
import store from "../../../store/index";
import { objToParamStr, strToParamObj, mapNum, debounce } from "../../../utils/tools";
import { FLOOR_TYPE } from "../../../constants/home";

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
        if(now && now.content) {
          debounce(() => {
            this.setClassList(now.content);
          }, 300)();
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
    },
    classTabAllCache: {},
  },

  methods: {

    // 设置商品分类数据
    setClassList(content) {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      if(content.dataType === 1) {
        if(homeCache.classTabList && !!homeCache.classTabList.length) {
          this.setData({
            classTabList: homeCache.classTabList,
          })
        }
        this.getCustomData();
      } else {
        this.setData({
          classTabList: content.data
        })
        homeCache.classTabList = content.data;
        wx.setStorageSync("HOME_CACHE", homeCache);
      }
    },

    // 获取classtab数据
    getCustomData() {
      let homeCache = wx.getStorageSync("HOME_CACHE") || {};
      const content = this.data.floor.content;
      homeApi.getFloorCustom(content.dataUrl, {}).then(res => {
        const list = res;
        this.setData({
          classTabList: list
        }, () => {
          homeCache.classTabList = list
          wx.setStorageSync("HOME_CACHE", homeCache);
          this.getListData(this.data.param)
        });
      });
    },

    // 获取商品列表数据
    getListData({
      index = 0,
      size = 10,
      next = 0,
      isTab = false,
      paging = false,
      isGetNext = false,
    }) {
      // 没缓存请求数据并加缓存
      let {
        classTabList,
        refreshering,
        classTabAllCache,
      } = this.data;
      
      // 先判断缓存
      console.log("🚀getListData ~ classTabAllCache", classTabAllCache)
      // console.log("🚀  ~ getListData ~ data", this.data)
      // 有缓存直接用缓存更新数据
      if (classTabAllCache[index] && !paging) {
        // 当前分类最近一次的商品列表
        const nowData = classTabAllCache[index].hotGoodList;
        // 当前分类最近一次的列表分页信息
        const pageData = classTabAllCache[index].pageData;
        this.setData({
          hotGoodList: nowData,
          pageData: pageData,
        }, () => {
          this.setScroll(isGetNext);
        })
        return
      }
      // if(!classTabList[index]) return;
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
        classTabAllCache = {
          ...classTabAllCache,
          [index]: {
            pageData: itemData,
            hotGoodList: bigArr
          },
        }
        this.setData({
          classTabAllCache,
          hotGoodList: bigArr,
          pageData: itemData
        }, () => {
          this.setScroll(isGetNext);
        })
      })
    },

    // 更新当前tab数据
    tabHandle({currentTarget}) {
      const index = currentTarget.dataset.index;
      const indexData = this.data.classTabList[index];
      this.setData({
        indexData: indexData,
        classIndex: index
      }, () => {
        // 请求当前tab列表数据
        this.getListData({index:index, isTab: true})
      })
    },

    // 设置滚动条高度
    setScroll(isGetNext) {
      
      this.data.isFixedTop && !isGetNext && this.triggerEvent("setScroll", {floorType: FLOOR_TYPE.classGood});
    },

    // 滚动到底
    handleScroll() {
      const {
        pageData,
      } = this.data;
      if(pageData.hasNext) {
        this.getListData({
          index: this.data.classIndex,
          size: pageData.size,
          next: pageData.next,
          paging: true,
          isGetNext: true,
        });
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
