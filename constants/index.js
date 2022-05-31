// 定义不常用常量

import { IMG_CDN } from './common'

// 初始环境变量 dev uat fat pro
// ***【 环境如有变动 common.wxs 需更换域名 】***
export const SYS_ENV = 'pro';
// DEVICE_CODE	1ae15f4549d3152281ca6c28e6ae6ad6
// 是否显示选择环境按钮
export const CHANGE_ENV = false;

// 小程序版本号
export const VERSION = "2.5.4";

// 服务器接口域名S
export const baseApi = {
  dev: "https://api-dev.yeahgo.com",
  uat: "https://api-uat.yeahgo.com",
  fat: "https://api-fat.yeahgo.com",
  pro: "https://api.yeahgo.com",
};
// 服务器接口域名
export const HTTP_TIMEOUT = 5000;
// 接口请求来源
export const SOURCE_TYPE = 4;

// 高德地图key
export const MAP_KEY = "2755064499f1d1ff7f7bc61154a112b2";

// 识别小程序码进入小程序场景值
export const CODE_SCENE = {
  // 扫描二维码
  1011: true,
  // 长按图片识别二维码
  1012: true,
  // 扫描手机相册中选取的二维码
  1013: true,
  // 扫描小程序码
  1047: true,
  // 长按图片识别小程序码
  1048: true,
  // 扫描手机相册中选取的小程序码
  1049: true,
  1007: true,
}


// 空状态图片列表
export const NODATA_LIST = [
  {
    type: "content",
    img: `${IMG_CDN}miniprogram/common/nodata/content.png?v=0806`,
    title: "暂无数据"
  },
  {
    type: "bankCard",
    img: `${IMG_CDN}miniprogram/common/nodata/bank_card.png`,
    title: "暂无银行卡"
  },
  {
    type: "cart",
    img: `${IMG_CDN}miniprogram/common/nodata/cart.png`,
    title: "空空如也"
  },
  {
    type: "collection",
    img: `${IMG_CDN}miniprogram/common/nodata/collection.png`,
    title: "暂无收藏"
  },
  {
    type: "coupon",
    img: `${IMG_CDN}miniprogram/common/nodata/coupon.png`,
    title: "暂无红包"
  },
  {
    type: "data",
    img: `${IMG_CDN}miniprogram/common/nodata/data.png`,
    title: "暂无数据"
  },
  {
    type: "goodLose",
    img: `${IMG_CDN}miniprogram/common/nodata/good_lose.png`,
    title: "哎呀，找不到数据~"
  },
  {
    type: "loadFail",
    img: `${IMG_CDN}miniprogram/common/nodata/load_fail.png`,
    title: "加载失败"
  },
  {
    type: "location",
    img: `${IMG_CDN}miniprogram/common/nodata/location.png`,
    title: "获取定位失败"
  },
  {
    type: "msg",
    img: `${IMG_CDN}miniprogram/common/nodata/msg.png`,
    title: "暂无消息"
  },
  {
    type: "network",
    img: `${IMG_CDN}miniprogram/common/nodata/network.png`,
    title: "网络不给力"
  },
  {
    type: "order",
    img: `${IMG_CDN}miniprogram/common/nodata/order.png`,
    title: "暂无订单"
  },
  {
    type: "search",
    img: `${IMG_CDN}miniprogram/common/nodata/search.png`,
    title: "暂无数据"
  },
  {
    type: "storeClose",
    img: `${IMG_CDN}miniprogram/common/nodata/store_close.png`,
    title: "门店休息中..."
  },
  {
    type: "user",
    img: `${IMG_CDN}miniprogram/common/nodata/user.png`,
    title: "暂无好友"
  }
];