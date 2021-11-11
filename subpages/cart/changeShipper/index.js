import router from "../../../utils/router";
import { showModal, showToast } from "../../../utils/tools";

Page({
  storeNo: "",

  data: {
    user: "",
    phone: "",
  },

  onLoad: function (options) {
    this.storeNo = options.storeNo;
  },

  onHide: function () {

  },

  onUnload: function () {

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
        wx.setStorageSync("ORDER_STORE_LOCATION", {
          setUser,
          setPhone,
        });
        router.go();
      },
    })
  },

})