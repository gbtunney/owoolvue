<template>
<div>
	Catalog
	<code>{{ `${products.length} products fetched yet!` }}</code>
	<br>
	<br>
	<button @click="getProduct({ params: { id: 12 } })">get post with id 12</button>
	<br>

	<div >found {{FoundCount}}
		<li v-for="filter in Filters">
			<h5>{{ filter.name }}</h5>
			<Multiselect :multiple="true" @input="_applyFilter(filter)" label="slug" track-by="slug"  v-model="activeFilters" :options="filter.options"></Multiselect>
		</li>
		active filters: {{this.ActiveFilters}}
		<ul class="product-cards">
			<li v-for="product in productlist">
				{{ product.title }} tags: {{product.tags}}
			</li>
		</ul>



	</div>
</div>
</template>
<script type="text/javascript">
    import Vue from 'vue';
    import Multiselect from 'vue-multiselect'
    import store from '@/store'
    import {mapState, mapActions} from "vuex";

    const schema = require("schm");
    import {FILTERS} from "@/components/configjs.js";

    let self = this;

    export default {
        name: 'shopify-catalog',
        components: {
            Multiselect
        },
        props: {},
        computed: {

            ...mapState({
                products: state => state._products
            }),

            Filters: function() {
                return FILTERS();
            },
            FilteredProducts: {
                get: function() {
                    return this.$data.productlist;
                },
                set: function(newVal) {
                    console.log("xdttingggg:", newVal);
                    this.$data.productlist = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            FoundCount: function() {
                return this.$data.productlist.length
            },
            filteredProducts: function() {
                console.log("filters:", FILTERS());
                return this.products.filter(function(product) {
                    if (product.tags.includes('pdf-download')){
                        return true;
                    } else {
                        return false;
                    }
                })
            },
            ActiveFilters: function() {
                return this.$data.activeFilters;
            }
        }
        ,
        mounted: function() {

            //parse products..
            const PRODUCT_SCHEMA = schema(
                {
                    productid: {type: String},
                    variantid: {type: String, default: false},
                    products: {type: Array, required: true},
                });

            let payload = PRODUCT_SCHEMA.parse(this.$props);
	let self = this;
            this.getProducts().then(function(res) {
            self.FilteredProducts = self.products;

        });




        },
        methods: {
            ...mapActions([
                "getProduct",
                "getProducts",
            ]),
            _applyFilter: function(filter) {
                if (this.$data.activeFilters.length > 0){
                    let self = this;
                    let reducedProductList = this.products;

                    console.log("count !!!:", reducedProductList.length, filter);
                    self.$data.activeFilters.forEach(function(filter) {
                        console.log("operation  !!!:",filter, reducedProductList.length, filter);

                        if (filter.operation == "OR"){


                            reducedProductList = self.products.filter(function(product) {
                                if (product.tags.includes(filter.slug)){
                                    return true;
                                } else {
                                    return false;
                                }
                            })

                        }else{
                            reducedProductList = reducedProductList.filter(function(product) {
                                if (product.tags.includes(filter.slug)){
                                    return true;
                                } else {
                                    return false;
                                }
                            })

                        }

                    });
                    this.FilteredProducts = reducedProductList;
                    console.log("count after!!!:", reducedProductList.length, filter);
                }
            }

        },
        data: function() {
            return {
                activeFilters: [],
                productlist: []
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>

	.g-Button {
		background: yellow;
		&.active {
			background: green;
		}
	}
</style>
