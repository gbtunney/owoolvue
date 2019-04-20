<template>
	<div >

		<div class="attribute-panel">

			<code>{{disabledOptions}}</code>
			<code style="display: none">{{option}}</code>
			<code style="display: none">{{selectedOptions}}</code>

			<div>
				<FuseSearch
					v-show="searchable"
					@fuseResult="fuseFilter"
					@fuseInactive="fuseInactive"
					:list="OptionValues">
				</FuseSearch>

				<h3 class="option__name">{{OptionName}} </h3>

				<Multiselect :options="OptionValues" class="--is-open"
				             v-model="selectedOptions"
				             @input="$emit('optionChanged',option, selectedOptions)"
				             v-on:close=""
				             v-on:open="selectOpen(option)"
				             displayMode="vertical"
				             :taggable="false"
				             label="title"
				             ref="gillian"
				             :multiple="false"
				             track-by="title"
				             :closeOnSelect="false"
				             :allow-empty="true">

					<template slot="singleLabel"  slot-scope="props">
						<div>
							<div v-if="option.slug == 'color'">
                            <span class="search-icon c-icon c-icon--light-alt --no-border">
                            <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-search" viewBox="0 0 32 32"><path fill="#444" d="M21.839 18.771a10.012 10.012 0 0 0 1.57-5.39c0-5.548-4.493-10.048-10.034-10.048-5.548 0-10.041 4.499-10.041 10.048s4.493 10.048 10.034 10.048c2.012 0 3.886-.594 5.456-1.61l.455-.317 7.165 7.165 2.223-2.263-7.158-7.165.33-.468zM18.995 7.767c1.498 1.498 2.322 3.49 2.322 5.608s-.825 4.11-2.322 5.608c-1.498 1.498-3.49 2.322-5.608 2.322s-4.11-.825-5.608-2.322c-1.498-1.498-2.322-3.49-2.322-5.608s.825-4.11 2.322-5.608c1.498-1.498 3.49-2.322 5.608-2.322s4.11.825 5.608 2.322z"/></svg>
                        </span>
							</div>
						</div>
					</template>
					<template slot="selection" slot-scope="{ values, searchable,search, isOpen }">
						<div v-if="option.slug == 'color'"></div>
						<span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span>
					</template>

					<template slot="option" class="is-grid-2" slot-scope="props">
						<div class="option__swatch" v-if="_getSwatchSrc(props.option)"  v-bind:style="{ backgroundColor: props.option.color}"  style=""><img  class="option__image" :src="_getSwatchSrc(props.option)" >
						</div>
						<div class="option__desc"><span class="option__title">{{_getIsDisabled(props.option)}} {{ props.option.title }}</span></div>
					</template>

				</Multiselect>
			</div>

		</div>
	</div>
</template>

