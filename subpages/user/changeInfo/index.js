import userApi from "../../../apis/user";
import router from "../../../utils/router";
import { getStorageUserInfo, showModal, showToast } from "../../../utils/tools";

const app = getApp();
Page({

  data: {
    userInfo: {},
    nickName: "",
  },

  onLoad(options) {
    const userInfo = getStorageUserInfo();
    this.setData({
      userInfo,
      nickName: userInfo.nickName,
    });
    app.trackEvent('mine_nickname_edit');
  },

  handleInput({
    detail
  }) {
    let nickName = detail.value;
    this.setData({
      nickName,
    });
  },

  onSave() {
    const {
      userInfo,
      nickName,
    } = this.data;
    if(!nickName) {
      showToast({ title: "请输入昵称" })
      return;
    }
    if(!nickName.match( /^[\u4E00-\u9FA5a-zA-Z0-9_]{2,26}$/)) {
      showToast({ title: "请确认昵称格式是否正确" })
      return;
    }
    userApi.updateUserInfo({
      memberId: userInfo.id,
      nickName,
    }).then(res => {
      showToast({ title: "修改成功", ok() {
          const pages = getCurrentPages();
          //上一个页面
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            updateInfo: true,
          });
          router.go();
        },
      })
    });
  },

})