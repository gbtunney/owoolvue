<template>
	<div :class="$options.name">
		<ul class="wrapperdiv">
			<li v-for="image,index in ImageArray" :key="index">
				<div>
					<img @click="imageChanged(image)" :src="getShopifyImageURL(image)" alt="image.alt">
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
	import {ProductImagesMixin} from  '@/components/product/images/productImagesMixin.js';


	module.exports = {
		name: 'ProductImages',
		mixins: [ProductImagesMixin],
		components: {},
		data: function() {
			return {
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

<style lang="scss" type="text/scss" >

</style>