<script type="text/javascript">

	import Vue from 'vue';
	//    import Multiselect from 'vue-multiselect'
	import Multiselect from '@/components/utilities/gMultiselectList.vue'
	//import Multiselect from 'vue-multiselect'

	import {mapGetters,mapState} from 'vuex'
	import store from '@/store'
	import { ShopifyImgURL, getVariantFromOptions} from '@/helpers/main.js'

	import FuseSearch from '@/components/utilities/g-Fuse-Search.vue';


	export default {
		name: 'ProductOptionPicker',
		components: {
			Multiselect,FuseSearch
		}, props: {
			option: {
				required:false
			},
			selectedoptionslug: {   ///TODO:this is acrually an optionvalueslug
				required:false
			},
			selectedoptionvalue: {
				required:false
			},
			searchable: {
				default: true    //an array with options that are searchable
			},
			swatches: {
				type:Boolean,
				default: false    //an array with options that are searchable
			},
			disabled: {
				type:Boolean ,
				default: false   //an array with options that are searchable
		},
			disabledOptions: {
				type:Array ,
				default: () => []   //an array with options that are searchable
			}
		},
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				totalOptions: 3,
				_optionValues: [],
				searchQuery: false,
				selectedOptions: [],
				selectedVariant: [],
			}
		},
		created: function() {
			if ( this.$props.option &&  this.$props.option.values){
				this.OptionValues = this.$props.option.values;
				if (this.$props.selectedoptionvalue && this.$props.selectedoptionvalue.id){
					this.$data.selectedOptions=this.$props.selectedoptionvalue;
				}
			}
		},
		watch: {
			///todo: these miht need to be MIRRORED in a create func for some reason.
			selectedoptionslug: function(val) {
				if (val && this.OptionValueByProp(val)){
					this.$data.selectedOptions = this.OptionValueByProp(val);
				}
			},
			disabledOptions: function(val) {

				if ( val && val.length > 0 ){
					this.OptionValues=	this.$data._optionValues;//this._mapDisabledOptions(this.$data._optionValues,val)
					console.log("DISABLED CHANGEEEEEEDDDD!!",this._mapDisabledOptions(this.$props.option,val),val);

				}

				/*if (val && this.OptionValueByProp(val)){
					this.$data.selectedOptions = this.OptionValueByProp(val);
				}*/
			},
			selectedoptionvalue:function(val) {
				if (val && val.hasOwnProperty('id')){
					this.$data.selectedOptions = val;

					this.OptionValues =this.$data._optionValues; //this._mapDisabledOptions(this.$data._optionValues,this.$props.disabledOptions);// val.values;
					console.log("SELECTED OPTION CHANGED, should update values???",val,this.$props.disabledOptions);
				}
			},
			option: function(val) {
				if (val && val.values){
					this.OptionValues = val.values;  //this._mapDisabledOptions(this.$data._optionValues,this.$props.disabledOptions);// val.values;
				}
			}
		},
		computed: {
			OptionName: function(){
				if ( this.$props.option ){
					return this.$props.option.name;
				}
			},
			OptionValues: {
				get: function() {
					return this.$data._optionValues;


				},
				set: function(newVal) {


					this.$data._optionValues = 	this._mapDisabledOptions(newVal,this.$props.disabledOptions);
				}
			},
		...mapGetters([
			'Options','OptionValueByProp'
		]),
	...mapState({
		variant_dictionary: state => state.variant_dictionary,
		product_image_dictionary: state => state.product_image_dictionary,
		option_dictionary: state => state.option_dictionary
	})

	},
	methods: {
			_setSelectedOptionValues:function(){


			},
		_getSwatchSrc: function(option){
			/*if ( option.swatch_image==true || option.swatch_image == "true" ){
				var foundVariantArr = getVariantFromOptions([option.id],this.Variants  );
				if ( foundVariantArr && foundVariantArr.length>0 && foundVariantArr[0].image_id ){
					var img = this.product_image_dictionary.get( foundVariantArr[0].image_id);
					if (  img  ){
						return ShopifyImgURL(img.src,'150x150') ;
					}
				}
			}*/
			return false;
		},
		GetMultiselectClass: function(option) {
			return `attribute-${option.slug}`;
		},
		selectOpen: function(option) {
			if (option.isOpen){
				Vue.set(option, 'isOpen', !option.isOpen);

			} else {
				Vue.set(option, 'isOpen', !true);

			}
		},
		selectClosed: function(option) {
			//Vue.set(option, 'isOpen', false);
		},
		_getSearchable: function(option) {
			return ( option.slug == "color") ? true : false;
		},
		_mapDisabledOptions:function(optionvalues,disabledOptions,bool=true){

			let newOptionsArr =Array.from(optionvalues);
			let _disabledArr =disabledOptions;

				newOptionsArr=     newOptionsArr.map(function(optionvalue){
					let ID = optionvalue.id;

						var result =  _disabledArr.find(function(item){

							if (ID == item.id ){
								return true;
							}else{
								return false;
							}
						})



					if ( result ){
							//return true;
						return  Object.assign(optionvalue, {$isDisabled :bool })
					}else{
						return  Object.assign(optionvalue, {$isDisabled :!bool  })
					}
				})




			return newOptionsArr;
		},
		_getIsDisabled: function(option) {
			/*var inverseMap = new Map(this.option_dictionary)  //.delete(option.id);
			inverseMap.delete(option.parent_id);

			let newFilteredArray = this.Variants;
			let optionSelf = option;

			newFilteredArray = newFilteredArray.filter(function(variant) {

				var foundArray = [];

				var optionID = optionSelf.parent_id;
				var optionValueID = optionSelf.id;

				if (optionValueID == variant.options.get(optionID).id){
					return true;
				}
			})

			let self = this;
			inverseMap.forEach(function(value, key, map) {
				let currentSelectedOption = self.$data.selectedOptions[value._index];
				if (currentSelectedOption){
					newFilteredArray = newFilteredArray.filter(function(variant) {

						var foundArray = [];

						var optionID = currentSelectedOption.parent_id;
						var optionValueID = currentSelectedOption.id;

						if (optionValueID == variant.options.get(optionID).id){
							return true;
						}
					})
				}
			});

			if (newFilteredArray.length < 1){
				Vue.set(option, '$isDisabled', true);
			} else {
				Vue.set(option, '$isDisabled', false);
			}*/
			return;

		},
		clickMe: function() {
		},
		customLabel({title, desc}) {
			return `${title} – ${desc}`
		},
		variantSelectorChanged: function() {
			console.log("VUEX ::VARIANT CHANGED!!! ", this.$data.selectedVariant);
			this._setSelectedOptions();
		},
		fuseFilter: function(result, query, list, fuse_options) {
			//console.log("FUSE FILTERED OPTION" , result,query,list, fuse_options);
			this.OptionValues = result;
		},
		fuseInactive:function( list, fuse_options){
			console.log("FUSE INACTIVEEE!!!" ,list, fuse_options);
			this.OptionValues = list;
		}
	},
	filters: {
		toString: function(value) {
			if (!value) return ''
			value = value.toString()
			return value;
		}
	},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" >

