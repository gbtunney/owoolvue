import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
const Numeral = require('numeral');

export const ProductMixin={
	    props: {
		    variantid: {
			    default: false
		    },
		    productid: {
			    default: false
		    },
	    },
	    components: {},
	    data() {
		    return {
		    	_currentVariant: false,
	          _currentProduct: false
		    }
	    },
	    name: 'testcomponent',
	    computed: {
	    ...mapGetters([
		    'Variants'
	    ]),

	    ...mapState({product_dictionary: state => state.product_dictionary,
		    variant_dictionary: state => state.variant_dictionary,
	    product_image_dictionary: state => state.product_image_dictionary,
	option_dictionary: state => state.option_dictionary,
	    CurrentProduct(state)
    {
	    return state.product_dictionary.get(this.NormalizedProductID);
    }
    }),
    CurrentProductTitle: function() {
	
	    if ( this.CurrentProduct ){
		    return this.CurrentProduct.title;
	    }else{
		    return "NO TITLE";
	    }
    },
    CurrentProductID: function() {
	
	    return this.CurrentProduct.id;
    },
	CurrentProductVendor:function(){
		if ( this.CurrentProduct && this.CurrentProduct.vendor ){
			return this.CurrentProduct.vendor;
		}else{
			return false;
		}
	},
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
	},
    NormalizedProductID: function() {
	    return parseInt(this.$props.productid);
    },
    NormalizedVariantID: function() {
	    return parseInt(this.$props.variantid);
    }
    },
    methods:{
    ...mapActions([
		    'getProduct','getVariant','getProductMeta','getVariantMeta'
	    ]),
    ...mapMutations(['increment', 'add_product_to_dictionary','add_variants_to_dictionary','add_images_to_dictionary','add_options_to_dictionary']),
		    loadVariant:function(){
		    let self = this;
		
		    console.log("test testvariant loaded!!")	;
		    this.getVariant({params: {id: this.$props.variantid}}).then(function(res) {
			    //self.add_product_to_dictionary({product: res.data.product});
			    self.add_variants_to_dictionary({variants: [res.data.variant]});
			    console.log("currenty variant ", this.variant_dictionary)
		    })
	    },
	    setCurrentVariant:function(variant){
		    let self = this;
		    
		    if (this.$data._currentVariant == false ){
			    this.$data._currentVariant = variant;
		    }
		
		   
		
	    },
	    loadProduct:function(){
		    let self = this;
		
		    return this.getProduct({params: {id: this.$props.productid}});
		
	    },
        loadProductMeta:function(productid){
	      //  getProductMeta
	        this.getProductMeta({params: {productid:productid}}).then(function(res) {
	        
	        })
         
        },
	    loadVariantMeta:function(productid,variantid){
		    //  getProductMeta
		    console.log("product variant meta");
		    this.getVariantMeta({params: {productid:productid,variantid:variantid}}).then(function(res) {
			
		    })
		
	    }
    },
    }
    
    

