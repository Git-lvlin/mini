// 定义常用常量

const ENV = wx.getStorageSync("SYS_ENV");

// oss 上传域名
// ***【 如有变动 common.wxs 需更换域名 】***
export const ossHost = {
  dev: "https://dev-yeahgo-oss.yeahgo.com/",
  uat: "https://uat-yeahgo-oss.yeahgo.com/",
  fat: "https://fat-yeahgo-oss.yeahgo.com/",
  pro: "https://pro-yeahgo-oss.yeahgo.com/",
};

// 图片cdn
export const IMG_CDN = ossHost[ENV];


// 字符类型资源位id
export const PAY_TYPE_KEY = "MINIPAYTYPE"

// 订单类型
export const ORDER_TYPE = {
  1: "普通商品",
  2: "秒约",
  3: "单约",
  4: "团约",
  5: "指令集约",
  6: "主动集约",
  11: "1688",
  15: "集约",
}
