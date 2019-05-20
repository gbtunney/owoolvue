import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
const Numeral = require('numeral');

export const CartMixin = {
	props: {},
	components: {},
	data() {
		return {}
	},
	computed: {
	...mapGetters([
		'Cart'
		// ...
	])
	},
	methods: {
...mapActions([
		'updateCartItem','getCart', 'addItem','getVariantDefaultImage'
	])
}
}