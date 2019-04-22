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

		<div class="grid product-single">
			<div class="grid__item large--seven-twelfths medium--seven-twelfths text-center">
				<ProductImageSlideshow :currentvariant="CurrentVariant"></ProductImageSlideshow>
			</div>

			<div class="grid__item product-single__meta--wrapper medium--five-twelfths large--five-twelfths">
				<div class="product-single__meta">

					<h1 class="product-single__title" itemprop="name">{{CurrentProductTitle}}</h1>

					<div>
						<div data-price-container>
							<span v-if="CurrentVariantOnSale" class="product-single__price wrapper" aria-hidden="false">
								<span id="ComparePrice" class="product-single__price compare-at">{{ CurrentVariantCompareAtPrice }}</span>
							</span>
							<span id="ProductPrice"
							      class="product-single__price on-sale"
							      itemprop="price"
							      :content="CurrentVariantPrice">{{ CurrentVariantPrice }}
							</span>
						</div>

						<meta itemprop="priceCurrency" v-if="shop" :content="shop.currency ">
						<link itemprop="availability" href="http://schema.org/|| if product.available || InStock{% else %}OutOfStock{% endif %}">
						<link itemprop="availability" href="http://schema.org/InStock">

						<productOptionPicker :inSelectedVariant="CurrentVariant" :meta="$data._optionMeta" @optionChanged="optionChanged" :options="CurrentProductOptions"></productOptionPicker>

						<form method="post" action="/cart/add"
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

					</div>

					<div class="product-single__description rte" itemprop="description">
						<p><strong></strong>After one adventurous drive in a minivan brimming with alpaca fiber, O-WoolΩLocal was born. Since then, I've visited farms all around the Philadelphia area collecting fiber. Local is processed in the Northeastern USA. It is squishy and soft, and still has that alpaca smell and some lanolin left in the fiber. It is a truly rustic, minimally processed yarn - if that's your thing, you're going to love this yarn</p>
						<p>How about <a href="/collections/yarns/products/local-natural-dyes" class="text-link">Local dyed with Natural Dyes</a>!?</p>
						<p>Click <a href="/collections/byyarn-local" class="text-link">here</a> for patterns in Local</p>
						<p>Want to see all of the colors in person before ordering? <a href="https://o-wool.myshopify.com/collections/yarns/products/color-cards" class="text-link">Order a Shade Card.</a></p>
						<meta charset="utf-8">
						<p><span>Want your yarn wound into balls?&nbsp;</span><span></span><a href="/collections/yarns/products/wind-yarn-into-balls" class="text-link">Look here.</a></p>
						<p>&nbsp;</p>
						<p>Hand wash in cold water with gentle detergent. Lay flat to dry.</p>
						<p>&nbsp;</p>
					</div>


					&lt;!&ndash; /snippets/social-sharing.liquid &ndash;&gt;


					<div class="social-sharing clean">


						<a target="_blank" href="//www.facebook.com/sharer.php?u=https://o-wool-stage.myshopify.com/products/local" class="share-facebook" title="Share on Facebook">
							<span class="icon icon-facebook" aria-hidden="true"></span>
							<span class="share-title" aria-hidden="true">Share</span>
							<span class="visually-hidden">Share on Facebook</span>
						</a>



						<a target="_blank" href="//twitter.com/share?text=Local%20(worsted)&amp;url=https://o-wool-stage.myshopify.com/products/local" class="share-twitter" title="Tweet on Twitter">
							<span class="icon icon-twitter" aria-hidden="true"></span>
							<span class="share-title" aria-hidden="true">Tweet</span>
							<span class="visually-hidden">Tweet on Twitter</span>
						</a>



						<a target="_blank" href="//pinterest.com/pin/create/button/?url=https://o-wool-stage.myshopify.com/products/local&amp;media=//cdn.shopify.com/s/files/1/0084/4044/7094/products/LSteelhead2_1024x1024.jpg?v=1532980795&amp;description=Local%20(worsted)" class="share-pinterest" title="Pin on Pinterest">
							<span class="icon icon-pinterest" aria-hidden="true"></span>
							<span class="share-title" aria-hidden="true">Pin it</span>
							<span class="visually-hidden">Pin on Pinterest</span>
						</a>


					</div>


				</div>
			</div>
		</div>

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

    import { getVariantFromOptions,isVariantAvailable,updateHistory} from '@/helpers/main.js'

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
			    default: true
		    },
	        updatehistory:{
		        default: true
	        },
	        shop:{
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
			    return this.Variants; //this._mapDisabledVariants(this.Variants, [] /*this._getVariantFromOptions( [value.id], this.Variants)*/);
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





