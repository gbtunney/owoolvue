<template>
	<div :class="$options.name"  ref="MYCART" class="cart-wrapper">
		<div v-if="kit">
			 <div class="kit_container">
				 <div class="PendingItemLoader" v-show="!this.Variant" >
				    <iconcomponent  icon_id="svg-icon-loadinganim" :flags="['--no-border','g-icon-absolute--md']" iconsize="absolute--xl" scheme="light" :showpicker="true"></iconcomponent>
				 </div>
				 <div v-show="this.Variant" :class="(!Availability) ? ['PendingItemUnavailable'] : []" class="PendingItemWrapper">
				<span class="PendingItemImage" v-if="Image">
						<img class="thumbnail"  v-if="kit && Image" :src="ShopifyImgURL(Image.src, $props.swatchsize)" :alt="Image.alt">
					</span>
					 <span class="PendingItemDetails">
					 <h5 class="PendingItemTitle" v-if="Product">{{Product.title}} / {{Variant.title}}</h5>
						 <div>-- {{ (!IsFree)? RequestedQuantity : " "}} {{UnitString}} {{Message}}  ( <span v-if="(!IsFree)">{{ this.Variant.price | toUSD}}</span><span v-else="IsFree">Free</span> )</div>
						<div style="opacity: .6;" v-if=" ManageQuantity">total available: {{Variant.inventory_quantity}}</div>
						 <div v-if="( Variant && item.editable_variant)">
							 <span>Color:</span>
							 <span>
								 <Multiselect  :options="ProductVariantArr"
								              @input="variantChanged(item)"
								              v-model="SelectedVariant"
								              track-by="title"
								              label="title"
								              class="multiselectmaster"
								              :taggable="false"
								              :multiple="false"
								              :closeOnSelect="false"
								              placeholder="Select one"
								              :searchable="true"
								              :allow-empty="false">

								<template slot="singleLabel" slot-scope="{ option }">
									<span>  {{ option.title }}</span>
								</template>

								<template slot="option" class="is-grid-2" slot-scope="props" disabled="true">
									<div disabled="true"  class="option__desc">
										<span><img :src="getVariantImage(props.option)"> </span>
										<span class="option__title">{{ props.option.title }}</span></div>
								</template>
					    </Multiselect>
							 </span>

						 </div>
					    </p>


						 <p v-show="!Availability">NO STOCK AVAILABLE!!</p>
						 </p>
						 <vue-numeric-input class="quantity-selector__input"   @input="quantityChanged(item,RequestedQuantity)" v-model="RequestedQuantity" v-if="item.quantity_editable"  :min="1" :max="Variant.inventory_quantity" :step="1"></vue-numeric-input>
					</span>
				 </div>
			 </div>
		</div>
		<div class="single_item_container" v-else>
			<div class="">
				<span class="pending-item-available" v-if=" ManageQuantity" >available: {{Variant.inventory_quantity}}</span>

				<h3 class="pending-item-name" v-if=" ManageQuantity"  >{{Variant.title}}</h3>

			</div>
				<span v-show="false" class="pending-item-price">{{VariantTotalPrice |toUSD}}</span>


			<div class="pending-item-available">Quantity:</div>
			<vue-numeric-input class="quantity-selector__input" v-if="item.quantity_editable"  @input="quantityChanged(item,RequestedQuantity)" v-model="RequestedQuantity"  :min="1" :max="Variant.inventory_quantity" :step="1"></vue-numeric-input>
		</div>
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {mapState, mapGetters, mapActions} from "vuex";
    import Multiselect from 'vue-multiselect'
    import VueNumericInput from 'vue-numeric-input';
    const Numeral = require('numeral');

    import {DictionaryMixin} from '@/mixins/dictionarymixin.js';
    import {isVariantAvailable, ShopifyImgURL} from '@/helpers/main.js'

    import iconcomponent from '@/components/utilities/g-icon-component.vue';

    Vue.filter('toUSD', function(value) {
        if (value == parseInt(0)){
            return "Free"
        }

        console.log("filtering ", value)
        return Numeral(value).format('$ 0,0[.]00');
    });

    export default {
        name: 'PendingItem',
        components: {VueNumericInput, Multiselect, iconcomponent},
        props: {
            item: {
                type: Object,
                required: true
            },
            local_variant_dictionary: {
                default: false,
                type: [Boolean, Map]
            },
            kit: {   ///this is used to give the kit an id
                type: [Boolean, Array],
                default: false
            },
            swatchsize: {
                required: false,
                type: String,
                default: '100x100'

            },
            selectorswatchsize: {
                required: false,
                type: String,
                default: '50x50'

            },
        },
        mixins: [DictionaryMixin],
        data() {
            return {
                _selectedVariant: false,
                _requested_quantity: false
            }
        },
        created: function() {
        },
        watch: {
            item: function(val) {
               // console.log("NEW ITEM SSETTTT", this.Variant);
            },
            local_variant_dictionary:function(){
                 console.log("CHANNNNGEDDD", this.Variant);


            }
        },
        computed: {

            Variant: function() {
                if (this.$props.local_variant_dictionary && this.$props.item.variant_id && this.$props.local_variant_dictionary.get(this.$props.item.variant_id)){
                    return this.$props.local_variant_dictionary.get(this.$props.item.variant_id);
                }
                return false;
            },
            Image: function() {
                if (this.Variant && this.Variant.image_id && this.product_image_dictionary.get(this.Variant.image_id)){
                    return this.product_image_dictionary.get(this.Variant.image_id);
                } else if (this.Product && this.Product.image.id && this.product_image_dictionary.get(this.Product.image.id)){
                    return this.product_image_dictionary.get(this.Product.image.id);
                }
                return false;
            },
            UnitString: function() {
                if (this.Product && ((this.Product.product_type).toLowerCase() == "yarns")){
                    if (this.$props.item.requested_quantity == 1) return "skein / "
                    return "skeins /"

                }
            },
            IsFree: function() {
                if (this.Variant && this.Variant.price == 0) return true;
                return false;
            },
            ProductVariantArr: function() {
                return (this.Product) ? this.Product.variants : []
            },
            Product: function() {
                if (this.Variant && this.Variant.product_id && this.product_dictionary.get(this.Variant.product_id)){
                    return this.product_dictionary.get(this.Variant.product_id);
                }
                return false;
            },
            VariantPrice: function() {
                return this.Variant.price;
            },
            Message: function() {
                if (this.$props.item.message){
                    return this.$props.item.message;
                } else {
                    return "";
                }
            },
            VariantTotalPrice: function() {
                return (this.Variant.price * this.$props.item.requested_quantity);
            },
            ManageQuantity: function() {
                return (this.Variant.inventory_management == null) ? false : true;
            },
            Availability: function() {
                if (this.Variant && isVariantAvailable(this.Variant, this.$props.item.requested_quantity)){
                    return true;
                }
                return false;
            },
            RequestedQuantity: {
                get: function() {

                    return this.$props.item.requested_quantity
                },
                set: function(newVal) {
                    if (!isNaN(newVal)){
                        this.$data._requested_quantity = newVal;  ///this.Variants[this.CurrentVariant._index];
                    } else {
                        this.$data._requested_quantity = 1;  ///this.Variants[this.CurrentVariant._index];
                    }
                }
            },
            SelectedVariant: {
                get: function() {

                    if (!this.$data._selectedVariant && this.Variant){
                        this.$data._selectedVariant = this.Variant;
                    }
                    return this.$data._selectedVariant;
                },
                set: function(newVal) {
                    this.$data._selectedVariant = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
        },
        methods: {
            getVariantImage: function(variant) {
                var image = this.product_image_dictionary.get(variant.image_id);
                if (image){
                    return ShopifyImgURL(image.src, this.$props.selectorswatchsize)
                }
                return false;
            },
            variantChanged: function(item) {
                this.$emit('variant_change', item, this.SelectedVariant)
            },
            ShopifyImgURL,
            quantityChanged: function(item, value) {
                this.$emit('requested_quantity_change', item, this.$data._requested_quantity)
            },
            ...mapActions([
                'getVariantDefaultImage'
            ]),
        }
    }

</script>
<style lang="scss" type="text/scss" >



	$GENERATE-QUEUE: false;
	@import "src/vue/helpers/product-dependancies.scss";

.pending-item-name{
	@include g-typeset(lg, font-serif)
}
.pending-item-available{
}
	$btn-option-render-disabled: (
		(
			description: "color schemes",
			selector:false,
			variant-key: light,
			parent: color-schemes,
			suffix:false,
			variants:(
				options: (
					obj: (
						background: true,
						foreground:  lighten foreground 40%,
						accent:true,
						border:  lighten foreground 40%,
						fill:foreground,
						hover-background:true,
						hover-foreground:true
					)
				)
			)
		)
	);

.PendingItem{
	.multiselect * {
		box-sizing: border-box;
	}

	.multiselect:focus {
		outline: none;
	}

	.multiselect{
		&--disabled{
			pointer-events: none;
			opacity: 0.6;
		}
		&--active {
			z-index: 0;
		}

	}

	.multiselect__content{
		background: white;
	}
	.multiselect__content-wrapper {

	}
	.multiselectlist--horizontal{
		width: fit-content;
		.multiselect__content{
			display: flex;
			justify-content: space-between;
		}
	}

	.multiselect__content {
		list-style: none;
		padding: 0;
		margin: 0;
		vertical-align: top;
	}

	.multiselect__content::webkit-scrollbar {
		display: none;
	}

	.multiselect__element {
		display: block;
	}


	.multiselect__option{

		text-transform: uppercase;
	}

	.multiselect__option {

		position: relative;
		cursor: pointer;
		white-space: nowrap;
	}

	.multiselect__option:after {
		display: none;
		/*	top: 0;
		right: 0;
		position: absolute;
		line-height: 40px;
		padding-right: 12px;
		padding-left: 20px;
		font-size: 13px;*/
	}

	.multiselect__option--highlight {
		//background: #41b883;
		outline: none;
		//color: white;
	}

	.multiselect__option--highlight:after {
		content: attr(data-select);
		//background: #41b883;
		//color: white;
	}

	.multiselect__option--selected {

		border-width: 1px!important;

	}

	.multiselect__option--selected:after {
		content: attr(data-selected);
		color: silver;
	}

	.multiselect__option--selected.multiselect__option--highlight {
		//background: #ff6a6a;
		//color: #fff;
	}

	.multiselect__option--selected.multiselect__option--highlight:after {
		//background: #ff6a6a;
		content: attr(data-deselect);
		//color: #fff;
	}

	.multiselect--disabled {
		background: #ededed;
		pointer-events: none;
	}

	.multiselect--disabled .multiselect__current,
	.multiselect--disabled .multiselect__select {

	}

	.multiselect__option--disabled {
		opacity:.3;
		cursor: text;
		pointer-events: none;
	}

	.multiselect__option--group {
		background: #ededed;
		color: #35495e;
	}

	.multiselect__option--group.multiselect__option--highlight {
		background: #35495e;
		color: #fff;
	}

	.multiselect__option--group.multiselect__option--highlight:after {
		background: #35495e;
	}

	.multiselect__option--disabled.multiselect__option--highlight {
		background: #dedede;
	}

	.multiselect__option--group-selected.multiselect__option--highlight {
		//background: #ff6a6a;
		color: #fff;
	}

	.multiselect__option--group-selected.multiselect__option--highlight:after {
		//background: #ff6a6a;
		content: attr(data-deselect);
		color: #fff;
	}
	fieldset[disabled] .multiselect {
		pointer-events: none
	}

	.multiselect__spinner {
		position: absolute;
		right: 1px;
		top: 1px;
		width: 48px;
		height: 35px;
		background: #fff;
		display: block
	}

	.multiselect__spinner:after, .multiselect__spinner:before {
		position: absolute;
		content: "";
		top: 50%;
		left: 50%;
		margin: -8px 0 0 -8px;
		width: 16px;
		height: 16px;
		border-radius: 100%;
		border-color: #41b883 transparent transparent;
		border-style: solid;
		border-width: 2px;
		box-shadow: 0 0 0 1px transparent
	}

	.multiselect__spinner:before {
		animation: a 2.4s cubic-bezier(.41, .26, .2, .62);
		animation-iteration-count: infinite
	}

	.multiselect__spinner:after {
		animation: a 2.4s cubic-bezier(.51, .09, .21, .8);
		animation-iteration-count: infinite
	}

	.multiselect__loading-enter-active, .multiselect__loading-leave-active {
		transition: opacity .4s ease-in-out;
		opacity: 1
	}

	.multiselect__loading-enter, .multiselect__loading-leave-active {
		opacity: 0
	}

	.multiselect, .multiselect__input, .multiselect__single {
		font-family: inherit;
		font-size: 16px;
		-ms-touch-action: manipulation;
		touch-action: manipulation
	}

	.multiselect {
		box-sizing: content-box;
		display: block;
		position: relative;
		width: 100%;
		min-height: 40px;
		text-align: left;
		color: #35495e
	}

	.multiselect * {
		box-sizing: border-box
	}

	.multiselect:focus {
		outline: none
	}

	.multiselect--disabled {
		opacity: .6
	}

	.multiselect--active {
		z-index: 1
	}

	.multiselect--active:not(.multiselect--above) .multiselect__current, .multiselect--active:not(.multiselect--above) .multiselect__input, .multiselect--active:not(.multiselect--above) .multiselect__tags {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0
	}

	.multiselect--active .multiselect__select {
		transform: rotate(180deg)
	}

	.multiselect--above.multiselect--active .multiselect__current, .multiselect--above.multiselect--active .multiselect__input, .multiselect--above.multiselect--active .multiselect__tags {
		border-top-left-radius: 0;
		border-top-right-radius: 0
	}

	.multiselect__input, .multiselect__single {
		position: relative;
		display: inline-block;
		min-height: 20px;
		line-height: 20px;
		border: none;
		border-radius: 5px;
		background: #fff;
		padding: 0 0 0 5px;
		width: 100%;
		transition: border .1s ease;
		box-sizing: border-box;
		margin-bottom: 8px;
		vertical-align: top
	}

	.multiselect__input:-ms-input-placeholder {
		color: #35495e
	}

	.multiselect__input::placeholder {
		color: #35495e
	}

	.multiselect__tag ~ .multiselect__input, .multiselect__tag ~ .multiselect__single {
		width: auto
	}

	.multiselect__input:hover, .multiselect__single:hover {
		border-color: #cfcfcf
	}

	.multiselect__input:focus, .multiselect__single:focus {
		border-color: #a8a8a8;
		outline: none
	}

	.multiselect__single {
		padding-left: 5px;
		margin-bottom: 8px
	}

	.multiselect__tags-wrap {
		display: inline
	}

	.multiselect__tags {
		min-height: 40px;
		display: block;
		padding: 8px 40px 0 8px;
		border-radius: 5px;
		border: 1px solid #e8e8e8;
		background: #fff;
		font-size: 14px
	}

	.multiselect__tag {
		position: relative;
		display: inline-block;
		padding: 4px 26px 4px 10px;
		border-radius: 5px;
		margin-right: 10px;
		color: #fff;
		line-height: 1;
		background: #41b883;
		margin-bottom: 5px;
		white-space: nowrap;
		overflow: hidden;
		max-width: 100%;
		text-overflow: ellipsis
	}

	.multiselect__tag-icon {
		cursor: pointer;
		margin-left: 7px;
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		font-weight: 700;
		font-style: normal;
		width: 22px;
		text-align: center;
		line-height: 22px;
		transition: all .2s ease;
		border-radius: 5px
	}

	.multiselect__tag-icon:after {
		content: "\D7";
		color: #266d4d;
		font-size: 14px
	}

	.multiselect__tag-icon:focus, .multiselect__tag-icon:hover {
		background: #369a6e
	}

	.multiselect__tag-icon:focus:after, .multiselect__tag-icon:hover:after {
		color: #fff
	}

	.multiselect__current {
		min-height: 40px;
		overflow: hidden;
		padding: 8px 12px 0;
		padding-right: 30px;
		white-space: nowrap;
		border-radius: 5px;
		border: 1px solid #e8e8e8
	}

	.multiselect__current, .multiselect__select {
		line-height: 16px;
		box-sizing: border-box;
		display: block;
		margin: 0;
		text-decoration: none;
		cursor: pointer
	}

	.multiselect__select {
		position: absolute;
		width: 40px;
		height: 38px;
		right: 1px;
		top: 1px;
		padding: 4px 8px;
		text-align: center;
		transition: transform .2s ease
	}

	.multiselect__select:before {
		position: relative;
		right: 0;
		top: 65%;
		color: #999;
		margin-top: 4px;
		border-style: solid;
		border-width: 5px 5px 0;
		border-color: #999 transparent transparent;
		content: ""
	}

	.multiselect__placeholder {
		color: #adadad;
		display: inline-block;
		margin-bottom: 10px;
		padding-top: 2px
	}

	.multiselect--active .multiselect__placeholder {
		display: none
	}

	.multiselect__content-wrapper {
		position: absolute;
		display: block;
		background: #fff;
		width: 100%;
		max-height: 240px;
		overflow: auto;
		border: 1px solid #e8e8e8;
		border-top: none;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		z-index: 1;
		-webkit-overflow-scrolling: touch
	}

	.multiselect__content {
		list-style: none;
		display: inline-block;
		padding: 0;
		margin: 0;
		min-width: 100%;
		vertical-align: top
	}

	.multiselect--above .multiselect__content-wrapper {
		bottom: 100%;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		border-bottom: none;
		border-top: 1px solid #e8e8e8
	}

	.multiselect__content::webkit-scrollbar {
		display: none
	}

	.multiselect__element {
		display: block
	}

	.multiselect__option {
		display: block;
		padding: 12px;
		min-height: 40px;
		line-height: 16px;
		text-decoration: none;
		text-transform: none;
		vertical-align: middle;
		position: relative;
		cursor: pointer;
		white-space: nowrap
	}

	.multiselect__option:after {
		top: 0;
		right: 0;
		position: absolute;
		line-height: 40px;
		padding-right: 12px;
		padding-left: 20px;
		font-size: 13px
	}

	.multiselect__option--highlight {
		background: #41b883;
		outline: none;
		color: #fff
	}

	.multiselect__option--highlight:after {
		content: attr(data-select);
		background: #41b883;
		color: #fff
	}

	.multiselect__option--selected {
		background: #f3f3f3;
		color: #35495e;
		font-weight: 700
	}

	.multiselect__option--selected:after {
		content: attr(data-selected);
		color: silver
	}

	.multiselect__option--selected.multiselect__option--highlight {
		background: #ff6a6a;
		color: #fff
	}

	.multiselect__option--selected.multiselect__option--highlight:after {
		background: #ff6a6a;
		content: attr(data-deselect);
		color: #fff
	}

	.multiselect--disabled {
		background: #ededed;
		pointer-events: none
	}

	.multiselect--disabled .multiselect__current, .multiselect--disabled .multiselect__select {
		background: #ededed;
		color: #a6a6a6
	}

	.multiselect__option--disabled {
		background: #ededed !important;
		color: #a6a6a6 !important;
		cursor: text;
		pointer-events: none
	}

	.multiselect__option--group {
		background: #ededed;
		color: #35495e
	}

	.multiselect__option--group.multiselect__option--highlight {
		background: #35495e;
		color: #fff
	}

	.multiselect__option--group.multiselect__option--highlight:after {
		background: #35495e
	}

	.multiselect__option--disabled.multiselect__option--highlight {
		background: #dedede
	}

	.multiselect__option--group-selected.multiselect__option--highlight {
		background: #ff6a6a;
		color: #fff
	}

	.multiselect__option--group-selected.multiselect__option--highlight:after {
		background: #ff6a6a;
		content: attr(data-deselect);
		color: #fff
	}

	.multiselect-enter-active, .multiselect-leave-active {
		transition: all .15s ease
	}

	.multiselect-enter, .multiselect-leave-active {
		opacity: 0
	}

	.multiselect__strong {
		margin-bottom: 8px;
		line-height: 20px;
		display: inline-block;
		vertical-align: top
	}

	[dir=rtl] .multiselect {
		text-align: right
	}

	gbt{
		background: red;
	}
	[dir=rtl] .multiselect__select {
		right: auto;
		left: 1px
	}

	[dir=rtl] .multiselect__tags {
		padding: 8px 8px 0 40px
	}

	[dir=rtl] .multiselect__content {
		text-align: right
	}

	[dir=rtl] .multiselect__option:after {
		right: auto;
		left: 0
	}

	[dir=rtl] .multiselect__clear {
		right: auto;
		left: 12px
	}

	[dir=rtl] .multiselect__spinner {
		right: auto;
		left: 1px
	}

	@keyframes a {
		0% {
			transform: rotate(0)
		}
		to {
			transform: rotate(2turn)
		}
	}

}



</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--
<style lang="scss" type="text/scss">
	.thumbnail{

		height: 50px;
		width: auto;
	}


</style>
-->
