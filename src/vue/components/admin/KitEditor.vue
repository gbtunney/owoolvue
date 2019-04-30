<template>
	<div>

		<Multiselect :options="$data._products"
		             v-model="$data._selectedProduct"
		             @input="productChanged($data._selectedProduct)"

		             track-by="title"
		             label="title"
		             class="multiselectmaster"
		             :taggable="false"
		             :multiple="false"
		             :closeOnSelect="true"
		             placeholder="Select one"
		             :searchable="true"
		             :allow-empty="false">
		</Multiselect>

		<p v-if="$data._selectedProduct">{{$data._selectedProduct.tags}}</p>


		<Multiselect :options="$data._variants"
		             v-model="$data._selectedVariant"
		             @input="productChanged"

		             track-by="title"
		             label="title"
		             class="multiselectmaster"
		             :taggable="false"
		             :multiple="true"
		             :closeOnSelect="true"
		             placeholder="Select one"
		             :searchable="true"
		             :allow-empty="false">
		</Multiselect>

<h2>KIT</h2>

		<ul>
			<li v-for="item in $data._selectedVariant">
				<ul>
					<li>Title: {{item.title}}
						<span>
							<vue-numeric-input class="quantity-selector__input" v-model="item.requested_quantity" :min="1" :max="item.inventory_quantity" :step="1"></vue-numeric-input>
						</span>
						<input type="text" v-model="item.message">
					</li>
				</ul>
			</li>
		</ul>

		<code>{{convertedVariants}}</code>
		<basecomponent text="DUMP Kit META>>> " :flags="['--icon-right','test']" scheme="light"
		              @click="remapVariants" font="san-serif"
		               padding="md"></basecomponent>


		<FuseSearch
			class="fuseSearchComponent"

			@fuseResult="fuseFilter"
			@fuseInactive="fuseInactive"
			:keys='["tags","title"]'
			:list="FilteredProducts">
		</FuseSearch>
		<ul>
		<li v-for="product in FilteredProducts">{{product.title}}{{product.tags}}</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
    import {ProductMixin} from  '@/mixins/productmixin.js';
    import {VariantMixin} from  '@/mixins/variantmixin.js';
    import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';
    import {ShopifyApiMixin} from  '@/mixins/shopifyapimixin.js';


    import basecomponent from '@/components/utilities/g-base-component.vue';

    import FuseSearch from '@/components/utilities/g-Fuse-Search.vue';


    import Multiselect from 'vue-multiselect'

    import { getVariantFromOptions,isVariantAvailable,updateHistory} from '@/helpers/main.js'

    import Vue from 'vue';
    import VueNumericInput from 'vue-numeric-input';

    import adminOptionSelect from '@/components/admin/ProductOptionTestComponent.vue';
    /*		<singleProductOptionPicker searchable="true" :selectedoptionslug="Slug" @optionChanged="optionChanged" :option="OptionByProp('color')"></singleProductOptionPicker>
	*/
    //custom version of vuemultiselect - stripped down.
    //  import Multiselect from '@/components/utilities/gMultiselectList.vue'
    //  import Multiselect from '@/components/utilities/gMultiselectList.vue'

    const schema = require("schm");

    //  ProductMixin
    export default {
        props: {

        },
        mixins: [DictionaryMixin,ProductMixin,VariantMixin,ShopifyApiMixin],
        components: {FuseSearch,basecomponent,VueNumericInput,Multiselect},
        data() {
            return {
               _products: [],
	            _variants:[],
	            _selectedProduct: false,
	            _selectedVariant: false,
                _pendingItems:  "Hello there",// [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
                loading: false,
                convertedVariants:[],
	            _filteredProductValues:false,
            }
        },
        name: 'testcomponent',
        computed: {
            ...mapGetters([
                    'LayoutToggle',
                    'OptionByProp',
                    'OptionValueByProp',
                    'OptionsArrByProduct',
                    'OptionsByProduct'
                ]
            ),

            ...mapState({shop: state => state._shop
            })
            ,
            FilteredProducts: {
                get: function() {
                    if (!this.$data._filteredProductValues){
                        return this.$data._products;
                    }else{
                        return this.$data._filteredProductValues;
                    }
                },
                set: function(newVal) {
                    this.$data._filteredProductValues =newVal; //	this._mapDisabledOptions(newVal,this.$props.disabledOptions);
                }
            },

            TestKit: function(){
                [  {"quantity": 3, "message":"this is a color way ","id": "18250174595190"} , {"quantity": 4, "id": "18250174627958"} ]
            },
            Slug:function(){
                return "wild-geranium"
            },
            VariantArr: function() {
                return this.Variants; //this._mapDisabledVariants(this.Variants, [] /*this._getVariantFromOptions( [value.id], this.Variants)*/);
            },
            Layout:function(){
                return this.$data.toggle_classes[this.LayoutToggle];
            },
            SelectedOptions:function(){
                return this.$data.toggle_classes[this.LayoutToggle];
            },
            IsOnSale :function(){

                if (  this.$data._currentVariant   ){

                    if (this.$data._currentVariant.compare_at_price  == null) return false;
                    if (  this.$data._currentVariant.compare_at_price  >  this.$data._currentVariant.price  ){
                        return true;
                    }

                }
                return false;
            }
        },
        created:function(){

            this.$data.loading=true;
            let self = this;


            this.loadProducts().then(function(res){
                console.log("DAATAA", res.data.products)
                self.$data._products= res.data.products;

                self.add_product_to_dictionary({products: res.data.products });


            });
        },
        mounted:function(){
            //  this.loadVariantMeta(this.NormalizedProductID, this.NormalizedVariantID)
        },
        methods:{
            ...mapMutations(['setlayoutButton']),
            testBtn:function(target){
                console.log("changed",target);
                this.setlayoutButton({index: target})
            },
            fuseFilter: function(result, query, list, fuse_options) {
                console.log("FUSE FILTERED OPTION" , result,query,list, fuse_options);
                this.FilteredProducts = result;
            },
            fuseInactive:function( list, fuse_options){
                console.log("FUSE INACTIVEEE!!!" ,list, fuse_options);
                this.FilteredProducts = this.$data._products;
            },
            remapVariants:function(){

               this.$data.convertedVariants  = this.$data._selectedVariant.map(function(variant) {

					   	return { id:variant.id,
					    title: variant.title,
						    requested_quantity: variant.requested_quantity,
						    message: variant.message
					    }

				   })
            },
            productChanged: function(product) {
                console.log("producr changed!!!!!",product,this.product_dictionary.get(product.id))

				var variantArr =  this.product_dictionary.get(product.id).variants;
                this.$data._variants = variantArr.map(function(variant){
                    return Object.assign(variant, {requested_quantity: 1, message: "colorway 1"});
                })


            },
            optionChanged: function(requestedVariant,option_dictionary) {

                console.log("!!master option changed!!!!!",this.CurrentVariant,requestedVariant,option_dictionary);
                this.variantChanged(requestedVariant);
            },
            _getVariantFromOptions: function( optionArray, variantsArr ) {   //move to a mixin.
                return   getVariantFromOptions(optionArray, variantsArr);
            },
            setVariantsDisabled:function(variantsArr){
                if (newFilteredArray.length < 1){
                    Vue.set(option, '$isDisabled', true);
                } else {
                    Vue.set(option, '$isDisabled', false);
                }
            },
            _mapDisabledVariants:function(variantsArr,flaggedVariants,bool=true){   ///TODO: remap oos too seperate out

                var newVariantArr =Array.from(variantsArr);
                let _flaggedVariants =flaggedVariants;

                newVariantArr=     newVariantArr.map(function(variant){
                    let ID = variant.id;
                    if ( _flaggedVariants.length > 0 ){
                        var result =  _flaggedVariants.find(function(item){
                            return  (ID == item.id )? true : false;
                        })
                    }
                    return  (  result || !isVariantAvailable(variant)  ) ? Object.assign(variant, {$isDisabled :bool }) :  Object.assign(variant, {$isDisabled :!bool  });
                })
                return newVariantArr;
            }
        },
    };
</script>


<style lang="scss" type="text/scss" >

	@import "src/vue/helpers/product-dependancies.scss";

	.product-app-loading{
		//	@include c-button( false,  dark-accent-primary     font-small-caps md lg , color-schemes typography font-size base-padding ) ;
		//background: red;
		$props: (
			background: true,
			foreground: true,
			border: false,
			fill:foreground,
			hover-background:rgba(color(accent-default, background), .7),
			hover-foreground:rgba(color(accent-default, foreground), .7)
		);
		@include g-color-scheme(accent-default, $props);
		@include u-icon-svg(false, 10%);
		margin:0 auto;
		svg rect{
			//fill: red;
		}
	}
	.divider{
		@include u-leader-padding(lg);
		@include u-trailer-padding(md);
		font-size: 12px;
		width: 99%;
		margin: 0 auto;
		opacity: .5;
		//@include rhythm-margin(md);
	}
	.multiselectmaster{
		span.multiselect__option{
			//background: red!important;

		}
		.multiselect__element{
			//background: red;



		}



	}
</style>