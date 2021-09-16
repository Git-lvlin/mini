import userApi from "../../../apis/user"
import dayjs from "../../../miniprogram_npm/dayjs/index";
import { getStorageUserInfo } from "../../../utils/tools";
import util from "../../../utils/util";

const topBarList = [
  {
    type: 1,
    name: "未使用",
    selected: true,
  },
  {
    type: 2,
    name: "已使用",
  },
  {
    type: 4,
    name: "已失效",
  },
];
const defPage = {
  page: 1,
  pageSize: 10,
  totalPage: 1,
}

Page({
  pageData: {
    ...defPage
  },

  data: {
    barList: topBarList,
    isLoad: false,
    conponList: [],
    selectType: 1,
    isNotData: false,
    showSharePopup: false,
  },

  onLoad(options) {
    this.getCouponList();
  },

  onReachBottom() {
    let {
      page,
      totalPage,
    } = this.pageData;
    const {
      isNotData
    } = this.data;
    if(page < totalPage) {
      this.pageData.page += 1;
      this.getCouponList();
    } else {
      if(!isNotData) {
        this.setData({
          isNotData: true,
        })
      }
    }
  },

  // 获取红包
  getCouponList() {
    const userInfo = getStorageUserInfo(true, true);
    if(!userInfo) {
      return;
    }
    let {
      page,
      pageSize,
    } = this.pageData;
    let {
      conponList,
      selectType,
      isNotData,
    } = this.data;
    let data = {
      status: selectType,
      memberId: userInfo.id,
      page,
      pageSize,
    }
    userApi.getCouponList(data).then(res => {
      this.pageData.totalPage = res.totalPage;
      let list = res.records;
      list.forEach(item => {
        item.freeAmount = util.divide(item.freeAmount, 100);
        item.usefulAmount = util.divide(item.usefulAmount, 100);
        item.activityStartTime = dayjs(item.activityStartTime).format("YYYY-MM-DD HH:mm:ss");
        item.activityEndTime = dayjs(item.activityEndTime).format("YYYY-MM-DD HH:mm:ss");
        
      });
      if(page == 1) {
        conponList = list;
        isNotData = page == 1 && list.length > 0 && list.length < pageSize ? true : false;
      } else {
        conponList = conponList.concat(list);
      }
      this.setData({
        isLoad: true,
        conponList,
      })
    });
  },

  // 切换bar
  onBar({
    currentTarget,
  }) {
    const {
      data,
    } = currentTarget.dataset;
    const {
      barList,
    } = this.data;
    this.pageData = {
      ...defPage
    }
    barList.forEach(item => {
      if(item.type == data.type) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    this.setData({
      barList,
      selectType: data.type,
    }, () => {
      this.getCouponList();
    })
  },

  onOpenRule({
    currentTarget
  }) {
    const {
      conponList,
    } = this.data;
    const {
      idx
    } = currentTarget.dataset;
    conponList[idx].ruleOpen = !conponList[idx].ruleOpen;
    this.setData({
      conponList,
    })
  },

  onToUse() {
    this.setData({
      showSharePopup: true,
    })
  },

  onHideSharePopup() {
    this.setData({
      showSharePopup: false,
    })
  },
})