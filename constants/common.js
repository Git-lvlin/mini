// 定义常用常量
const ENV = wx.getStorageSync("SYS_ENV") || 'pro';

// oss 上传域名
// ***【 如有变动 common.wxs 需更换域名 】***
export const ossHost = {
  dev: "https://dev-yeahgo-oss.yeahgo.com/",
  uat: "https://uat-yeahgo-oss.yeahgo.com/",
  fat: "https://fat-yeahgo-oss.yeahgo.com/",
  pro: "https://pro-yeahgo-oss.yeahgo.com/",
};

// H5 域名
export const webHost = {
  dev: "https://publicmobile-dev.yeahgo.com",
  uat: "https://publicmobile-uat.yeahgo.com",
  fat: "https://publicmobile-fat.yeahgo.com",
  pro: "https://publicmobile.yeahgo.com",
}

// 图片cdn
export const IMG_CDN = ossHost[ENV] || ossHost['pro'];
// export const H5_HOST = webHost[ENV] || webHost['pro'];

export const H5_HOST = webHost[ENV] || webHost['uat'];

// 协议
const agreementHost = {
  dev: "https://publicmobile-dev.yeahgo.com/web/agreement",
  uat: "https://publicmobile-uat.yeahgo.com/web/agreement",
  fat: "https://publicmobile-fat.yeahgo.com/web/agreement",
  pro: "https://publicmobile.yeahgo.com/web/agreement",
};
export const agreementUrl = {
  // 服务协议
  service: `${agreementHost[ENV || 'pro']}?reg=user&index=1`,
  // 隐私政策
  privacy: `${agreementHost[ENV || 'pro']}?reg=user&index=0`,
}

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

// 详情服务内容
export const DETAIL_SERVICE_LIST = [
  "正品保障",
  "损坏包换",
  "直采低价",
]
