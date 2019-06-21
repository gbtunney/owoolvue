import {mapGetters, mapActions, mapState, mapMutations} from 'vuex';

const Numeral = require('numeral');
import {UIDMixin} from '@/mixins/uid-mixin.js';

export const ProductMixin = {
    props: {
        productid: {
            default: false
        },
        variantid: {
            default: false
        },
        producthandle: {
            default: false
        },
        defaults: {
            type: Object,
            default: () => {
            }
        },
        default_heirarchy: {
            type: Array,
            default: () => []
        },
        imagesize: {
            required: false,
            type: [Boolean, String],
            default:'350x350'
        }
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
            CurrentProduct(state) {
                if ( this.NormalizedProductID )
                return state.product_dictionary.get(this.NormalizedProductID);
            }
        }),
        ProductUrl: function(){
            if ( this.CurrentProduct && this.CurrentProduct.handle) return `/products/${this.CurrentProduct.handle}`
            return false;
        },
        ProductVariantArr: function() {

            //TODO: figure out what the deal is with this.
            let self = this;

            if (this.CurrentProduct){
                if (this.CurrentProduct.variants){
                    var newArr = this.CurrentProduct.variants.map(function(variant) {
                        if (self.variant_dictionary.get(variant.id)){
                            return self.variant_dictionary.get(variant.id);
                        }
                        return false
                    })
                    return newArr.filter(function(item){
                        if ( !item ) return false;
                        return true;
                    });
                } else {
                    return this.Variants;
                }

            } else {
                this.Variants;
            }
            return this.Variants; //this._mapDisabledVariants(this.Variants, [] /*this._getVariantFromOptions( [value.id], this.Variants)*/);
        },
        MappedDefaults: function () {
            let self = this;

            if (!this.$props.default_heirarchy || this.$props.default_heirarchy.length<1 ) return false;
            var new_map = this.$props.default_heirarchy.map(function (item) {

                console.log("ITEM IS!!", item)
                var delimiter = ".";
                let keyItemArr = [];

                if (r.is(Array, item)) {
                    keyItemArr = item;
                }

                if (r.is(String, item)) {
                    keyItemArr = item.toString().split(delimiter);
                }

                console.log("key item ",keyItemArr )
                if (self.$props.product) {

                    if (self.$props.product.hasOwnProperty(item)) {
                        keyItemArr.push((self.$props.product[item]).toString().toLowerCase());
                    }
                }
                return ( self.Defaults(keyItemArr) ) ? ( self.Defaults(keyItemArr) ): [] ;
            });

            return Object.assign(...new_map);
        },
        CurrentProductTitle: function() {
            
            if (this.CurrentProduct){
                return this.CurrentProduct.title;
            } else {
                return false;
            }
        },
        CurrentProductSubtitle: function() {
            
            if (this.CurrentProduct && this.CurrentProduct.subtitle){
                return this.CurrentProduct.subtitle;
            } else {
                return false;
            }
        },
        CurrentProductOptions: function() {
            if (this.CurrentProduct){
                return this.OptionsArrByProduct(this.CurrentProduct.id);
            } else {
                return [];
            }
        },
        CurrentProductRavelryLink: function() {
            
            if (this.CurrentProduct && this.CurrentProduct.download && this.CurrentProduct.download.ravelry){
                
                return this.CurrentProduct.download.ravelry;
            } else {
                return false;
                ;
            }
        },
        CurrentProductID: function() {
            return this.CurrentProduct.id;
        },
        CurrentProductImages: function() {
            if (this.CurrentProduct && this.ImagesByProduct(this.CurrentProduct)){
                return this.ImagesByProduct(this.CurrentProduct);
            } else {
                return [];
            }
        },
        CurrentProductVendor: function() {
            if (this.CurrentProduct && this.CurrentProduct.vendor){
                return this.CurrentProduct.vendor;
            } else {
                return false;
            }
        },
        _getProductDefaultImage:function(product){
        
        
        },
        _getProductDefaultImage:function(product){
        
        
        },
        CurrentProductDefaultImage: function() {
            if (this.CurrentProduct){
                if (this.CurrentVariant && this.CurrentVariant.image_id && this.product_image_dictionary.get(this.CurrentVariant.image_id)){
                    return this.product_image_dictionary.get(this.CurrentVariant.image_id);
                } else if (this.CurrentProduct.image.id && this.product_image_dictionary.get(this.CurrentProduct.image.id)){
                    return this.product_image_dictionary.get(this.CurrentProduct.image.id);
                }
            }
            return false;
        },
        CurrentProductDesc: function() {
            
            if (this.CurrentProduct && this.CurrentProduct.body_html){
                return this.CurrentProduct.body_html;
            } else {
                return false;
            }
        },
        NormalizedProductID: function() {

            if ( this.$data._productid ){
                return parseInt(this.$data._productid);
            }else{
                return parseInt(this.$props.productid);
            }
        }
    },
    methods: {
        loadProduct: function() {
            let self = this;
            
            return this.getProduct({params: {id: this.$props.productid, handle: this.$props.producthandle}})
            
        },
        loadProducts: function() {
            let self = this;
            return this.getProducts();
        },
        initCurrentProduct: function (current_product, _options = false) {

            if ( this.MappedDefaults ){
                current_product= this.GetMergedProduct(current_product);
            }

            this.$data._productid = current_product.id;

            //!***PRODUCT
            this.add_product_to_dictionary({product: current_product });

            //!***VARIANTS
            this.add_variants_to_dictionary({variants: this.CurrentProduct.variants});

            //!**IMAGES
            this.add_images_to_dictionary({images: this.CurrentProduct.images});

            if (_options && this.VariantArr && this.VariantArr.length > 1) {
                //!***INIT OPTIONS TODO: eventually be able to turn this off?
                this.initOptions(this.CurrentProduct);
            }
        },
        initOptions:function(current_product){
            var payload = {
                options: current_product.options,
                optionconfig: (current_product.optionconfig && current_product.optionconfig.length > 0) ? current_product.optionconfig : false,
                option_value_overrides: (current_product.optionvalues && current_product.optionvalues.length > 0) ? current_product.optionvalues  : false
            };
            this.add_options_to_dictionary(payload);
        },
        Defaults: function (_key = false, _flattened = false, _defaults = this.$props.defaults, _delimiter = '.') {
            var return_obj = false;
            if (!_key) {
                return_obj = _defaults;
            } else if (_key && r.is(String, _key)) {
                _key = _key.split(_delimiter);
            }
            if (_key && r.is(Array, _key)) {
                return_obj = (r.path(_key, _defaults)) ? r.path(_key, _defaults) : false;
            }

            if (!_flattened) return return_obj;
            if (_flattened && r.is(Boolean, _flattened)) return flatten(return_obj, FLATTEN_OPTIONS_DEFAULT);
            if (_flattened && r.is(Object, _flattened)) return flatten(return_obj, _flattened) //overriding the default options.
            return false;
        },
        GetMergedProduct: function (product = this.$props.product, override = this.MappedDefaults) {
            if (!product) return false;
            let R = r;
            let self = this;
            let customMerge = function (k, l, r) {
                if (R.is(Array, k) && R.is(Array, l)) {
                    var newVal = k.map(function (item, index) {
                        return Object.assign(R.clone(item), l[index]);
                    })
                }
                return newVal;//k == 'values' ? R.concat(l, r) : r
            };
            return R.mergeWith(customMerge,
                R.clone(product), R.clone(override)
            );
        },
        loadProductMeta: function(productid) {
            //  getProductMeta
            this.getProductMeta({params: {productid: productid}}).then(function(res) {
            
            })
        }
    },
}
    
    

