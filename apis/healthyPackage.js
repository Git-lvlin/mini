import Request from '../utils/request'

const url = {
  giftPackage:"/store/option/giftPackage/page",
  getNearbyStore:"/store/option/memberShopOperator/nearby",
}
export default {
  getGiftPackage(params, option) {
    return Request.get(url.giftPackage, params, option);
  },
  getNearbyStore(params, option) {
    return Request.get(url.getNearbyStore, params, option);
  },
}