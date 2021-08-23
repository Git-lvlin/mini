import { IMG_CDN } from "../../constants/common"
import create from "../../utils/create"
import store from "../../store/index"
import { showToast } from "../../utils/tools"
import commonApi from "../../apis/common"
import router from "../../utils/router"

create.Page(store, {
  use: [
    "systemInfo"
  ],

  data: {
    invitationBack: `${IMG_CDN}miniprogram/invitation/invite_back.png`,
    tipsList: [
      "1、邀请码仅作为约购APP内测使用凭证，不做商业用途",
      "2、同一设备，同一账户邀请码只能使用一次，不可重复使用",
      "3、平台严厉打击非法手段使用APP，一经发现将冻结账户",
    ],
    code: "",
  },

  handleInput({
    detail
  }) {
    this.setData({
      code: detail.value,
    })
  },

  onSubmitCode() {
    const {
      code,
    } = this.data;
    if(!code) {
      showToast({ title: "请输入邀请码" });
      return;
    } 
    const deviceCode = wx.getStorageSync("DEVICE_CODE");
    commonApi.getInviteCode({
      code,
    }, {
      header: {
        d: deviceCode,
      },
    }).then(res => {
      if(res.invite) {
        wx.setStorageSync("IS_INPUT_INVITE", true);
        wx.setStorageSync("BETA_INFO", {betaCode:code});
        showToast({
          title: "提交成功",
          icon: "success",
          ok() {
            router.goTabbar();
          }
        });
      }
    })
  },

})