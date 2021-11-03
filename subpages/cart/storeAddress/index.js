import router from "../../../utils/router"
import format from '../../../utils/format'
import { showToast } from '../../../utils/tools'

const app = getApp();
Page({
  data: {
    storeAddress: {},
  },

  onLoad() {
    const storeAddress = wx.getStorageSync("ORDER_STORE_LOCATION");
    storeAddress.setAllAddress = `${storeAddress.provinceName}${storeAddress.cityName}${storeAddress.districtName}${storeAddress.address}`
    this.setData({
      storeAddress,
    })
    app.trackEvent('address_editAddress', {
      type: 'store'
    });
  },

  // 输入内容
  handleInput({
    currentTarget,
    detail,
  }) {
    const {
      storeAddress,
    } = this.data;
    let field = currentTarget.dataset.field;
    let value = detail.value;
    storeAddress[field] = value;
    this.setData({
      storeAddress,
    })
  },

  // 保存地址
  onSave() {
    const {
      storeAddress,
    } = this.data;
    if(format.checkEmpty(storeAddress.setUser)) {
      showToast({ title: "请输入提货人"});
      return;
    } else if(format.checkEmpty(storeAddress.setPhone)) {
      showToast({ title: "请输入手机号码"});
      return;
    } else if(!format.checkMobile(storeAddress.setPhone)) {
      showToast({ title: "请输入正确手机号码"});
      return;
    } else if(format.checkEmpty(storeAddress.setAddress)) {
      showToast({ title: "请输入详细地址"});
      return;
    }
    wx.setStorageSync("ORDER_STORE_LOCATION", storeAddress);
    router.go();
  },
})