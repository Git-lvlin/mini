import create from '../../utils/create'
import store from '../../store/index'
import router from '../../utils/router'
import day from 'dayjs' 
import { getList } from '../../apis/home'

create.Page(store, {
  use: [
    'motto'
  ],

  data: {
    showTreaty: false,
  },

  onLoad(options) {
    this.getUserSetting();
  },
  
  // 进入页面获取用户授权情况
  getUserSetting() {
    var that = this;
    //查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("用户授权了");
          wx.getUserInfo({
            lang: "zh_CN",
            success (res) {
              that.getCodeLogin(res.userInfo);
            }
          })
        } else {
          //用户没有授权
          console.log("用户没有授权");
          that.setData({ userAuth : false})
        }
      }
    });
  },

  // 点击授权
  handleGetUerInfo(res) {
    console.log(res)
    // rawData
    if(!!res.detail.userInfo){ // 返回用户信息
      this.getCodeLogin(res.detail.userInfo);
    } else { // 没有返回用户信息
      console.log("用户按了拒绝按钮")
    }
  },

  // 获取用户openid 登录
  getCodeLogin(userInfo) {
    console.log(userInfo);
    this.setData({ userAuth : true, userInfo: userInfo})
  },

  // 关闭条款弹窗
  onClickTreaty() {
    console.log(this)
    this.setData({
      showTreaty: true
    })
  },

  // 关闭条款弹窗
  onCloseTreaty() {
    this.setData({
      showTreaty: false
    })
  }

})