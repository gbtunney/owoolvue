<template>
	<div :class="$options.name" style="position: relative;">
		<swiper :options="swiperOption"   :ref="Ref"  >
			<!-- slides -->
			<swiper-slide v-for="image,index in ImageArray" :key="index">
					<div class="swiper-zoom-container">
						<img :class="(index == 0)? getShopifyImageURL(image) : 'swiper-lazy' "  :src="(index == 0)? getShopifyImageURL(image) : '' " :data-src="getShopifyImageURL(image)" :alt="image.alt">
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
		<div class="lazy-preloader" v-show="mounted">
				<iconcomponent  :addl_styles="{width: '10rem',height: '10rem'}" icon_id="svg-icon-loadinganim" :flags="['--no-border']"  scheme="dark-accent-default" :showpicker="false"></iconcomponent>
		</div>
	</div>
</template>

<script type="text/javascript">

    import {ProductImageSlideshowMixin} from  '@/components/product/images/productImageSlidehowMixin.js';
    import iconcomponent from '@/components/utilities/g-icon-component.vue';

    export default {
        name: 'ProductImageSlideshow',
        mixins: [ProductImageSlideshowMixin],
        components: {
            iconcomponent
        }, props: {
            idleNext: {
                default: true
            },
            currentvariant: {
                default: false
            }
        },
        created: function() {
            let self = this;
        },
        mounted: function() {
            let self = this;
            this.swiper.on('lazyImageLoad', function(target, value) { /* do something */
             //   console.log("LAZY IMG LOADING !!!", target, value);
            });

            this.swiper.on('lazyImageReady', function(target, value) { /* do something */
              //  console.log("LAZY IMG REaDy !!!", target, value);                self.$data.mounted=true;
            });
        },
        methods: {
        },
        watch: {
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

	//		touch-action: none;

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

		.swiper-lazy{
			opacity: 0;

		}
		.swiper-button-disabled{
			display: none;
		}
		.swiper-lazy-loaded {
			opacity: 1;
			@include u-transition(opacity, .8s, ease);
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
			min-height: 50vw;
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

