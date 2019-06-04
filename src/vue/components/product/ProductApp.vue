<template>
	<div class="component-productApp">
		<div class="grid product-single">
			<h1 class="product-single__title product-single__title-mobile" v-if="CurrentProductTitle" itemprop="name">{{CurrentProductTitle}}</h1>
			<div class="grid__item large--seven-twelfths do-touch-manipulation medium--seven-twelfths text-center">
				<ProductImageSlideshow :currentimage="$data._currentImageSlideshow" :imagearray="CurrentProductImages" :imagesize="'1250x1250'"></ProductImageSlideshow>
				<ProductImageThumbailPicker v-if="CurrentProduct && CurrentProduct.thumbnail_panel && CurrentProduct.thumbnail_panel.show"
				                            :option="ThumbnailPanelKey"
				                            :imagearray="CurrentProductImages"
				                            :imagesize="'150x150'"
				                            @UPDATE_OPTION="imageOptionUpdated"
				                            @UPDATE_IMAGE="imageUpdated">

				</ProductImageThumbailPicker>
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
						<div data-price-container>
							<span v-if="CurrentVariantOnSale" class="product-single__price wrapper" aria-hidden="false">
								<span id="ComparePrice" class="product-single__price compare-at">{{ CurrentVariantCompareAtPrice }}</span>
							</span>
							<span id="ProductPrice"
							      v-bind:class="{ 'on-sale' : CurrentVariantOnSale }"
							      class="product-single__price "
							      itemprop="price"
							      :content="CurrentVariantPrice">{{ CurrentVariantPrice }}
							</span>
						</div>

						<meta itemprop="priceCurrency" v-if="shop" :content="shop.currency ">
						<link itemprop="availability" href="http://schema.org/|| if product.available || InStock{% else %}OutOfStock{% endif %}">
						<link itemprop="availability" href="http://schema.org/InStock">

						<iconcomponent  v-show="false" icon_id="svg-icon-divider-right" :flags="['--no-border']"  scheme="light" :showpicker="true"></iconcomponent>

						<kabob class="divider" scheme="accent-default" componentclass="c-kabob"></kabob>

						<productOptionPicker v-show="Options" :inSelectedVariant="CurrentVariant" :meta="$data._optionMeta" @optionChanged="optionChanged" :options="CurrentProductOptions"></productOptionPicker>

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

						<div v-if="( CurrentProduct && CurrentProduct.recc_yarn)">
							<a :href="getProductUrl(CurrentProduct.recc_yarn)" >Recommended Yarn</a>
						</div>
						<div v-if="( CurrentProduct && CurrentProduct.recc_kit)">
							<a :href="getProductUrl(CurrentProduct.recc_kit)" >Recommended Kit</a>
						</div>

						<PendingItemsComponent :lineitemmessage="( CurrentProduct && KitItems) ? CurrentProduct.title : false"
						                       v-if="(CurrentProduct && !CurrentProduct.notforsale)"
						                       :kit="KitItems"
						                       :addtocartvariants='$data._pendingItems'>
						</PendingItemsComponent>

						<div v-html="CurrentProductDesc" class="product-single__description rte" itemprop="description"></div>

					</div>
				</div>
			</div>
		</div>

		<div class="g-center-panel-callout">
			<ul>
				<li>
					<h6>YARN WEIGHT</h6>
					<p>Worsted Weight
						Put-up: 3.5 oz / 100g
						Yardage: 240 yds / 219m
					</p>
				</li>
				<li>
					<span>Fiber Content:</span>
					<span>50% alpaca from local farms in NJ & PA
			50% certified organic merino</span>
				</li>

				<li>
					<span>Gauge:</span>
					<span>18 - 20 sts = 4” / 10cm</span>
				</li>
				<li>
					<span>Needle:</span>
					<span>7 - 9 US / 4.5 - 5.5mm</span>
				</li>
			</ul>


		</div>

		<Multiselect :options="VariantArr"
		             v-model="CurrentVariant"
		             @input="variantChanged"
		             v-show="showmasterselect"
		             track-by="title"
		             label="title"
		             class="multiselectmaster"
		             :taggable="false"
		             :multiple="false"
		             :closeOnSelect="false"
		             placeholder="Select one"
		             :searchable="true"
		             :allow-empty="false">




			clear
			<template slot="option" class="is-grid-2" slot-scope="props" disabled="true">
				<div disabled="true"  class="option__desc"><span class="option__title">qty{{ props.option.inventory_quantity}}:  {{ props.option.title }}</span></div>
			</template>

		</Multiselect>
		<div>
			DRAGAABLE!!!!!
		</div>
		<draggable class="draggablePanel"  v-if="( CurrentVariant && CurrentVariant.length>0) " v-model="CurrentVariant" group="people" @start="drag=true" @end="drag=false">
			<div v-for="selected_variant,key in CurrentVariant" :key="key">
				<img  :src="ShopifyImgURL(_getVariantImage(selected_variant).src,'200x200')">
				<span class="custom__remove" @click="removeSelectedVariant(key)">
						X
						</span></div>
		</draggable>



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
    import { getVariantFromOptions,isVariantAvailable,updateHistory,ShopifyImgURL} from '@/helpers/main.js'
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
    import draggable from 'vuedraggable'

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
		        type: Object,
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
	    components: {draggable,iconcomponent,ProductImageThumbailPicker,basecomponent,ProductImageSlideshow,kabob,PendingItemsComponent,productOptionPicker,Multiselect},
	    data() {
		    return {
		    	toggle_classes:['layout-grid','layout-list','layout-lg','layout-sm' ],
			    toggle_exclusive:2,
			    _optionMeta: [],
			    _pendingItems:  false,// [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
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

	                    additionalProductProps =Object.assign(additionalProductProps,window.producthandledata[self.$props.producthandle] )//self.$props.productdata;
                        console.log("FOUND",additionalProductProps,window.producthandledata, window.producthandledata[self.$props.producthandle],self.$props.producthandle)

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

                self.loadProducts().then(function(res){

                    // self.add_product_to_dictionary({products: res.data.products });

                });
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
            ShopifyImgURL,
		    getProductUrl: function(handle){
			      return `/product/${handle}`;
		    },   getIconSVG:function( icon_id ){
                var element = document.getElementById(icon_id);
                return element.outerHTML;
            },

		    removeSelectedVariant:function(index){
                this.CurrentVariant.splice(index,1);

		    },
            imageOptionUpdated: function(product_image,option,value) {

				console.log("image option updated",product_image,option,value)
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

                                console.log("&&&&&&& looking for ALTERNATE!!!", newFoundVariantArr);


                                if (newFoundVariantArr && newFoundVariantArr.length == 1 && isVariantAvailable(newFoundVariantArr[0])){
							        console.log("&&&&&&& ALTERNATE!!!", newFoundVariantArr, newOptionDictionaryforPendingVariant)

							        this.variantChanged(newFoundVariantArr[0]);
						        } else {
							        console.log("VARIANT SEARCH RETURNED MORE OR LESS THAN AMOUNT TO TRIGGER A CHANGE!!!", newFoundVariantArr, newOptionDictionaryforPendingVariant)
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
            _getVariantImage: function(variant){

                if (variant && variant.image_id && this.product_image_dictionary.get(variant.image_id)){
                    return this.product_image_dictionary.get(variant.image_id);
                }
                return false;

            },
	    	variantChanged: function(variant) {
			    console.log("!!!!!!!!!variant changed!!!!!", this.$data._currentImageSlideshow,this.CurrentVariant,variant)
			    this.$data._currentVariant   = variant;


                this.KitItems = this.getKitItems(variant); ///gets kit items from meta.


			    //set the default image in the slideshow
                if ( this.CurrentProductDefaultImage ){
                    this.$data._currentImageSlideshow=this.CurrentProductDefaultImage;
                }else{
                    throw "DIDNT SET THE IMAGE!!";
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
                        this.$data._pendingItems = [{ requested_quantity: 1,quantity_editable: true, variant_id:  this.CurrentVariant.id }];
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
<!--
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
-->

<style lang="scss" type="text/scss" >

	@import "src/vue/helpers/product-dependancies.scss";
	.g-center-panel-callout{
		@include g-color-scheme(accent-primary,(background:true,foreground:true,fill:true,border:true));
		border-width: 2px;
	}
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

.draggablePanel{
	display: flex;
	width: 100%;
}
.multiselectmaster{
	background: red;

	.multiselect__option--selected{
	}
	span.multiselect__option{;

	}
	.multiselect__element{
		//background: red;



	}



}
</style>





