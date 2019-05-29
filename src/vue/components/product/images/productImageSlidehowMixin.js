import {mapGetters, mapActions, mapState, mapMutations} from 'vuex';

const Numeral = require('numeral');
import {ShopifyImgURL, getVariantFromOptions} from '@/helpers/main.js'

export const ProductImageSlideshowMixin = {
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
    components: {},
    computed: {
        ImageArray: function() {
            return this.$props.imagearray;
        },
        TrackIdle: function() {
        
        },
        swiper: function() {
            
            //	return  document.getElementById(this.UID);
            return this.$refs[this.Ref].swiper;
        },
        Ref: function() {
            return `swiper-${this.$options.name}`;
            
        },
        Reftest: function() {
            // return this.$refs[UID].swiper;
            
        },
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
                this.swiper.slideTo(this.getImageIndex(image, 0, false))
            }
        },
        getImageIndex: function(image) {
            let _image = image;
            return this.ImageArray.findIndex(function(product_image) {
                // console.log("searcing ",_image.id, product_image.id  )
                if (_image.id == product_image.id){
                    console.log("FOUND ", _image.id, product_image.id)
                    
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