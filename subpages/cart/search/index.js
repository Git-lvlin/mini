
Page({

  data: {
    searchText: "",
    showAssociation: false,
  },

  onLoad: function (options) {

  },

  onShow: function () {

  },

  onSearch() {
    console.log("search")
    this.setData({
      showAssociation: false,
    })
  },

  handleSearchFocus() {
    this.setData({
      showAssociation: true,
    })
  },
  
  onCloseAssociation({
    currentTarget
  }) {
    this.setData({
      showAssociation: false,
      searchText: currentTarget.dataset.text,
    })
  }
})