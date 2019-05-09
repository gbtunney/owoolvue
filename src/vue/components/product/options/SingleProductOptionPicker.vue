<template>
	<div >

		<div class="attribute-panel">
			<code style="display: none">{{disabledOptions}}</code>
			<code style="display: none">{{option}}</code>
			<div v-show="false" >
				<code style="">{{selectedOptions}}</code>

				<ul>
					<li v-for="value,key  in selectedOptions">{{key}} : <input class="vue-form-test" v-model="selectedOptions[key]" type="text"> </input></li>

				</ul><button @click="transformOptions">TRANSFORM ARRAY</button>

			</div>
			<div>
				<h5 class="option__name">{{option.name}}<span v-if="selectedOptions.title"> : {{selectedOptions.title}}</span> </h5>
				<h5 class="option__color-story" v-if="selectedOptions.color_story">{{selectedOptions.color_story}}</h5>
				<FuseSearch
					class="fuseSearchComponent"
					v-show="searchable"
					@fuseResult="fuseFilter"
					@fuseInactive="fuseInactive"
					:keys='["title","tags","color_story"]'
					:list="OptionValues">
				</FuseSearch>


				<Multiselect :options="FilteredOptionValues" class="--is-open"
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
						<div class="option__swatch"  v-bind:style="OptionSwatchCSS(props.option)"  style="">
							<img v-if="props.option.swatch_image" class="option__image" :src="_getSwatchSrc(props.option)" >
						</div>
						<div class="option__desc"><span class="option__title">{{ props.option.title }}</span></div>
					</template>

				</Multiselect>
				<kabob class="divider" scheme="accent-default" componentclass="c-kabob"></kabob>

			</div>

		</div>
	</div>
</template>

<script type="text/javascript">

	import Vue from 'vue';
	//    import Multiselect from 'vue-multiselect'
	import Multiselect from '@/components/utilities/gMultiselectList.vue'
	//import Multiselect from 'vue-multiselect'
	import kabob from '@/components/utilities/kabob';

	import {mapGetters,mapState} from 'vuex'
	import store from '@/store'
	import { ShopifyImgURL, getVariantFromOptions} from '@/helpers/main.js'

	import FuseSearch from '@/components/utilities/g-Fuse-Search.vue';
    import isColor from 'is-color';


	export default {
		name: 'ProductOptionPicker',
		components: {
			Multiselect,FuseSearch,kabob
		}, props: {
			option: {
				default: false
			},
			swatchsize: {
				required:false,
				type:String ,
				default:'150x150'

			},
			selectedoptionslug: {   ///TODO:this is acrually an optionvalueslug
				required:false
			},
			selectedoptionvalue: {
				required:false
			},
			searchable: {
				default: false    //an array with options that are searchable
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
				_filteredOptionValues:false,
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
			},
			selectedoptionvalue:function(val) {
				if (val && val.hasOwnProperty('id')){
					this.$data.selectedOptions = val;
					this.OptionValues =this.$data._optionValues; // updates disabledthis._mapDisabledOptions(this.$data._optionValues,this.$props.disabledOptions);// val.values;
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
			OptionValues: {
				get: function() {
					return this.$data._optionValues;
				},
				set: function(newVal) {
					this.$data._optionValues = 	this._mapDisabledOptions(newVal,this.$props.disabledOptions);
				}
			},
			FilteredOptionValues: {
				get: function() {
					if (!this.$data._filteredOptionValues){
						return this.OptionValues;
					}else{
						return this.$data._filteredOptionValues;
					}
				},
				set: function(newVal) {
					this.$data._filteredOptionValues =newVal; //	this._mapDisabledOptions(newVal,this.$props.disabledOptions);
				}
			},
		...mapGetters([
			'Options','OptionValueByProp','Variants'
		]),
	...mapState({
		variant_dictionary: state => state.variant_dictionary,
		product_image_dictionary: state => state.product_image_dictionary,
		option_dictionary: state => state.option_dictionary
	})

	},
	methods: {
			transformOptions:function(){

				var option = this.$data.selectedOptions;

				var obj = 	{
						slug: option.slug,
						color_story:option.color_story,
						tags:option.tags,
						color:option.color
					}
			},
        OptionSwatchCSS: function(option) {
            var color = option.color;
            if (isColor(color)){
                return {backgroundColor: color, 'border-width': '1px','border-style' :'solid'}
            } else {
                if (!option.swatch_image){
                    return {display: 'none'}
                }else{
                    return {'border-width': '1px','border-style' :'solid'}
                }
            }
        },
		_getSwatchSrc: function(option){

			if (option.swatch_image == true || option.swatch_image == "true"){
                var foundVariantArr = getVariantFromOptions([option.id], this.Variants);

                if (foundVariantArr && foundVariantArr.length > 0 && foundVariantArr[0].image_id){
                    var img = this.product_image_dictionary.get(foundVariantArr[0].image_id);
                    if (img){
                        return ShopifyImgURL(img.src, this.$props.swatchsize);
                    }
                }
            }
            return false;
		},
		_mapDisabledOptions:function(optionvalues,disabledOptions,bool=true){

			let newOptionsArr =Array.from(optionvalues);
			let _disabledArr =disabledOptions;

			newOptionsArr = newOptionsArr.map(function(optionvalue) {

				let ID = optionvalue.id;
				var result = _disabledArr.find(function(item) {

					if (ID == item.id){
						return true;
					} else {
						return false;
					}
				})

				if (result){
					return Object.assign(optionvalue, {$isDisabled: bool})
				} else {
					return Object.assign(optionvalue, {$isDisabled: !bool})
				}
			})
			return newOptionsArr;
		},
		fuseFilter: function(result, query, list, fuse_options) {
			console.log("FUSE FILTERED OPTION" , result,query,list, fuse_options);
			this.FilteredOptionValues = result;
		},
		fuseInactive:function( list, fuse_options){
			console.log("FUSE INACTIVEEE!!!" ,list, fuse_options);
			this.FilteredOptionValues = list;
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

	@import "src/vue/helpers/product-dependancies.scss";

	//TODO DIX THIS
	.divider{
		font-size: 10px;
		width: 60%;
		margin: 0 auto;
		opacity:.5;
	}
	h5{
	}
.vue-form-test{
	@include g-color-scheme(dark, (background:true, foreground:true, border:true));

}


	.option {

		&__color-story {
			@include g-typeset(xs, font-small-caps);
			@include g-color-scheme(accent-default);
		//	background: red;
		}

		input[type=text]{
			background: red;

		}
	}
//	.option__color-story{}




	.multiselect__single{
		width: 100%;
	}


	.multiselect__content{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;

	}

.fuseSearchComponent{
	padding-top: 0;
	padding-bottom:  get-lookup-prop( base-padding, md);//get-lookup-prop($collection:(),$variant-key:false, $prop: false );
margin-top:-20px;
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
