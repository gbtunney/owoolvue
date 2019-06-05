<template>
		<div :class="$options.name">
			<swiper :options="swiperOption" :id="[ UID]" ref="mySwiper"  >
				<!-- slides -->
				<swiper-slide v-for="image,index in ImageArray" :key="index">
					<div>
						{{getImageTooltip(image)}}
						<img @click="imageChanged(image)"  v-tooltip.top-start="getImageTooltip(image)" :src="getShopifyImageURL(image)" :alt="image.alt">
					</div>
				</swiper-slide>
				<!-- Optional controls -->
				<div class="swiper-scrollbar"   slot="scrollbar"></div>
			</swiper>

			<h2 v-tooltip.top-start="'ghhhh'">GILLIAN </h2>
		</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {mapGetters,mapState,mapActions} from 'vuex'
    import { VTooltip } from 'v-tooltip'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'

    import { normalize} from '@/helpers/main.js'
    import {ProductImageSlideshowMixin} from  '@/components/product/images/productImageSlidehowMixin.js';

    Vue.directive('tooltip', VTooltip)

    export default {
        name: 'ProductImageThumbailPicker',
        mixins: [ProductImageSlideshowMixin],
        components: {
            swiper,
            swiperSlide
        }, props: {
            updateMode: {
                type: String,
                default: "UPDATE_IMAGE" // "UPDATE_OPTION" "UPDATE_VARIANT"
            },
            option: {
                type: [Boolean, Object],
                default: false
            },
            tooltipAlt: {
                type: [Boolean],
                default: true
            }
        },
        data() {
            return {
                swiperOption: {
                    loop: false,
                    preloadImages: true,
                    centeredSlides: false,
                    scrollbar: false,
                    slidesPerView: 6,
                    spaceBetween: 0,
                    navigation: false,
                    zoom: false,
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
                    return variant.options.get(this.OptionID);
                }
                return false;
            },
            imageChanged: function(product_image) {
                let self = this;
                if (this.$props.option){
                    if (product_image.variants && product_image.variants.length > 0){

                        let optionMap = new Map();

                        var variantList = product_image.variants.forEach(function(variant) {
                            if (variant.options.get(self.OptionID)){
                                var optionValue = variant.options.get(self.OptionID);
                                optionMap.set(optionValue.id, optionValue);
                            }
                        })
                        if (optionMap.size > 1){
                            throw "OPTION MAP ERROR!!";
                        } else {
                            var optionValue = Array.from(optionMap.values())[0];
                        }
                        this.$emit("UPDATE_OPTION", product_image, this.$props.option, optionValue);
                    } else {
                        this.$emit(this.$props.updateMode, product_image);
                    }
                } else {
                    this.$emit(this.$props.updateMode, product_image);
                }
            },
        },
        watch: {},
        computed: {
            OptionID: function() {
                return (this.$props.option && this.$props.option.id) ? this.$props.option.id : false;
            }
        }
    }

</script>
<style src="swiper/dist/css/swiper.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" type="text/scss"  >
	@import "src/vue/helpers/product-dependancies.scss";

	h2{
		&:hover{
			background: red;
		}
	}
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
			left:0;
			border-radius:0;
			width:100%;
			height: 10%;
			bottom: 5px;
			@include g-color-scheme(dark-accent-primary, (background:true, foreground:true,border:true,fill:true ));
		}
		.swiper-scrollbar-drag{
			@include g-color-scheme(light, (background:true, foreground:true,border:false,fill:true ));
			opacity: 1;
		}
	}
	.tooltipbnbn {
		display: block !important;
		z-index: 10000;
		@include g-typeset(lg,font-small-caps);

		.tooltip-inner {
			border-radius: 16px;
			padding: 5px 10px 4px;
			@include g-color-scheme(dark-accent-default, (background:true, foreground:true,border:false,fill:true ));
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

	}

</style>

