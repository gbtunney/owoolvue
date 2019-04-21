import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
const Numeral = require('numeral');

export const VariantMixin = {
	props: {},
	components: {},
	data() {
		return {}
	},
	computed: {
		...mapGetters([
			'Variants'
		]),
		CurrentVariantID: function() {
			return this.CurrentVariant.id;
		},
		CurrentVariantTitle: function() {
			if ( this.CurrentVariant ){
				return this.CurrentVariant.title;
			}else{
				return "NO variant TITLE";
			}
			
		},
		CurrentVariantPrice:function(){
			if ( this.CurrentVariant && this.CurrentVariant.price ){
				return Numeral(this.CurrentVariant.price).format('$ 0,0[.]00');
			}else{
				return false;
			}
		},
		CurrentVariantCompareAtPrice:function(){
			if ( this.CurrentVariant && this.CurrentVariant.compare_at_price ){
				return Numeral(this.CurrentVariant.compare_at_price).format('$ 0,0[.]00');
			}else{
				return false;
			}
		},
		CurrentVariant:{
			get: function() {
				if (this.$data._currentVariant == false ){
					return this.variant_dictionary.get(this.NormalizedVariantID);
				}else{
					return  this.$data._currentVariant;
				}
			},
			set: function(newVal) {
				console.log("setting@");
				this.$data._currentVariant = newVal;  ///this.Variants[this.CurrentVariant._index];
			}
		},
		CurrentVariantOnSale:function(){
			
			if ( this.CurrentVariant && this.CurrentVariant.compare_at_price  ){
				
				if (  this.CurrentVariant.compare_at_price >  this.CurrentVariant.price ){
					return true;
				}else {
					return false;
				}
			}else{
				return false;
			}
		},
		CurrentVariantAvailable:function(){
			return true;
		}
	},
	methods: {
		loadVariant:function(){
			let self = this;

			console.log("test testvariant loaded!!")	;
			this.getVariant({params: {id: this.$props.variantid}}).then(function(res) {
				//self.add_product_to_dictionary({product: res.data.product});
				self.add_variants_to_dictionary({variants: [res.data.variant]});
				console.log("currenty variant ", this.variant_dictionary)
			})
		},
	
	loadVariantMeta:function(productid,variantid){
		//  getProductMeta
		console.log("product variant meta");
		this.getVariantMeta({params: {productid:productid,variantid:variantid}}).then(function(res) {
		
		})
		
	}
	}
}