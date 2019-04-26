<template>
	<div ref="MYCART" class="cart-wrapper">
		<span v-show="!Availability">NO STOCK AVAILABLE!!</span>
		<span v-if="kit">
			--{{Message}} <img class="thumbnail"  v-if="kit" :src="Image.src" :alt="Image.alt" > {{VariantName}} // Count: {{RequestedQuantity}} at {{VariantPrice | toUSD }} <strong>Total:</strong> {{VariantTotalPrice |toUSD}}
		<vue-numeric-input class="quantity-selector__input" @input="quantityChanged(item)"  v-show="item.quantity_editable" v-model="item.requested_quantity" :min="1" :max="Variant.inventory_quantity" :step="1"></vue-numeric-input>
		<span>total available: {{Variant.inventory_quantity}}</span>
		</span>
		<span v-else>
			<h3  class="pending-item-name">{{VariantName}} </h3>
		<vue-numeric-input class="quantity-selector__input" @input="quantityChanged(item)"  v-show="item.quantity_editable" v-model="item.requested_quantity" :min="1" :max="Variant.inventory_quantity" :step="1"></vue-numeric-input>
		<div class="pending-item-available" >available: {{Variant.inventory_quantity}}</div>
		</span>

	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {mapState, mapGetters, mapActions} from "vuex";
    import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';

    import { isVariantAvailable} from '@/helpers/main.js'

    import VueNumericInput from 'vue-numeric-input';

    ///TODO  - figure out how to do this 4 reals.
    
    Vue.filter('toUSD', function(value) {
        return `$${value}`;
    });

    export default {
        name: 'Cart',
        components: {VueNumericInput},
	    props: {
            item: {
                type: Object,
                required: true
            },
		    kit: {   ///this is used to give the kit an id
			    type: Boolean,
			    default: false
		    }
        },
	    mixins:[DictionaryMixin],
        data() {
            return {
                _variant:false,
	            _item:[],
	            _image:false
            }
        },
        created: function() {
	      /*  this.Variant = ;
	       */
	        if ( this.product_image_dictionary.get(this.Variant.image_id) ){
		        this.Image =this.product_image_dictionary.get(this.Variant.image_id);
	        }else{
		        this.getVariantDefaultImage(  {params: {productid:this.Variant.product_id, imageid:this.Variant.image_id}}).then(function(res){
			        self.Image= res.data.image;
		        });
	        }

        },
	    watch: {
		    item: function(val) {
			    console.log("NEW ITEM SSETTTT",this.Variant);
			    let self =this;

			    if ( this.product_image_dictionary.get(this.Variant.image_id) ){
			    	this.Image =this.product_image_dictionary.get(this.Variant.image_id);
			    }else{
				    this.getVariantDefaultImage(  {params: {productid:this.Variant.product_id, imageid:this.Variant.image_id}}).then(function(res){
					    self.Image= res.data.image;
				    });
			    }

			    console.log("WATCH WM _ __ ",isVariantAvailable(this.Variant))

			    this.$emit('available', this.Availability)


		    }
	    },
        mounted: function() {

	       // if (Availability){

		        console.log("mount EM IS ",this.Availability )
		        this.$emit('available', this.Availability)

	       // }
        }, computed: {
            RequestedQuantity: function() {
                return this.$props.item.requested_quantity;
            },
            Variant:
            function(){
	            return     this.$props.item.variant;//this.$data._variant ;
            },

            Image: {
                get: function() {
                    return     this.$data._image ;
                },
                set: function(newVal) {

                    this.$data._image = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            VariantPrice: function() {
                return this.Variant.price;
            },
            Message: function() {

                if (this.$props.item.message){
                    return this.$props.item.message;
                }else{
                    return "";
                }

            },
            VariantTotalPrice: function() {
                return ( this.Variant.price * this.$props.item.requested_quantity);
            },
            VariantName: function() {
                return this.Variant.title;
            },
            Availability: function() {

	            if ( isVariantAvailable(this.Variant) ){
		            if (Number(this.RequestedQuantity) <= Number(this.Variant.inventory_quantity)){
			            return true;
		            }

	            } else {
		            return false;
	            }

            }
        },
        methods: {
	        quantityChanged:function(item){
		        this.$emit('requested_quantity_change', item)
		        console.log("QUATITY CHANGEDDDDD!!!!",item)
	        },
            ...mapActions([
                'getVariantDefaultImage'
            ]),
        }
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css" scoped></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--
<style lang="scss" type="text/scss">
	.thumbnail{

		height: 50px;
		width: auto;
	}


</style>
-->
