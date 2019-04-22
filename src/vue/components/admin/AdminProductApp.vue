<template>
	<div>
		<PendingItemsComponent :addtocartvariants='$data._pendingItems'></PendingItemsComponent>
		<adminOptionSelect></adminOptionSelect>
		<Multiselect :options="VariantArr"
		             v-model="CurrentVariant"
		             @input="variantChanged"
		             v-show="showmasterselect"
		             track-by="title"
		             label="title"
		             class="multiselectmaster"
		             :taggable="false"
		             :multiple="allowmultiple"
		             :closeOnSelect="false"
		             placeholder="Select one"
		             searchable="true"
		             :allow-empty="false">

			<template slot="singleLabel" slot-scope="{ option }">
				<strong>{{ option.id }}</strong> ID:<strong>  {{ option.title }}</strong>
			</template>

			<template slot="option" class="is-grid-2" slot-scope="props" disabled="true">
				<div disabled="true"  class="option__desc"><span class="option__title">qty{{ props.option.inventory_quantity}}:  {{ props.option.title }}</span></div>
			</template>

		</Multiselect>

		meta

		<productOptionPicker :inSelectedVariant="CurrentVariant" :meta="$data._optionMeta" @optionChanged="optionChanged" :options="CurrentProductOptions"></productOptionPicker>


		option 2

		<div class="product-single__meta">
			<h2 v-show="sectionsettings.product_vendor_enable && ProductVendor" class="product-single__vendor" itemprop="brand">{{ CurrentProductVendor }}</h2>

			<h1 class="product-single__title" itemprop="name">{{ CurrentProductTitle }}</h1>

			<div data-price-container>
				<span v-if="CurrentVariantOnSale" class="product-single__price--wrapper" aria-hidden="false">
                  <span id="ComparePrice" class="product-single__price--compare-at">
                   {{ CurrentVariantCompareAtPrice }}
                  </span>
                </span>
				<span id="ProductPrice"
				      class="product-single__price on-sale"
				      itemprop="price"
				      :content="CurrentVariantPrice">
                {{ CurrentVariantPrice }}
              </span>
			</div>
		</div>

		<ProductImageSlideshow :currentvariant="CurrentVariant"></ProductImageSlideshow>
		{{Layout}}
		<div @change="testBtn" v-model="LayoutToggle">
			<span>
				<span>format_grid</span>
			</span>
			<button flat>
				<span>format_list</span>
			</button>
			<button flat>
				<span>format_align_right</span>
			</button>
			<button flat>
				<span>format_align_justify</span>
			</button>
		</div>

	</div>
</template>

