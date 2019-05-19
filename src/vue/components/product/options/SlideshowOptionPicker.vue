<template>
	<div class="slideshow-OptionPicker">
		<swiper :options="swiperOption" ref="mySwiper"  >
			<!-- slides -->
			<swiper-slide v-for="optionvalue,index in OptionValues" :key="index">
				<div >
					<img @click="optionChanged($props.option, optionvalue)" v-tooltip.top-start="optionvalue.title" :src="getShopifyImageURL(getDefaultImage(optionvalue))" >
				</div>
			</swiper-slide>

			<!-- Optional controls -->
			<div class="swiper-pagination"  slot="pagination"></div>
		<!--	<div class="swiper-button-prev" slot="button-prev">
				<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow-left" viewBox="0 0 32 32"><path fill="#444" d="M24.333 28.205l-1.797 1.684L7.666 16l14.87-13.889 1.797 1.675L11.269 16z"/></svg>
			</div>
			<div class="swiper-button-next" slot="button-next">
				<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow-right" viewBox="0 0 32 32"><path fill="#444" d="M7.667 3.795l1.797-1.684L24.334 16 9.464 29.889l-1.797-1.675L20.731 16z"/></svg>
			</div>-->
			<div class="swiper-scrollbar"   slot="scrollbar"></div>
		</swiper>
	</div>
