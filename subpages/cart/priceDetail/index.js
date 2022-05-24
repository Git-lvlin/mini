import goodApi from '../../../apis/good';
import router from '../../../utils/router';
import util from '../../../utils/util';
import wxCharts from '../../../utils/wxcharts';

let lineChart = null;

Page({
	id: "",
	goodPage: {
		size: 10,
		page: 1,
		hasNext: true,
		next: 1,
	},

  data: {
		activeNames: [],
		goodInfo: {},
		showOtherPrice: false,
		inputPrice: "",
		goodList: [],
  },

  onLoad(options) {
		this.id = options.id;
		this.getPriceDetail();
		this.getPriceGoodList();
  },

	// 获取比价详情
	getPriceDetail() {
		if(!this.id) return;
		goodApi.getPriceDetail({
			id: this.id,
		}).then(res => {
			const goodInfo = res;
			const lineData = {
				categories: [],
				data: [],
			};
			goodInfo.averagePrice = util.divide(goodInfo.averagePrice, 100);
			goodInfo.goodsMarketPrice = util.divide(goodInfo.goodsMarketPrice, 100);
			goodInfo.goodsPrice = util.divide(goodInfo.goodsPrice, 100);
			goodInfo.jdPrice = util.divide(goodInfo.jdPrice, 100);
			goodInfo.maxPrice = util.divide(goodInfo.maxPrice, 100);
			goodInfo.minPrice = util.divide(goodInfo.minPrice, 100);
			goodInfo.pddPrice = util.divide(goodInfo.pddPrice, 100);
			goodInfo.tbPrice = util.divide(goodInfo.tbPrice, 100);
			goodInfo.tmallPrice = util.divide(goodInfo.tmallPrice, 100);
			goodInfo.chartData.length && goodInfo.chartData.forEach(item => {
				lineData.categories.push(item.date);
				lineData.data.push(util.divide(item.price, 100));
			});
			goodInfo.platformPrice.length && goodInfo.platformPrice.forEach(item => {
				item.price = util.divide(item.price, 100);
			});
			this.setData({
				goodInfo
			})
			this.lineLoad(lineData);
		});
	},

	// 商品列表
	getPriceGoodList() {
		const{
			size,
			page,
		} = this.goodPage;
		let {
			goodList,
		} = this.data;
		goodApi.getPriceGoodList({
			size,
			page,
		}).then(res => {
			this.goodPage.hasNext = res.hasNext;
			this.goodPage.next = res.next;
			let list = res.records || [];
			if(page === 1) {
				goodList = list
			} else {
				goodList = goodList.concat(list);
			}
			this.setData({
				goodList: res.records || [],
			});
		});
	},

	// 加载图表
	lineLoad(lineData) {
		let windowWidth = 375;
		try {
			const res = wx.getSystemInfoSync();
			windowWidth = res.windowWidth;
		} catch (e) {
			console.error('getSystemInfoSync failed!');
		}
		lineChart = new wxCharts({
			canvasId: 'lineCanvas',
			type: 'line',
			categories: lineData.categories,
			animation: true,
			background: '#ffffff',
			series: [{
				name: '价格',
				color: "#e5352f",
				data: lineData.data,
				format (val, name) {
					return val.toFixed(2) + '元';
				}
			}],
			xAxis: {
				disableGrid: true,
			},
			yAxis: {
				// gridColor: "#e5352f",
				disableGrid: false,
				format: function (val) {
					return val.toFixed(2);
				},
				min: 0
			},
			width: windowWidth,
			height: 175,
			dataLabel: false,
			dataPointShape: true,
		});
	},

	// 点击图表展示数据
  touchHandler(e) {
    lineChart.showToolTip(e, {
        // background: '#7cb5ec',
        format: function (item, category) {
            return category + ' ' + item.name + ':' + item.data 
        }
    });
  },

	// 工薪图表数据
  updateData () {
      var simulationData = this.createSimulationData();
      var series = [{
          name: '价格',
          data: simulationData.data,
          format(val, name) {
              return val.toFixed(2) + '元';
          }
      }];
      lineChart.updateData({
          categories: simulationData.categories,
          series: series
      });
  },

	// 点击展示其他价格
	onClickOther() {
		this.setData({
			showOtherPrice: !this.data.showOtherPrice,
		});
	},

	// 监听价格输入
	handleInput({
		detail
	}) {
		this.setData({
			inputPrice: detail.value,
		});
	},

	onReachBottom() {
		const{
			next,
			hasNext
		} = this.goodPage;
		if(hasNext) {
			this.goodPage.page = next;
			this.getPriceGoodList();
		}
	},

	// 点击跳转商品详情
	onToDetail({
		currentTarget,
	}) {
		const {
			good,
		} = currentTarget.dataset;
		const data = {
			spuId: good.spuId,
			skuId: good.skuId || good.goodsSkuId,
			activityId: good.activityId || 0,
			objectId: good.objectId || 0,
			orderType: good.orderType,
		};
		router.replace({
			name: "detail",
			data,
		})
	}
})