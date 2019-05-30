<template>
	<div class="c-freeshipping-message">
		<div class="c-freeshipping-message__message" v-if="!MinRequirementMet">Add {{DiffFormatted}} more to your cart
			for FREE shipping!
		</div>
		<div class=" c-freeshipping-message__chart" v-if="!MinRequirementMet">
			<span :style="InnerStyleObj " class="c-freeshipping-message__chart-inner"></span>
		</div>
		<span class="c-freeshipping-message__byline" v-if="!MinRequirementMet"> (USA customers only)</span>
		<div class="c-freeshipping-message__qualified" v-if="MinRequirementMet">
			You have qualified for free shipping!!
		</div>
	</div>
</template>

<script>

    import Vue from 'vue';
    import {mapGetters, mapActions, mapState, mapMutations} from 'vuex';
    import store from '@/store'
    import {ShopifyApiMixin} from '@/mixins/shopifyapimixin.js';
    import {CartMixin} from '@/mixins/cartmixin.js';

    const Numeral = require('numeral');

    module.exports = {
        name: '',
        mixins: [CartMixin, ShopifyApiMixin],
        components: {},
        data: function() {
            return {
                greeting: 'Hello'
            }
        },
        props: {
            freeshippingmin: {
                default: 150,
                type: Number
            }
        },
        mounted: function() {
            let self = this;
            this.getCart().then(function(res) {
            })
        },
        computed: {
            ...mapGetters([
                'Variants'
            ]),
            example: {
                get: function() {
                    return;
                },
                set: function(newVal) {
                    //=newVal;
                }
            },
            CartTotal: function() {
                if (this.Cart){
                    return parseInt(this.Cart.total_price) / 100;
                } else {
                    return false;
                }
            },
            MinRequirementMet: function() {
                if (this.Diff <= 0){
                    return true;
                } else {
                    return false;
                }
            },
            DiffFormatted: function() {

                return Numeral(this.Diff).format('$0,0[.]00');
            },
            DiffPercent: function() {
                return 100 - ( (this.Diff * 100) / 150);
            },
            InnerStyleObj: function() {
                return {
                    width: `${this.DiffPercent}%`
                }
            },
            Diff: function() {
                return (this.$props.freeshippingmin - this.CartTotal )
            }
        },
        methods: {}
    }
</script>

<style lang="scss" type="text/scss" >

	@import "src/vue/helpers/product-dependancies.scss";

	.c-freeshipping-message {

		@include u-make-container(100%);
		@include g-color-scheme(dark-accent-primary, (foreground:true, background: false, border:false));
		position: relative;

		&__byline {
			@include g-typeset(sm, font-small-caps);
			position: absolute;
			right: 0;
		}
		&__message {
			@include g-typeset(base, font-serif);
		}

		&__qualified {
			@include g-typeset(md, font-serif-italic);
		}
		&__chart {
			@include g-color-scheme(dark-accent-primary, (foreground:false, background: lighten background 18%, border:true));
			height: .8em;
			border-radius: 15px;
			display: flex;
			&-inner {
				height: 100%;
				border-radius: 15px;
				@include g-color-scheme(dark-accent-primary, (foreground:false, border:false, background: lighten background 2%));
			}
		}
	}
</style>