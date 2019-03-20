<template>
	<div ref="MYCART" class="cart-wrapper">
		THIS IS A CART  :   {{this.Cart.item_count}}
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
   import store from '@/store'
    import {mapState,mapGetters, mapActions} from "vuex";
    export default {
        name: 'Cart',
        components: {

        }, props: {
        },

        data() {
            return {
            }
        },
        created: function() {

            store.subscribe((mutation, state) => {
                console.log(mutation.type)
                console.log(mutation.payload)
            })

            this.getCart();
        },
        mounted: function() {

        }, computed: {
            ...mapGetters([
                'Cart'
                // ...
            ])
        },

        methods: {

            ...mapActions([
                'getCart',
            ]),
        }
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">
</style>
