<template>
	<div>

		<h2  v-for="option,index in options">{{SelectedOptionValue(index)}}</h2>

		<singleProductOptionPicker v-for="option,index in options"
		                           :option="option"
		                           :selectedoptionvalue="SelectedOptionValue(option.id)"
		                           :key="index"
		                           searchable="false"
		                           @optionChanged="optionChanged" ></singleProductOptionPicker>


	</div>
</template>

<script type="text/javascript">
	import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import {ProductMixin} from  '@/mixins/productmixin.js';

	import singleProductOptionPicker from '@/components/product/options/SingleProductOptionPicker.vue'
	import { getVariantFromOptions} from '@/helpers/main.js'
	import 'vuetify/dist/vuetify.min.css'

	import Vue from 'vue';

	//custom version of vuemultiselect - stripped down.
	//  import Multiselect from '@/components/utilities/gMultiselectList.vue'
	//  import Multiselect from '@/components/utilities/gMultiselectList.vue'

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
		...mapGetters([
				'OptionByProp',
				'OptionValueByProp'
			]
		),
		Slug:function(){
			return "wild-geranium"
		},
		OptionsDictionary:function(){
			if ( this.CurrentVariant && this.CurrentVariant.options){
				return this.CurrentVariant.options;

			}else{
				return [];
			}
		},
		CurrentVariant:{
			get: function() {
					return  this.$data._currentVariant;
			},
			set: function(newVal) {
				console.log("setting@ variant");
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
		},
		/*_setSelectedOptions: function() {
			var selectedArr = new Array()

			if (this.$data.selectedVariant){
				this.$data.selectedOptions = [];
				for (var i = 0; i < this.Options.length; i++) {
					console.log("selected variant is ",this.$data.selectedVariant,this.Options,this.$data.selectedVariant.options );

					this.$data.selectedOptions.push(this.$data.selectedVariant.options.get(this.Options[i].id));
				}
			}
		},*/
	},
	watch: {
		inSelectedVariant: function(val) {
			console.log("app changed variant!!!!!!!!",val);
			this.CurrentVariant=val;
		}
	},
	created:function(){

	},
	mounted:function(){
	},
	methods:{
		SelectedOptionValue: function( val  /* or id?????*/ ) {
			console.log("TRYING TO GET INDEX VALUEE",this.OptionsDictionary,val);

			if ( isNaN(val) && val.hasOwnProperty('id')){    //the whole object
				return ( this.OptionsDictionary.get(val.id) ) ? this.OptionsDictionary.get(val.id) : false;
			}else if ( this.OptionsDictionary.get(val) ) {
				return this.OptionsDictionary.get(val);
			}else if ( !isNaN(val) &&  Array.from(this.OptionsDictionary).length >= val ){ /*or what ever total amt of optiosn is.  )*/
				//its an index
				return Array.from(this.OptionsDictionary)[val];
			}
			return "**BUSTED";
			throw "BUSTED SELECTED OPTION"
		},
	...mapMutations(['setlayoutButton']),

			testBtn:function(target){
			console.log("changed",target);
			this.setlayoutButton({index: target})
		},
		optionChanged: function(option,value) {
			console.log("OPTRIONq1 changed!!!!!",option,value, this._getVariantFromOptions( [value.id], this.Variants));
		},
		_getVariantFromOptions: function( optionArray, variantsArr ) {   //move to a mixin.
			return   getVariantFromOptions(optionArray, variantsArr);
		},
		setVariantsDisabled:function(variantsArr){
			if (newFilteredArray.length < 1){
				Vue.set(option, '$isDisabled', true);
			} else {
				Vue.set(option, '$isDisabled', false);
			}
		},
		getSelectedOptions:function(){

			//  this.CurrentVariant

			/*_setSelectedOptions: function() {
					   var selectedArr = new Array()

					   if (this.$data.selectedVariant){
						   this.$data.selectedOptions = [];
						   for (var i = 0; i < this.Options.length; i++) {
							   console.log("selected variant is ",this.$data.selectedVariant,this.Options,this.$data.selectedVariant.options );

							   this.$data.selectedOptions.push(this.$data.selectedVariant.options.get(this.Options[i].id));
						   }
					   }
				   },*/
		},
		_mapDisabledVariants:function(variantsArr,flaggedVariants,bool=true){   ///TODO: remap oos too seperate out

			var newVariantArr =Array.from(variantsArr);

			let _flaggedVariants =flaggedVariants;
			newVariantArr=     newVariantArr.map(function(variant){
				let ID = variant.id;

				var result =  _flaggedVariants.find(function(item){
					if (ID == item.id ){
						return true;
					}else{
						return false;
					}
				})
				if ( result || variant.inventory_quantity <=0  ){
					return  Object.assign(variant, {$isDisabled :bool })
				}else{
					return  Object.assign(variant, {$isDisabled :!bool  })
				}

			})

			return newVariantArr;
		}
	},
	};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css" ></style>

<style lang="scss" type="text/scss">

</style>





