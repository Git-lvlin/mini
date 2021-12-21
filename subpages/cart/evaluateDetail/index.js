import goodApi from '../../../apis/good'
import { IMG_CDN } from '../../../constants/common';
import router from '../../../utils/router';
import { getStorageUserInfo } from '../../../utils/tools';

Page({
  id: '',

  data: {
    fabulous: `${IMG_CDN}miniprogram/cart/fabulous.png`,
    fabulousAct: `${IMG_CDN}miniprogram/cart/fabulous_act.png`,
    comment: {},
  },

  onLoad(options) {
    this.id = options.id;
    this.getDetail();
  },

  getDetail() {
    goodApi.getCommentDetail({
      id: this.id
    }).then(res => {
      this.setData({
        comment: res
      })
    });
  },

  onSetFabulous() {
    const {
      comment,
    } = this.data;
    const userInfo = getStorageUserInfo(true);
    if(!userInfo) {
      return;
    }
    goodApi.setFabulous({
      id: comment.id,
      type: !!comment.isPoint ? 2 : 1,
    }, {
      showLoading: false
    }).then(res => {
      comment.isPoint = !!comment.isPoint ? false : true;
      comment.pointNum = !!comment.isPoint ? +comment.pointNum + 1 : +comment.pointNum - 1;
      const data = {
        isPoint: comment.isPoint,
        id: comment.id,
        uId: userInfo.uId,
      };
      this.setData({
        comment
      })
      wx.setStorageSync('SET_COMMENT', data);
    });
  },

  onToDetail() {
    router.go(2);
    // const {
    //   comment
    // } = this.data;
    // const {
    //   orderType
    // }
  },

  onOpenImg({
    currentTarget,
  }) {
    const {
      idx,
    } = this.data;
    const {
      comment,
    } = this.data;
    if(comment.imgs && comment.imgs.length) {
      wx.previewImage({
        current: comment.imgs[idx],
        urls: comment.imgs,
      });
    }
  }
})