import math from 'mathjs'

export const ProductMixin = {
	props: {},
	components: {},
	data() {
		return {
			_id: Math.round(math.random(11111111111, 999999999999999))
		}
	},
//	name: 'testcomponent',  component must use a name for the ID
	computed: {
		UID: function() {
			return `${this.$options.name}-${this.$data._id}`;
		}
	},
	methods: {}
}