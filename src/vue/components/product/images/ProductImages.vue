<template>
	<p>{{ greeting }} World!</p>
</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
	import {ProductImagesMixin} from  '@/components/product/images/productImagesMixin.js';


	module.exports = {
		name: '',
		mixins: [],
		components: {},
		data: function() {
			return {
				greeting: 'Hello'
			}
		},
		props: {
			exampleprop: {
				type: String,
				default: 'not set',
				required: false
			},
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