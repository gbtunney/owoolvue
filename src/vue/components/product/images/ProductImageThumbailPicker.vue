<template>
		<div :class="$options.name">
			{{option}}
			<swiper :options="swiperOption" :id="[ UID]" ref="mySwiper"  >
				<!-- slides -->
				<swiper-slide v-for="image,index in ImageArray" :key="index">
					<div>
						<img @click="imageChanged(image)"  :src="getShopifyImageURL(image)" alt="image.alt">
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
            imageChanged: function(product_image) {
                this.$emit(this.$props.updateMode, product_image);

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

