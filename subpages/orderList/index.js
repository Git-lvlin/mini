// pages/community/main/index.js
import commonApis from '../../apis/common'
import healthyPackageApis from '../../apis/healthyPackage'
import orderListApi from '../../apis/orderList'
import router from '../../utils/router'
import create from '../../utils/create.js'
import store from '../../store/index'
import { getBaseApiUrl, handleErrorCode, showModal, setLoginRouter, clearLoginInfo } from '../../utils/tools'

create.Page(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 页面的初始数据
   */
  data: {
    orderData: [],
    title: ['全部', '待付款', '待收货', '已完成'],
    status: {
      1: '待付款',
      2: '待收货',
      4: '已完成'
    }
  },

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const userInfo = wx.getStorageSync("USER_INFO")
    if (!userInfo) {
      showModal({
        content: "未登录，请登录",
        confirmText: "去登录",
        ok() {
          setLoginRouter();
          router.push({
            name: "mobile"
          })
        },
        cancel() {
          // router.goTabbar();
        }
      })
    }
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync("USER_INFO")
    if (userInfo) {
      orderListApi.userOrderList({
        size: 20,
      }).then(res => {
        this.selectComponent('#tabs').resize();
        this.setData({
          orderData: res.records
        })
      })
    }
  },

  change({ detail }) {
    const userInfo = wx.getStorageSync("USER_INFO")
    if (userInfo) {
      orderListApi.userOrderList({
        status: detail.index === 3 ? 4 : detail.index,
        size: 20,
      }).then(res => {
        this.setData({
          orderData: res.records
        })
      })
    } else {
      showModal({
        content: "未登录，请登录",
        confirmText: "去登录",
        ok() {
          setLoginRouter();
          router.push({
            name: "mobile"
          })
        },
        cancel() {
          // router.goTabbar();
        }
      })
    }
    
  },
})
