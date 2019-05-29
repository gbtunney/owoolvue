<template>
	<div :class="$options.name" class="pending-items-component --productApp">
		<h4 v-show="false">TOTAL: {{  TotalAmount | toUSD }}</h4>
		<h3 v-show="false">availability test {{Availability}} disabled {{ Disabled }}</h3>
		<basecomponent  :text="AddToCartString" :flags="['addToCartPadding']"
		               v-show="!Disabled" scheme="dark-accent-primary"
		               @click="addMultipletoCart(PendingItems)" font="small-caps"
		               fontsize="lg"
		               :showpicker="false">
			<template slot="content" >
				<span style="font-weight: 500">
					Add To Cart
				</span>
				<span class="bullet-circle"></span>
				<span class="addToCartPrice">
					{{  TotalAmount | toUSD }}
				</span>
				<span>
					<iconcomponent icon_id="svg-icon-loadinganim" :flags="['--no-border','icon-transistion', (!Loading)? 'icon-loading-hidden' : '' ]" iconsize="relative--lg" :showpicker="false"></iconcomponent>
				</span>
			</template>
		</basecomponent>
		<span v-show="!availablity">Product Unavailble </span>
		<div v-show="metavisible" class="productMeta" >
			<h5 v-show="kit">Kit Includes: </h5>
			<ul>
				<li v-for="pendingItem in PendingItems">
						<PendingCartItem :local_variant_dictionary="LocalVariantDictionary" :item="pendingItem" :kit="kit" @available="updateAvailability" @variant_change="updateVariant" @requested_quantity_change="updateQuantity" ></PendingCartItem>
				</li>
			</ul>
		</div>
	</div>

</template>

