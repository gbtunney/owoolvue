<template>
		<div class="product-single product-wrapper">
			<div>
				<h2 class="product-single__title" itemprop="name"></h2>
				NEW PRODUCT SELECTORR

				{{imagelookup}}
				<Multiselect v-model="SelectedProduct"
				             :options="products" label="title"
				             track-by="title"
				             @input="productChanged"
				             :show-labels="false"
				             placeholder="Pick a value"></Multiselect>

				<Multiselect v-model="SelectedVariant"
				             :options="variants" label="title"
				             track-by="title"
				             @input="variantChanged"
				             :multiple="true"
				             :show-labels="false"
				             placeholder="Pick a value"></Multiselect>




				<button @click="dumpData">DUMP DATA FOR KIT</button>
				<pre class="language-json"><code>{{ SelectedVariant  }}</code></pre>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {mapState, mapActions, mapGetters} from "vuex"
    import axios from 'axios'

    import Multiselect from 'vue-multiselect'
  //  import Multiselect from '@/components/utilities/gMultiselectList.vue'
    import {Slugify, setQueryStringParameter, GDatamapper} from '@/gUtilities/main.js'

    export default {
        name: 'Product',
        components: {
            Multiselect
        }, props: {
            imagelookup:{
                default: 'notset'
            },
            productid: {
                required: true,
            },
            variantid: {
                required: false,
            },
        },

        data() {
            return {
                products: [],
                _selectedProduct: false,
                _variantDictionary: false,
                _selectedVariant: false,
                value: '',
                variants: []

            }
        },
        created: function() {
            let self = this;
            /*this.getProduct({params: {id: this.$props.productid}}).then(function(res) {
                self.Product = res.data.product;
                self.$data._variantDictionary = GDatamapper.parseToDictionary(self.Product.variants, "id");
                self.Variants = self.Product.variants;
                self.SelectedVariant = self.$data._variantDictionary.get(self.$props.variantid);
   this.getVariantDefaultImage(  {params: {productid:this.Variant.product_id, imageid:this.Variant.image_id}}).
            });
*/
       this.getProducts({params: {producttype: 'yarns' }}).then(function(res){
              self.Products = res.data.products;
         });



        },
        mounted: function() {

        },
        computed: {
            Products: {
                get: function() {
                    return this.$data.products;
                },
                set: function(newVal) {
                    this.$data.products = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            Product: {
                get: function() {
                    return this.$data._product;
                },
                set: function(newVal) {
                    this.$data._product = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            SelectedProduct: {
                get: function() {
                    return this.$data._selectedProduct;
                },
                set: function(newVal) {
                    this.$data._selectedProduct = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            SelectedVariant: {
                get: function() {
                    return this.$data._selectedVariant;
                },
                set: function(newVal) {
                    this.$data._selectedVariant = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            }, Variants: {
                get: function() {
                    return this.$data.variants;
                },
                set: function(newVal) {
                    this.$data.variants = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            }
        },

        methods: {
            ...mapActions([
                'getProduct','getProducts',
                'getVariant'
                // ...
            ]),

	    productChanged: function() {
                this.Variants = this.SelectedProduct.variants;

        },dumpData:function(){
            console.log("dumping!!!!!!", this.SelectedVariant);


            var dump = this.SelectedVariant.map(
                function(item){
return { quantity:1,
	id: item.id,
	message:"Color Way:"
}

                }
            )
            console.log("dumping!!!!!!", dump);


        },
            variantChanged: function(variant) {

            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">

</style>