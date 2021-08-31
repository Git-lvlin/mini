
export default {
  // 检查是不是手机号
  checkMobile(value) {
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value)
  },
  // 检查是不是验证码
  checkSmsCode(value) {
    return /^\d{4}$/.test(value)
  },
  // 检查是不是图片
  checkImgCode(value) {
    return /^[a-zA-Z\d]{4}$/.test(value)
  },
  // 检查是不是数字
  checkVerifyCode(value) {
    return /^^[0-9]*$/.test(value) //^[0-9]*$
  },
  // 检查是不是空值
  checkEmpty(value) {
    return !value;
    // return !!value
  },
  // 检查密码
  checkPassword(value) {
    let hasChinese = /[\u4e00-\u9fa5]/.test(value)
    return hasChinese
  },
}