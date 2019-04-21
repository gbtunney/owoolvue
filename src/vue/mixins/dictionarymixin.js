import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
const Numeral = require('numeral');

export const DictionaryMixin = {
	props: {},
	components: {},
	data() {
		return {}
	},
	computed: {
		...mapState({product_dictionary: state => state.product_dictionary,
	variant_dictionary: state => state.variant_dictionary,
	product_image_dictionary: state => state.product_image_dictionary,
	option_dictionary: state => state.option_dictionary,
	metafield_dictionary: state => state.metafield_dictionary, })
	},
	methods: {
	...mapMutations(['add_product_to_dictionary','add_variants_to_dictionary','add_images_to_dictionary','add_options_to_dictionary']),
	}
}