import goodApi from "../../../apis/good"
import { mapNum } from "../../../utils/tools";
import router from "../../../utils/router";
import util from "../../../utils/util";

Component({

  properties: {
  },

  data: {
    // hotGoodList: [],
    userLike:[],
    // pageData: {
    //   size: 15,
    //   next: 1,
    //   hasNext: false,
    // },
  }, 
  ready(){
    this.getUserLike();
  },
  methods: {
    // 设置商品列表数据
    // setGoodList(content) {
    //   let homeCache = wx.getStorageSync("HOME_CACHE") || {};
    //   if(content.dataType === 1) {
    //     if(homeCache.hotGoodList && !!homeCache.hotGoodList.length) {
    //       this.setData({
    //         hotGoodList: homeCache.hotGoodList,
    //       })
    //     }
    //     this.getCustomData(1);
    //   } else {
    //     this.setData({
    //       hotGoodList: mapNum(content.data)
    //     })
    //     if(homeCache.hotGoodList) {
    //       delete homeCache.hotGoodList;
    //       wx.setStorage({
    //         key: "HOME_CACHE",
    //         data: homeCache,
    //       })
    //     }
    //   }
    // },
    //猜你喜欢
    getUserLike(next){
      // const data = {
      //   size: 10,
      // };
      // if(!!next) {
      //   data.next = next;
      // } 
      goodApi.getUserLike({size:10}).then(res => {
        // console.log('res',res)
        // const {
        //   pageData,
        // } = this.data;
        // if(res.hasNext){
        //   pageData.next = parseInt(res.next)++;
        // }
        // pageData.hasNext = res.hasNext;
        const list = res.records;
        list.forEach(item => {
          item.goodsSaleMinPrice = util.divide(item.goodsSaleMinPrice, 100);
          item.goodsMarketPrice = util.divide(item.goodsMarketPrice, 100);
        });
        this.setData({
          // pageData,
          userLike: list
        })
      });
    },
    // 获取数据
    // getCustomData(page, pageSize = 15) {
    //   let homeCache = wx.getStorageSync("HOME_CACHE") || {};
    //   const content = this.data.floor.content;
    //   homeApi.getFloorCustom(content.dataUrl, {
    //     page,
    //     pageSize,
    //   }).then(res => {
    //     let list = [];
    //     let pageData = this.data.pageData;
    //     if(page < 2) {
    //       list = mapNum(res.records);
    //     } else {
    //       list = homeCache.hotGoodList;
    //       list = list.concat(mapNum(res.records));
    //     }
    //     pageData.totalPage = res.totalPage;
    //     pageData.page = page;
    //     this.setData({
    //       hotGoodList: list,
    //       pageData,
    //     });
    //     homeCache.hotGoodList = list
    //     wx.setStorage({
    //       key: "HOME_CACHE",
    //       data: homeCache,
    //     })
    //   });
    // },

    // 滚动到底
    // handleScroll() {
    //   const {
    //     pageData,
    //   } = this.data;
    //   // if(pageData.hasNext) {
    //     // console.log(222222)
    //     this.getUserLike(pageData.next);
    //   // }
    // },
    // 跳转详情
    // onGood({
    //   currentTarget
    // }) {
    //   let {
    //     spuId,
    //     skuId,
    //     activityId,
    //     objectId,
    //     orderType,
    //   } = currentTarget.dataset.data;
    //   router.push({
    //     name: 'detail',
    //     data: {
    //       spuId,
    //       skuId,
    //       activityId,
    //       objectId,
    //       orderType,
    //     }
    //   });
    // },
  }
})
