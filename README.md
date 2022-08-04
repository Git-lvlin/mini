appid wxb8db75a7eea8787f  汇意
appid wxdc1fcef98ae73d1e  聚创  current

# 上线注意事项
务必在发布前确认环境变量是否已修改，环境变量包含接口环境变量和OSS图片环境变量：

```
接口环境变量： ./constants/index.js 生产环境：
SYS_ENV = pro   (接口环境变量)
CHANGE_ENV = false   (登录页面是否显示切换环境按钮)

OSS图片环境变量：/wxs/common.wxs
生产环境：
var IMG_CDN = "https://pro-yeahgo-oss.yeahgo.com/
```

* 修改环境变量 ./constants/index.js LINE 7  (export const SYS_ENV = 'dev'; )
* ./wxs/common.wxs 文件里面的 IMG_CDN 需要对应环境

# 全局状态管理 omix

https://github.com/Tencent/omi/tree/v6/packages/omix
