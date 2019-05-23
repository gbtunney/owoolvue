<template>
	<div :class="$options.name" style="position: relative;">
		<swiper :options="swiperOption"  :ref="Ref"  >
			<!-- slides -->
			<swiper-slide v-for="image,index in ImageArray"  :key="index">
					<div class="swiper-zoom-container">
						<img class=" swiper-lazy"  :data-src="getShopifyImageURL(image)" :alt="image.alt">
					</div>
			</swiper-slide>

			<!-- Optional controls -->
			<div class="swiper-button-prev" slot="button-prev">
				<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow-left" viewBox="0 0 32 32"><path fill="#444" d="M24.333 28.205l-1.797 1.684L7.666 16l14.87-13.889 1.797 1.675L11.269 16z"/></svg>
			</div>
			<div class="swiper-button-next" slot="button-next">
				<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow-right" viewBox="0 0 32 32"><path fill="#444" d="M7.667 3.795l1.797-1.684L24.334 16 9.464 29.889l-1.797-1.675L20.731 16z"/></svg>
			</div>
		</swiper>
		<div class="lazy-preloader">
				<iconcomponent  :addl_styles="{width: '10rem',height: '10rem'}" icon_id="svg-icon-loadinganim" :flags="['--no-border']"  scheme="accent-default" :showpicker="true"></iconcomponent>
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
    import iconcomponent from '@/components/utilities/g-icon-component.vue';

    export default {
        name: 'ProductImageSlideshow',
        mixins: [DictionaryMixin,UIDMixin,ProductImageSlideshowMixin],
        components: {
	        iconcomponent,
            swiper,
            swiperSlide
        }, props: {
		    idleNext: {
			    default: true
		    },
		    currentvariant: {
    default: false
    }
        },
        methods: {
        	clicky:function(index){
		       // this.swiper.slideTo(index, 0, false)
		     // clearTimeout(  this.$data.idle);

	        },
            SlideTo: function(image_id) {
               // var currentImage = this.product_image_dictionary.get(image_id.toString());
                //console.log("IMAGES", currentImage);
               // this.swiper.slideTo(currentImage._index, 1000, false)
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
	        currentvariant: function(val) {
		        if (this.ImageArray){
			       this.GetVariantSlideMatch(val.id);
		        }
	        }
        },
        computed: {

    },

    }

</script>
<style src="swiper/dist/css/swiper.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" type="text/scss"  >
	@import "src/vue/helpers/product-dependancies.scss";

	.ProductImageSlideshow {

		.lazy-preloader {
			height: 100%;
			width: 100%;
			position: absolute;
			top: 50%;
			justify-content: center;
			display: flex;
			align-items: center; //height: -webkit-fill-available;
			top: 50%;
			-webkit-transform: translateY(-50%);
			-ms-transform: translateY(-50%);
			transform: translateY(-50%);
		}
		.swiper-button-prev, .swiper-button-next, .swiper-container-rtl .swiper-button-next {

			@include g-color-scheme(accent-primary, (background:false, foreground:true, border:false, fill:true));
			@include u-icon-svg(false, 30px, 150px);
			opacity: .9;
			margin: 0;
			left: none;
			top: 0;
			background-image: none;
			width: 8%;
			height: 100%;

			&:before {
				content: "";
			}
		}

		.swiper-button-prev {
			left: 0;
		}

		.swiper-button-next {
			right: 0;
		}

		.swiper-lazy-loaded {
			opacity: 1;
			@include u-transition(opacity, .4s, ease, .5s);
		}

		.swiper-scrollbar {
			display: none;
		}

		.swiper-slide-shadow-left {
			background-image: linear-gradient(to left, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.9)) !important;
		}

		.swiper-container {
			width: 100%;
			height: auto;
		}

		.swiper-slide {
			overflow: hidden;
		}

		.swiper-slide {
			display: -webkit-box;
			display: -ms-flexbox;
			display: -webkit-flex;
			display: flex;
			-webkit-box-pack: center;
			-ms-flex-pack: center;
			-webkit-justify-content: center;
			justify-content: flex-end;
			-webkit-box-align: center;
			-ms-flex-align: center;
			-webkit-align-items: center;
			align-items: center;
			position: relative;
		}
	}


</style>

