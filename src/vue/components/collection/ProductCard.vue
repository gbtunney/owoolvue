<template>
	<div :class="$options.name"  v-if="CurrentProduct">
			<h1 class="product-single__title" v-if="CurrentProductTitle" itemprop="name">
				{{CurrentProductTitle}}</h1>
			<h3 v-if="CurrentProductSubtitle">{{CurrentProductSubtitle}}</h3>


		<ProductImages v-if="CurrentProduct"
					   :option="ThumbnailPanelKey"
					   :imagearray="CurrentProductImages"
					   :imagesize="'150x150'">

		</ProductImages>
	
		<ProductImageThumbailPicker v-if="CurrentProduct"
										:option="ThumbnailPanelKey"
										:imagearray="CurrentProductImages"
										:imagesize="'150x150'">

			</ProductImageThumbailPicker>

			<div v-if="CurrentProduct.variants">{{CurrentProduct.variants}}</div>
			<div data-price-container>
			<span v-if="CurrentVariantOnSale" class="product-single__price wrapper" aria-hidden="false">
				<span id="ComparePrice" class="product-single__price compare-at">{{ CurrentVariantCompareAtPrice }}</span>
			</span>

				<span id="ProductPrice"
				      v-bind:class="{ 'on-sale' : CurrentVariantOnSale }"
				      class="product-single__price "
				      itemprop="price"
				      :content="CurrentVariantPrice">{{ CurrentVariantPrice }}</span>
			</div>

			<lazy-component v-if="DefaultImage">
				<img class="mini-cover" :src="getShopifyImageURL(CurrentProductDefaultImage)" :alt="CurrentProductDefaultImage.alt">
			</lazy-component>

			<p class="grid-product__vendor" v-if="CurrentProduct">{{ CurrentProduct.product_type }} - {{ CurrentProduct.vendor }}</p>
	</div>
</template>

<script>

	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
    import VueLazyload from 'vue-lazyload'

    import {ProductMixin} from  '@/mixins/productmixin.js';
    import {VariantMixin} from  '@/mixins/variantmixin.js';
    import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';
    import {ShopifyApiMixin} from  '@/mixins/shopifyapimixin.js';
    import {LocalVariantDictionaryMixin} from  '@/mixins/localVariantDictionaryMixin.js';
    import {isVariantAvailable, ShopifyImgURL} from '@/helpers/main.js'
	import ProductImageThumbailPicker from '@/components/product/images/ProductImageThumbailPicker.vue'
	import ProductImageSlideshow from '@/components/product/images/ProductImageSlideshow.vue'


    Vue.use(VueLazyload, {
        lazyComponent: true
    });

	module.exports = {
		name: 'ProductCard',
        mixins: [LocalVariantDictionaryMixin,DictionaryMixin,ProductMixin,VariantMixin,ShopifyApiMixin],
        components: {ProductImageThumbailPicker},
		data: function() {
			return {
				greeting: 'Hello',
				_productid:false
			}
		},
		props: {
            variantid: {
                default: false
            },
			producthandle: {
				default: false
			},
			defaults: {
				type: Object,
				default: () => {
				}
			},
			default_heirarchy: {
				type: Array,
				default: () => []
			},
            imagesize: {
                required: false,
                type: [Boolean, String],
                 default:'350x350'
            }
		},
		mounted:function(){

		    let self = this;

			this.loadProduct().then(function(res){
self.initCurrentProduct(res.data.product);

				console.log("LOADING!!",);

			})


		},
		computed: {
            ...mapState({shop: state => state._shop
            }),
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
			initCurrentProduct: function (current_product) {

				if ( this.MappedDefaults ){
					current_product= this.GetMergedProduct(current_product);
				}

				this.$data._productid = current_product.id;

				//!***PRODUCT
				this.add_product_to_dictionary({product: current_product });

				//!***VARIANTS
				this.add_variants_to_dictionary({variants: this.CurrentProduct.variants});

				//!**IMAGES
				this.add_images_to_dictionary({images: this.CurrentProduct.images});

				/*if (this.VariantArr && this.VariantArr.length > 1) {
					//!***INIT OPTIONS TODO: eventually be able to turn this off?
					this.initOptions(this.CurrentProduct);
				}*/
			},
			initOptions:function(current_product){
				var payload = {
					options: current_product.options,
					optionconfig: (current_product.optionconfig && current_product.optionconfig.length > 0) ? current_product.optionconfig : false,
					option_value_overrides: (current_product.optionvalues && current_product.optionvalues.length > 0) ? current_product.optionvalues  : false
				};
				this.add_options_to_dictionary(payload);
			},
			Defaults: function (_key = false, _flattened = false, _defaults = this.$props.defaults, _delimiter = '.') {
				var return_obj = false;
				if (!_key) {
					return_obj = _defaults;
				} else if (_key && r.is(String, _key)) {
					_key = _key.split(_delimiter);
				}
				if (_key && r.is(Array, _key)) {
					return_obj = (r.path(_key, _defaults)) ? r.path(_key, _defaults) : false;
				}

				if (!_flattened) return return_obj;
				if (_flattened && r.is(Boolean, _flattened)) return flatten(return_obj, FLATTEN_OPTIONS_DEFAULT);
				if (_flattened && r.is(Object, _flattened)) return flatten(return_obj, _flattened) //overriding the default options.
				return false;
			},
			GetMergedProduct: function (product = this.$props.product, override = this.MappedDefaults) {
				if (!product) return false;
				let R = r;
				let self = this;
				let customMerge = function (k, l, r) {
					if (R.is(Array, k) && R.is(Array, l)) {
						var newVal = k.map(function (item, index) {
							return Object.assign(R.clone(item), l[index]);
						})
					}
					return newVal;//k == 'values' ? R.concat(l, r) : r
				};
				return R.mergeWith(customMerge,
						R.clone(product), R.clone(override)
				);
			}
		}
	}
</script>

<style lang="scss" type="text/scss" >

	.ProductCard img{
		max-width: 100%;
	}
</style>