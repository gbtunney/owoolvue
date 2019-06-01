<template>
	<div> {{productid}}World!
		<h1 class="product-single__title" v-if="CurrentProductTitle" itemprop="name">
			{{CurrentProductTitle}}</h1>
		<h3 v-if="CurrentProductSubtitle">{{CurrentProductSubtitle}}</h3>

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

	module.exports = {
		name: '',
        mixins: [DictionaryMixin,ProductMixin,VariantMixin,ShopifyApiMixin],
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
		/*  if (this.product_dictionary &&  this.$props.productid ){
		      ///console.log("trying to get it", this.product_dictionary, this.product_dictionary.get(this.$props.productid))
//this.add_recently_viewed({product: this.$props.productid } )
          }

*/
		  /*    this.loadProducts().then(function(res){

                 // self.add_product_to_dictionary({products: res.data.products });

              });*/
		      //console.log("PRODUCT JSON!!!",JSON.parse(this.$props.product))
            console.log("CURRENT PRODUCT!!!!!!!!!!!",this.CurrentProduct);

		},
        watch: {
            ///todo: these miht need to be MIRRORED in a create func for some reason.
            product_dictionary: function(val) {

                console.log("&&&&&&&&&&&&&&&&&PRODUCT DICTIONARY UPDATED@@!!!!!!!!!!!",val , this.CurrentProduct);
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
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	p {
		font-size: 2em;
		text-align: center;
	}
</style>