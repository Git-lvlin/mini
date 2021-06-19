import { IMG_CDN } from './common'
import routes from '../constants/routes'

export const orderList = [
  {
    icon: `${IMG_CDN}miniprogram/user/wait_pay.png`,
    name: "待付款",
    subNum: 0,
  },{
    icon: `${IMG_CDN}miniprogram/user/wait_share.png`,
    name: "待分享",
    subNum: 0,
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
  1: "普通会员",
  2: "铜卡",
  3: "银卡",
  4: "金卡",
  5: "合金卡",
  6: "白金卡",
  7: "钻石卡",
  8: "黑钻卡",
  9: "终身会员卡",
  10: "汇通卡",
}