import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
const Numeral = require('numeral');
import {UIDMixin} from  '@/mixins/uid-mixin.js';

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
		    	_currentVariant: [],
	          _currentProduct: false
		    }
	    },
	    name: 'testcomponent',
	    computed: {
	    ...mapGetters([
		    'Variants',
		    'Options',
		    'ImagesByProduct'
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
		    return false;
	    }
    },
    CurrentProductSubtitle: function() {
	
	if ( this.CurrentProduct &&  this.CurrentProduct.subtitle ){
		return this.CurrentProduct.subtitle;
	}else{
		return false;
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
    }, CurrentProductImages:function(){
                if ( this.CurrentProduct && this.ImagesByProduct(this.CurrentProduct)){
                    return this.ImagesByProduct(this.CurrentProduct);
                }else{
                    return [];
                }
            },
	CurrentProductVendor:function(){
		if ( this.CurrentProduct && this.CurrentProduct.vendor ){
			return this.CurrentProduct.vendor;
		}else{
			return false;
		}
	},
        
            CurrentProductDesc:function(){
    
                if ( this.CurrentProduct && this.CurrentProduct.body_html ){
                    return this.CurrentProduct.body_html;
                }else{
                    return false;
                }
            }	,
    NormalizedProductID: function() {
	    return parseInt(this.$props.productid);
    }
    },
    methods:{
	    loadProduct:function(){
		    let self = this;
		
		    return this.getProduct({params: {id: this.$props.productid}})
		
	    },
        loadProducts:function(){
            let self = this;
        console.log("loading products!");
            return this.getProducts();
        
        },
        loadProductMeta:function(productid){
	      //  getProductMeta
	        this.getProductMeta({params: {productid:productid}}).then(function(res) {
	        
	        })
         
        }
    },
    }
    
    

