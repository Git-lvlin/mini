import router from "../../../utils/router";
import { showModal, showToast } from "../../../utils/tools";

Page({
  storeNo: "",

  data: {
    user: "",
    phone: "",
  },

  onLoad(options) {
    this.storeNo = options.storeNo;
    let data = wx.getStorageSync("ORDER_STORE_LOCATION");
    if(data && data.setUser) {
      this.setData({
        user: data.setUser,
        phone: data.setPhone,
      });
    }
  },

  handleInput({
    detail
  }) {
    let data = {};
    data[detail.label] = detail.value;
    this.setData(data)
  },

  onSave() {
    const {
      user,
      phone,
    } = this.data;
    if(!user) {
      showToast({ title: "请输入提货人" })
      return;
    }
    if(!phone) {
      showToast({ title: "请输入手机号" })
      return;
    }
    if(phone.length != 11) {
      showToast({ title: "请输入正确手机号" })
      return;
    }
    showModal({
      content: "您确定要修改提货人信息？",
      ok() {
        let data = wx.getStorageSync("ORDER_STORE_LOCATION");
        data = {
          ...data,
          setUser: user,
          setPhone: phone
        };
        wx.setStorageSync("ORDER_STORE_LOCATION", data);
        router.go();
      },
    })
  },

})