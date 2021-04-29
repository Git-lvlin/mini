// 定义不常用常量

import { IMG_CDN } from './common'

// 小程序版本号
export const VERSION = "1.0.0";

// 服务器接口域名
// export const apiUrl = "http://dev-yeahgo-public-web.waiad.icu/";
// export const apiUrl = "http://8.135.39.109";
export const apiUrl = "http://dev-yeahgo-gateway.waiad.icu";
// 服务器接口域名
export const HTTP_TIMEOUT = 5000;
// 接口请求来源
export const SOURCE_TYPE = 4;

// 空状态图片列表
export const NODATA_LIST = [
  {
    type: "content",
    img: `${IMG_CDN}miniprogram/common/nodata/content.png`,
    title: "暂无数据"
  }
];