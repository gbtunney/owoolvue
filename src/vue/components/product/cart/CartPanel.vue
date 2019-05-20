<template>
	<div ref="MYCART" class="cart-wrapper">
		<FreeShippingMessage ></FreeShippingMessage>
		{{Cart.item_count}}
		<div  v-if="this.Cart.items.length == 0">Your cart is currently empty</div>
		<div v-for="item in this.Cart.items">

			<span v-if="loading">LOADING</span>
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

							<VueNumericInput :disabled="loading" @input="quantityChanged(item)"  v-model="item.quantity"></VueNumericInput>
						</div>
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


    export default {
        name: 'Cart',
        components: {
            FreeShippingMessage,VueNumericInput
        }, props: {
        },
	    mixins:[CartMixin],
        data() {
            return {
                loading: false
            }
        },
	    computed:{
            ...mapState({cart: state => state._cart })

	    },
        created: function() {


            this.getCart();
        },
        mounted: function() {

        },
        methods: {
            quantityChanged: function(item) {
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
