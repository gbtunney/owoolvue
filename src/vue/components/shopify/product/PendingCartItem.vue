<template>
	<div ref="MYCART" class="cart-wrapper">
		<span v-show="NoStockAlert">NO STOCK AVAILABLE!!</span>
		-- {{VariantName}} // Count: {{RequestedQuantity}} at {{VariantPrice | toUSD }} <strong>Total:</strong> {{VariantTotalPrice |toUSD}}
		<vue-numeric-input class="quantity-selector__input"  v-model="item.requested_quantity" :min="1" :max="1000" :step="1"></vue-numeric-input>
total available: {{Variant.inventory_quantity}}
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {mapState, mapGetters, mapActions} from "vuex";

    const PromiseQueue = require("easy-promise-queue").default;

    const schema = require("schm");
    const pq_additems = new PromiseQueue({concurrency: 1});

    import VueNumericInput from 'vue-numeric-input';

    ///TODO  - figure out how to do this 4 reals.
    
    Vue.filter('toUSD', function(value) {
        return `$${value}`;
    });

    export default {
        name: 'Cart',
        components: {VueNumericInput}, props: {
            item: {
                type: Object,
                required: true
            }
        },
        data() {
            return {}
        },
        created: function() {

        },
        mounted: function() {
            if (this.NoStockAlert){
                this.$emit('unavailable', this.Variant.id)
            }
        }, computed: {
            RequestedQuantity: function() {
                return this.$props.item.requested_quantity;
            },
            VariantPrice: function() {
                return this.Variant.price;
            },
            VariantTotalPrice: function() {
                return ( this.Variant.price * this.$props.item.requested_quantity);
            },
            Variant: function() {
                return this.$props.item.variant;
            },
            VariantName: function() {
                return this.Variant.title;
            },
            NoStockAlert: function() {
                if (Number(this.RequestedQuantity) > Number(this.Variant.inventory_quantity)){
                    return true;
                } else {
                    return false;
                }
            }
        },
        methods: {}
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">
</style>
