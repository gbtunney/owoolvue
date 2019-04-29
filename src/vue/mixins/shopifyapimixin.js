import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
const Numeral = require('numeral');

export const ShopifyApiMixin = {
	props: {},
	components: {},
	data() {
		return {}
	},
	computed: {},
	methods: {
	...mapActions([
		'getProducts','getProduct','getVariant','getProductMeta','getVariantMeta','getShop'
	])
	}
}