
export default {
  // 检查是不是手机号
  checkMobile(value) {
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(value)
  },
  // 检查是不是验证码
  checkSmsCode(value) {
    return /^\d{6}$/.test(value)
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
    return !!value
  },
  // 检查密码
  checkPassword(value) {
    let hasChinese = /[\u4e00-\u9fa5]/.test(value)
    // console.log(hasNum,hasWord,hasSymbol,hasChinese);
    return hasChinese
  },
  // 浮点数相加
  f_add(arg1,arg2){
    arg1 = !arg1 ? 0 : arg1
    arg2 = !arg2 ? 0 : arg2
    let r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        let cm = Math.pow(10, c);
        if (r1 > r2) {
           arg1 = Number(arg1.toString().replace(".", ""));
           arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
           arg1 = Number(arg1.toString().replace(".", "")) * cm;
           arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
  },
  // 浮点数相减
  f_sub(arg1,arg2){
    arg1 = !arg1 ? 0 : arg1
    arg2 = !arg2 ? 0 : arg2
    let r1, r2, m, n;
    try {
       r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  }
}