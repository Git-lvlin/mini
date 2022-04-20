import create from '../../../utils/create'
import store from '../../../store/index'
import activityApi from '../../../apis/activity'
import util from '../../../utils/util';
import router from '../../../utils/router';

const app = getApp();
create.Page(store, {
  use: [
    'systemInfo',
  ],
  redPage: {
    hasNext: false,
    next: '',
  },
  goodPage: {
    page: 1,
    size: 10,
    totalPage: 1,
  },

  data: {
    signInfo: {},
    signList: [],
    redPopup: false,
    resPopupActType: 1,
    rulePopup: false,
    redDetailPopup: false,
    redUseType: '',
    redUseList: [],
  },

  onLoad(options) {
    this.getSignGood();
  },

  onShow() {
    this.getSignInfo();
    this.getQueryRecord(true);
    app.trackEvent('mine_sign_in_detail');
  },
  handleScrollTop() {
    wx.pageScrollTo({
      scrollTop: 350,
      // selector: '.good_content_back',
      // offsetTop: -200
    })
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
          isSign: index < signInfo.signNumber,
          isToday: signInfo.signNumber + 1 > index && signInfo.signNumber -1 !== index,
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

  // 获取红包明细
  getQueryRecord(fristLoad) {
    let {
      redUseType,
      redUseList,
    } = this.data;
    const {
      next,
    } = this.redPage;
    const data = {};
    if(!!redUseType) {
      data.recordType = redUseType;
    }
    if(!!next) {
      data.next = next;
    }
    activityApi.getQueryRecord(data).then(res => {
      let list = res.records;
      this.redPage.hasNext = res.hasNext;
      this.redPage.next = res.next || '';
      list.forEach(item => {
        item.changeValue = util.divide(item.changeValue, 100);
      })
      if(!fristLoad) {
        redUseList = redUseList.concat(list);
      } else {
        redUseList = list;
      }
      this.setData({
        redUseList,
      });
    });
  },

  // 获取签到商品列表
  getSignGood() {
    let {
      goodList,
    } = this.data;
    const {
      page,
      size,
    } = this.goodPage;
    activityApi.getSignGood({
      page,
      size,
    }).then(res => {
      let list = res.records;
      this.goodPage.totalPage = res.totalPage;
      list.forEach(item => {
        item.destAmount = util.divide(item.destAmount, 100);
        item.goodsSalePrice = util.divide(item.goodsSalePrice, 100);
        item.maxDeduction = util.divide(item.maxDeduction, 100);
        item.goodsMarketPrice = util.divide(item.goodsMarketPrice, 100);
        item.finalPrice = util.divide(item.finalPrice, 100);
      })
      if(page != 1) {
        goodList = goodList.concat(list);
      } else {
        goodList = list;
      }
      this.setData({
        goodList,
      });
    });
  },

  // 明细滚动到底部
  handleScrollBottom() {
    const {
      hasNext,
    } = this.redPage;
    if(hasNext) {
      this.getQueryRecord();
    }
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
    const {
      page,
      totalPage,
    } = this.goodPage;
    if(totalPage > page) {
      this.goodPage.page += 1;
      this.getSignGood();
    }
  },

  // 返回上一页
  onBack() {
    router.go();
  },

  // 关闭红包弹窗
  onCloseRed() {
    this.setData({
      redPopup: false
    })
  },

  // 打开规则
  onOpenRule() {
    this.setData({
      rulePopup: true
    })
  },

  // 关闭规则
  onCloseRule() {
    this.setData({
      rulePopup: false
    })
  },

  // 选择明细类型
  onChangeUseType({
    currentTarget,
  }) {
    const {
      type
    } = currentTarget.dataset;
    this.setData({
      redUseType: type
    }, () => {
      this.getQueryRecord(true);
    })
  },

  // 打开使用明细
  onOpenDetailRed() {
    this.setData({
      redDetailPopup: true
    })
  },

  // 关闭使用明细
  onCloseDetailRed() {
    this.setData({
      redDetailPopup: false
    })
  },

  // 跳转商品详情
  onToDetail({
    currentTarget,
  }) {
    const {
      good,
    } = currentTarget.dataset;
    const {
      spuId = '',
      skuId = '',
      activityId = '',
      objectId = '',
      orderType = '',
    } = good;
    router.push({
      name: "detail",
      data: {
        spuId,
        skuId,
        activityId,
        objectId,
        orderType,
      },
    });
  },
  notmove() {},
})