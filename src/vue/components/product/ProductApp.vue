<template>
	<div :class="$options.name">
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

				<div v-show="loading" class="product__main-loader">
					<iconcomponent icon_id="svg-icon-loadinganim" :flags="['--no-border']" iconsize="rel--xl"  scheme="light" :showpicker="true"></iconcomponent>
				</div>

				<div v-show="!loading" class="product-single__meta">
					<h2 v-show="sectionsettings.product_vendor_enable && ProductVendor" class="product-single__vendor" itemprop="brand">{{ CurrentProductVendor }}</h2>


					<iconcomponent  v-show="false" icon_id="svg-icon-leaves-a"   scheme="light" :showpicker="true"></iconcomponent>
					<h1 class="product-single__title" v-if="CurrentProductTitle" itemprop="name">
						{{CurrentProductTitle}}</h1>
					<h3 class="product-single__subtitle" v-if="CurrentProductSubtitle">{{CurrentProductSubtitle}}</h3>


					<div>
						<div class="product__price-container" data-price-container>
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

						<kabob class="product__divider" scheme="accent-default" componentclass="c-kabob"></kabob>

						<productOptionPicker v-show="Options" :inSelectedVariant="CurrentVariant" @optionChanged="optionChanged" :options="CurrentProductOptions"></productOptionPicker>

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
							<a :href="_getProductUrl(CurrentProduct.recc_yarn)" >Recommended Yarn</a>
						</div>
						<div v-if="( CurrentProduct && CurrentProduct.recc_kit)">
							<a :href="_getProductUrl(CurrentProduct.recc_kit)" >Recommended Kit</a>
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
				<img  :src="ShopifyImgURL(_getVariantDefaultImage(selected_variant).src,'200x200')">
				<span class="custom__remove" @click="_removeSelectedVariant(key)">
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
    import { getVariantFromOptions,isVariantAvailable,dictionaryIDArr,updateHistory,ShopifyImgURL} from '@/helpers/main.js'
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
			    _pendingItems:  false,// [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
			    _kititems:false,
			    loading: false,
			    convertedVariants:[],
			    _currentImageSlideshow: false
		    }
	    },
	    name: 'ProductApp',
	    computed: {
		    ...mapGetters([
			    'LayoutToggle',
			    'OptionByProp',
			    'OptionValueByProp',
			    'OptionsArrByProduct',
			    'OptionsByProduct']),
            ...mapState({shop: state => state._shop}),
            KitItems: {
                get: function() {
                    return this.$data._kititems;
                },
                set: function(newVal) {
                    //=newVal;
                    this.$data._kititems = newVal;
                }
            },
            ThumbnailPanelKey: function() {
                if (this.CurrentProduct && this.CurrentProduct.thumbnail_panel && this.CurrentProduct.thumbnail_panel.option_key && this.OptionByProp(this.CurrentProduct.thumbnail_panel.option_key)){
                    return this.OptionByProp(this.CurrentProduct.thumbnail_panel.option_key);
                }
                return {};
            },
            SelectedOptionsDictionary: function() {
                if (this.$data._currentVariant && this.$data._currentVariant.options){
                    return this.$data._currentVariant.options;
                } else {
                    return new Map;
                }
            },
            VariantArr: function() {

                //TODO: figure out what the deal is with this.
                let self = this;

                if (this.CurrentProduct){

                    if (this.CurrentProduct.variants){
                        var newArr = this.CurrentProduct.variants.map(function(variant) {

                            if (self.variant_dictionary.get(variant.id)){
                                return self.variant_dictionary.get(variant.id);
                            }
                        })
                        return newArr;
                    } else {
                        return this.Variants;
                    }

                } else {
                    this.Variants;
                }
                return this.Variants; //this._mapDisabledVariants(this.Variants, [] /*this._getVariantFromOptions( [value.id], this.Variants)*/);
            },
            Layout: function() {
                return this.$data.toggle_classes[this.LayoutToggle];
            }
	    },
	    created:function(){
            let self = this;
	    	this.$data.loading=true;

	    	this.getShop().then(function(res){
		    })
            self.loadProducts().then(function(res){

                // self.add_product_to_dictionary({products: res.data.products });

            });

		    this.loadProduct().then(function(res){

			    //***PRODUCT  ADDITIONAL PROPS.
                var additionalProductProps =self.$props.productdata;
                ///merge props..
                if ( self.$props.producthandle ){
                    if ( window.producthandledata &&window.producthandledata.hasOwnProperty(self.$props.producthandle )){
	                    additionalProductProps =Object.assign(additionalProductProps,window.producthandledata[self.$props.producthandle] )//self.$props.productdata;
                    }
                }

                //***PRODUCT
                self.add_product_to_dictionary({product: res.data.product, additionalProps:additionalProductProps });

			    //***VARIANTS
			    self.add_variants_to_dictionary({variants: res.data.product.variants});

                //***IMAGES
                self.add_images_to_dictionary({images: res.data.product.images});
                /********/

				 //todo, MOVE THIS PLS.

				  if (  self.Variants && self.Variants.length >1 ){
                      //!***INIT OPTIONS TODO: eventually be able to turn this off?
                      self.initOptions(self.CurrentProduct);
				  }

                ////!*****SET VARIANT
                self.variantChanged(self.variant_dictionary.get(self.NormalizedVariantID))
			    self.$data.loading = false;
		    })
	    },
	    mounted:function(){
		  //  this.loadVariantMeta(this.NormalizedProductID, this.NormalizedVariantID)
	    },
	    methods:{
	        initOptions:function(current_product){
                var payload = {
                    options: current_product.options,
                    optionconfig: (current_product.optionconfig && current_product.optionconfig.length > 0) ? current_product.optionconfig : false,
                    option_value_overrides: (current_product.optionvalues && current_product.optionvalues.length > 0) ? current_product.optionvalues  : false
                };
                this.add_options_to_dictionary(payload);
	        },
	    ...mapMutations(['setlayoutButton']),
			    testBtn:function(target){
		    	this.setlayoutButton({index: target})
		    },
            variantChanged: function(variant) {
                console.log("!!!!!!!!!variant changed!!!!!", this.$data._currentImageSlideshow,this.CurrentVariant,variant)
                this.$data._currentVariant   = variant;


                this.KitItems = this._getKitItems(variant); ///gets kit items from meta.


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

            ///***  THUMBNAIL PANEL LISTENERS
            imageUpdated: function(product_image) {
                this.$data._currentImageSlideshow= product_image;
            },
            imageOptionUpdated: function(product_image, option, value) {

                if (this.CurrentProduct && this.CurrentProduct.thumbnail_panel && !this.CurrentProduct.thumbnail_panel.option_key){
                    this.imageUpdated(product_image);
                } else {

                    //clone the selected options dictionary
                    var selectedOptionsDictionary_for_PendingVariant = new Map(this.SelectedOptionsDictionary);

                    ///if the single option selected is registered, replace with new option if its different.
                    if (selectedOptionsDictionary_for_PendingVariant.get(option.id) && (selectedOptionsDictionary_for_PendingVariant.get(option.id) != value)){

                        selectedOptionsDictionary_for_PendingVariant.set(option.id, value);

                        //convert the dictionary to ids, then find the variants.
                        var foundVariantArr = this._getFilterUnavailable(getVariantFromOptions(dictionaryIDArr(selectedOptionsDictionary_for_PendingVariant), this.Variants));

                        //we are looking for only 1 variant option, so if there are none available that matches BOTH options,
                        /// try a single option instead.
                        if (foundVariantArr && foundVariantArr.length != 1){
                            console.log("USING ALTERNATE INSTEAD!");
                            foundVariantArr = this._getFilterUnavailable(getVariantFromOptions([value.id], this.Variants));
                        }

                        if (foundVariantArr && foundVariantArr.length == 1){
                            this.variantChanged(foundVariantArr[0]);
                        } else {
                            console.log("A suitable variant that meets the criteria is not found.")
                        }
                    }
                }
            },
            optionChanged: function(requestedVariant,option_dictionary) {
               //***event THE MASTER OPTION PICKER IS CHANGED!!
                this.variantChanged(requestedVariant);
            },
           //***** FILTER OUT UNAVAILABLE VARIANTS FROM ARRAY
            _getFilterUnavailable: function(variants) {
                return variants.filter(function(variant) {
                    return (isVariantAvailable(variant)) ? true : false
                })
            },
		    _getKitItems:function(variant){
	    	if ( this.CurrentProduct && this.CurrentProduct.variant_meta ){
	    		if ( this.CurrentProduct.variant_meta[variant.id] && this.CurrentProduct.variant_meta[variant.id].hasOwnProperty('kit')  ){
				    return this.CurrentProduct.variant_meta[variant.id]['kit'];
			    }
			    return false;
		    }
		    },
            _getVariantDefaultImage: function(variant){
                if (variant && variant.image_id && this.product_image_dictionary.get(variant.image_id)){
                    return this.product_image_dictionary.get(variant.image_id);
                }
                return false;
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
		    },
            _getProductUrl: function(handle){
                return `/product/${handle}`;
            },
            _removeSelectedVariant:function(index){
                this.CurrentVariant.splice(index,1);
            }
	    },
};
</script>
<!--
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
-->

<style lang="scss" type="text/scss" >

	@import "src/vue/helpers/product-dependancies.scss";

	.g-center-panel-callout {
		@include g-color-scheme(accent-primary, (background:true, foreground:true, fill:true, border:true));
		border-width: 2px;
	}
	.draggablePanel {
		display: flex;
		width: 100%;
	}

	.multiselectmaster {
		background: red;

		.multiselect__option--selected {
		}

		span.multiselect__option {;

		}

		.multiselect__element {
			//background: red
		}
	}
</style>





