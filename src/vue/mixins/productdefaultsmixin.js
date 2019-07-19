import {mapGetters, mapActions, mapState, mapMutations} from 'vuex';
const r =  require('ramda');
const RAM =  require('ramda');

const flatten = require('flat').flatten
const unflatten = require('flat').unflatten

export const ProductDefaultsMixin = {
    props: {
        defaults: {
            type: Object,
            default: () => {}
        },
        default_heirarchy: {
            type: Array,
            default: () => []
        }
    } ,data() {
        return {}
    },
    computed: {
        Test:function(){
            return "testtt";
        }
    },
    methods: {
        DefaultsFunc: function (_key = false, _flattened = false, _defaults = this.$props.defaults, _delimiter = '.') {
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
        },
        GetMappedDefaults: function (_product = this.$props.product,_defaultdata= this.$props.defaults, _default_heirarchy  = this.$props.default_heirarchy) {
            
            console.log("THE MAPPED DEFUALTS ARE", r)
            
            let self = this;
            var new_map = _default_heirarchy.map(function (item) {

               
                var delimiter = ".";
                let keyItemArr = [];

                if (r.is(Array, item)) {
                    keyItemArr = item;
                }

                if (r.is(String, item)) {
                    keyItemArr = item.toString().split(delimiter);
                }
                
                keyItemArr.forEach(function(_item,index){
                    if (_product.hasOwnProperty(_item)) {
                        if (  typeof _item == 'string'){
                            var push_value = (_product[_item]).toString().toLowerCase();
                            keyItemArr.push(push_value);
                        }
                    }
                })
                return self.Defaults(keyItemArr,false,_defaultdata);
            });

            return Object.assign(...new_map);
        }
 }
    
}