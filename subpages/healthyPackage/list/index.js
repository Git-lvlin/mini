// pages/community/main/index.js
import commonApis from '../../../apis/common'
import healthyPackageApis from '../../../apis/healthyPackage'
import goodApi from '../../../apis/good'
import router from '../../../utils/router'
import create from '../../../utils/create.js'
import store from '../../../store/index'

create.Page(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 页面的初始数据
   */
  data: {
    goodsData: []
  },

  options: {},

  // 解析分享配置
  getShareParam(data) {
    commonApis.getShareParam({
      scene: data.scene,
    }).then(res => {
      this.getStoreInfo({
        storeNo: res.shareStoreNo
      })

      wx.setStorageSync("INVITE_INFO", {
        inviteCode: res.inviteCode,
        shareMemberId: res.shareMemberId,
      });
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    if (!options.scene) {
      this.getStoreInfo({
        storeNo: options.shareStoreNo
      })

      wx.setStorageSync("INVITE_INFO", {
        inviteCode: options.inviteCode,
        shareMemberId: options.shareMemberId,
      });
    } else {
      this.getShareParam(options);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getShareParam(this.options);
    healthyPackageApis.getGiftPackage({ orderType: 32, size: 999, page:1 })
      .then(res => {
        console.log(res);
        this.setData({
          goodsData: res.records
        })
      })
  },

  getStoreInfo({
    storeNo,
  }) {
    goodApi.getStoreInfo({
      storeNo,
    }).then(res => {
      if (res.storeAddress) {
        let takeSpot = {
          ...res.storeAddress,
          selected: 1,
          storeNo: storeNo,
          storeName: res.storeName,
        }
        const takeSpotOld = wx.getStorageSync("TAKE_SPOT") || {}
        wx.setStorageSync('OLD_TAKE_SPOT', takeSpotOld)
        wx.setStorageSync('TAKE_SPOT', takeSpot)
      }
    });
  },

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
        isCart: 1,
      }
    });
  },
  onBack() {
    router.go()
  }
})
