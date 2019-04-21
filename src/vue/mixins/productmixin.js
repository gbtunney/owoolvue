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

	    ...mapState({
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
	CurrentProductOptions: function() {
		
		if ( this.CurrentProduct ){
			
			
			return this.OptionsArrByProduct(this.CurrentProduct.id);
		}else{
			return [];
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
    NormalizedProductID: function() {
	    return parseInt(this.$props.productid);
    },
    NormalizedVariantID: function() {
	    return parseInt(this.$props.variantid);
    }
    },
    methods:{
	    loadProduct:function(){
		    let self = this;
		
		    return this.getProduct({params: {id: this.$props.productid}})
		
	    },
        loadProductMeta:function(productid){
	      //  getProductMeta
	        this.getProductMeta({params: {productid:productid}}).then(function(res) {
	        
	        })
         
        }
    },
    }
    
    

