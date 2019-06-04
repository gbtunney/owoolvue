<template>
	<div :class="$options.name"  class="cart-link js-drawer-open-button-right" aria-controls="CartDrawer">
	<div class="__cart-item">
		<iconcomponent icon_id="svg-icon-cart" :flags="['--no-border']" iconsize="rel--md"  scheme="accent-primary" :showpicker="true"></iconcomponent>
	</div>
	<div class="item-count">
			<span class="js-drawer-open-button">
				{{ItemText}}
			</span>
	</div>
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
   import store from '@/store'
    import {mapState,mapGetters, mapActions} from "vuex";
    import iconcomponent from '@/components/utilities/g-icon-component.vue';

    import {CartMixin} from  '@/mixins/cartmixin.js';
    export default {
        name: 'CartIndicator',
        components: {iconcomponent

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
<style lang="scss" type="text/scss" scoped>
	$GENERATE-QUEUE: false;

	@import "src/vue/helpers/product-dependancies.scss";

	.CartIndicator {
		width: auto;
		@include u-horizontal-list();
		align-items: center;

		@include breakpoint-range(sm,"<="){
			flex-direction: column;
			align-items: flex-end;
		}
		.c-button__icon {
			//@include u-icon-svg(false,1.5em);
		}

		&-icon {
			display: flex;
		}

		.item-count {
			@include g-typeset(base, font-serif-italic);
			color: darken(color(light,accent), 20%) !important;

			a {
				color:inherit;
			}

			&.--active {

			}
		}
	}

</style>
