// 定义不常用常量

import { IMG_CDN } from './common'

// 小程序版本号
export const VERSION = "1.0.1";

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

// 空状态图片列表
export const NODATA_LIST = [
  {
    type: "content",
    img: `${IMG_CDN}miniprogram/common/nodata/content.png`,
    title: "暂无数据"
  }
];

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
}