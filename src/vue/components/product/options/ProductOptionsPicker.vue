<template>
	<div>
		<singleProductOptionPicker v-for="option,index in options"
		                           :option="option"
		                           :selectedoptionvalue="SelectedOptionValue(option.id)"
		                           :disabledOptions="_remapOptionValuesDisabled(option)"
		                           :key="index"
		                           class="optionpicker"
		                           :searchable="option.searchable"
		                           @optionChanged="optionChanged" >

		</singleProductOptionPicker>


	</div>
</template>

<script type="text/javascript">
	import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import {ProductMixin} from  '@/mixins/productmixin.js';
	import {ProductOptionPickerMixin} from '@/components/product/options/productOptionPickerMixin.js'
	import singleProductOptionPicker from '@/components/product/options/SingleProductOptionPicker.vue'
	import { getVariantFromOptions,filterArrayByValue,isVariantAvailable} from '@/helpers/main.js'
	import 'vuetify/dist/vuetify.min.css'

	import Vue from 'vue';

	//  ProductMixin
	export default {
		props: {
			options: {  ////plural options
				required:false
			},
			inSelectedVariant: {  ////plural options
				required:false
			},
			meta: {  ////plural options
				required:false
			}
		},
		mixins: [ProductMixin,ProductOptionPickerMixin],
		components: {singleProductOptionPicker},
	created:function(){
	},
	mounted:function(){



	},
	};
</script>

<style lang="scss" type="text/scss">
	@import "src/vue/helpers/product-dependancies.scss";

	.optionpicker {

		img {
			height: auto;
			width: 100%;
			max-width: 100%;
		}
		.option__desc {
			padding: #{get-lookup-prop( base-padding, md)};
		}
		.option__swatch {
			img {
				object-fit: cover;
				height: 100%;
				width: 100%;
			}
			width: 2em;
			height: 2em;
		}

	}

	.span {
	}
</style>
-





