<template>
	<div class="pending-items-component --productApp">
		<basecomponent :disabled="isDisabled" :text="AddToCartString" :flags="IconClasses"
		               scheme="dark-accent-primary"
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
				<li v-for="pendingCartItem in PendingItems">
					<PendingCartItem @available="updateAvailability" @requested_quantity_change="updateQuantity" :item="pendingCartItem" :kit="kit"></PendingCartItem>
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
				type: Boolean,
				default: false
			},
		kit: {   ///this is used to give the kit an id
			type: Boolean,
			default: false
		}
		},
		mounted:function(){

			let self = this;



			this.$data._pendingItems = this.parsePendingItems(this.$props.addtocartvariants)
			this.updateTotal();

			this.getCart().then(function(res){
			})
	},
	watch: {


			addtocartvariants: function(val) {

				let items = val;
				var product_ids  = val.map(function(item){

					return item.product_id;
				})
					console.log("!!PRUDCT IDS IS",product_ids )

					this.$data._pendingItems = this.parsePendingItems(val)
			this.updateTotal();
        }
	},
		computed: {
			...mapGetters([
				'Variants'
			]),

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

				Loading: {
				get: function() {
					return this.$data._loading;
				},
				set: function(newVal) {
					this.$data._loading = newVal;  ///this.Variants[this.CurrentVariant._index];
				}
			},
			isDisabled: {
				get: function() {
					return this.$data._isDisabled;
				},
				set: function(newVal) {
					this.$data._isDisabled = newVal;  ///this.Variants[this.CurrentVariant._index];
				}
			},
			PendingItems: {
				get: function() {
					return this.$data._pendingItems;
				},
				set: function(newVal) {
					this.$data._pendingItems = newVal;  ///this.Variants[this.CurrentVariant._index];
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
                    console.log("ITEM TRANSFORMED IS " ,data,item ,item.message );
					const params = {}
					return {params, data};
				});
			} ,
			addMultipletoCart: function(_pendingItems) {

				let pendingItems  = this.transformItemArray(_pendingItems, this.$props.lineitemmessage)

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
			updateQuantity:function(item ){

				//getTotalAmount
				this.updateTotal();

				console.log("updateQuantity,TRYING TO REMOVE@!~!",item, this.PendingItems,this.getTotalAmount(),this.$data._totalAmt );

			},
			updateTotal:function(){


				this.$data._totalAmt =this.getTotalAmount();

				console.log("updating!!",this.PendingItems, this.getTotalAmount() );


			},
			updateAvailability: function(bool) {

				//todo: make some way of doing alternate number here.
				let self = this;

				this.$data.availablity= bool;

				if (this.$props.disableunavailable){
					this.isDisabled = !bool;
				}
			},
			addVarianttoPendingItem: function(item , _variant){
					return Object.assign(item, {variant: _variant});

			},
			parsePendingItemsSchema:function(itemArr){

				return itemArr.map(function(item) {

					const PENDING_ITEM_SCHEMA = schema(
						{
							id: {type: Number, required: true},
							variant: {type: Object},
							message: {type: String},
							requested_quantity: {type: Number, required: true, default: 1},
							quantity_editable: {type:Boolean, default:false}
						}
					);
					return PENDING_ITEM_SCHEMA.parse(item);
				});
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
			},
			getData:function( item){
				if (this.variant_dictionary.get(item.id)){
					retrievedDataArr.push(self.addVarianttoPendingItem(item, self.variant_dictionary.get(item.id)))
					self.updateTotal();
				}else{
					return false;
				}

			},
			parsePendingItems: function(itemArr) {
				let self = this;

				var requestedItemArr = this.parsePendingItemsSchema(itemArr);

				///todo: update and make more sense making
				if (requestedItemArr instanceof Array &&requestedItemArr.length>0 ){

					let retrievedDataArr = [];
					requestedItemArr.forEach(function(item) {
						let _unprocessedItemArr = requestedItemArr;

						if (self.variant_dictionary.get(item.id)){
							retrievedDataArr.push(self.addVarianttoPendingItem(item, self.variant_dictionary.get(item.id)))
							self.updateTotal();
						} else {
							self.getVariant({params: {id: item.id}}).then(function(res) {

								//	    self.add_variants_to_dictionary({variants: res.data.product.variants});

								let variantData = res.data.variant;

								if (self.product_dictionary.get(variantData.product_id)){
									console.log("PRODUCT ID IS FOUND!!",variantData.product_id);

								}else{
									self.getProduct({params: {id: variantData.product_id}}).then(function(res){


										self.add_product_to_dictionary({product: res.data.product});
										self.add_variants_to_dictionary({variants: res.data.product.variants});
										console.log("PRODUCT RETRWVAL OUND!!",self.product_dictionary.get(res.data.product.id) );

										retrievedDataArr.push(self.addVarianttoPendingItem(myObj, res.data.variant));

									})

								}



									/*
								var myObj = requestedItemArr.find(function(item) {
									return (item.id == Number(variantData.id)) ? true : false;
								});

									 */
								//retrievedDataArr.push(self.addVarianttoPendingItem(myObj, res.data.variant));
								//self.updateTotal();

							})
						}
					});

					return retrievedDataArr;
				} else {
					//push it?
				}
			},
		}
	}
</script>


<style lang="scss" type="text/scss" >

</style>
