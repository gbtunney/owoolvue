<template>
	<div>
		product option tester :
		option 1:
		<input v-model="option1" placeholder="option1">
		option 1:
		<input v-model="option2" placeholder="option2">
		<button @click="_getVariant([ option1,option2])" >GET VARIANTS</button>
	</div>
</template>


<script type="text/javascript">

	import Vue from 'vue';
	import store from '@/store'
	import {mapGetters,mapState,mapActions} from 'vuex'
	import { normalize,getVariantFromOptions} from '@/helpers/main.js'
	import {ProductMixin} from  '@/mixins/productmixin.js';


	export default {
		name: 'ProductImages',
		components: {

		},
		mixins: [ProductMixin],
		props: {

		},
		methods: {
			_getVariant:function(options){

				var newoptions= options.filter(function(option){
					if ( option != false ){
						return true;
					}else{
						return false;
					}
				})

				getVariantFromOptions(newoptions, this.Variants);


				// this.swiper.slideTo(index, 0, false)
				// clearTimeout(  this.$data.idle);

			}
		},
		computed: {
		...mapState({
			product_image_dictionary: state => state.product_image_dictionary
	}),
	ImageArray:function(){

		var imgArr =Array.from(this.product_image_dictionary.values());
		return imgArr.map(function(item,index){
			return Object.assign(item, {_index: index});
		});
		//Array.from(this.product_image_dictionary.values());
	}
	},
	data() {

		return {
			option1: false,
			option2:false
		}
	}
	}

</script>