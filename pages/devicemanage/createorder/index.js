import create from "../../../utils/create";
import store from "../../../store/index";
import router from "../../../utils/router";
import { getStorageUserInfo, jumpToAgreement } from "../../../utils/tools";
import api from "../../../apis/devicemanage";
import { debounce, showToast } from '../../../utils/tools';
import { H5_HOST,IMG_CDN } from '../../../constants/common'

const app = getApp();
create.Page(store, {

  data: {
    userInfo: "",
    //
    agreement: {link:"", prefix:"我已阅读并同意", name:"平台服务协议》"},
    maxNum: 3,
    minNum: 1,
    num: 1,
    numTips: "每人最多开通3台设备",
    text:[],
    unitPrice: 0,
    //
    selectIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    selectedIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    checked: false,
  },

  onLoad(options) {
    const userInfo = getStorageUserInfo() || ""
    this.setData({
      userInfo
    });
    console.log('createorder options ', options, '; userInfo ', userInfo)
    this.getPay()
  },
  onShow() {
    this.getPay()
  },
  getPay() {
    api.getPay().then(res => {
      console.log('createorder res ', res)
      var prefix = res.agreement.title.split("《")[0]
      var name = res.agreement.title.split("《")[1]
      this.setData({
        agreement: {
          link: res.agreement.link,
          prefix: prefix,
          name: name,
        },
        maxNum: res.maxNum,
        minNum: res.minNum,
        num: res.num,
        numTips: res.numTips,
        text: res.text,
        unitPrice: res.unitPrice,
      })
    console.log('createorder this.data ', this.data)
    }).catch(err => {
      console.log("createorder err ", err)
    })
  },

  onReduceNum() {
    this.data.num -= 1
    if (this.data.num < this.data.minNum) {
      this.data.num = this.data.minNum
    }
    this.setData({
      num: this.data.num
    })
  },

  onAddNum() {
    this.data.num += 1
    if (this.data.num > this.data.maxNum) {
      this.data.num = this.data.maxNum
    }
    this.setData({
      num: this.data.num
    })
  },

    // 勾选条件
    onChangeRadio(event) {
      var check = this.data.checked;
      if (check) {
        this.data.checked = false;
        console.log("已取消选中");
      } else {
        this.data.checked = true;
        console.log("已选中");
      }
      this.setData({
        checked: this.data.checked,
      });
    },
    // 协议跳转
    onClickAgreement(event) {
    console.log('createorder this.data.agreement ', this.data.agreement)
      router.push({
        name: "webview",
        data: {
          url: this.data.agreement.link,
        },
      })
    },

    onConfirm() {
      if (!this.data.checked) {
        showToast({
          title: '请先阅读并勾选协议',
        })
        return
      }
      var param = {
        count: this.data.num,
        payAmount: this.data.num * this.data.unitPrice,
      }
      api.createOrder(param).then(res => {
        console.log('createorder api res ', res)
        router.push({
          name: "cashier",
          data: {
            id: res.orderId,
            scene: res.orderType,
            payAmount: res.payAmount,
          },
        })
      })
    },
})
