// 生产随机字符串
export default {
  getId() {
    let str1 = Math.random()
      .toString(32)
      .slice(-6)
    let str2 = Math.random()
      .toString(32)
      .slice(-6)
    let str3 = Math.random()
      .toString(32)
      .slice(-6)
    let str4 = Math.random()
      .toString(32)
      .slice(-6)
    return `${str1}-${str2}-${str3}-${str4}`
  }
}
