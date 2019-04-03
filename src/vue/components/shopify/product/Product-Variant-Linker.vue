<template>
		<div class="product-single product-wrapper">
			<div>
				Variant selector
				<h2 class="product-single__title" itemprop="name">{{ CurrentProductTitle}}</h2>
				{{Variants}}
				<Multiselect v-model="SelectedVariant"
				             :options="Variants" label="title"
				             track-by="title"
				             @input="variantChanged"
				             :show-labels="false"
				             placeholder="Pick a value"></Multiselect>
				<pre v-show="false" class="language-json"><code>{{ value  }}</code></pre>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';

  //  import Multiselect from 'vue-multiselect'
    import Multiselect from '@/components/utilities/gMultiselectList.vue'
    import {ProductMixin} from  '@/mixins/productmixin.js';


    export default {
        name: 'ProductVariantLinker',
        components: {
            Multiselect
        }, props: {

        },
	    mixins: [ProductMixin],
	    data() {
            return {
                _product: false,
                _variantDictionary: false,
                _selectedVariant: false,
                value: '',
                variants: []

            }
        },
        created: function() {
			this.loadProduct();
			//this.loadProductMeta();
        },
        mounted: function() {
        	console.log("variamtid",this.NormalizedVariantID)
	        this.loadVariantMeta(this.NormalizedProductID, this.NormalizedVariantID);

        },
        computed: {
            SelectedVariant: {
                get: function() {
                    return this.$data._selectedVariant;
                },
                set: function(newVal) {
                    this.$data._selectedVariant = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            }, Variants: function(){
		        return Array.from(this.variant_dictionary.values());
	        }
        },

        methods: {
            variantChanged: function(variant) {
                var newurl =
                    window.location.protocol +
                    '//' +
                    window.location.host +
                    window.location.pathname +
                    '?variant=' +
                    variant.id;

                window.location = newurl;
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">
	@import "product-dependancies";

</style>