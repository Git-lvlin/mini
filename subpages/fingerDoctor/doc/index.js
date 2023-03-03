// pages/community/main/index.js
import commonApis from '../../../apis/common'
import healthyPackageApis from '../../../apis/healthyPackage'
import fingerDoctorApi from '../../../apis/fingerDoctor'
import router from '../../../utils/router'
import create from '../../../utils/create.js'
import store from '../../../store/index'
import dayjs from 'dayjs'
// import { getBaseApiUrl, handleErrorCode, showModal, setLoginRouter, clearLoginInfo } from '../../utils/tools'

create.Page(store, {
  use: [
    "systemInfo"
  ],

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },
  page: 1,
  totalPage: 1,

  options: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onReachBottom() {
    this.fetchData()
  },

  fetchData() {
    if (this.page > this.totalPage) {
      return
    }
    fingerDoctorApi.reportList({
      page: this.page,
      size: 20,
      type: this.options.type
    })
      .then(res => {
        this.totalPage = res.totalPage
        this.setData({
          data: [...this.data.data, ...res.records]
        })
        this.page++
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.fetchData()
  },
})
