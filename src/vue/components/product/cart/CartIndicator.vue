<template>
	<span class="js-drawer-open-button">
	{{ItemText}}
	</span>
</template>

<script type="text/javascript">

    import Vue from 'vue';
   import store from '@/store'
    import {mapState,mapGetters, mapActions} from "vuex";

    import {CartMixin} from  '@/mixins/cartmixin.js';
    export default {
        name: 'Cart',
        components: {

        }, props: {
        },
	    mixins:[CartMixin],
        data() {
            return {
            }
        },
	    computed:{
            ...mapState({cart: state => state._cart }),
		    ItemText:function(){
                if ( this.Cart.item_count == 0 ) return "";
                if ( this.Cart.item_count == 1 ) return `(${this.Cart.item_count} item)`;
                if ( this.Cart.item_count > 1 ) return `(${this.Cart.item_count} items)`;
		    }
	    },
        created: function() {


          ///  this.getCart();
        },
        mounted: function() {

        },
        methods: {

        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">
</style>
