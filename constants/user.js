import { IMG_CDN } from './common'
import routes from '../constants/routes'

export const orderList = [
  {
    icon: `${IMG_CDN}miniprogram/user/wait_pay.png`,
    name: "待付款",
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
    icon: `${IMG_CDN}miniprogram/user/service.png`,
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
    icon: `${IMG_CDN}miniprogram/user/address.png`,
    name: "收货地址",
    type: 1,
    path: "address",
  },
  {
    icon: `${IMG_CDN}miniprogram/user/customer_service.png`,
    name: "在线客服",
    type: 2,
    path: "",
  },
  {
    icon: `${IMG_CDN}miniprogram/user/setting.png`,
    name: "设置",
    type: 2,
    path: "setting",
  },
]
