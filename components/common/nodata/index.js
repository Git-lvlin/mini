import { NODATA_LIST } from '../../../constants/index'

Component({
  properties: {
    title: {
      type: String,
      value: "",
    },
    type: {
      type: String,
      value: "content"
    },
    top: {
      type: String,
      value: 248
    },
    imgStyle: {
      type:String,
      value: ""
    },
  },

  data: {
    imgList: NODATA_LIST
  },

  methods: {

  }
})
