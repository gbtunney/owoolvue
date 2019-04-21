import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
const Numeral = require('numeral');

export const CartMixin = {
	props: {},
	components: {},
	data() {
		return {}
	},
	name: 'testcomponent',
	computed: {
	...mapGetters([
		'Cart'
		// ...
	])
	},
	methods: {
...mapActions([
		'getCart', 'addItem','getVariantDefaultImage'
	])
}
}