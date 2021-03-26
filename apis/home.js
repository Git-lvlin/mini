import Request from '../utils/request.js'

const url = {
  list: "?search=列表"
}

export const getList = () => {
  console.log(11)
  return Request.get(url.list, { })
}