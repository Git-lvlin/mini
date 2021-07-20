import crypto from '../miniprogram_npm/crypto-js/index';
import { Base64 } from '../miniprogram_npm/js-base64/index';

// 计算签名。
const computeSignature = (accessKeySecret, canonicalString) => {
  return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
}

const date = new Date();
date.setHours(date.getHours() + 1);
const policyText = {
  expiration: date.toISOString(), // 设置policy过期时间。
  conditions: [
    // 限制上传大小。
    ["content-length-range", 0, 1024 * 1024 * 1024],
  ],
};

export const getCofigData = (config) => {
  const policy = Base64.encode(JSON.stringify(policyText)) // policy必须为base64的string。
  const signature = computeSignature(config.accessKeySecret, policy)
  const formData = {
    OSSAccessKeyId: config.accessKeyId,
    signature,
    policy,
    'x-oss-security-token': config.token,
    "success_action_status": "200",
  }
  return formData
}

export const getOssImgWH = (url, width, height) => {
  return `${url}?x-oss-process=image/resize,m_fill,h_${height},w_${width},limit_0/auto-orient,0`;
}