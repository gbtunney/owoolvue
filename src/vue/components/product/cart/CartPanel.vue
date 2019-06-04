<template>
	<div id="CartDrawer" class="drawer drawer--right drawer--has-fixed-footer">
		<div class="drawer__fixed-header">
			<FreeShippingMessage ></FreeShippingMessage>
			<div class="drawer__header">
				<div class="drawer__title">Cart</div>
				<div class="drawer__close">
					<button type="button" class="icon-fallback-text drawer__close-button js-drawer-close">

						<div class="g-scheme--dark-accent-primary c-icon-base g-size-rel--lg --no-border">
							<iconcomponent icon_id="svg-icon-vintage-arrow-2" :flags="['--no-border']" iconsize="rel--lg" :showpicker="false"></iconcomponent>

						</div>
						<span class="fallback-text">Close cart</span>
					</button>
				</div>
			</div>
		</div>
		<div class="drawer__inner">
			<div id="CartContainer" class="drawer__cart">
				<div  v-if="( this.Cart && this.Cart.items)" ref="MYCART" class="cart-wrapper">

					<div  v-if="this.Cart.items.length == 0">Your cart is currently empty</div>

					<div class="ajaxcart__inner ajaxcart__inner--has-fixed-footer" style="bottom: 219px;">

						<span v-if="loading">LOADING</span>

						<div v-for="item in this.Cart.items">

							<div class="ajaxcart__product">
								<div class="ajaxcart__row" >
									<div class="grid">
										<div class="grid__item one-quarter">
											<a :href="item.url" class="ajaxcart__product-image"><img :src="item.image" :alt="item.name"></a>
										</div>
										<div class="grid__item three-quarters">
											<div class="ajaxcart__product-name--wrapper">
												<a :href="item.url" class="ajaxcart__product-name">{{ item.product_title }}</a>
											</div>
											<span class="ajaxcart__product-meta">{{item.variant_title}}</span>

											<div v-if="item.properties">
												<span v-for="lineproperty in item.properties" class="ajaxcart__product-meta">{{lineproperty}}</span>
											</div>
											<div class="grid--full display-table">
												<div class="grid__item display-table-cell one-half">
													<VueNumericInput  @change="quantityChanged(item)"  v-model="item.quantity"></VueNumericInput>
												</div>
												<div class="grid__item display-table-cell one-half text-right">
													<div v-if="discountsApplied(item)">
														<small class="ajaxcart__price--strikethrough">{{item.price | toUSD }}</small>
														<span class="ajaxcart__price">{{discountedPrice(item) | toUSD}}</span>
													</div>
													<div v-else >
														<span class="ajaxcart__price">{{item.price  | toUSD }}</span>
													</div>
												</div>
											</div>
											<div  v-if="discountsApplied(item)" class="grid--full display-table">
												<div class="grid__item text-right">
													<small v-for="discount in item.discounts" class="ajaxcart__discount">{{discount.title}}</small>
												</div>
											</div>
										</div>
									</div>



								</div>
							</div>
						</div>


						<div v-if="cart_notes_enable">
							<label for="CartSpecialInstructions" class="ajaxcart__note">Special instructions for seller</label>
							<textarea name="note" class="input-full" v-model="Cart.note" id="CartSpecialInstructions" @change="updateNote">{{Cart.note}}</textarea>
						</div>

					</div>




					<div class="ajaxcart__footer ajaxcart__footer--fixed">
						<div class="grid--full">
							<div class="grid__item two-thirds">
								<p class="ajaxcart__subtotal">Subtotal</p>
							</div>
							<div class="grid__item one-third text-right">
								<p class="ajaxcart__subtotal">{{Cart.total_price | toUSD }}</p>
							</div>
						</div>

						<p v-if="Cart.total_discount > 0" class="ajaxcart__savings text-center">You have saved {{Cart.total_discount | toUSD}}</p>


						<p class="ajaxcart__policies">
							Taxes and shipping calculated at checkout</p>
						<button type="submit" class="btn--secondary btn--full cart__checkout" name="checkout">
							<span class="icon icon-arrow-right" aria-hidden="true"></span>
						</button>
					</div>


				</div>
			</div>
		</div>
	</div>





</template>

<script type="text/javascript">

    import Vue from 'vue';
   import store from '@/store'
    import {mapState,mapGetters, mapActions} from "vuex";

    import {CartMixin} from  '@/mixins/cartmixin.js';
    import FreeShippingMessage from '@/components/header/FreeShippingMessage.vue'
    import VueNumericInput from 'vue-numeric-input';
    const Numeral = require('numeral');

    import iconcomponent from '@/components/utilities/g-icon-component.vue';

    ///TODO  - figure out how to do this 4 reals.

    Vue.filter('toUSD', function(value) {
        return Numeral(( value * .01)).format('$ 0,0[.]00');
    });

/*  item = {
        key: cartItem.key,
        line: index + 1, // Shopify uses a 1+ index in the API
        url: cartItem.url,
        img: prodImg,
        name: cartItem.product_title,
        variation: cartItem.variant_title,
        properties: cartItem.properties,
        itemAdd: cartItem.quantity + 1,
        itemMinus: cartItem.quantity - 1,
        itemQty: cartItem.quantity,
        price: theme.Currency.formatMoney(cartItem.price, settings.moneyFormat),
        discountedPrice: theme.Currency.formatMoney(
          cartItem.price - cartItem.total_discount / cartItem.quantity,
          settings.moneyFormat
        ),
        discounts: cartItem.discounts,
        discountsApplied:
          cartItem.price === cartItem.price - cartItem.total_discount
            ? false
            : true,
        vendor: cartItem.vendor
      };

      items.push(item);
    });
generalsettings.cart_notes_enable
*/

    export default {
        name: 'Cart',
        components: {
            FreeShippingMessage,VueNumericInput,iconcomponent
        }, props: {
            cart_notes_enable : {
                default: false,
	            type: [Boolean,String]
            }

        },
	    mixins:[CartMixin],
        data() {
            return {
                loading: false
            }
        },
	    computed:{
            ...mapState({cart: state => state._cart,shop: state => state._shop })

	    },
        created: function() {
            this.getCart();
        },
        mounted: function() {

        },
        methods: {
            updateNote:function(){

                const data = {note: this.Cart.note };
                const params = {}
                console.log("TRYING TO UPDATE NOTE!!",this.Cart.note);

                this.$data.loading= true;
                let self = this;

                this.updateCartNote({params, data}).then(function(res) {
                    self.getCart().then(function(res) {
                        self.$data.loading= false;
                    });
                });

            },
            discountedPrice:function(item){
                return  item.price - (item.total_discount / item.quantity);
            },
	        discountsApplied:function(item){

                return ( item.price === (item.price - item.total_discount )) ? false : true;
	        },
            quantityChanged: function(item,e) {
	          console.log("UPDATING CART ITEM!!!!!!", item)
	            this._updateCartItem(item)
            },
	        _updateCartItem: function(item) {

        const data = {quantity: item.quantity, id: item.key };
        const params = {}
                console.log('requested_quantity_change', data,item.quantity, item)

                this.$data.loading= true;
        let self = this;

        this.updateCartItem({params, data}).then(function(res) {
            self.getCart().then(function(res) {
                self.$data.loading= false;
            });

          //
        });
    }


        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">
</style>
