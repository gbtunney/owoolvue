<template>
	<div class="pending-items-component --productApp">

		<h4>TOTAL: {{  TotalAmount}}</h4>
		<h3 >availability test {{Availability}} disabled {{ Disabled }}</h3>
		<basecomponent  :text="AddToCartString" :flags="IconClasses"
		               v-show="!Disabled" scheme="dark-accent-primary"
		               @click="addMultipletoCart(PendingItems)" font="small-caps"
		               fontsize="md"
		               :showpicker="false" padding="md">
			<template slot="right-icon" class="is-grid-2" >
				<iconcomponent icon_id="svg-icon-loadinganim" :flags="['--no-border']"  scheme="light" :showpicker="true"></iconcomponent>
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
		name: '',
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
				default: false
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
//this._addPendingItems();

			///this._retrieveItemData(this.$data._pendingItems);

			//this.updateTotal();

			this.LocalVariantDictionary = this.variant_dictionary;


            this._initPendingItem();

			this.getCart().then(function(res){
			})
	},
	watch: {
			addtocartvariants: function(val) {


                this.PendingItems =   this.parsePendingItemsSchema(val);//this.parsePendingItems(this.$props.addtocartvariants)
                this._initPendingItem();

               // this.$data._pendingItemData = new Map();
				//this._addPendingItems();
              ///  let items = val;

				//this.$data._pendingItems = this.parsePendingItems(val)

               // this._retrieveItemData(this.$data._pendingItems);

              ///  this._retrieveItemData(val);





                //this.updateTotal();
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

                    //console.log("TOTAL AMT ")
                    let isUnavailable = false;

                    this.PendingItems.forEach(function(item){

                        if ( self.Variant(item.variant_id) ){

                            var _variant = self.LocalVariantDictionary.get(item.variant_id);

                            if ( !isUnavailable && !isVariantAvailable(_variant,1) ){
                                isUnavailable=true;
                            }
                        }

                    })

                    return !isUnavailable;


                }else{
                    return false;
                }
			    //inventory_count

              //  isVariantAvailable

			},
            UnloadedDataItems:function(){
			    let self = this;
	            return this.PendingItems.filter(function(item){
                     console.log("filtering item " ,item,self.LocalVariantDictionary.get(item.variant_id) )
                    // return true;

                    if ( self.LocalVariantDictionary && item.variant_id && self.LocalVariantDictionary.get(item.variant_id) ){
                        return false;
                    }else{
                        return true;

                    }

                })
            },
			AddToCartString:function(){
				return `Add To Cart * ${Numeral(this.$data._totalAmt).format('$ 0,0[.]00')}`
			},
			IconClasses:function(){

			    if ( this.Loading ){
                    return  ['--icon-right','test']
                }else{
                    return  ['test']
                }
			},
            TotalAmount:function(){

			    let self = this;
			    if (this.PendingItems && this.PendingItems.length >= 1 &&  this.UnloadedDataItems.length == 0 ){

			        //console.log("TOTAL AMT ")
                        let totalprice = 0;

                        this.PendingItems.forEach(function(item){

                            if ( item.variant_id && self.LocalVariantDictionary && self.LocalVariantDictionary.get(item.variant_id)  )
                            var _variant = self.LocalVariantDictionary.get(item.variant_id);

                            var newtotal =  (item.requested_quantity * _variant.price);

                            totalprice +=   newtotal;
                        })

                        return totalprice;


			    }else{
                return false;
    }
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

                    if ( !this.$data._local_variant_dictionary ){
                        this.$data._local_variant_dictionary= new Map(this.variant_dictionary);
                    }
                    return this.$data._local_variant_dictionary;
                },
                set: function(newVal) {
                    let self = this;


                    if ( typeof newVal == "map" ){

                        self.$data._local_variant_dictionary = new Map(newVal);
                    }else if ( typeof newVal == "object" && newVal.length >1 ){
                        console.log("Appending new",newVal, typeof newVal);

                        newVal.forEach(function(variant){
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


                    //self.$data._pendingItemData = new Map( self.$data._pendingItemData).set(myObj.item_id, self.addVarianttoPendingItem(item, variantData));



                    this.$data._pendingItems = newVal;

					///this.$data._pendingItems = newVal;  ///this.Variants[this.CurrentVariant._index];
				}
			},
			ItemCount: function() {
				let total = 0;

				this.$data._pendingItems.forEach(function(item) {
					total += item.requested_quantity;
				})
				return total;
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
            _initPendingItem:function(){
				let self = this;
                console.log("CHECK DATA", this.UnloadedDataItems )

                Promise.all([ ...this.UnloadedDataItems.map(function(item) {
                    return   self.getVariant({params: {id: item.variant_id }})

                })]).then(function(values) {

                 var myset=  new Set(values.map(function(res){
                        return res.data.variant.product_id;
                    })
                )
                 Array.from(myset.values()).map( function(product_id){


                     console.log("TRYING TO GET PRODUCT",product_id );
                     self.getProduct({params: {id: product_id}}).then(function(product_res){
                         self.add_product_to_dictionary({product: product_res.data.product});
                         self.add_images_to_dictionary({images: product_res.data.product.images});
                         self.LocalVariantDictionary = Array.from(product_res.data.product.variants);
                     })
                 })
                })  ;










            /*    pq.add( [() => { return _productProm }] );

                var _productProm =  self.getProduct({params: {id: myVariantData.product_id}}).then(function(product_res){

                    console.log("--resolved product!!!", product_res.data.product);

                    self.add_product_to_dictionary({product: product_res.data.product});
                    self.add_images_to_dictionary({images: product_res.data.product.images});
                    self.LocalVariantDictionary = Array.from(product_res.data.product.variants);
                    console.log("--dictionary resolved product!!!",  self.LocalVariantDictionary );

                })

*/









/*
                    this.getVariant({params: {id: this.PendingItems[0].id }}).then(function(res) {
	                    let variantData = res.data.variant;
                        console.log("GOINGTO RETRIEVE!", res.data );

                        if (self.product_dictionary.get(variantData.product_id)){
                            self._addPendingItems();
                        }else{
                            console.log("RETRIEDING",variantData.product_id );

                            self.getProduct({params: {id: variantData.product_id}}).then(function(res){

                                self.add_product_to_dictionary({product: res.data.product});
                                self.add_images_to_dictionary({images: res.data.product.images});
                                self.$data._local_variant_dictionary=   self.arrayToDictionary(res.data.product.variants);

                            })

                        }



                    });
*/


                    //var product_ids  = this.PendingItems.map(function(item){

                      //  return item.product_id;
                  //  })




			},
			transformItemArray:function(pendingItems , lineItemMessage =false){
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
							id: {type: Number, required: true},
							quantity: {type: Number, default: item.requested_quantity },
							properties: {type: Number, default: line_props},
						});



					const data = ITEM_SCHEMA.parse(item);
					const params = {}
					return {params, data};
				});
			} ,
			addMultipletoCart: function(_pendingItems) {

				let pendingItems  = this.transformItemArray(_pendingItems, this.$props.lineitemmessage)

				let self = this;
				let pq = new PromiseQueue({concurrency: 1});


			//	this.Loading = this.isDisabled = true;


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
                               // self.Loading = self.isDisabled = false;
                                self.getCart().then(function(res){
                                    $('.js-drawer-open-button').click()
                                })

                                resolve();
							}, 5)
						});
					}])


			},
			updateQuantity:function(item ){

				//getTotalAmount
				//this.updateTotal();

				console.log("updateQuantity,TRYING TO REMOVE@!~!",item, this.PendingItems,this.getTotalAmount(),this.$data._totalAmt );

			},
			updateVariant:function(item,variant){



				//this.$emit('variant_change', item, variant );

				if ( item && item.item_id){
                    var newItem = item;

                    newItem = Object.assign(item,{id: variant.id, variant: variant} );
                    this.$data._pendingItemData  = new Map(	this.$data._pendingItemData).set(item.item_id,newItem  )

                }


			},

			updateTotal:function(){


				this.$data._totalAmt =this.getTotalAmount();

				console.log("updating!!",this.PendingItems, this.getTotalAmount() );


			},
			updateAvailability: function(bool) {


                //isVariantAvailable(foundVariantArr[0])
				//todo: make some way of doing alternate number here.
				let self = this;

				this.$data.availablity= bool;

				if (this.$props.disableunavailable){
				//	this.isDisabled = !bool;
				}
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

</style>
