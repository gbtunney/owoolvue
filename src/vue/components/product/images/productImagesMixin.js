import Vue from 'vue';
import store from '@/store'
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import {mapGetters, mapState, mapActions} from 'vuex'
const Numeral = require('numeral');

import {ShopifyImgURL, getVariantFromOptions,normalize} from '@/helpers/main.js'
import {UIDMixin} from '@/mixins/uid-mixin.js';
import {DictionaryMixin} from '@/mixins/dictionarymixin.js';

export const ProductImagesMixin = {
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
        imagesize: {
            required: false,
            type: [Boolean, String],
            // default:'150x150'
            default: false
        },
        data: {
            default: false
        },
        tooltip: {
            type: [Boolean, String], //true = default behaivior  alt , or flattened key to get tooltip
            default: true
        }
    },
    computed: {
        ImageArray: function () {
            return this.$props.imagearray;
        }
    },
    watch: {},
    methods: {
        getImageTooltip: function (product_image) {
            if (this.getProductImageOptionValue(product_image)) {
                return this.getProductImageOptionValue(product_image).title;
            } else if (this.$props.tooltipAlt) {
                return product_image.alt
            }
            return false;
        },
        getImageVariants: function (product_image) {

            //////mapp the variant_id property
            return false;
        },
        getImageIndex: function (image) {
            let _image = image;
            return this.ImageArray.findIndex(function (product_image) {
                if (_image.id == product_image.id) {
                    return true;
                }
                return false;
            });
        },
        getShopifyImageURL(img, imgSize = this.$props.imagesize) {
            if (img) {
                return ShopifyImgURL(img.src, imgSize);
            } else {
                return false;
            }
        }
    },
    data() {
    }
}