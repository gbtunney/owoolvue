<template>
	<div :class="$options.name"  v-if="CurrentProduct">
		<a :href="ProductUrl">
			<h1 class="product-single__title" v-if="CurrentProductTitle" itemprop="name">
				{{CurrentProductTitle}}</h1>
			<h3 v-if="CurrentProductSubtitle">{{CurrentProductSubtitle}}</h3>
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
				<img class="mini-cover" :src="getShopifyImageURL(DefaultImage)" :alt="DefaultImage.alt">
			</lazy-component>

			<p class="grid-product__vendor" v-if="CurrentProduct">{{ CurrentProduct.product_type }} - {{ CurrentProduct.vendor }}</p>

		</a>
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

    Vue.use(VueLazyload, {
        lazyComponent: true
    });

	module.exports = {
		name: 'ProductCard',
        mixins: [LocalVariantDictionaryMixin,DictionaryMixin,ProductMixin,VariantMixin,ShopifyApiMixin],
        components: {},
		data: function() {
			return {
				greeting: 'Hello'
			}
		},
		props: {
            variantid: {
                default: false
            },
            productid: {
                default: false
            },
            product: {
                type: Object,
                default: () => {}
            },
            imagesize: {
                required: false,
                type: [Boolean, String],
                 default:'350x350'
            }
		},
		mounted:function(){

		    let self = this;

		},
        watch: {
            ///todo: these miht need to be MIRRORED in a create func for some reason.
            product_dictionary: function(val) {
                if ( this.CurrentProduct){
					this.initProduct();
                }
            }
        },
		computed: {
            ...mapState({shop: state => state._shop
            }),
            DefaultImage: function() {
                if (this.CurrentVariant && this.CurrentVariant.image_id && this.product_image_dictionary.get(this.CurrentVariant.image_id)){
                    return this.product_image_dictionary.get(this.CurrentVariant.image_id);
                } else if (this.CurrentProduct && this.CurrentProduct.image.id && this.product_image_dictionary.get(this.CurrentProduct.image.id)){
                    return this.product_image_dictionary.get(this.CurrentProduct.image.id);
                }
                return false;
            },
            ProductUrl: function(){
                if ( this.CurrentProduct && this.CurrentProduct.handle) return `/product/${this.CurrentProduct.handle}`
                return false;
            },
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
            initProduct:function (){
                if ( this.CurrentProduct && this.CurrentProduct.variants){
                    this.LocalVariantDictionary = Array.from(this.CurrentProduct.variants);
                    if ( !this.$props.variantid){
                     this.CurrentVariant = this.CurrentProduct.variants[0]; ///use the default
                    }else if (this.$props.variantid && this.LocalVariantDictionary && this.LocalVariantDictionary.get(this.$props.variantid) ) {
                       this.CurrentVariant = tthis.variant_dictionary.get(this.$props.variantid);///use the set one.
                    }
                    this.add_images_to_dictionary({images: this.CurrentProduct.images});
                }
		    },
            getShopifyImageURL(img, imgSize = this.$props.imagesize) {
                if (img){
                    return ShopifyImgURL(img.src, imgSize);
                } else {
                    return false;
                }
            }
		}
	}
</script>

<style lang="scss" type="text/scss" >

	.ProductCard img{
		max-width: 100%;
	}
</style>