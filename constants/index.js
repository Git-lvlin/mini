import { IMG_CDN } from './common'

// 服务器接口域名
export const apiUrl = "http://dev-yeahgo-public-web.waiad.icu/";
// 服务器接口域名
export const HTTP_TIMEOUT = 5000;

// 空状态图片列表
export const NODATA_LIST = [
  {
    type: "content",
    img: `${IMG_CDN}miniprogram/common/nodata/content.png`,
    title: "暂无数据"
  }
];