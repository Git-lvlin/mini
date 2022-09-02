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

    orderType: 29,
    title: "开通运营设备",
    maxNum: 3,
    minNum: 1,
    num: 1,
    numTips: "每人最多开通3台设备",

    originalTitle: "运营设备服务费原价",
    originalPrice: 680000,
    originalPriceStr: "¥6800.00/台",
    unitTitle: "运营设备服务费现价",
    unitSubTitle: "（仅限前2000名）",
    unitPriceStr: "¥3800.00/台",
    priceTips: "设备运营期为3年,首次下单减免该年VIP店铺服务费：￥1000.00",
    leasePackage: {title:"", items:[]},

    leasePackageId: 0,
    periodAmount:0,
    //
    selectIcon: `${IMG_CDN}miniprogram/common/def_choose.png`,
    selectedIcon: `${IMG_CDN}miniprogram/common/choose.png`,
    checked: false,
  },

  onLoad(options) {
    if(options.inviteCode) {
      wx.setStorageSync("INVITE_INFO", {
        inviteCode: options.inviteCode,
      });
    }
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
        originalTitle: res.originalTitle,
        originalPrice: res.originalPrice,
        originalPriceStr: res.originalPriceStr,
        unitTitle: res.unitTitle,
        unitSubTitle: res.unitSubTitle,
        unitPrice: res.unitPrice,
        unitPriceStr: res.unitPriceStr,
        priceTips: res.priceTips,
        leasePackage: res.leasePackage,
        orderType: res.orderType,
      })
    console.log('createorder this.data ', this.data)
    }).catch(err => {
      console.log("createorder err ", err)
    })
  },

  onClickLeasePackage(detail) {
    var leasePackageId = detail.currentTarget.dataset.id
    var periodAmount = detail.currentTarget.dataset.amount
    console.log("onClickLeasePackage ", leasePackageId, "; amount", periodAmount, detail)
    this.setData({
      leasePackageId,
      periodAmount,
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
      if (!this.data.leasePackageId && this.data.orderType == 29) {
        showToast({
          title: '请选择套餐',
        })
        return
      }
      if (!this.data.checked) {
        showToast({
          title: '请先阅读并勾选协议',
        })
        return
      }
      var param = {
        count: this.data.num,
        orderType: this.data.orderType,
        leasePackageId: this.data.leasePackageId,
        payAmount: this.data.num * (this.data.unitPrice + this.data.periodAmount),
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
