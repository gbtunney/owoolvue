<template>
		<div class="product-single product-wrapper">
			<div>
				<h2 class="product-single__title" itemprop="name">{{ Product.title}}</h2>
				<Multiselect v-model="SelectedVariant"
				             :options="variants" label="title"
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
    import store from '@/store'
    import {mapState, mapActions, mapGetters} from "vuex"
    import axios from 'axios'


  //  import Multiselect from 'vue-multiselect'
    import Multiselect from '@/components/utilities/gMultiselectList.vue'
    import {Slugify, setQueryStringParameter, GDatamapper} from '@/gUtilities/main.js'

    export default {
        name: 'Product',
        components: {
            Multiselect
        }, props: {
            productid: {
                required: true,
            },
            variantid: {
                required: false,
            },
        },

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
            let self = this;
            this.getProduct({params: {id: this.$props.productid}}).then(function(res) {
                self.Product = res.data.product;
                self.$data._variantDictionary = GDatamapper.parseToDictionary(self.Product.variants, "id");
                self.Variants = self.Product.variants;
                self.SelectedVariant = self.$data._variantDictionary.get(self.$props.variantid);
            });
        },
        mounted: function() {

        },
        computed: {
            Product: {
                get: function() {
                    return this.$data._product;
                },
                set: function(newVal) {
                    this.$data._product = newVal;  ///this.Variants[this.CurrentVariant._index];
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
                'getProduct',
                'getVariant'
                // ...
            ]),
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