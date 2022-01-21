import goodApi from '../../../apis/good'
import { IMG_CDN } from '../../../constants/common';
import router from '../../../utils/router';
import { getStorageUserInfo } from '../../../utils/tools';

Page({
  loadData: {},

  data: {
    fabulous: `${IMG_CDN}miniprogram/cart/fabulous.png`,
    fabulousAct: `${IMG_CDN}miniprogram/cart/fabulous_act.png`,
    // 总数
    allCount: 0,
    // 好评数
    greatCount: 0,
    // 中差评数
    middleCount: 0,
    // 有图数
    imgCount: 0,
    // 1 全部 2好评 3中差评 4有图
    type: 1,
    commentList: [],
    pageData: {
      next: 0,
      hasNext: true,
    },
  },

  onLoad(options) {
    options.commentType = options.orderType != 5 && options.orderType != 6 ? 1 : 2;
    this.loadData = options;
    this.getCommentListTotal();
    this.getCommentList();
  },
  
  onShow() {
    const setComment = wx.getStorageSync('SET_COMMENT');
    if(setComment && setComment.uId) {
      const userInfo = getStorageUserInfo();
      if(userInfo && userInfo.uId == setComment.uId) {
        const {
          commentList
        } = this.data;
        commentList.forEach(item => {
          if(setComment.id == item.id) {
            item.isPoint = setComment.isPoint;
            item.pointNum = !!setComment.isPoint ? +item.pointNum + 1 : +item.pointNum - 1;
          }
        });
        this.setData({
          commentList,
        })
        wx.removeStorage({
          key: 'SET_COMMENT'
        });
      }
    }
  },

  onReachBottom() {
    const {
      hasNext
    } = this.data.pageData;
    if(!!hasNext) {
      this.getCommentList();
    }
  },

  // 获取评价数
  getCommentListTotal() {
    const {
      storeNo,
      spuId,
      commentType,
    } = this.loadData;
    goodApi.getCommentListTotal({
      storeNo,
      spuId,
      commentType,
    }).then(res => {
      this.setData({
        greatCount: res.greatCount,
        middleCount: res.middleCount,
        imgCount: res.imgCount,
      });
    })
  },

  // 获取评价数
  getCommentList() {
    const {
      storeNo,
      spuId,
      commentType,
    } = this.loadData;
    const {
      type,
      pageData,
    } = this.data;
    const {
      next,
    } = pageData;
    goodApi.getCommentList({
      storeNo,
      spuId,
      commentType,
      next,
      type,
    }).then(res => {
      pageData.next = res.next;
      pageData.hasNext = res.hasNext;
      this.setData({
        pageData,
        commentList: res.records
      });
    })
  },

  onChangeType({
    currentTarget,
  }) {
    const {
      val
    } = currentTarget.dataset;
    const {
      type,
      pageData,
    } = this.data;
    if(type != +val) {
      pageData.next = 0;
      pageData.hasNext = false;
      this.setData({
        type: +val,
        pageData,
      }, () => {
        this.getCommentList();
      });
    }
  },

  onSetFabulous({
    currentTarget,
  }) {
    const {
      idx,
    } = currentTarget.dataset;
    const {
      commentList,
    } = this.data;
    const userInfo = getStorageUserInfo(true);
    if(!userInfo) {
      return;
    }
    const comment = commentList[idx];
    goodApi.setFabulous({
      id: comment.id,
      type: !!comment.isPoint ? 2 : 1,
    }, {
      showLoading: false
    }).then(res => {
      commentList[idx].isPoint = !!comment.isPoint ? false : true;
      commentList[idx].pointNum = !!comment.isPoint ? +comment.pointNum + 1 : +comment.pointNum - 1;
      this.setData({
        commentList
      })
    });
  },
  
  onToBuy() {
    router.go();
  },

  onToEvaluateDetail({
    currentTarget,
  }) {
    router.push({
      name: 'evaluateDetail',
      data: currentTarget.dataset,
    });
  },
})