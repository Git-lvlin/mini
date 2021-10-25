import create from '../../../utils/create'
import store from '../../../store/index'
import activityApi from '../../../apis/activity'
import util from '../../../utils/util';

create.Page(store, {
  use: [
    'systemInfo',
  ],

  data: {
    signInfo: {},
    signList: [],
    redPopup: false,
    resPopupActType: 1,
  },

  onLoad(options) {
    
  },

  onShow() {
    this.getSignInfo();
  },
  
  // 获取签到信息
  getSignInfo(isRevice) {
    let resPopupActType = 1;
    let redPopup = false;
    activityApi.getSignInfo().then(res => {
      const signInfo = res;
      let signList = [];
      const extraList = signInfo.signRedRule.extraList;
      signInfo.signRedRule.dayList.forEach((item, index) => {
        index < 7 && signList.push({
          value: util.divide(+item + (+extraList[index]), 100),
          hasGife: !!(+extraList[index]),
          isSign: index < signInfo.signNumber
        })
      })
      signInfo.signAmount = util.divide(signInfo.signAmount, 100);
      if(!!(+signInfo.signRedRule.status) && isRevice) {
        resPopupActType = 1;
        redPopup = true;
      } 
      if(!(+signInfo.signRedRule.status)) {
        resPopupActType = 2;
        redPopup = true;
      }
      this.setData({
        signInfo,
        signList,
        resPopupActType,
        redPopup,
      })
      
    });
  },

  // 点击签到
  onSign() {
    activityApi.userSign().then(res => {
      if(res) {
        this.getSignInfo(true);
      }
    });
  },

  onReachBottom() {

  },

  // 关闭红包弹窗
  onCloseRed() {
    this.setData({
      redPopup: false
    })
  },
})