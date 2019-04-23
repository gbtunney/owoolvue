<template>
	<div class="pending-items-component --productApp">
		<button  class="btn-add-to-cart"  @click="addMultipletoCart(PendingItems)" :disabled="isDisabled">{{label}}
			<div v-show="Loading" class="aspinner">LOADING SPINNER</div>
		</button>
		<span v-show="disableunavailable && isDisabled">Product Unavailble </span>
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


	const PromiseQueue = require("easy-promise-queue").default;

	import PendingCartItem from '@/components/product/cart/PendingtItem.vue'

	module.exports = {
		name: '',
		mixins: [CartMixin,ShopifyApiMixin,DictionaryMixin],
		components: {PendingCartItem},
		data: function() {
			return {
				_loading: false,
				_pendingItems: [],
				_isDisabled: false,
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
							quantity: {type: Number, default: 1},
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
								resolve();
							}, 5)
						});
					}]);
			},
			updateQuantity:function(item ){
			//	console.log("updateQuantity,TRYING TO REMOVE@!~!",item, this.PendingItems);
			},
			updateAvailability: function(bool) {

				//todo: make some way of doing alternate number here.
				console.log("UPDATE AVAIABILITY")
				let self = this;

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

	$my-default-spacing-variant: xl;

	.pending-items-component{

		ul{
			padding: 0;
		}
//@include u-trailer-padding($my-default-spacing-variant);

		&.--productApp{
			display: flex;
			flex-direction: column-reverse;
			align-items: center;

			.btn-add-to-cart{
				@include 	rhythm-margin(md);
				@include c-button( false,  dark-accent-primary     font-small-caps md lg , color-schemes typography font-size base-padding ) ;

			}
			.pending-item-name{
				@include 	rhythm-padding(md);

			}
			.pending-item-available{

				$collection: typography font-size ;
				$variant-keys: font-small-caps xs;
				@include render-queue( get-collection( $collection,$variant-keys) );
				@include 	u-leader-padding(md);


				//TODO: replace w font function

			}

			.vue-numeric-input .btn-decrement	.btn-icon:before{

				content: "G";
			}


			.vue-numeric-input .btn-increment	.btn-icon:before{

				content: "+";
			}

			.btn-icon{
				display: none;

				//@include g-color-scheme(dark);
					&:before, &:after{
					height: auto;
					background-color: red;
						position: relative;
						transform: none;
						/* position: absolute; */
						/* visibility: visible; */
						/* background-color: #111; */
						/* content: ""; */
						/* left: 50%; */
						/* top: 50%; */
						/* -webkit-transform: translate(-50%,-50%); */
						/* xf: translate(-50%,-50%); */



						content: "TTG";

					}


			}
			button.btn{
				box-shadow:initial!important;
				border-radius:0;
				$collection:color-schemes typography font-size ;
				$variant-keys: dark-accent-primary   font-small-caps lg ;
				@include render-queue( get-collection( $collection,$variant-keys) );

				display: flex;
				flex-direction: row;
				border-width: 2px;
				//justify-content: center;

				&:disabled{
					opacity: .7;
				}
				&:before{
					//margin-left: -7px;
					content: "+";
					width: 100%;
					height: 100%;
					position: absolute;
					top: 2px;
					left: 0;
				}

				&.btn-decrement{
					&:before{
						//margin-right: -7px;
						content: "-";
					}
				}

			}
			.numeric-input{
				border-radius:0;

				$collection:color-schemes typography font-size ;
				$variant-keys: accent-default  font-small-caps lg ;
				@include render-queue( get-collection( $collection,$variant-keys) );
				border-width: 1px;
				border-color: color(accent-primary,border);
			}
		}

		//background: red;

	}


</style>