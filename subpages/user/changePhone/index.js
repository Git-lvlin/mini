import loginApi from "../../../apis/login";
import router from "../../../utils/router";
import { getStorageUserInfo, showModal, showToast } from "../../../utils/tools";

const defTime = 60;

Page({
  timer: null,

  data: {
    code: "",
    phone: "",
    countTime: 0,
    openTimeType: false,
  },

  onLoad(options) {
    this.storeNo = options.storeNo;
  },

  handleInput({
    detail
  }) {
    let data = {};
    data[detail.label] = detail.value;
    this.setData(data);
  },
  
  // 点击获取验证码
  onCode() {
    const {
      phone,
    } = this.data;
    if(!phone) {
      showToast({ title: "请输入新手机号" });
      return;
    }
    if(phone.length != 11) {
      showToast({ title: "请输入正确手机号" });
      return;
    }
    this.checkPhone();
  },

  // 检验手机是否绑定
  checkPhone() {
    const {
      phone
    } = this.data;
    loginApi.checkBindPhone({
      phoneNumber: phone,
    }, {
      showLoading: false,
    }).then(res => {
      this.getCode();
    }).catch(err => {
      console.log(err)
    });
  },

  // 获取短信验证码
  getCode() {
    const {
      phone
    } = this.data;
    loginApi.getCode({
      phoneNumber: phone,
    }).then(res => {
      if(res.smsLimit) {
        // let overTime = res.vcodeCacheTime > 0 ? res.vcodeCacheTime : 0;
        // overTime = (overTime / 60).toFixed(0);
        showToast({ title: "短信已发送至您的新手机号码" });
        this.openTime();
      }
    });
  },

  // 开启倒计时
  openTime() {
    if(this.timer !== null) return;
    this.setData({
      openTimeType: true,
    })
    this.startTimer(defTime);
  },

  // 倒计时
  startTimer(countTime) {
    if(countTime === defTime) {
      this.setData({
        countTime: defTime,
      })
    }
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      if(countTime > 0) {
        let time = countTime - 1;
        this.setData({
          countTime: time,
        })
        this.startTimer(time);
      } else {
        this.setData({
          openTimeType: false,
          countTime: 0,
        })
      }
    }, 1000);
  },

  onSave() {
    const {
      code,
      phone,
    } = this.data;
    if(!phone) {
      showToast({ title: "请输入手机号" })
      return;
    }
    if(phone.length != 11) {
      showToast({ title: "请输入正确手机号" })
      return;
    }
    if(!code) {
      showToast({ title: "请输入验证码" })
      return;
    }
    // 逻辑未完成 - 后端业务不全
    const userInfo = getStorageUserInfo();
    loginApi.changeBindPhone({
      uid: userInfo.uId,
      phoneNumber: phone,
    })
  },

})