<template>
	<div><code>{{CurrentVariant}}</code>

		<Multiselect :options="VariantArr"
		             v-model="CurrentVariant"
		             @input="variantChanged"

		             track-by="title"
		             label="title"
		             class="multiselectmaster"
		             :taggable="false"
		             :multiple="true"
		             :closeOnSelect="false"
		             placeholder="Select one"
		             :searchable="true"
		             :allow-empty="false">
		</Multiselect>

<basecomponent text="Add To Cart" :flags="['--icon-right','test']" scheme="light"
               font="san-serif"
               padding="md"></basecomponent>

		<div class="grid product-single">
			<div class="grid__item large--seven-twelfths medium--seven-twelfths text-center">
				<ProductImageSlideshow :currentvariant="CurrentVariant"></ProductImageSlideshow>
			</div>

			<div class="grid__item product-single__meta--wrapper medium--five-twelfths large--five-twelfths">

				<div v-show="loading" class="product-app-loading">
					<svg class="lds-spinner" width="200px"  height="200px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><g transform="rotate(0 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(30 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(60 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(90 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(120 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(150 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(180 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(210 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(240 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(270 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(300 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
						</rect>
					</g><g transform="rotate(330 50 50)">
						<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
							<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
						</rect>
					</g></svg>
				</div>


				<div v-show="!loading" class="product-single__meta">
					<h2 v-show="sectionsettings.product_vendor_enable && ProductVendor" class="product-single__vendor" itemprop="brand">{{ CurrentProductVendor }}</h2>

					<h1 class="product-single__title" v-if="CurrentProductTitle" itemprop="name">{{CurrentProductTitle}}</h1>
					<h3 v-if="CurrentProductSubtitle">{{CurrentProductSubtitle}}</h3>

					<div>
						<div data-price-container>
							<span v-if="CurrentVariantOnSale" class="product-single__price wrapper" aria-hidden="false">
								<span id="ComparePrice" class="product-single__price compare-at">{{ CurrentVariantCompareAtPrice }}</span>
							</span>
							<span id="ProductPrice"
							      v-bind:class="{ 'on-sale' : IsOnSale }"
							      class="product-single__price "
							      itemprop="price"
							      :content="CurrentVariantPrice">{{ CurrentVariantPrice }}
							</span>
						</div>

						<meta itemprop="priceCurrency" v-if="shop" :content="shop.currency ">
						<link itemprop="availability" href="http://schema.org/|| if product.available || InStock{% else %}OutOfStock{% endif %}">
						<link itemprop="availability" href="http://schema.org/InStock">

						<kabob class="divider" scheme="accent-default" componentclass="c-kabob"></kabob>

						<productOptionPicker v-show="Options" :inSelectedVariant="CurrentVariant" :meta="$data._optionMeta" @optionChanged="optionChanged" :options="CurrentProductOptions"></productOptionPicker>

						<form  v-show="false" method="post" action="/cart/add"
						      id="AddToCartForm&#45;&#45;product-template"
						      accept-charset="UTF-8" class="product-single__form" enctype="multipart/form-data" data-children-count="26">
							<input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="✓">
							<div class="radio-wrapper js product-form__item">
								<label class="single-option-radio__label" for="ProductSelect-option-0">
									Color
								</label>
								<fieldset class="single-option-radio" name="color" id="ProductSelect-option-0">


									<input type="radio" value="Alumroot" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Alumroot">
									<label for="ProductSelect-option-color-Alumroot">Alumroot</label>


									<input type="radio" value="Ash" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Ash">
									<label for="ProductSelect-option-color-Ash">Ash</label>


									<input type="radio" value="Basswood" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Basswood">
									<label for="ProductSelect-option-color-Basswood">Basswood</label>


									<input type="radio" value="Bee-Balm" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Bee-Balm">
									<label for="ProductSelect-option-color-Bee-Balm">Bee-Balm</label>


									<input type="radio" value="Bluebell" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Bluebell">
									<label for="ProductSelect-option-color-Bluebell">Bluebell</label>


									<input type="radio" value="Cresheim Creek" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Cresheim Creek">
									<label for="ProductSelect-option-color-Cresheim Creek">Cresheim Creek</label>


									<input type="radio" value="Cedar Berry" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Cedar Berry">
									<label for="ProductSelect-option-color-Cedar Berry">Cedar Berry</label>


									<input type="radio" value="Fringetree" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Fringetree">
									<label for="ProductSelect-option-color-Fringetree">Fringetree</label>


									<input type="radio" value="Ganoga Falls" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Ganoga Falls">
									<label for="ProductSelect-option-color-Ganoga Falls">Ganoga Falls</label>


									<input type="radio" value="Gingko Nut" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Gingko Nut">
									<label for="ProductSelect-option-color-Gingko Nut">Gingko Nut</label>


									<input type="radio" value="Gray Birch" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Gray Birch">
									<label for="ProductSelect-option-color-Gray Birch">Gray Birch</label>


									<input type="radio" value="Juneberry" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Juneberry">
									<label for="ProductSelect-option-color-Juneberry">Juneberry</label>


									<input type="radio" checked="checked" value="Pachysandra" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Pachysandra">
									<label for="ProductSelect-option-color-Pachysandra">Pachysandra</label>


									<input type="radio" value="Porcupine" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Porcupine">
									<label for="ProductSelect-option-color-Porcupine">Porcupine</label>


									<input type="radio" value="Purple Loosestrife" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Purple Loosestrife">
									<label for="ProductSelect-option-color-Purple Loosestrife">Purple
										Loosestrife</label>


									<input type="radio" value="Red Squirrel" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Red Squirrel">
									<label for="ProductSelect-option-color-Red Squirrel">Red Squirrel</label>


									<input type="radio" value="River Oat" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-River Oat">
									<label for="ProductSelect-option-color-River Oat">River Oat</label>


									<input type="radio" value="Scarlet Oak" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Scarlet Oak">
									<label for="ProductSelect-option-color-Scarlet Oak">Scarlet Oak</label>


									<input type="radio" value="Steelhead" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Steelhead">
									<label for="ProductSelect-option-color-Steelhead">Steelhead</label>


									<input type="radio" value="Wild Geranium" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Wild Geranium">
									<label for="ProductSelect-option-color-Wild Geranium">Wild Geranium</label>


									<input type="radio" value="Wissahickon" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Wissahickon">
									<label for="ProductSelect-option-color-Wissahickon">Wissahickon</label>


									<input type="radio" value="Wood Dove" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Wood Dove">
									<label for="ProductSelect-option-color-Wood Dove">Wood Dove</label>


									<input type="radio" value="Wood Fern" data-index="option1" name="color" class="single-option-selector__radio" id="ProductSelect-option-color-Wood Fern">
									<label for="ProductSelect-option-color-Wood Fern">Wood Fern</label>

								</fieldset>
							</div>
							<div class="radio-wrapper js product-form__item">
								<label class="single-option-radio__label" for="ProductSelect-option-1" data-children-count="0">
									Size
								</label>

								<fieldset class="single-option-radio" name="size" id="ProductSelect-option-1" data-children-count="2">


									<input type="radio" checked="checked" value="Skein" data-index="option2" name="size" class="single-option-selector__radio" id="ProductSelect-option-size-Skein">
									<label for="ProductSelect-option-size-Skein">Skein</label>


									<input type="radio" value="MiniSkein" data-index="option2" name="size" class="single-option-selector__radio" id="ProductSelect-option-size-MiniSkein">
									<label for="ProductSelect-option-size-MiniSkein">MiniSkein</label>

								</fieldset>

							</div>
							<div class="product-single__add-to-cart">
								<button type="submit" name="add" id="AddToCart&#45;&#45;product-template" class="btn btn&#45;&#45;add-to-cart">
                  <span class="btn__text">

	                    Add to Cart

                  </span>
								</button>

							</div>
						</form>

						<PendingItemsComponent :kit="false" :addtocartvariants='$data._pendingItems'></PendingItemsComponent>

					</div>
				</div>
			</div>
		</div>

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
		             :searchable="true"
		             :allow-empty="false">

			<template slot="singleLabel" slot-scope="{ option }">
				<strong>{{ option.id }}</strong> ID:<strong>  {{ option.title }}</strong>
			</template>

			<template slot="option" class="is-grid-2" slot-scope="props" disabled="true">
				<div disabled="true"  class="option__desc"><span class="option__title">qty{{ props.option.inventory_quantity}}:  {{ props.option.title }}</span></div>
			</template>

		</Multiselect>

		<div @change="testBtn" v-show="false" v-model="LayoutToggle">
			{{Layout}}
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

    import kabob from '@/components/utilities/kabob';

    import basecomponent from '@/components/utilities/g-base-component.vue';


    import ProductImageSlideshow from '@/components/product/images/ProductImageSlideshow.vue'
    import productOptionPicker from '@/components/product/options/ProductOptionsPicker.vue'
    import PendingItemsComponent from '@/components/product/cart/PendingItemsComponent.vue'

    import Multiselect from 'vue-multiselect'

    import { getVariantFromOptions,isVariantAvailable,updateHistory} from '@/helpers/main.js'

    import Vue from 'vue';

    import adminOptionSelect from '@/components/admin/ProductOptionTestComponent.vue';
/*		<singleProductOptionPicker searchable="true" :selectedoptionslug="Slug" @optionChanged="optionChanged" :option="OptionByProp('color')"></singleProductOptionPicker>
*/
    //custom version of vuemultiselect - stripped down.
  //  import Multiselect from '@/components/utilities/gMultiselectList.vue'
    //  import Multiselect from '@/components/utilities/gMultiselectList.vue'

    const schema = require("schm");

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
            product_option_value_meta:{
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
		    },
	        updatehistory:{
		        default: true
	        },
	        shop:{
		        default: false
	        },
            subtitle:{
	            default:false
            },
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
	    mixins: [DictionaryMixin,ProductMixin,VariantMixin,ShopifyApiMixin],
	    components: {basecomponent,ProductImageSlideshow,kabob,PendingItemsComponent,adminOptionSelect,productOptionPicker,Multiselect},
	    data() {
		    return {
		    	toggle_classes:['layout-grid','layout-list','layout-lg','layout-sm' ],
			    toggle_exclusive:2,
			    _optionMeta: [],
			    _pendingItems:  "Hello there",// [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
		        loading: false,
			    convertedVariants:[],
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
            ...mapState({shop: state => state._shop
             })
        ,


		    TestKit: function(){
		    [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
	    },
		    Slug:function(){
			    return "wild-geranium"
		    },
		    VariantArr: function() {
			    return this.Variants; //this._mapDisabledVariants(this.Variants, [] /*this._getVariantFromOptions( [value.id], this.Variants)*/);
		    },
		    Layout:function(){
				return this.$data.toggle_classes[this.LayoutToggle];
		    },
		    SelectedOptions:function(){
			    return this.$data.toggle_classes[this.LayoutToggle];
		    },
	    IsOnSale :function(){

		    	if (  this.$data._currentVariant   ){

		    		if (this.$data._currentVariant.compare_at_price  == null) return false;
		    		if (  this.$data._currentVariant.compare_at_price  >  this.$data._currentVariant.price  ){
		    			return true;
				    }

			    }
		    return false;
	    }
	    },
	    created:function(){

	    	this.$data.loading=true;
	    	let self = this;

	    	this.getShop().then(function(res){
	    	    console.log("SHOP FOUDN!!!!",res)
		    })
		    this.loadProduct().then(function(res){


		    	var additionalProductProps = {optionconfig: self.$props.product_option_meta, subtitle: self.$props.subtitle };

			     //***PRODUCT
			   ///  if ( self.$props.product_option_meta ){
				   self.add_product_to_dictionary({product: res.data.product, additionalProps:additionalProductProps });
			   /// }else{
				  //  self.add_product_to_dictionary({product: res.data.product});
			    //}

                //***IMAGES
                self.add_images_to_dictionary({images: res.data.product.images});
                /********/
				 //***VARIANTS
				 self.add_variants_to_dictionary({variants: res.data.product.variants});

				  if (  self.Variants && self.Variants.length >1 ){
                      //!***OPTIONS
                      var payload = {
                          options: res.data.product.options,
                      optionconfig: (self.CurrentProduct.optionconfig && self.CurrentProduct.optionconfig.length > 0) ? self.CurrentProduct.optionconfig : false,
                          option_value_overrides: (self.$props.product_option_value_meta && self.$props.product_option_value_meta.length > 1 ) ? self.$props.product_option_value_meta : false
                      };
                      self.add_options_to_dictionary(payload);

                      ////!*****SET VARIANT
                      self.variantChanged(self.variant_dictionary.get(self.NormalizedVariantID))

				  }else{
                      console.log("VARIANAT COUNT", self.Variants, self.Options);

                      ////!*****SET VARIANT
					  self.variantChanged(self.variant_dictionary.get(self.NormalizedVariantID))
                      //single variant
				  }
				 self.$data.loading = false;
		    })
	    },
	    mounted:function(){
		  //  this.loadVariantMeta(this.NormalizedProductID, this.NormalizedVariantID)
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

			    	if ( this.$props.updatehistory ){
					    updateHistory(variant);
				    }

                //TODO: figure this out
                   // this.$data._pendingItems =this.$props.addtocartvariants;// [{ requested_quantity: 1,quantity_editable: true, variant: this.CurrentVariant, id:  this.CurrentVariant.id }];


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

<style src="vue-multiselect/dist/vue-multiselect.min.css" ></style>

<style lang="scss" type="text/scss" >

	@import "src/vue/helpers/product-dependancies.scss";

	.product-app-loading{
		//	@include c-button( false,  dark-accent-primary     font-small-caps md lg , color-schemes typography font-size base-padding ) ;
		//background: red;
		$props: (
			background: true,
			foreground: true,
			border: false,
			fill:foreground,
			hover-background:rgba(color(accent-default, background), .7),
			hover-foreground:rgba(color(accent-default, foreground), .7)
		);
		@include g-color-scheme(accent-default, $props);
		@include u-icon-svg(false, 10%);
		margin:0 auto;
		svg rect{
			//fill: red;
		}
	}
	.divider{
		@include u-leader-padding(lg);
		@include u-trailer-padding(md);
		font-size: 12px;
		width: 99%;
		margin: 0 auto;
		opacity: .5;
		//@include rhythm-margin(md);
	}
.multiselectmaster{
	span.multiselect__option{
		background: red!important;

	}
	.multiselect__element{
		//background: red;



	}



}
</style>