<script>

	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
	const schema = require("schm");
	import {ShopifyApiMixin} from  '@/mixins/shopifyapimixin.js';
	import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';

	import {CartMixin} from  '@/mixins/cartmixin.js';
    import basecomponent from '@/components/utilities/g-base-component.vue';
	import iconcomponent from '@/components/utilities/g-icon-component.vue';

    import Toasted from 'vue-toasted';
    Vue.use(Toasted)

	const PromiseQueue = require("easy-promise-queue").default;

	import math from 'mathjs'

    import { isVariantAvailable} from '@/helpers/main.js'
    import PendingCartItem from '@/components/product/cart/PendingtItem.vue'

	const Numeral = require('numeral');

	///TODO  - figure out how to do this 4 reals.

	Vue.filter('toUSD', function(value) {
		return Numeral(value).format('$ 0,0[.]00');
	});

	module.exports = {
		name: 'PendingItemsComponent',
		mixins: [CartMixin,ShopifyApiMixin,DictionaryMixin],
		components: {iconcomponent,PendingCartItem,basecomponent},
		data: function() {
			return {
				_loading: false,
				_pendingItems: [],
				_isDisabled: false,
				availablity:true,
				_totalAmt:false,
				_local_variant_dictionary: false
			}
		},
		props: {
			metavisible: {
				type: Boolean,
				default: true
			},
			addtocartvariants: {
				default: () => []
			},
			label: {
				type: String,
				default: "Add to Cart"
			},
			disableunavailable: {
				type: Boolean,
				default: true
			},
			lineitemmessage: {   ///this is used to give the kit an id
				type: [Boolean,String],
				default: false
			},
		kit: {   ///this is used to give the kit an id
			type: [Boolean,Array],
			default: false
		}
		},
		mounted:function(){
			this.PendingItems =  this.parsePendingItemsSchema(this.$props.addtocartvariants);//this.parsePendingItems(this.$props.addtocartvariants)
			this.LocalVariantDictionary = this.variant_dictionary;

			console.log("**************MOUNTED",	this.PendingItems);

            this._initPendingItem();

			this.getCart().then(function(res){
			})
	},
	watch: {
			addtocartvariants: function(val) {

                console.log("**************WATCH",	this.PendingItems);

                this.PendingItems =   this.parsePendingItemsSchema(val);//this.parsePendingItems(this.$props.addtocartvariants)
                this._initPendingItem();

               // this.$data._pendingItemData = new Map();
				//this._addPendingItems();
              ///  let items = val;

				//this.$data._pendingItems = this.parsePendingItems(val)

               // this._retrieveItemData(this.$data._pendingItems);

              ///  this._retrieveItemData(val);

        }
	},
		computed: {
			...mapGetters([
				'Variants'
			]),
		Disabled:function(){
                if (this.$props.disableunavailable && !this.Availability){
                  return  true;
                }else{
                    return false;
                }
            return false;

            },
           /* Disabled: {
                get: function() {
                    return this.$data._isDisabled;
                },
                set: function(newVal) {
                    this.$data._isDisabled = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },*/
			Availability:function(){
                let self = this;

                if (this.PendingItems && this.PendingItems.length >= 1 &&  this.UnloadedDataItems.length == 0 ){

                    let isUnavailable = false;

                    this.PendingItems.forEach(function(item){
                        if ( item.variant_id && self.Variant(item.variant_id) ){

                            var _variant = self.Variant(item.variant_id);

                            if ( !isUnavailable && !isVariantAvailable(_variant,item.requested_quantity) ){
                                isUnavailable=true;
                            }
                        }

                    })

                    return !isUnavailable;
                }
				return false;
			},
            UnloadedDataItems:function(){
			    let self = this;
	            return this.PendingItems.filter(function(item){
                     //console.log("filtering item " ,item,self.LocalVariantDictionary.get(item.variant_id) )

                    if ( self.Variant(item.variant_id) ){
                        return false;
                    }else{
                        return true;
                    }
                })
            },
			AddToCartString:function(){
				return `Add To Cart * ${Numeral(this.TotalAmount ).format('$ 0,0[.]00')}`
			},
            TotalAmount: function() {
                let self = this;

                if (this.PendingItems && this.PendingItems.length >= 1 && this.UnloadedDataItems.length == 0){

                    let totalprice = 0;

                    this.PendingItems.forEach(function(item) {
                        if (self.Variant(item.variant_id))
                            var _variant = self.Variant(item.variant_id);
                        var newtotal = (item.requested_quantity * _variant.price);
                        totalprice += newtotal;
                    })

                    return totalprice;
                }
                return false
            },

				Loading: {
				get: function() {
					return this.$data._loading;
				},
				set: function(newVal) {
					this.$data._loading = newVal;  ///this.Variants[this.CurrentVariant._index];
				}
			}, PendingItemData:function(){
				return Array.from(this.$data._pendingItemData.values());
			},
            LocalVariantDictionary: {
                get: function() {
                    if (!this.$data._local_variant_dictionary){
                        this.$data._local_variant_dictionary = new Map(this.variant_dictionary);
                    }
                    return this.$data._local_variant_dictionary;
                },
                set: function(newVal) {
                    let self = this;

                    if (typeof newVal == "map"){
                        self.$data._local_variant_dictionary = new Map([newVal, self.$data._local_variant_dictionary]);
                    } else if (typeof newVal == "object" && newVal.length >= 1){
                        console.log("ADDING TO VARIANT DICTIONARY", newVal)

                        newVal.forEach(function(variant) {
                            self.$data._local_variant_dictionary = new Map(self.$data._local_variant_dictionary).set(variant.id, variant);
                        })
                        self.$data._local_variant_dictionary = new Map(self.$data._local_variant_dictionary);
                    }
                }
            },
			PendingItems: {
				get: function() {
					return this.$data._pendingItems;
				},
				set: function(newVal) {
				    this.$data._pendingItems = newVal;
				}
			},
            PendingItemsMap: function(){
			    return new Map(this.$data._pendingItems.map(function(item){
			        return [ item.item_id, item];
			    }))
            }
		},
		methods: {
            Variant:function(variant_id ){
                if ( this.LocalVariantDictionary && variant_id && this.LocalVariantDictionary.get(variant_id) ){
                    return this.LocalVariantDictionary.get(variant_id);
                }else{
                    return false;
                }
            },
		    //NEW
            _initPendingItem: function() {
                let self = this;
                console.log("CHECK DATA", this.UnloadedDataItems)

                Promise.all([...this.UnloadedDataItems.map(function(item) {
                    return self.getVariant({params: {id: item.variant_id}})

                })]).then(function(values) {

                    var myset = new Set(values.map(function(res) {
                            return res.data.variant.product_id;
                        })
                    )
                    Array.from(myset.values()).map(function(product_id) {
                        self.getProduct({params: {id: product_id}}).then(function(product_res) {


                            self.add_product_to_dictionary({product: product_res.data.product});
                            self.add_images_to_dictionary({images: product_res.data.product.images});
                            self.LocalVariantDictionary = Array.from(product_res.data.product.variants);
                            console.log("************ADDING PRODUCT TO DICTIONARYS",product_res.data.product.variants)

                        })
                    })
                })
            },
            transformCartItemArray:function(pendingItems , lineItemMessage =false){
				///transform the pending item array for ajax cart.

				///TODO THIS IS SOME DUMB BULLSHITTTTTT
				return pendingItems.map(function(item) {


                    let line_props = {};

                    if (lineItemMessage){
                    line_props = Object.assign(line_props, {message: lineItemMessage} );
                    }

                    if (item.message){
                        line_props = Object.assign(line_props ,{message2: item.message } );
                    }

					const ITEM_SCHEMA = schema(
						{
							id: {type: Number, required: true, default:  item.variant_id},
							quantity: {type: Number, default: item.requested_quantity },
							properties: {type: Number, default: line_props},
						});

					const data = ITEM_SCHEMA.parse(item);
					const params = {}
					return {params, data};
				});
			} ,
			addMultipletoCart: function(_pendingItems) {

				let pendingItems  = this.transformCartItemArray(_pendingItems, this.$props.lineitemmessage)

				let self = this;
				let pq = new PromiseQueue({concurrency: 1});

				this.Loading = this.isDisabled = true;

				pq.add([() => {
					return new Promise(function(resolve, reject) {
						setTimeout(function() {
							resolve();
						}, 1000)
					});
				}, ...pendingItems.map(function(item) {
						return () => {
							return self.addItem(item);
						}}), () => {
						return new Promise(function(resolve, reject) {
							setTimeout(function() {
                                self.Loading = self.isDisabled = false;
                                self.getCart().then(function(res){
                                    $('.js-drawer-open-button').click()
                                })

                                resolve();
							}, 5)
						});
					}])
			},
			updateQuantity:function(item,value ){

				//getTotalAmount
				//this.updateTotal();


				var itemsMap= this.PendingItemsMap;

				if ( item && item.item_id ){

				    var newItem = Object.assign(item, {requested_quantity: value })

					if ( itemsMap.get(item.item_id) ){

                        itemsMap.set(item.item_id,newItem)
					}

				this.PendingItems = Array.from(itemsMap.values());

                    console.log("updateQuantity,TRYING TO REMOVE@!~!",value,newItem,itemsMap);

                }

			},
			updateVariant:function(item,variant){

                var itemsMap= this.PendingItemsMap;

                if ( item && item.item_id ){

                    var newItem = Object.assign(item, {variant_id: variant.id })

                    if ( itemsMap.get(item.item_id) ){

                        itemsMap.set(item.item_id,newItem)
                    }

                    this.PendingItems = Array.from(itemsMap.values());

                    console.log("updatevariant,TRYING TO REMOVE@!~!",value,newItem,itemsMap);

                }

                /*



								//this.$emit('variant_change', item, variant );


				*/

			},

			updateAvailability: function(bool) {

         /*       //isVariantAvailable(foundVariantArr[0])
				//todo: make some way of doing alternate number here.
				let self = this;

				this.$data.availablity= bool;

				if (this.$props.disableunavailable){
				//	this.isDisabled = !bool;
				}*/
			},
			parsePendingItemsSchema:function(itemArr){

				if ( itemArr && itemArr.length > 0 ){
					return itemArr.map(function(item) {

						const PENDING_ITEM_SCHEMA = schema(
							{
                                variant_id: {type: Number, required: true},
								item_id : Math.round(math.random(11111111111, 999999999999999)),
								message: {type: String},
								requested_quantity: {type: Number, required: true, default: 1},
								quantity_editable: {type:Boolean, default:false},
                                editable_variant: {type:Boolean, default:false}
							}
						);
						return PENDING_ITEM_SCHEMA.parse(item);
					});
				}else{
					return [];
				}

			},
			getTotalAmount:function(){

				if ( this.PendingItems ){

					let totalprice = 0;

					this.PendingItems.forEach(function(item){

						var newtotal =  (item.requested_quantity * item.variant.price);

						totalprice +=   newtotal;
					})

					return totalprice;

				}else{
					return false;
				}
			}
		}
	}
</script>


<style lang="scss" type="text/scss" >


	.productMeta{
		width: 100%;
		//todo: change this;
	}

	$GENERATE-QUEUE: false;

	@import "src/vue/helpers/product-dependancies.scss";

	.addToCartPadding{
		padding: .5em 2em;
		@include breakpoint-range(sm,"<="){
			padding: .5em 1em;

		}
	}

	.icon-loading-hidden{
		width: .2em;
	}
	.icon-transistion{
		@include u-transition(all,.5s);
	}

	.bullet-circle{
		width: 4px;
		height: 4px;

		margin: 0 4px;

		@include g-color-scheme(light,(background:true,foreground:false));
		border-radius: 100%;
	}
	.addToCartPrice {
		@include g-typeset(md,font-small-caps);
	}


</style>
