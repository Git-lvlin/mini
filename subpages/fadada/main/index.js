// pages/community/main/index.js
import commonApis from '../../../apis/common'
import fadadaApi from '../../../apis/fadada'
import router from '../../../utils/router'
import { SYS_ENV } from '../../../constants/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractDetail: {}
  },

  options: {},

  contractId: null,

  sign() {
    this.findCompanyCert(this.data.contractDetail)
  },

  // 解析分享配置
  getShareParam(data) {
    var that = this
    console.log("getShareParam data ", data)
    if (data.contractId && data.callback==1) {
      this.getContractGetDetail(data.contractId)
    } else {
      commonApis.getShareParam({
        scene: data.scene,
      }).then(res => {
        this.contractId = res.contractId
        that.getContractGetDetail(this.contractId)
      })
    }
  },

  //
  getContractGetDetail(contractId) {
    fadadaApi.getContractGetDetail({
      contractId: contractId,
    }).then(res => {
      wx.setStorageSync('CURRENT_CONTRACT_ID', contractId)
      // console.log('pactUrl contractId ', wx.getStorageSync('CURRENT_CONTRACT_ID'), '; contractId', contractId)
      // 签订状态，1 已签订 ，2未签订，3待上传，4待支付，5待签订
      var signStatusDesc = {
        1: '已签订',
        2: '未签订',
        3: '待上传',
        4: '待支付',
        5: '待签订',
      }
      this.setData({
        contractDetail: {
          ...res.records,
          signStatusDesc: signStatusDesc[res.records.signStatus] || '-'
        }
      })
    })
  },

  findCompanyCert({ id, pactUrl }) {
    fadadaApi.findCompanyCert({
      companyId: id
    }).then(res => {
      if (res) {
        fadadaApi.genCompanyContract({
          companyId: id,
          businessId: id,
          contractUrl: pactUrl
        }).then(res => {
          router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(res.signUrl),
              encode: true
            }
          });
        })
      } else {
        fadadaApi.getCompanyVerifyUrl({
          companyId: id
        }).then(res => {
          router.push({
            name: "webview",
            data: {
              url: encodeURIComponent(res.verifyUrl),
              encode: true
            }
          });
        })
      }
    })
  },

  pactUrl() {
    const env = {
      'dev': '-dev',
      'uat': '-uat',
      'pro': ''
    }
    router.push({
      name: "webview",
      data: {
        url: encodeURIComponent(`https://publicmobile${env[SYS_ENV] || ''}.yeahgo.com/web/fadada-pdf?url=${this.data.contractDetail.pactUrl}&contractId=${this.data.contractDetail.id}`),
        encode: true
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
    this.getShareParam(options);
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
    this.getShareParam(this.options);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