//	@import "product-dependancies";

	.multiselect__single{
		width: 100%;
	}

	.option__name{
		display: none;
	}


	.search-icon{
		position: absolute;
		top: 0;
		right: 0;
	}

	.multiselect__tags {
	}

	/*SVG ICON SYSTEM*/
	.icon {
		display: inline-flex;
		align-self: center;
	}

	.icon svg, .icon img {
		height: 1em;
		width: 1em;
		fill: currentColor;
	}

	.icon.baseline svg, .icon img {
		top: .125em;
		position: relative;
	}

	.option__swatch {

		//   @include dimensions(100px,100px) ;
	}
	.option__image{
		// height: 60px;

	}
	.layout-sm{
		.option__swatch {
			clip-path: circle(40% at center);
			/* Also can take single values to make all sides the same, or 2 values (vert/horz), or 3 values (top/horz/bottom). */
		}

	}
	.layout-lg{
		.option__swatch{
			width: 300px;
			clip-path: inset(20% 20%);
			/* Also can take single values to make all sides the same, or 2 values (vert/horz), or 3 values (top/horz/bottom). */
		}

	}
	.layout-list{

		.option__image{
			height: 40px;
		}
	}
	.layout-grid{

		.multiselect__content{
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
			.option__swatch{
				//width: 50px;
				//clip-path: inset(20% 20%);
				/* Also can take single values to make all sides the same, or 2 values (vert/horz), or 3 values (top/horz/bottom). */
			}
			.option__image{
				width: 100%;
			}
			.option__title{
				background: red;
				width: 100%;
				text-align: center;
			}
		}
		.multiselect__option{
			display:block;
		}
	}

</style>
