<template>
	<div class="pending-items-component --productApp">

		<basecomponent :disabled="isDisabled" text="Add To Cart" :flags="IconClasses"
		               scheme="dark-accent-primary"
		               @click="addMultipletoCart(PendingItems)" font="small-caps"
		               fontsize="lg"
		               :showpicker="false" padding="md">
			<template slot="right-icon" class="is-grid-2" >

				<svg v-show="Loading"  class="lds-spinner" width="200px"  height="200px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><g transform="rotate(0 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(30 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(60 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(90 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(120 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(150 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(180 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(210 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(240 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(270 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(300 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
					</rect>
				</g><g transform="rotate(330 50 50)">
					<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
						<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
					</rect>
				</g></svg>
			</template>
		</basecomponent>

		<span v-show="!availablity">Product Unavailble </span>
		<div v-show="metavisible" class="productMeta" >
			<h5 v-show="kit">Includes: </h5>
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

    import Toasted from 'vue-toasted';
    Vue.use(Toasted)

	const PromiseQueue = require("easy-promise-queue");

	import PendingCartItem from '@/components/product/cart/PendingtItem.vue'

	module.exports = {
		name: '',
		mixins: [CartMixin,ShopifyApiMixin,DictionaryMixin],
		components: {PendingCartItem,basecomponent},
		data: function() {
			return {
				_loading: false,
				_pendingItems: [],
				_isDisabled: false,
				availablity:true
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
			this.getCart().then(function(res){
			})

		console.log("cart is props;",this.$props.addtocartvariants	 )


	},
	watch: {
		addtocartvariants: function(val) {
			this.$data._pendingItems = this.parsePendingItems(val)
        }
	},
		computed: {
			...mapGetters([
				'Variants'
			]),

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

				let line_props = {};

				if (lineItemMessage){
					line_props = Object.assign(line_props, {message: lineItemMessage} );
				}
				///TODO THIS IS SOME DUMB BULLSHITTTTTT
				return pendingItems.map(function(item) {

					const ITEM_SCHEMA = schema(
						{
							id: {type: Number, required: true},
							quantity: {type: Number, default: item.requested_quantity },
							properties: {type: Number, default: line_props},
						});

					if (item.message){
						line_props = Object.assign(line_props ,{message2: item.message } );
					}

					const data = ITEM_SCHEMA.parse(item);
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
							console.log('task 1');
							resolve();
						}, 1000)
					});
				}, ...pendingItems.map(function(item) {
						return () => {
							return self.addItem(item);
						}}), () => {
						return new Promise(function(resolve, reject) {
							setTimeout(function() {
								console.log('QUEUE COMPLETE', pq, self);
								self.Loading = self.isDisabled = false;
                                let toast = self.$toasted.show(`${self.ItemCount} Items added to cart`, {
                                    theme: "toasted-custom",
                                    position: "top-right",
                                    duration : 2000

                                });


                                resolve();
							}, 5)
						});
					}])


			},
			updateQuantity:function(item ){
			console.log("updateQuantity,TRYING TO REMOVE@!~!",item, this.PendingItems);
			},
			updateAvailability: function(bool) {

				//todo: make some way of doing alternate number here.
				console.log("UPDATE AVAIABILITY",bool)
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
						} else {
							self.getVariant({params: {id: item.id}}).then(function(res) {

								let variantData = res.data.variant;

								var myObj = requestedItemArr.find(function(item) {
									return (item.id == Number(variantData.id)) ? true : false;
								});
								retrievedDataArr.push(self.addVarianttoPendingItem(myObj, res.data.variant));
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

	@import "src/vue/helpers/product-dependancies.scss";

	$my-default-spacing-variant: md;

	toasted .primary, .toasted.toasted-custom {

		@include g-color-scheme(dark-accent-secondary)
		border-radius: 0px;
		min-height: 38px;
		@include g-typeset(lg, font-small-caps);
	//line-height: 1.1em;
	//	background-color: #353535;
	//	padding: 0 20px;
		//font-size: 15px;
	//	font-weight: 300;
		//color: #fff;
		//box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);
	}


	.pending-items-component{


		ul{
			padding: 0;
		}

		&.--productApp{
			display: flex;
			flex-direction: column-reverse;
			align-items: center;

			.pending-item-name{
				@include 	rhythm-padding($my-default-spacing-variant);

			}
			.pending-item-available{

				@include 	u-leader-padding($my-default-spacing-variant);
				@include g-typeset(xs,font-small-caps )

			}

			////CUSTOMIZED OVERRIDE OF VUE NUMERIC INPUT
			.vue-numeric-input{
				border-radius:0;

				$collection:color-schemes typography font-size ;
				$variant-keys: accent-default  font-small-caps lg ;
				@include render-queue( get-collection( $collection,$variant-keys) );
				border-width: 1px;
				border-color: color(accent-primary,border);

				.btn-icon{
					display: none;
					&:before, &:after{
						height: auto;
						position: relative;
						transform: none;
						content: "TTG";
					}


				}
				button.btn {
					box-shadow: initial !important;
					border-radius: 0;
					$collection: color-schemes typography font-size;
					$variant-keys: dark-accent-primary font-small-caps lg;
					@include render-queue(get-collection($collection, $variant-keys));

					display: flex;
					flex-direction: row;
					border-width: 2px;

					&:disabled {
						opacity: .7;
					}
					&:before {
						content: "+";
						width: 100%;
						height: 100%;
						position: absolute;
						top: 2px;
						left: 0;
					}

					&.btn-decrement {
						&:before {
							content: "-";
						}
					}

				}
			}
		}
	}


</style>
