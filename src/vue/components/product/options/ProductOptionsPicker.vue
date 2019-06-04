<template>
	<div>
		<singleProductOptionPicker v-for="option,index in options"
		                           :option="option"
		                           :selectedoptionvalue="SelectedOptionValue(option.id)"
		                           :disabledOptions="_remapOptionValuesDisabled(option)"
		                           :key="index"
		                           class="optionpicker"
		                           :searchable="option.searchable"
		                           @optionChanged="optionChanged" >

		</singleProductOptionPicker>


	</div>
</template>

<script type="text/javascript">
    import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';

	import {ProductMixin} from  '@/mixins/productmixin.js';
	import singleProductOptionPicker from '@/components/product/options/SingleProductOptionPicker.vue'
	import { getVariantFromOptions,dictionaryIDArr,filterArrayByValue,isVariantAvailable} from '@/helpers/main.js'

	//  ProductMixin
	export default {
		props: {
			options: {  ////plural options
				required:false
			},
			inSelectedVariant: {  ////plural options
				required:false
			},
		},

		mixins: [ProductMixin],
		components: {singleProductOptionPicker},
		data() {
			return {
				_optionsArr : [],
				_currentVariant:[] //selected option
			}
		},
		name: 'ProductOptionPicker',
		computed: {

		CurrentVariant:{
			get: function() {
					return  this.$data._currentVariant;
			},
			set: function(newVal) {
				this.$data._currentVariant = newVal;  ///this.Variants[this.CurrentVariant._index];
			}
		},
		SelectedOptions: function() {
			return Array.from(this.SelectedOptionsDictionary);
		},
		SelectedOptionsDictionary: function() {
			if (  this.$data._currentVariant &&  this.$data._currentVariant.options){
				return  this.$data._currentVariant.options;
			}
            return new Map;
        }
	},
	watch: {
		inSelectedVariant: function(val) {
			this.CurrentVariant=val;
		}
	},
	methods:{
        //***** FILTER OUT UNAVAILABLE VARIANTS FROM ARRAY
        _getFilterUnavailable: function(variants) {
            return variants.filter(function(variant) {
                return (isVariantAvailable(variant)) ? true : false
            })
        },
        SelectedOptionValue: function(val, optionsDictionary = this.SelectedOptionsDictionary  /* or id?????*/) {
            if (val && isNaN(val) && val.hasOwnProperty('id')){    //the whole object
                return (optionsDictionary.get(val.id)) ? optionsDictionary.get(val.id) : false;
            } else if (optionsDictionary.get(val)){
                return optionsDictionary.get(val);
            } else if (!isNaN(val) && Array.from(optionsDictionary).length >= val){ /*or what ever total amt of optiosn is.  )*/
                //its an index
                return Array.from(optionsDictionary)[val];
            }
            return "**BUSTED";
            throw "BUSTED SELECTED OPTION"
        },
        optionChanged: function(option, value) {

            //clone the selected options dictionary
            var selectedOptionsDictionary_for_PendingVariant = new Map(this.SelectedOptionsDictionary);

            ///if the single option selected is registered, replace with new option if its different.
            if (selectedOptionsDictionary_for_PendingVariant.get(option.id) && (selectedOptionsDictionary_for_PendingVariant.get(option.id) != value)){

                selectedOptionsDictionary_for_PendingVariant.set(option.id, value);

                //convert the dictionary to ids, then find the variants.
                var foundVariantArr = this._getFilterUnavailable(getVariantFromOptions(dictionaryIDArr(selectedOptionsDictionary_for_PendingVariant), this.Variants));

                if (foundVariantArr && foundVariantArr.length == 1){
                    this.$emit('optionChanged', foundVariantArr[0], selectedOptionsDictionary_for_PendingVariant)
                } else {
                    console.log("VARIANT SEARCH RETURNED MORE OR LESS THAN AMOUNT TO TRIGGER A CHANGE!!!", foundVariantArr, newOptionDictionaryforPendingVariant)
                }
            }
        },
        _remapOptionValuesDisabled: function(val) {
            if (val){
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
                    var variants = getVariantFromOptions(testableCombo, self.Variants);
                    if (variants.length < 1){
                        return true;

                    } else if (variants.length == 1){
                        if (!isVariantAvailable(variants[0])){
                            return true;
                        }
                    }
                })
            }
        }
	},
	};
</script>

<style lang="scss" type="text/scss">
	@import "src/vue/helpers/product-dependancies.scss";

	.optionpicker {

		img {
			height: auto;
			width: 100%;
			max-width: 100%;
		}
		.option__desc {
			padding: #{get-lookup-prop( base-padding, md)};
		}
		.option__swatch {
			img {
				object-fit: cover;
				height: 100%;
				width: 100%;
			}
			width: 2em;
			height: 2em;
		}

	}

	.span {
	}
</style>
-





