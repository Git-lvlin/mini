import Request from '../utils/request.js'

const url = {
  resource: "cms/open/json/selByResourceKey"
}

export const getResourceDetail = (params) => {
  return Request.get(url.resource, params)
}