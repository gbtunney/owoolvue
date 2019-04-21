<template>
	<p>{{ greeting }} World!</p>
</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'

	import PendingCartItem from '@/components/product/cart/PendingtItem.vue'

	module.exports = {
		name: '',
		mixins: [],
		components: {PendingCartItem},
		data: function() {
			return {
				_loading: false,
				_pendingItems: [],
				_isDisabled: false,
			}
		},
		props: {
			metavisible: {
				type: Boolean,
				default: true
			},
			addtocartvariants: {
				type: Array,
				default: []
			},
			label: {
				type: String,
				default: "nottt setAdd to Cart"
			},
			disableunavailable: {
				type: Boolean,
				default: false
			},
			lineitemmessage: {   ///this is used to give the kit an id
				type: String,
				default: false
			}
		},
		computed: {
			...mapGetters([
				'Variants'
			]),
			example: {
				get: function() {
					return;
				},
				set: function(newVal) {
					//=newVal;
				}
			},
			example2: function() {
				
			}
		},
		methods: {
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	p {
		font-size: 2em;
		text-align: center;
	}
</style>