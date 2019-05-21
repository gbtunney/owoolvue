import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
import {ProductMixin} from  '@/mixins/productmixin.js';
import { getVariantFromOptions,filterArrayByValue,isVariantAvailable} from '@/helpers/main.js'

//  ProductMixin
export const ProductOptionPickerMixin = {
    data() {
        return {
            _optionsArr : [],
            _currentVariant:[] //selected option
        }
    },
    name: 'ProductOptionPicker',
    computed: {
        ...mapGetters([
                'OptionByProp',
                'OptionValueByProp',
                'MetafieldsByProps'
            ]
        ),
        Slug:function(){
            return "wild-geranium"
        },
        CurrentVariant:{
            get: function() {
                return  this.$data._currentVariant;
            },
            set: function(newVal) {
                //console.log("setting@ variant");
                this.$data._currentVariant = newVal;  ///this.Variants[this.CurrentVariant._index];
            }
        },
        SelectedOptions: function() {
            return Array.from(this.SelectedOptionsDictionary);
        },
        SelectedOptionsDictionary: function() {
            if (  this.$data._currentVariant &&  this.$data._currentVariant.options){
                return  this.$data._currentVariant.options;
            }else{
                return new Map;
            }
        }
    },
    watch: {
        inSelectedVariant: function(val) {
            console.log("app changed variant!!!!!!!!",val);
            this.CurrentVariant=val;
        },
        meta: function(val) {
            console.log("META SET!!!!!!!!!!!",val);
            //this.CurrentVariant=val;
        }
    },
    methods:{
        SelectedOptionValue: function( val ,optionsDictionary =this.SelectedOptionsDictionary  /* or id?????*/ ) {
            
            if ( val && isNaN(val) && val.hasOwnProperty('id')){    //the whole object
                return ( optionsDictionary.get(val.id) ) ? optionsDictionary.get(val.id) : false;
            }else if ( optionsDictionary.get(val) ) {
                return optionsDictionary.get(val);
            }else if ( !isNaN(val) &&  Array.from(optionsDictionary).length >= val ){ /*or what ever total amt of optiosn is.  )*/
                //its an index
                return Array.from(optionsDictionary)[val];
            }
            return "**BUSTED";
            throw "BUSTED SELECTED OPTION"
        },
        ...mapMutations(['setlayoutButton']),
        
        optionChanged: function(option,value) {
            
            var newOptionDictionaryforPendingVariant = new Map(this.SelectedOptionsDictionary);
            
            if ( newOptionDictionaryforPendingVariant.get(option.id) ){
                
                if ( newOptionDictionaryforPendingVariant.get(option.id) != value ){
                    newOptionDictionaryforPendingVariant.set(option.id, value);
                    var idmap = Array.from(newOptionDictionaryforPendingVariant.values()).map(function(option){
                        if (option.hasOwnProperty('id')){
                            return option.id;
                        }
                    })
                    
                    var foundVariantArr = this._getVariantFromOptions( idmap, this.Variants);
                    
                    if (foundVariantArr && foundVariantArr.length==1 ){
                        this.$emit('optionChanged',foundVariantArr[0], newOptionDictionaryforPendingVariant )
                    }else{
                        console.log("VARIANT SEARCH RETURNED MORE OR LESS THAN AMOUNT TO TRIGGER A CHANGE!!!",foundVariantArr,newOptionDictionaryforPendingVariant )
                    }
                }
            }
        },
        _getVariantFromOptions: function( optionArray, variantsArr ) {   //move to a mixin.
            return   getVariantFromOptions(optionArray, variantsArr);
        },
        _remapOptionValuesDisabled: function(val) {
            
            if ( val){
                let self = this;
                
                let activeoption = val;//this.SelectedOption(val)
                let selectedoptionsArr = Array.from(self.SelectedOptionsDictionary.values());
                
                return activeoption.values.filter(function(activeoptionvalue) {
                    
                    let variableOption = activeoptionvalue;
                    
                    var testableCombo = selectedoptionsArr.map(function(_optionvalues) {
                        if (_optionvalues.parent_id == activeoptionvalue.parent_id){
                            return activeoptionvalue;
                        } else {
                            return _optionvalues;
                        }
                    })
                    
                    var variants = self._getVariantFromOptions(testableCombo, self.Variants);
                    if (variants.length < 1){
                        return true;
                        
                    }else if (variants.length == 1){
                        if ( !isVariantAvailable(variants[0]) ){
                            return true;
                        }
                    }
                    
                })
                
            }
        }
    },
};