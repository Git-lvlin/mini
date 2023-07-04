import Request from '../utils/request'

const url = {
  contractGetDetail: "/activity/auth/supplier/contractGetDetail",
  contractAddOrder: "/activity/auth/supplier/contractAddOrder",
  findCompanyCert: "/public/open/contract/findCompanyCert",
  getCompanyVerifyUrl: "/public/open/contract/getCompanyVerifyUrl",
  genCompanyContract: "/public/open/contract/genCompanyContract",
  contractPayOrder: "/activity/auth/supplier/contractPayOrder",
  findCert: "/auth/contract/findCert",
  getVerifyUrl: "/auth/contract/getVerifyUrl",
  genContract: "/auth/contract/genContract",
}

export default {
  getContractGetDetail(params, option) {
    return Request.post(url.contractGetDetail, params, option);
  },
  contractAddOrder(params, option) {
    return Request.post(url.contractAddOrder, params, option);
  },
  findCompanyCert(params, option) {
    return Request.post(url.findCompanyCert, params, option);
  },
  getCompanyVerifyUrl(params, option) {
    return Request.post(url.getCompanyVerifyUrl, params, option);
  },
  genCompanyContract(params, option) {
    return Request.post(url.genCompanyContract, params, option);
  },
  contractPayOrder(params, option) {
    return Request.post(url.contractPayOrder, params, option);
  },
  findCert(params, option) {
    return Request.post(url.findCert, params, option);
  },
  getVerifyUrl(params, option) {
    return Request.post(url.getVerifyUrl, params, option);
  },
  genContract(params, option) {
    return Request.post(url.genContract, params, option);
  },
}