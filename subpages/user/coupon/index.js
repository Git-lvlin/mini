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
  selectType: 1,
  pageData: {
    ...defPage
  },

  data: {
    barList: topBarList,
    isLoad: false,
    conponList: [],
  },

  onLoad(options) {
    this.getCouponList();
  },

  onReachBottom() {
    let {
      page,
      totalPage,
    } = this.pageData;
    if(page < totalPage) {
      this.pageData.page += 1;
      this.getCouponList();
    }
  },

  // 获取优惠券
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
      conponList
    } = this.data;
    let data = {
      status: this.selectType,
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
    this.selectType = data.type;
    barList.forEach(item => {
      if(item.type == data.type) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    this.setData({
      barList,
    })
    this.getCouponList();
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
  }
})