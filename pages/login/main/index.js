import create from '../../../utils/create'
import store from '../../../store/index'
import router from '../../../utils/router'
import { getUserInfo, handleErrorCode } from '../../../utils/tools'
import { SOURCE_TYPE } from '../../../constants/index'
import { userLogin } from '../../../apis/login'

create.Page(store, {
  use: [
    'motto'
  ],

  data: {
    showTreaty: false,
    canUseProfile: false,
    radio: ''
  },

  onLoad(options) {
    if (wx.getUserProfile) {
      this.setData({
        canUseProfile: true
      })
    } else {
      this.getUserSetting();
    }
    
    router.loginTo();
  },

  // 新API登录
  onLogin: async function() {
    // 生命周期内登录过了
    if(!this.data.radio) {
      wx.showToast({
        title: '请先勾选服务协议和隐私政策',
        icon: 'none',
        mask: false,
      });
      return;
    }
    let userInfo = "";
    if(!!this.data.$.defUserInfo) {
      userInfo = this.data.$.defUserInfo;
    } else {
      try {
        const res = await getUserInfo();
        userInfo = res.userInfo
      } 
      catch(err) {
        console.log("🚀 ~ login err", err)
        return
      }
    }
    this.getCodeLogin(userInfo);
  },
  
  // 进入页面获取用户授权情况 - 旧api登录
  getUserSetting() {
    var that = this;
    //查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.getCodeLogin(getUserInfo(false));
        } else {
          //用户没有授权
          console.log("用户没有授权");
          that.setData({ userAuth : false})
        }
      }
    });
  },

  // 点击授权 - 旧api登录
  handleGetUerInfo(res) {
    if(!!res.detail.userInfo){
      this.getCodeLogin(res.detail.userInfo);
    } else {
      console.log("用户按了拒绝按钮")
    }
  },

  // 获取用户openid 登录
  getCodeLogin(userInfo) {
    console.log(userInfo);
    wx.login({
      success: (result)=>{
        userLogin({
          code: result.code,
          sourceType: SOURCE_TYPE,
        }, {
          notErrorMsg: true,
        }).then(res => {
        console.log("🚀 ~ file: index.js ~ line 84 ~ getCodeLogin ~ res", res)
          
        }).catch(err => {
          if(err.code === 200102) {
            wx.setStorageSync("LOGIN_INFO", err.data);
            store.data.userInfo = userInfo;
            store.data.defUserInfo = userInfo;
            router.push({
              name: "bindPhone"
            });
          } else {
            handleErrorCode(err.code);
          }
        })
      },
      fail: ()=>{}
    });
    this.setData({ userAuth : true, userInfo: userInfo})
  },

  // 勾选条件
  onChangeRadio(event) {
    this.setData({
      radio: event.detail,
    });
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