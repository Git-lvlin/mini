
/**
 * 路由映射表
 * key App 路由
 * value 小程序 routes 内的 key
*/
export default {
  // 登录
  "/login/index": "login",
  // 登录验证码
  "/login/code": "",
  // 绑定微信页面
  "/login/bindWx": "",

  // 首页
  "/tab/index": "home",
  appTabbar: {
    // app首页
    0: {
      isTabbar: true,
      route: 'home',
    },
    1: {
      isTabbar: false,
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
  // 分类页面
  "/home/category": "classList",
  // 搜索页面
  "/home/search": "search",
  // 会员专享
  "/home/members": "",
  // 会员店专享
  "/home/vip": "",
  // 集约页面
  "/home/intensive": "storeIntensive",
  // 签到活动
  "/flutter/mine/sign_in/detail": "signin",
  
  // 商品详情
  "/shopping/detail": "detail",
  // 代发店、会员店商品详情（商品预览功能）
  "/shopping/detail_undertakes_store": "store",
  // 确认订单
  "/shopping/confirmOrder": "createOrder",
  // 收银台
  "/shopping/cashier": "cashier",
  // 支付结果  小程序收银台页面
  "/shopping/cashierResult": "",
  // 收货地址
  "/address/myAddress": "address",
  // 编辑地址
  "/address/editAddress": "editAddress",
  // 修改提货人信息
  "/address/updatePickInfo": "changeShipper",

  // 选择自提点
  "/amap/selectStore": "location",
  // 选择自提点，选择市级下POI
  "/amap/selectAddress": "locationSearch",

  // 新增地址时，从地图选址
  "/amap/selectLocation": "",
  // 会话列表
  "/im/conversationList": "",
  // 会话
  "/im/conversation": "",
  // IM服务路由（登录、退出登录、联系客服）
  "/im/service": "",

  // h5页面
  "/web/index": "webview",
  // 发布动态
  "/community/postDynamic": "",
  // 动态详情
  "/community/detail": "",
  // 转发动态
  "/community/forwardDynamic": "",
  // 点赞列表(消息-我收到的)
  "/community/favourList": "",
  // 新增关注列表(消息-我收到的)
  "/community/focusList": "",
  // 评论列表(消息-我收到的)
  "/community/commentList": "",

  // C/个人中心/订单详情
  "/mine/order/detail": "",
}