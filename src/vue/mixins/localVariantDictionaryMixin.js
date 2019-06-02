import {mapGetters, mapActions, mapState, mapMutations} from 'vuex';
const Numeral = require('numeral');

export const LocalVariantDictionaryMixin = {
    props: {},
    components: {},
    data() {
        return {
            _local_variant_dictionary: false
        }
    },
    computed: {
        LocalVariantDictionary: {
            get: function() {
                if (!this.$data._local_variant_dictionary){
                    this.$data._local_variant_dictionary = new Map(this.variant_dictionary);
                }
                return this.$data._local_variant_dictionary;
            },
            set: function(newVal) {
                let self = this;
            
                if (typeof newVal == "map"){
                    self.$data._local_variant_dictionary = new Map([newVal, self.$data._local_variant_dictionary]);
                } else if (typeof newVal == "object" && newVal.length >= 1){
                    console.log("ADDING TO VARIANT DICTIONARY", newVal)
                
                    newVal.forEach(function(variant) {
                       if (! self.$data._local_variant_dictionary) {
                           self.$data._local_variant_dictionary = new Map();
                       }
                        
                        self.$data._local_variant_dictionary = new Map(self.$data._local_variant_dictionary).set(variant.id, variant);
                    })
                    self.$data._local_variant_dictionary = new Map(self.$data._local_variant_dictionary);
                }
            }
        }
    },
    methods: {}
}