import { IMG_CDN } from './common'
import routes from '../constants/routes'

export const orderList = [
  {
    icon: `${IMG_CDN}miniprogram/user/wait_pay.png`,
    name: "待付款",
    subNum: 0,
  // },{
  //   icon: `${IMG_CDN}miniprogram/user/wait_share.png`,
  //   name: "待分享",
  //   subNum: 0,
  },{
    icon: `${IMG_CDN}miniprogram/user/wait_push.png`,
    name: "待发货",
    subNum: 0,
  },{
    icon: `${IMG_CDN}miniprogram/user/finish.png`,
    name: "已完成",
    subNum: 0,
  },{
    icon: `${IMG_CDN}miniprogram/user/service.png?v=20210617`,
    name: "售后/退款",
    subNum: 0,
  },
]

/**
 * 其他设置
 * icon srting 标题前icon
 * type number 操作类型 1 跳转 2 提示打开APP push
 * name string 名称
 * path string 地址名
*/
export const otherSetting = [
  {
    icon: `${IMG_CDN}miniprogram/user/address.png?v=202106170`,
    name: "收货地址",
    type: 1,
    path: "address",
  },
  {
    icon: `${IMG_CDN}miniprogram/user/customer_service.png?v=202106170`,
    name: "在线客服",
    type: 2,
    path: "",
  },
  {
    icon: `${IMG_CDN}miniprogram/user/share-app/share.png?v=202106170`,
    name: "下载APP",
    type: 3,
    path: "share",
  },
  {
    icon: `${IMG_CDN}miniprogram/user/setting.png?v=202106170`,
    name: "设置",
    type: 1,
    path: "setting",
  },
]

/**
 * 用户等级
*/
export const USER_LEVEL = {
  0: {
    name: "普通会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_1.png`
  },
  1: {
    name: "普通会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_1.png`
  },
  2: {
    name: "铜卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_2.png`
  },
  3: {
    name: "银卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_3.png`
  },
  4: {
    name: "金卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_4.png`
  },
  5: {
    name: "合金卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_5.png`
  },
  6: {
    name: "白金卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_6.png`
  },
  7: {
    name: "钻石卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_7.png`
  },
  8: {
    name: "黑钻卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_8.png`
  },
  9: {
    name: "终身卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_9.png`
  },
  10: {
    name: "汇通卡会员",
    icon: `${IMG_CDN}miniprogram/user/levelIcon/user_label_10.png`
  },
}
