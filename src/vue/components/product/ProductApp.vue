<template>
	<div class="component-productApp">
		<div class="grid product-single">
			<h1 class="product-single__title product-single__title-mobile" v-if="CurrentProductTitle" itemprop="name">{{CurrentProductTitle}}</h1>
			<div class="grid__item large--seven-twelfths do-touch-manipulation medium--seven-twelfths text-center">
				<ProductImageSlideshow :currentimage="$data._currentImageSlideshow" :imagearray="CurrentProductImages" :imagesize="'1250x1250'"></ProductImageSlideshow>
				<ProductImageThumbailPicker v-if="CurrentProduct && CurrentProduct.thumbnail_panel && CurrentProduct.thumbnail_panel.show" :option="ThumbnailPanelKey" @UPDATE_OPTION="imageOptionUpdated" @UPDATE_IMAGE="imageUpdated" :imagearray="CurrentProductImages" :imagesize="'150x150'"></ProductImageThumbailPicker>
			</div>

			<div class="grid__item product-single__meta--wrapper medium--five-twelfths large--five-twelfths">

				<div v-show="loading" class="product-app-loading">
					<iconcomponent icon_id="svg-icon-loadinganim" :flags="['--no-border']"  scheme="light" :showpicker="true"></iconcomponent>
				</div>


				<div v-show="!loading" class="product-single__meta">
					<h2 v-show="sectionsettings.product_vendor_enable && ProductVendor" class="product-single__vendor" itemprop="brand">{{ CurrentProductVendor }}</h2>


					<iconcomponent  v-show="false" icon_id="svg-icon-leaves-a"   scheme="light" :showpicker="true"></iconcomponent>
					<h1 class="product-single__title" v-if="CurrentProductTitle" itemprop="name">
						{{CurrentProductTitle}}</h1>
					<h3 v-if="CurrentProductSubtitle">{{CurrentProductSubtitle}}</h3>

					<div>

						<meta itemprop="priceCurrency" v-if="shop" :content="shop.currency ">
						<link itemprop="availability" href="http://schema.org/|| if product.available || InStock{% else %}OutOfStock{% endif %}">
						<link itemprop="availability" href="http://schema.org/InStock">

						<iconcomponent  v-show="false" icon_id="svg-icon-divider-right" :flags="['--no-border']"  scheme="light" :showpicker="true"></iconcomponent>

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

						<a v-if="CurrentProductRavelryLink" :href="CurrentProductRavelryLink" >
							<basecomponent :disabled="isDisabled" text="Download on ravelry"
							               scheme="dark-accent-primary" :flags="['--icon-right','test']"
							               font="small-caps"
							               fontsize="lg"
							               :showpicker="false" padding="md">
								<template slot="right-icon" class="is-grid-2" >
									<span v-html="getIconSVG('leaves-single')"></span>
								</template>

							</basecomponent>
						</a>


						<div v-if="( CurrentProduct && CurrentProduct.recc_yarn)"><a :href="getProductUrl(CurrentProduct.recc_yarn)" >Recommended Yarn</a></div>
						<div v-if="( CurrentProduct && CurrentProduct.recc_kit)"><a :href="getProductUrl(CurrentProduct.recc_kit)" >Recommended Kit</a></div>

						<PendingItemsComponent :lineitemmessage="( CurrentProduct && KitItems) ? CurrentProduct.title : false"  v-if="(CurrentProduct && !CurrentProduct.notforsale)" :kit="KitItems" :addtocartvariants='$data._pendingItems'></PendingItemsComponent>
						<div v-html="CurrentProductDesc" class="product-single__description rte" itemprop="description">
						</div>

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
    const schema = require("schm");
    import { getVariantFromOptions,isVariantAvailable,updateHistory} from '@/helpers/main.js'
    import Multiselect from 'vue-multiselect'
    import Vue from 'vue';

    import {ProductMixin} from  '@/mixins/productmixin.js';
    import {VariantMixin} from  '@/mixins/variantmixin.js';
    import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';
    import {ShopifyApiMixin} from  '@/mixins/shopifyapimixin.js';

    import kabob from '@/components/utilities/kabob';
    import iconcomponent from '@/components/utilities/g-icon-component.vue';

    import basecomponent from '@/components/utilities/g-base-component.vue';

    import ProductImageThumbailPicker from '@/components/product/images/ProductImageThumbailPicker.vue'
    import ProductImageSlideshow from '@/components/product/images/ProductImageSlideshow.vue'

    import productOptionPicker from '@/components/product/options/ProductOptionsPicker.vue'
    import PendingItemsComponent from '@/components/product/cart/PendingItemsComponent.vue'

    //  ProductMixin
    export default {
	    props: {
		    variantid: {
			    default: false
		    },
		    productid: {
			    default: false
		    },
            producthandle: {
                default: false
            },
            productdata: {
                default: () => []
            },
            producthandledata:{
                default: () => {}

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
            metavisible: {
                type: Boolean,
                default: true
            },
            download: {
                default:false
            },
            addtocartvariants: {
                type: Array,
            default: () => []
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
                type: [String,Boolean],
                default: false
            }
	    },
	    mixins: [DictionaryMixin,ProductMixin,VariantMixin,ShopifyApiMixin],
	    components: {iconcomponent,ProductImageThumbailPicker,basecomponent,ProductImageSlideshow,kabob,PendingItemsComponent,productOptionPicker,Multiselect},
	    data() {
		    return {
		    	toggle_classes:['layout-grid','layout-list','layout-lg','layout-sm' ],
			    toggle_exclusive:2,
			    _optionMeta: [],
			    _pendingItems:  "Hello there",// [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
		        _kit: false,
			    _kititems:false,
			    loading: false,
			    convertedVariants:[],
			    _currentImageSlideshow: false
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
	    KitItems: {
		    get: function() {
			  return  this.$data._kititems;
		    },
		    set: function(newVal) {
			    //=newVal;
			    this.$data._kititems = newVal;
		    }
	    },
	  /*  KitItems:function(){
		//_kititems

		    	if ( !_kititems){
				    if ( .$props.addtocartvariants && self.$props.addtocartvariants.length >0
			    }
		    /!*if ( this.$data._kit ){

			f ( self.$props.addtocartvariants && self.$props.addtocartvariants.length >0 ){


			    console.log("THIS IS A KIT" ,this.$props.addtocartvariants);
			    this.$data._pendingItems =this.$props.addtocartvariants;// [{ requested_quantity: 1,quantity_editable: true, variant: this.CurrentVariant, id:  this.CurrentVariant.id }];
		    }else{
			    this.$data._pendingItems = [{ requested_quantity: 1,quantity_editable: true, variant: this.CurrentVariant, id:  this.CurrentVariant.id }];
		    }*!/

	    },*/
		    ThumbnailPanelKey:function() {
                if (this.CurrentProduct && this.CurrentProduct.thumbnail_panel && this.CurrentProduct.thumbnail_panel.option_key && this.OptionByProp(this.CurrentProduct.thumbnail_panel.option_key)){
                   return this.OptionByProp(this.CurrentProduct.thumbnail_panel.option_key);
                }else{
                    return {};
                }

                },

            SelectedOptionsDictionary: function() {
                if (  this.$data._currentVariant &&  this.$data._currentVariant.options){
                    return  this.$data._currentVariant.options;
                }else{
                    return new Map;
                }
            },

		    TestKit: function(){
		    [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
	    },
		    Slug:function(){
			    return "wild-geranium"
		    },
		    VariantArr: function() {

			    let self =this;

			    if ( this.CurrentProduct ){

				    if (this.CurrentProduct.variants ){
					    var newArr =    this.CurrentProduct.variants.map(function(variant){

						    if (self.variant_dictionary.get(variant.id)){
							    return	self.variant_dictionary.get(variant.id);
						    }
					    })
					    return this.Variants;
				    }else{
					    return this.Variants;
				    }

			    }else{
				    this.Variants;
			    }
			    //    return this.Variants; //this._mapDisabledVariants(this.Variants, [] /*this._getVariantFromOptions( [value.id], this.Variants)*/);


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
		    })
		    this.loadProduct().then(function(res){

			    //***PRODUCT
                var additionalProductProps =self.$props.productdata;

                ///merge props..
                if ( self.$props.producthandle ){
                    if ( window.producthandledata &&window.producthandledata.hasOwnProperty(self.$props.producthandle )){
	                    //console.log("FOUND",window.producthandledata, window.producthandledata[self.$props.producthandle],self.$props.producthandle)

	                    additionalProductProps =Object.assign(additionalProductProps,window.producthandledata[self.$props.producthandle] )//self.$props.productdata;
                    }
                }

                self.add_product_to_dictionary({product: res.data.product, additionalProps:additionalProductProps });
			/*
			    if (  this.CurrentProduct.variant_meta){
				    let variantmeta = this.CurrentProduct.variant_meta
				    var unmergedVariants = res.data.product.variants;
				    var newarr = unmergedVariants.map(function(variant){
					    if ( variantmeta[variant.id]){
						    var eachvariantmeta = variantmeta[variant.id];

						    return Object.assign(variant,{ variantmeta: eachvariantmeta })
					    }else{
						    return variant;
					    }


				    })

				    console.log("VARIANTMERA PRODUCT", newarr)

			    }*/




			    //***VARIANTS
	    self.add_variants_to_dictionary({variants: res.data.product.variants});

                //***IMAGES
                self.add_images_to_dictionary({images: res.data.product.images});
                /********/

				 //todo, MOVE THIS PLS.
                self.$data.currentProductImages=  self.ImagesByProduct(self.CurrentProduct);


				  if (  self.Variants && self.Variants.length >1 ){
                      //!***OPTIONS
                      var payload = {
                          options: res.data.product.options,
                      optionconfig: (self.CurrentProduct.optionconfig && self.CurrentProduct.optionconfig.length > 0) ? self.CurrentProduct.optionconfig : false,
                          option_value_overrides: (self.CurrentProduct.optionvalues && self.CurrentProduct.optionvalues.length > 0) ? self.CurrentProduct.optionvalues  : false
                      };
                      self.add_options_to_dictionary(payload);
///right here
                      if ( self.$props.addtocartvariants && self.$props.addtocartvariants.length >0 ){
                          self.$data._kit = true;
                      }
                      ////!*****SET VARIANT
                      self.variantChanged(self.variant_dictionary.get(self.NormalizedVariantID))
				  }else{
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
		    	this.setlayoutButton({index: target})
		    },
		    getProductUrl: function(handle){
			      return `/product/${handle}`;
		    },   getIconSVG:function( icon_id ){
                var element = document.getElementById(icon_id);
                return element.outerHTML;
            },
            imageOptionUpdated: function(product_image,option,value) {


		        if (this.CurrentProduct && this.CurrentProduct.thumbnail_panel && !this.CurrentProduct.thumbnail_panel.option_key){
                    this.imageUpdated(product_image);
		        }else {

			        var newOptionDictionaryforPendingVariant = new Map(this.SelectedOptionsDictionary);

			        if (newOptionDictionaryforPendingVariant.get(option.id)){

				        if (newOptionDictionaryforPendingVariant.get(option.id) != value){
					        newOptionDictionaryforPendingVariant.set(option.id, value);
					        var idmap = Array.from(newOptionDictionaryforPendingVariant.values()).map(function(option) {
						        if (option.hasOwnProperty('id')){
							        return option.id;
						        }
					        })

					        var foundVariantArr = this._getVariantFromOptions(idmap, this.Variants);

					        if (foundVariantArr && foundVariantArr.length == 1 && isVariantAvailable(foundVariantArr[0])){


						        this.variantChanged(foundVariantArr[0]);
						        //  this.$emit('optionChanged',foundVariantArr[0], newOptionDictionaryforPendingVariant )
					        } else {
						        this.imageUpdated(product_image);

						        var newFoundVariantArr = this._getVariantFromOptions([value.id], this.Variants);

						        if (newFoundVariantArr && newFoundVariantArr.length == 1 && isVariantAvailable(newFoundVariantArr[0])){
							        console.log("&&&&&&& ALTERNATE!!!", newFoundVariantArr, newOptionDictionaryforPendingVariant)

							        this.variantChanged(newFoundVariantArr[0]);
						        } else {
							       // console.log("VARIANT SEARCH RETURNED MORE OR LESS THAN AMOUNT TO TRIGGER A CHANGE!!!", foundVariantArr, newOptionDictionaryforPendingVariant)
						        }
					        }
				        }
			        }
		        }
            },
            _getVariantFromOptions: function( optionArray, variantsArr ) {   //move to a mixin.
                return   getVariantFromOptions(optionArray, variantsArr);
            },
            imageUpdated: function(product_image) {
              //  this.$emit(this.$props.updateMode, product_image);
            this.$data._currentImageSlideshow= product_image;

            },
		    remapVariants:function(variantArr){

			    	let baseObj= {
			    		requested_quantity: 1,
						    message: "not set"
			    };
		    },
		    getKitItems:function(variant){
	    	if ( this.CurrentProduct && this.CurrentProduct.variant_meta ){

	    		//console.log("HAS VARIANT META",this.CurrentProduct.variant_meta, variant.id);

	    		if ( this.CurrentProduct.variant_meta[variant.id] && this.CurrentProduct.variant_meta[variant.id].hasOwnProperty('kit')  ){
				    //console.log("HAS VARIANT META", this.CurrentProduct.variant_meta[variant.id]['kit']  );
				    return this.CurrentProduct.variant_meta[variant.id]['kit'];
			    }
			    return false;
		    }
		    },
	    	variantChanged: function(variant) {
			    console.log("!!!!!!!!!variant changed!!!!!",this.CurrentVariant,variant)
			    this.$data._currentVariant   = variant;


                this.KitItems = this.getKitItems(variant);



			    if ( this.product_image_dictionary.get(this.CurrentVariant.image_id)){
                    this.$data._currentImageSlideshow= this.product_image_dictionary.get(this.CurrentVariant.image_id);

                }

                if (variant instanceof Array &&variant.length>0 ){
			    	var variantArr  =variant;
			    	var newPending  = variantArr.map(function(_variant){

			    		return { requested_quantity: 1,quantity_editable: true, id: _variant.id }
				    })
				    this.$data._pendingItems =newPending;
			    }else{

			    	if ( this.$props.updatehistory ){
					    updateHistory(variant);
				    }

                //TODO: figure this out

				    if ( this.KitItems ){
				    	console.log("THIS IS A KIT" ,this.KitItems );
                        this.$data._pendingItems =this.KitItems;// [{ requested_quantity: 1,quantity_editable: true, variant: this.CurrentVariant, id:  this.CurrentVariant.id }];
                    }else{
                        this.$data._pendingItems = [{ requested_quantity: 1,quantity_editable: true, variant: this.CurrentVariant, id:  this.CurrentVariant.id }];
                    }
			    }
	        },
		    optionChanged: function(requestedVariant,option_dictionary) {

			  //  console.log("!**************!master option changed!!!!!",this.CurrentVariant,requestedVariant,option_dictionary);

                let tally = [];
                Array.from(this.option_dictionary.values()).forEach(function(option){
                    tally =[...tally,...option.values];
			    })


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

<style lang="scss" type="text/scss" >

	@import "src/vue/helpers/product-dependancies.scss";
.product-single__title-mobile{

	@include breakpoint-range(md,">="){
		display: none;
	}
}
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
	span.multiselect__option{;

	}
	.multiselect__element{
		//background: red;



	}



}
</style>





