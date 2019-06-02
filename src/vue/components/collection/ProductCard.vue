<template>
	<div> {{productid}}World!
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
			      :content="CurrentVariantPrice">{{ CurrentVariantPrice }}
							</span>
		</div>
	</div>
</template>

<script>

	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'

    import {ProductMixin} from  '@/mixins/productmixin.js';
    import {VariantMixin} from  '@/mixins/variantmixin.js';
    import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';
    import {ShopifyApiMixin} from  '@/mixins/shopifyapimixin.js';
    import {LocalVariantDictionaryMixin} from  '@/mixins/localVariantDictionaryMixin.js';

	module.exports = {
		name: '',
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
                }
		    }
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	p {
		font-size: 2em;
		text-align: center;
	}
</style>