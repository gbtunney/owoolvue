<template>
		<div :class="$options.name">
			<swiper :options="swiperOption" :id="[ UID]" ref="mySwiper"  >
				<!-- slides -->
				<swiper-slide v-for="image,index in ImageArray" :key="index">
					<div>
						{{getImageTooltip(image)}}
						<img @click="imageChanged(image)"  v-tooltip.top-start="getImageTooltip(image)" :src="getShopifyImageURL(image)" alt="image.alt">
					</div>
				</swiper-slide>
				<!-- Optional controls -->
				<div class="swiper-scrollbar"   slot="scrollbar"></div>
			</swiper>
		</div>
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import {mapGetters,mapState,mapActions} from 'vuex'
    import { normalize} from '@/helpers/main.js'

    import {UIDMixin} from  '@/mixins/uid-mixin.js';

    import {DictionaryMixin} from  '@/mixins/dictionarymixin.js';
    import {ProductImageSlideshowMixin} from  '@/components/product/images/productImageSlidehowMixin.js';

    import { VTooltip } from 'v-tooltip'

    Vue.directive('tooltip', VTooltip)
    //:options="swiperOption" ref="mySwiper"
    export default {
        name: 'ProductImageThumbailPicker',
        mixins: [DictionaryMixin,UIDMixin,ProductImageSlideshowMixin],
        components: {
            swiper,
            swiperSlide
        }, props: {
            updateMode: {
                type: String,
                default: "UPDATE_IMAGE" // "UPDATE_OPTION" "UPDATE_VARIANT"
            },
		    option:{
                type: [Boolean,Object],
                default:false
            },
            tooltipAlt:{
                type: [Boolean],
                default:true
            }
        },
        data() {

            return {
                swiperOption: {
                    loop: false,
                    preloadImages: true,
                    grabCursor: true,
                    centeredSlides: false,
                    scrollbar:false,
                    slidesPerView: 6,
                    spaceBetween: 0,
                    allowTouchMove:true,
                    navigation:false,
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
        methods: {
            getImageTooltip: function(product_image) {
                if (this.getProductImageOptionValue(product_image)){
                    return this.getProductImageOptionValue(product_image).title;
                } else if (this.$props.tooltipAlt){
                    return product_image.alt
                }
                return false;
            },
            getProductImageOptionValue: function(product_image) {
                if (product_image.variants && product_image.variants.length > 0){
                    var variant = product_image.variants[0];
                    console.log("OPTIONsssss", variant.options.get(this.OptionID))
                    return variant.options.get(this.OptionID);
                }
                return false;
            },
            imageChanged: function(product_image) {
                //this.$emit(this.$props.updateMode, product_image);

                if ( this.$props.option ){
                    if ( product_image.variants &&  product_image.variants.length> 0 ){

                       var  variantList = product_image.variants.find(function(variant){


                       })

                        this.$emit("UPDATE_OPTION", product_image,this.$props.option);
                    } else{
                        this.$emit(this.$props.updateMode, product_image);
                    }
                }else{
                    this.$emit(this.$props.updateMode, product_image);
                }


                //@click="$emit('optionChanged',$props.option, optionvalue)"
        /*
                var newOptionDictionaryforPendingVariant = new Map(this.SelectedOptionsDictionary);
                console.log("******OPTION HANGED!!", newOptionDictionaryforPendingVariant, value)

                if ( newOptionDictionaryforPendingVariant.get(option.id) ){

                    if ( newOptionDictionaryforPendingVariant.get(option.id) != value ){
                        newOptionDictionaryforPendingVariant.set(option.id, value);
                        var idmap = Array.from(newOptionDictionaryforPendingVariant.values()).map(function(option){
                            if (option.hasOwnProperty('id')){
                                return option.id;
                            }
                        })

                        var foundVariantArr = this._getVariantFromOptions( idmap, this.Variants);

                        console.log("******OPTION HANGED!!", foundVariantArr, value)


                        if (foundVariantArr && foundVariantArr.length==1 ){
                            this.$emit('optionChanged',foundVariantArr[0], newOptionDictionaryforPendingVariant )
                        }else{
                            console.log("VARIANT SEARCH RETURNED MORE OR LESS THAN AMOUNT TO TRIGGER A CHANGE!!!",foundVariantArr,newOptionDictionaryforPendingVariant )
                        }
                    }*/

            },
            GetVariantSlideMatch: function(variantid) {
	            let _variantid = variantid;

        		let tester = this.ImageArray.findIndex(function(item){

        			let found = false;

        			if (typeof item.variant_ids == 'object'){

        				 found = item.variant_ids.find(function(innerid){

					         if (_variantid == innerid ){
        							return true;
					        }else{
        						return false;
					        }
				        })
			        }
			        if (found ){
        				return true;
			        }else{
			        	return false;
			        }
		        } )
	            if ( tester < 0 ){

                    this.swiper.slideTo(1, 0, false)

                }else{
                    this.swiper.slideTo(tester, 0, false)
                }
            }
        },
        watch: {

        },
        computed: {
            OptionID:function(){
                return (this.$props.option && this.$props.option.id )? this.$props.option.id : false;
            }
        }

    }

</script>
<style src="swiper/dist/css/swiper.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" type="text/scss"  >
	@import "src/vue/helpers/product-dependancies.scss";

	.ProductImageThumbailPicker{

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

</style>

