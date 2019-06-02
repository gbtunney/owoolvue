import Vue from 'vue';
import store from '@/store'
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import {mapGetters, mapState, mapActions} from 'vuex'
const Numeral = require('numeral');

import {ShopifyImgURL, getVariantFromOptions,normalize} from '@/helpers/main.js'
import {UIDMixin} from '@/mixins/uid-mixin.js';
import {DictionaryMixin} from '@/mixins/dictionarymixin.js';

export const ProductImageSlideshowMixin = {
    mixins: [DictionaryMixin, UIDMixin],
    components: {
        swiper,
        swiperSlide
    },
    props: {
        imagearray: {
            type: [Array, Boolean],
            default: () => []
        },
        currentimage: {
            type: [Object, Boolean],
            default: () => {
            }
        },
        imagesize: {
            required: false,
            type: [Boolean, String],
            // default:'150x150'
            default: false
        }
    },
    computed: {
        ImageArray: function() {
            return this.$props.imagearray;
        },
        TrackIdle: function() {
        
        },
        swiper: function() {
            return this.$refs[this.Ref].swiper;
        },
        Ref: function() {
            return `swiper-${this.$options.name}`;
            
        }
    },
    watch: {
        currentimage: function(val) {
            if (this.ImageArray){
                this.goToImage(val);
            }
        }
    },
    methods: {
        goToImage: function(image) {
            if (this.swiper.activeIndex != this.getImageIndex(image)){
                this.swiper.slideTo(this.getImageIndex(image), 0, false)
            }
        },
        getImageIndex: function(image) {
            let _image = image;
            return this.ImageArray.findIndex(function(product_image) {
                if (_image.id == product_image.id){
                    return true;
                }
                return false;
            });
        },
        getShopifyImageURL(img, imgSize = this.$props.imagesize) {
            if (img){
                return ShopifyImgURL(img.src, imgSize);
            } else {
                return false;
            }
        }
    },
    data() {
        return {
            idle: false,
            mounted:false,
            swiperOption: {
                preloadImages: false,
                
                grabCursor: false,
                centeredSlides: false,
                scrollbar: false,
                zoom: true,
                slidesPerView: 1,
                spaceBetween: 0,
                lazy: {
                    loadPrevNext: true,
                    preloaderClass: 'lazy-preloader'//loadOnTransitionStart:true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            }
        }
    }
}