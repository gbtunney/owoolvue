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
		'getProduct','getVariant','getProductMeta','getVariantMeta'
	])
	}
}