<script type="text/javascript">
	import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import {ProductMixin} from  '@/mixins/productmixin.js';
	import {VariantMixin} from  '@/mixins/variantmixin.js';
	import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';
	import {ShopifyApiMixin} from  '@/mixins/shopifyapimixin.js';


	import ProductImageSlideshow from '@/components/product/images/ProductImageSlideshow.vue'
	import productOptionPicker from '@/components/product/options/ProductOptionsPicker.vue'
	import PendingItemsComponent from '@/components/product/cart/PendingItemsComponent.vue'

	import Multiselect from 'vue-multiselect'

	import { getVariantFromOptions,isVariantAvailable} from '@/helpers/main.js'

	import Vue from 'vue';

	import adminOptionSelect from '@/components/admin/ProductOptionTestComponent.vue';
	/*		<singleProductOptionPicker searchable="true" :selectedoptionslug="Slug" @optionChanged="optionChanged" :option="OptionByProp('color')"></singleProductOptionPicker>
	*/
	//custom version of vuemultiselect - stripped down.
	//  import Multiselect from '@/components/utilities/gMultiselectList.vue'
	//  import Multiselect from '@/components/utilities/gMultiselectList.vue'

	const schema = require("schm");

	const demo_config= [{
		"slug": "color",
		"searchable": true,
		"value_config_default": {
			"swatch_image": true
		}
	},
		{
			"slug": "size",
			"searchable": false,
			"value_config_default": {
				"color": "#ff0000"
			}
		}
	]

	const optionvaluemeta=[
		{
			"slug" : "alumroot",
			"swatch_image": "swatch-alumroot.png",
			"color": "#4b1b3f",
		},
		{
			"slug" : "ash",
			"swatch_image": "swatch-ash.png",
			"color": "#3e404c",
		},
		{
			"slug" : "basswood",
			"swatch_image": "swatch-basswood.png",
			"color": "#191e2f",
		}
	]




	//  ProductMixin
	export default {
		props: {
			variantid: {
				default: false
			},
			productid: {
				default: false
			},
			product_option_meta:{
				default: () => []
		},
		sectionsettings: {
			default: {}
		},
		allowmultiple: {
			default: false
		},
		showmasterselect: {
			default: false
		}
	},
	mixins: [DictionaryMixin,ProductMixin,VariantMixin,ShopifyApiMixin],
		components: {ProductImageSlideshow,PendingItemsComponent,adminOptionSelect,productOptionPicker,Multiselect},
	data() {
		return {
			toggle_classes:['layout-grid','layout-list','layout-lg','layout-sm' ],
			toggle_exclusive:2,
			_optionMeta: [],
			_pendingItems:  "Hello there"// [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
		}
	},
	name: 'testcomponent',
		computed: {
	...mapGetters([
				'LayoutToggle',
				'OptionByProp',
				'OptionValueByProp',
				'OptionsArrByProduct',
				'OptionsByProduct'
			]
		),
			TestKit: function(){
			[  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
		},
		Slug:function(){
			return "wild-geranium"
		},
		VariantArr: function() {
			return this._mapDisabledVariants(this.Variants, [] /*this._getVariantFromOptions( [value.id], this.Variants)*/);
		},
		Layout:function(){
			return this.$data.toggle_classes[this.LayoutToggle];
		},
		SelectedOptions:function(){
			return this.$data.toggle_classes[this.LayoutToggle];
		}
	},
	created:function(){

		let self = this;

		this.loadProduct().then(function(res){

			//***PRODUCT
			if ( self.$props.product_option_meta ){
				self.add_product_to_dictionary({product: res.data.product, optionconfig: self.$props.product_option_meta});
			}else{
				self.add_product_to_dictionary({product: res.data.product});
			}

			//***VARIANTS
			self.add_variants_to_dictionary({variants: res.data.product.variants});

			//***IMAGES
			self.add_images_to_dictionary({images: res.data.product.images});

			//***OPTIONS
			if (self.CurrentProduct.optionconfig && self.CurrentProduct.optionconfig.length > 0){
				self.add_options_to_dictionary({
					options: res.data.product.options,
					optionconfig: self.CurrentProduct.optionconfig
				});
			} else {
				self.add_options_to_dictionary({options: res.data.product.options});
			}

			////*****SET VARIANT
			//self.CurrentVariant  = self.variant_dictionary.get(self.NormalizedVariantID) ;
			self.variantChanged( self.variant_dictionary.get(self.NormalizedVariantID) )
			//  console.log("variany",self.CurrentVariant, [{ quantity: 1, id:  self.CurrentVariant }]);

			///example - --::
			// console.log("kjkkhhkhkhhkhkOPTIN!!!!!!!!!!",self.OptionValueByProp("gray-birch"));
		})
	},
	mounted:function(){
		this.loadVariantMeta(this.NormalizedProductID, this.NormalizedVariantID)
	},
	methods:{
	...mapMutations(['setlayoutButton']),
			testBtn:function(target){
			console.log("changed",target);
			this.setlayoutButton({index: target})
		},
		variantChanged: function(variant) {
			console.log("variant changed!!!!!",this.$data._pendingItems,this.CurrentVariant,variant)
			this.$data._currentVariant   = variant;

			if (variant instanceof Array &&variant.length>0 ){
				var variantArr  =variant;
				var newPending  = variantArr.map(function(_variant){

					return { requested_quantity: 1,quantity_editable: true, variant: _variant, id: _variant.id }
				})
				this.$data._pendingItems =newPending;
			}else{
				this.$data._pendingItems = [{ requested_quantity: 1,quantity_editable: true, variant: this.CurrentVariant, id:  this.CurrentVariant.id }];
			}
		},
		optionChanged: function(requestedVariant,option_dictionary) {

			console.log("!!master option changed!!!!!",this.CurrentVariant,requestedVariant,option_dictionary);
			this.variantChanged(requestedVariant);
		},
		_getVariantFromOptions: function( optionArray, variantsArr ) {   //move to a mixin.
			return   getVariantFromOptions(optionArray, variantsArr);
		},
		setVariantsDisabled:function(variantsArr){
			if (newFilteredArray.length < 1){
				Vue.set(option, '$isDisabled', true);
			} else {
				Vue.set(option, '$isDisabled', false);
			}
		},
		_mapDisabledVariants:function(variantsArr,flaggedVariants,bool=true){   ///TODO: remap oos too seperate out

			var newVariantArr =Array.from(variantsArr);
			let _flaggedVariants =flaggedVariants;

			newVariantArr=     newVariantArr.map(function(variant){
				let ID = variant.id;
				if ( _flaggedVariants.length > 0 ){
					var result =  _flaggedVariants.find(function(item){
						return  (ID == item.id )? true : false;
					})
				}
				return  (  result || !isVariantAvailable(variant)  ) ? Object.assign(variant, {$isDisabled :bool }) :  Object.assign(variant, {$isDisabled :!bool  });
			})
			return newVariantArr;
		}
	},
	};
</script>
<!--

<style src="vue-multiselect/dist/vue-multiselect.min.css" ></style>
-->


<style lang="scss" type="text/scss" >

	.multiselectmaster{
		span.multiselect__option{
			background: red!important;

		}
		.multiselect__element{
			//background: red;



		}


	}
</style>





