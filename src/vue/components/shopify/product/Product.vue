<template>
		<div class="product-single product-wrapper">


			<div>

				<ProductImages :images="Images"></ProductImages>
			</div>
			<div>
				<v-text-field
					label="Search colors"
					append-outer-icon="search"
				></v-text-field>
				<v-btn-toggle  @change="testBtn" v-model="toggle_exclusive">
					<v-btn flat>
						<v-icon>format_align_left</v-icon>
					</v-btn>
					<v-btn flat>
						<v-icon>format_align_center</v-icon>
					</v-btn>
					<v-btn flat>
						<v-icon>format_align_right</v-icon>
					</v-btn>
					<v-btn flat>
						<v-icon>format_align_justify</v-icon>
					</v-btn>
				</v-btn-toggle>

				<h1 class="product-single__title" itemprop="name">{{CurrentProduct.title}}</h1>
				<h2>{{this.CurrentVariant.price}}</h2>
cart: {{this.Cart.item_count}}
				<productOptionSelect class="--is-grid-2" :variants="Variants"  :selectedVariant="CurrentVariant" v-on:variant="variantChanged"></productOptionSelect>
				<div class="add-to-cart-section">
					<div class="quantity-selector">
						<vue-numeric-input class="quantity-selector__input"  v-model="selectedQuantity" :min="1" :max="QuantityMax" :step="1"></vue-numeric-input>
						<h6 class="quantity-selector__available">available: {{QuantityMax}}</h6>
					</div>
					<button @click="addToCart" class="c-button c-button--dark-accent-primary">
						Add to cart
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import productOptionSelect from '@/components/shopify/product/ProductOptionSelector.vue'
    import ProductImages from '@/components/shopify/product/ProductImages.vue'
    import store from '@/store'
    import {mapState, mapActions} from "vuex";

    const schema = require("schm");
    import {Slugify, ShopifyImgURL,setQueryStringParameter, GDatamapper} from '@/gUtilities/main.js'
    import {mapGetters} from 'vuex'
    import VueNumericInput from 'vue-numeric-input';
    import axios from 'axios';
    import 'vuetify/dist/vuetify.min.css'


    import Vuetify from 'vuetify'
    import 'vuetify/dist/vuetify.min.css'

    Vue.use(Vuetify, {
        theme: {
            primary: '#ee44aa',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107'
        },
        iconfont: 'md',
    })


    export default {
        name: 'Product',
        components: {
            productOptionSelect,
            ProductImages,
            VueNumericInput
        }, props: {
            producthandle: {
                type: String,
                default: 'not set'
            },
            productid: Number,
            currentproduct: Object,
            products: Array,
            variantid: {
                required: false,
            },
            currentvariant: Object,
        },

        data() {
            return {
                productDictionary: false,
                selectedQuantity: 1,
                selectedVariant: false,
            }
        },
        created: function() {
            const PRODUCT_SCHEMA = schema(
                {
                    productid: {type: String},
                    variantid: {type: String, default: false},
                    products: {type: Array, required: true},
                });

            let payload = PRODUCT_SCHEMA.parse(this.$props);

            let urlArray = [] // unknown # of urls (1 or more)

            this.getProduct({params: {id: this.productid}}).then(function(res) {
                payload = Object.assign(payload);
                payload.products = [res.data.product]
                store.dispatch('SHOPIFY_DATA_INIT', payload).then(function(res) {
                    if (payload.productid){
                        store.dispatch('SET_CURRENT_PRODUCT', payload).then(function(res) {
                            store.dispatch('SET_CURRENT_VARIANT', payload);


                        });
                    }
                })
            })

            this.getCart();
        },
        mounted: function() {


        },
        computed: {
            QuantityMax: function() {
                //return 22;
                if (!this.CurrentVariant){
                    return 1;
                } else {
                    if (this.$data.selectedQuantity > this.CurrentVariant.inventory_quantity){
                        this.$data.selectedQuantity = this.CurrentVariant.inventory_quantity;
                    }
                    return this.CurrentVariant.inventory_quantity;
                }
            },
            ...mapGetters([
                'VariantDictionary',
                'Variants',
                'Options',
                'OptionsDictionary',
                'CurrentProduct',
                'CurrentVariant',
                'Images',
                'Cart',
            'ImagesDictionary'
                // ...
            ])

        },

        methods: {

            ...mapActions([
                'getProduct',
                'getVariant',
                'getProducts',
                'getCart',
                'getProductMeta',
                'addItem'
                // ...
            ]),
            variantChanged: function(variant) {
                let self = this;
                if (variant != undefined){

                    if (variant.length > 1){

                        var newArr = variant.map(function(item) {

                            const params = {id: 42}
                            const data = {
                                quantity: 1, id: item.id,
                                properties: {
                                    'childproduct': true,
                                    'notes': "as part of xxxx kit",
                                    'editable': false
                                }
                            }

                            return {params, data};
                        });
                        newArr.forEach(function(item) {

                            self.addItem(item);
                        });
                        //  this.addMultipletoCart(newArr);
                    } else {
                        store.dispatch('SET_CURRENT_VARIANT', {selectedVariant: variant});
                        //setQueryStringParameter("variant", variant.id);
                        var newurl =
                            window.location.protocol +
                            '//' +
                            window.location.host +
                            window.location.pathname +
                            '?variant=' +
                            variant.id;
                        window.history.replaceState({path: newurl}, '', newurl);
                    }
                }
            },
            addMultipletoCart: function(_promiseArr) {

                const data = {quantity: this.$data.selectedQuantity, id: this.CurrentVariant.id}
                const params = {id: 42}

                let self = this;

                this.addItem({params, data}).then(function(res) {
                    self.getCart();
                });

                let promiseArray = _promiseArr;// urlArray.map(url => axios.get(url)); // or whatever
                axios.all(promiseArray)
                .then(function(results) {
                    console.log(results);
                });
            },
            addToCart: function(_promiseArr) {

                const data = {quantity: this.$data.selectedQuantity, id: this.CurrentVariant.id}
                const params = {}

                let self = this;

                this.addItem({params, data}).then(function(res) {
                    self.getCart();
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">
	@import "product-dependancies";

	.multiselect__tags {

	}

	.add-to-cart-section {
		display: flex;
	}

	.product-wrapper {
		@include breakpoint-range(md, ">=") {
			display: grid;
			grid-template-columns: 50% 1fr;
		}
	}

	.quantity-selector {
		display: flex;
		align-items: center;
		height: 100%;
		&____available {
			margin-left: 20px;
		}
		&__input {

		}
	}

	///BLOCK LAYOUT INSTEAD

	.c-input-group__icon {
		display: none;

		.is-open & {
			display: block;
		}
	}

	.attribute-size {
		.option__swatch {
			display: none;
		}
	}


	.multiselect__content-wrapper{
		border: 0px solid red!important;
	}
	.--is-open {

		.attribute-color {
			.option__swatch {
				display: block;
			}
			.multiselect__content {
				@include breakpoint-range(md, ">=") {
					display: grid !important;
					grid-template-columns: repeat(2, auto);
				}
			}
		}

		@include breakpoint-range(md, ">=") {
			.multiselect__content-wrapper {
				//border: 1px solid red;
				display: block !important;
				max-height: none !important;
				height: 100%;
				position: relative;
			}
			.multiselect__select {
				display: none;

			}
			.multiselect__option--highlight:after, .multiselect__option--selected:after, .multiselect__option--selected.multiselect__option--highlight:after {
				content: " ";

				background: none;
			}
		}
	}

	.--is-grid-2 {

	}

	.multiselect {
		.option__swatch {
			//	display: none
		}
		&.color {

		}
	}

	.multiselect__option--selected.multiselect__option--highlight{
		background: none!important;
	}

	.multiselect__option {
		display: flex;
		align-items: center;
		//background:none!important;

		$props: (foreground:true,
			background:true,
			accent:false,
			border:false,
			hover-foreground: color(light, foreground),
			hover-background: darken(color(light, background), 2%));
		@include g-color-scheme(light, $props...);
		.option__desc {
			padding-left: get-spacing();
			@include set-type(sm, font-small-caps);

		}

		&--selected {

			$props: (foreground:true,
				background:true,
				accent:false,
				border:true,
				hover-background: darken(color(light, background), 2%),
			);
			@include g-color-scheme(light, $props...);
		}
	}

	.option__name {
		@include set-type(base);
	}

	.multiselect__tags {

	}



	.optionbutton {
	}

	.option__swatch {
		border: 1px solid black;
		height: 100%;
		width: 100%
	}
</style>