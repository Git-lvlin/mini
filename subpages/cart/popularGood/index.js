import commonApi from '../../../apis/common';
import homeApi from '../../../apis/home'
import router from '../../../utils/router';
import { mapNum } from '../../../utils/tools';

Page({
	pageData: {
		size: 20,
		next: 0,
		hasNext: false,
		indexVersion: '',
	},

	data: {
		banner: '',
		goodList: [],
	},

	onLoad(options) {
		if(!!options.navTitle) {
			wx.setNavigationBarTitle({
				title: options.navTitle || '',
			});
		}
		this.getBanner();
		this.getPopularList();
	},

	onReachBottom() {
		if(this.pageData.hasNext) {
			this.getPopularList();
		}
	},

	getBanner() {
		let data = {
			useType: 5,
			location: 6
		};
		data = homeApi.getExamine(data);
		commonApi.getBanner(data, {
			showLoading: false
		}).then(res => {
			let bannerData = res[0];
			if(bannerData) {
				this.setData({
					banner: bannerData.image,
				})
			}
		});
	},

	getPopularList() {
		const {
			size,
			next,
			indexVersion,
		} = this.pageData;
		let {
			goodList,
		} = this.data;
		let data = {
			size,
			next,
			indexVersion,
		};
		data = homeApi.getExamine(data);
		homeApi.getPopularList(data).then(res => {
			const list = mapNum(res.records);
			this.pageData.next = res.next;
			this.pageData.hasNext = res.hasNext;
			goodList = goodList.concat(list);
			this.setData({
				goodList,
			});
		});
	},

	onToDetail({
		currentTarget
	}) {
		let {
			good,
		} = currentTarget.dataset;
		let params = {
			spuId: good.spuId,
			skuId: good.skuId,
		};
		params.activityId = good.activityId || 0;
		params.objectId = good.objectId || 0;
		if(!!good.orderType) params.orderType = good.orderType;
		router.push({
			name: "detail",
			data: params
		})
	},
})