<template>
		<div class="product-single product-wrapper">

			<div>

			</div>
			<div>
				<h2 class="product-single__title" itemprop="name">{{ Product.title}}</h2>
			vriant:
				<multiselect v-model="SelectedVariant" :options="variants" label="title"

				             track-by="title" @input="variantChanged" :searchable="false" :close-on-select="false" :show-labels="false" placeholder="Pick a value"></multiselect>
				<pre class="language-json"><code>{{ value  }}</code></pre>


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
    import Multiselect from 'vue-multiselect'

    const schema = require("schm");
    import {Slugify, setQueryStringParameter, GDatamapper} from '@/gUtilities/main.js'
    import {mapGetters} from 'vuex'
    import VueNumericInput from 'vue-numeric-input';
    import axios from 'axios';

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
	            _variantDictionary:false,
	            _selectedVariant:false,
                value: '',
                variants:[]

            }
        },
        created: function() {


            //this.Product= PRODUCT_SCHEMA.parse(this.$props);

	        let self = this;
            this.getProduct({params: {id: this.$props.productid}}).then(function(res) {

                self.Product=res.data.product;

                self.$data._variantDictionary = GDatamapper.parseToDictionary(	self.Product.variants , "id");
                self.Variants = self.Product.variants;
                self.SelectedVariant = self.$data._variantDictionary.get(self.$props.variantid);
                //self.$data._variantDictionary.get('22449391304822')
                console.log("variant dict ", self.$data._variantDictionary,self.$data._variantDictionary.values() ); // GDatamapper.parseToDictionary(	self.Product.variants , "id"))
                //= GDatamapper.parseToDictionary(	parsedVariants , "id");
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
            },Variants: {
                get: function() {
                    return this.$data.variants;
                },
                set: function(newVal) {
                    this.$data.variants = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            }

          /*  ...mapGetters([
                'VariantDictionary',
                'Variants',
                'Options',
                'OptionsDictionary',
                'CurrentProduct',
                'CurrentVariant',
                'Images',
                'Cart'
                // ...
            ])*/
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

                window.location =newurl;


                //window.history.replaceState({path: newurl}, '', newurl);

            },
                    }
    }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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
				border: 1px solid red;
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

	.multiselect__option--selected {
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

	.multiselect__input {
		@include c-input(false, dark font-serif lg sm);
		border-radius: 0;
	}

	.optionbutton {
	}

	.option__swatch {
		border: 1px solid black;
		height: 100%;
		width: 100%
	}
</style>