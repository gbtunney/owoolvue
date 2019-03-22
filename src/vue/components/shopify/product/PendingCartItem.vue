<template>
	<div ref="MYCART" class="cart-wrapper">
		-- {{VariantName}} // Count: {{RequestedQuantity}} at {{VariantPrice}} <strong>Total:</strong> {{VariantTotalPrice}}

	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {mapState, mapGetters, mapActions} from "vuex";

    const PromiseQueue = require("easy-promise-queue").default;

    const schema = require("schm");
    const pq_additems = new PromiseQueue({concurrency: 1});

    export default {
        name: 'Cart',
        components: {}, props: {
            item: {
                type: Object,
                required:true
            }
        },

        data() {
            return {
            }
        },
        created: function() {

        },
        mounted: function() {
        }, computed: {
            RequestedQuantity: function() {
               return this.$props.item.requested_quantity;
            },
            VariantPrice: function() {
                return this.$props.item.variant.price;
            },
            VariantTotalPrice: function() {
                return ( this.$props.item.variant.price * this.$props.item.requested_quantity);
            },
            VariantName: function() {
                return this.$props.item.variant.title;
            }
        },
        methods: {
        }
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">
</style>
