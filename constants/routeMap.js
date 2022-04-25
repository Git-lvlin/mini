
/**
 * 路由映射表
 * key App 路由
 * value 小程序 routes 内的 key
*/
export default {
  appTabbar: {
    // app首页
    0: {
      isTabbar: true,
      route: 'home',
    },
    1: {
      isTabbar: true,
      route: 'seckill',
    },
    2: {
      isTabbar: true,
      route: 'intensive',
    },
    3: {
      isTabbar: false,
      route: '',
    },
    4: {
      isTabbar: true,
      route: 'user',
    },
  },

  // ============================= 小程序页面映射
  // 登录
  "/login/index": {
    path: "login",
  },
  // 登录验证码
  "/login/code": {
    path: "",
  },
  // 绑定微信页面
  "/login/bindWx": {
    path: "",
  },

  // 首页
  "/tab/index": {
    path: "home",
    hasTab: true
  },
  
  // 分类页面
  "/home/category": {
    path: "classList",
  },
  // 搜索页面
  "/home/search": {
    path: "search",
  },
  // 会员专享
  "/home/members": {
    path: "",
  },
  // 会员店专享
  "/home/vip": {
    path: "",
  },
  // 集约页面
  "/home/intensive": {
    path: "storeIntensive",
  },
  // 秒杀
  "/seckill": {
    path: "seckill",
  },
  // 签到活动
  "/flutter/mine/sign_in/detail": {
    path: "signin",
    needLogin: true,
  },
  // 帮扶爆品
  "/home/spikeGoods": {
    path: "popularGood",
  },
  
  
  // 商品详情
  "/shopping/detail": {
    path: "detail",
  },
  // 代发店、会员店商品详情（商品预览功能）
  "/shopping/detail_undertakes_store": {
    path: "store",
  },
  // 确认订单
  "/shopping/confirmOrder": {
    path: "createOrder",
  },
  // 收银台
  "/shopping/cashier": {
    path: "cashier",
  },
  // 支付结果  小程序收银台页面
  "/shopping/cashierResult": {
    path: "",
  },
  // 收货地址
  "/address/myAddress": {
    path: "address",
  },
  // 编辑地址
  "/address/editAddress": {
    path: "editAddress",
  },
  // 修改提货人信息
  "/address/updatePickInfo": {
    path: "changeShipper",
  },

  // 选择自提点
  "/amap/selectStore": {
    path: "location",
  },
  // 选择自提点，选择市级下POI
  "/amap/selectAddress": {
    path: "locationSearch",
  },

  // 新增地址时，从地图选址
  "/amap/selectLocation": {
    path: "",
  },
  // 会话列表
  "/im/conversationList": {
    path: "",
  },
  // 会话
  "/im/conversation": {
    path: "",
  },
  // IM服务路由（登录、退出登录、联系客服）
  "/im/service": {
    path: "",
  },

  // h5页面
  "/web/index": {
    path: "webview",
  },
  // 发布动态
  "/community/postDynamic": {
    path: "",
  },
  // 动态详情
  "/community/detail": {
    path: "",
  },
  // 转发动态
  "/community/forwardDynamic": {
    path: "",
  },
  // 点赞列表(消息-我收到的)
  "/community/favourList": {
    path: "",
  },
  // 新增关注列表(消息-我收到的)
  "/community/focusList": {
    path: "",
  },
  // 评论列表(消息-我收到的)
  "/community/commentList": {
    path: "",
  },

  // C/个人中心/订单详情
  "/mine/order/detail": {
    path: "",
  },

  // ===================================== H5 页面映射
  // 新人专享
  "/web/exclusive-for-novices": {
    path: "",
    key: "newCoupon",
    needLogin: true
  }
}