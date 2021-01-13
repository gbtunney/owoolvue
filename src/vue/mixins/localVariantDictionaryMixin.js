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
    
              //  LocalVariantDictionary
             this.$data._local_variant_dictionary =newVal;
            }
        }
    },
    methods: {
    
    }
}