</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
	import ProductOptionPickerMixin from '@/components/product/options/productOptionPickerMixin'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import { ShopifyImgURL, getVariantFromOptions} from '@/helpers/main.js'
    import {VariantMixin} from  '@/mixins/variantmixin.js';
    import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';
    import { VTooltip } from 'v-tooltip'

    Vue.directive('tooltip', VTooltip)
    module.exports = {
		name: '',
		mixins: [DictionaryMixin,VariantMixin],
		components: {
            swiper,
            swiperSlide
		},
        data() {

            return {
                _currentVariant:[] ,//selected option
                _optionValues:[],
                idle: false,
                swiperOption: {
                    loop: false,
                    preloadImages: true,

                    grabCursor: true,
                    centeredSlides: false,
                    scrollbar:false,
                    slidesPerView: 6,
                    spaceBetween: 0,
                    allowTouchMove:true,
                   /* navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },*/
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        draggable: true,
                        snapOnRelease: true
                    }
                }
            }
        },
        props: {
            option: {
                default: false
            },
            disabledOptions: {
                type:Array ,
                default: () => []   //an array with options that are searchable
            },
            inSelectedVariant: {  ////plural options
                required:false
            },
            swatchsize: {
                required:false,
                type:String ,
                default:'150x150'

            }
		},
        created: function() {
            if ( this.$props.option &&  this.$props.option.values){
                this.OptionValues = this.$props.option.values;
               /* if (this.$props.selectedoptionvalue && this.$props.selectedoptionvalue.id){
                    this.$data.selectedOptions=this.$props.selectedoptionvalue;
                }*/
            }
        },
        watch: {
            ///todo: these miht need to be MIRRORED in a create func for some reason.
            selectedoptionvalue:function(val) {
                if (val && val.hasOwnProperty('id')){
                    this.$data.selectedOptions = val;
                    this.OptionValues =this.$data._optionValues; // updates disabledthis._mapDisabledOptions(this.$data._optionValues,this.$props.disabledOptions);// val.values;
                    console.log("SELECTED OPTION CHANGED, should update values???",val,this.$props.disabledOptions);
                }
            },
            inSelectedVariant: function(val) {
                console.log("app changed variant!!!!!!!!",val);
                this.CurrentVariant=val;
            },
            option: function(val) {
                if (val && val.values){
                    this.OptionValues = val.values;  //this._mapDisabledOptions(this.$data._optionValues,this.$props.disabledOptions);// val.values;
                }
            }
        },
		computed: {
			...mapGetters([
				'Variants'
			]),
            CurrentVariant:{
                get: function() {
                    return  this.$data._currentVariant;
                },
                set: function(newVal) {
                    console.log("setting@ variant");
                    this.$data._currentVariant = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            SelectedOptionsDictionary: function() {
                if (  this.$data._currentVariant &&  this.$data._currentVariant.options){
                    return  this.$data._currentVariant.options;
                }else{
                    return new Map;
                }
            },
            OptionValues: {
                get: function() {
                    return this.$data._optionValues;
                },
                set: function(newVal) {
                    this.$data._optionValues = newVal;//	this._mapDisabledOptions(newVal,this.$props.disabledOptions);
                }
            },
			example: {
				get: function() {
					return;
				},
				set: function(newVal) {
					//=newVal;
				}
			},
			example2: function() {
				
			}
		},
		methods: {
            _getVariantFromOptions: function( optionArray, variantsArr ) {   //move to a mixin.
                return   getVariantFromOptions(optionArray, variantsArr);
            },
            optionChanged: function(option,value) {
                //@click="$emit('optionChanged',$props.option, optionvalue)"

	            console.log("******OPTION HANGED!!", option, value)
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
		    getShopifyImageURL(img){
		        if ( img ){
                    return ShopifyImgURL(img.src, this.$props.swatchsize);
		        }else{
		            return false;
		        }
		    },
            getDefaultImage: function(option){

                if (option.swatch_image == true || option.swatch_image == "true"){
                    var foundVariantArr = getVariantFromOptions([option.id], this.Variants);

                    if (foundVariantArr && foundVariantArr.length > 0 && foundVariantArr[0].image_id){
                        var img = this.product_image_dictionary.get(foundVariantArr[0].image_id);
                      return img;
                        /*if (img){
                            return ShopifyImgURL(img.src, this.$props.swatchsize);
                        }*/
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
		}
	}
</script>

<style lang="scss" type="text/scss" >
	@import "src/vue/helpers/product-dependancies.scss";

	.slideshow-OptionPicker{

		.swiper-button-prev,.swiper-button-next, .swiper-container-rtl .swiper-button-next {

			@include g-color-scheme(dark, (background:true, foreground:true,border:false,fill:true ));
			@include u-icon-svg(false,30px,150px);
opacity: .6;
			margin:0;
			left:none;
			top:0;

			&:before{
				content: "";
			}
			background-image: none;
		}

		.swiper-button-prev{
			left: 0;
		}
		.swiper-button-next{
			right: 0;
		}
		.swiper-scrollbar{
background: white	;
			opacity: .5;
		display: block;

			//@include g-color-scheme(light, (background:true, foreground:true,border:true,fill:true ));
			@include g-color-scheme(dark-accent-primary, (background:true, foreground:true,border:true,fill:true ));
			left:0;
			border-radius:0;
			width:100%;
			height: 10%;
			bottom: 5px;
		}
		.swiper-scrollbar-drag{
			@include g-color-scheme(light, (background:true, foreground:true,border:false,fill:true ));
			opacity: 1;


		}
	}
	.tooltip {
			display: block !important;
			z-index: 10000;
			//background: red;
@include set-type(lg,font-small-caps);
			.tooltip-inner {
				//background: black;
				//color: white;
				@include g-color-scheme(dark-accent-default, (background:true, foreground:true,border:false,fill:true ));

				border-radius: 16px;
				padding: 5px 10px 4px;
				//@include box-shadow(3px, 3px, 3px, #333);

			}

			.tooltip-arrow {
				width: 0;
				height: 0;
				border-style: solid;
				position: absolute;
				margin: 5px;
				border-color: color(dark-accent-primary,background);
				z-index: 1;
			}

			&[x-placement^="top"] {
				margin-bottom: 5px;

				.tooltip-arrow {
					border-width: 5px 5px 0 5px;
					border-left-color: transparent !important;
					border-right-color: transparent !important;
					border-bottom-color: transparent !important;
					bottom: -5px;
					left: calc(50% - 5px);
					margin-top: 0;
					margin-bottom: 0;
				}
			}

			&[x-placement^="bottom"] {
				margin-top: 5px;

				.tooltip-arrow {
					border-width: 0 5px 5px 5px;
					border-left-color: transparent !important;
					border-right-color: transparent !important;
					border-top-color: transparent !important;
					top: -5px;
					left: calc(50% - 5px);
					margin-top: 0;
					margin-bottom: 0;
				}
			}

			&[x-placement^="right"] {
				margin-left: 5px;

				.tooltip-arrow {
					border-width: 5px 5px 5px 0;
					border-left-color: transparent !important;
					border-top-color: transparent !important;
					border-bottom-color: transparent !important;
					left: -5px;
					top: calc(50% - 5px);
					margin-left: 0;
					margin-right: 0;
				}
			}

			&[x-placement^="left"] {
				margin-right: 5px;

				.tooltip-arrow {
					border-width: 5px 0 5px 5px;
					border-top-color: transparent !important;
					border-right-color: transparent !important;
					border-bottom-color: transparent !important;
					right: -5px;
					top: calc(50% - 5px);
					margin-left: 0;
					margin-right: 0;
				}
			}

			&.popover {
				$color: #f9f9f9;

				.popover-inner {
					background: $color;
					color: black;
					padding: 24px;
					border-radius: 5px;
					box-shadow: 0 5px 30px rgba(black, .1);
				}

				.popover-arrow {
					border-color: $color;
				}
			}

			&[aria-hidden='true'] {
				visibility: hidden;
				opacity: 0;
				transition: opacity .15s, visibility .15s;
			}

			&[aria-hidden='false'] {
				visibility: visible;
				opacity: 1;
				transition: opacity .15s;
			}
		}


</style>