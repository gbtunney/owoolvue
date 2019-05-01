<template>
	<div>
		<swiper :options="swiperOption" ref="mySwiper"  >
			<!-- slides -->
			<swiper-slide v-for="image,index in ImageArray" :key="index">
				<div class="swiper-zoom-container">
					<img class="swiper-lazy" :data-src="image.src" :alt="image.alt">
					<div class="lazy-preloader">
						<svg  class="lds-spinner" width="200px"  height="200px"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><g transform="rotate(0 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(30 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(60 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(90 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(120 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(150 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(180 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(210 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(240 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(270 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(300 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate>
							</rect>
						</g><g transform="rotate(330 50 50)">
							<rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#fdfdfd">
								<animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
							</rect>
						</g></svg>
					</div>
				</div>
			</swiper-slide>

			<!-- Optional controls -->
			<div class="swiper-pagination"  slot="pagination"></div>
			<div class="swiper-button-prev" slot="button-prev"></div>
			<div class="swiper-button-next" slot="button-next"></div>
			<div class="swiper-scrollbar"   slot="scrollbar"></div>
		</swiper>
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import {mapGetters,mapState,mapActions} from 'vuex'
    import { normalize} from '@/helpers/main.js'



    //:options="swiperOption" ref="mySwiper"
    export default {
        name: 'ProductImages',
        components: {
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

	           // this.$data.idle = setTimeout(function(){ alert("Hello"); }, 3000);


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

	            console.log("IMAGE SEARCH IS ", tester);
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
        ...mapState({
	        product_image_dictionary: state => state.product_image_dictionary
    }),
        ImageArray:function(){

        	var imgArr =Array.from(this.product_image_dictionary.values());
	        return imgArr.map(function(item,index){
	        	return Object.assign(item, {_index: index});
	        });
	         //Array.from(this.product_image_dictionary.values());
        },
    TrackIdle:function(){


    },
    swiper: function() {
	    return this.$refs.mySwiper.swiper;
    }

        },
        data() {

            return {
            	idle: false,
                swiperOption: {
	                grabCursor: false,
	                centeredSlides: true,
	                scrollbar:false,
	                zoom:true,
	                slidesPerView: 1,
	                spaceBetween: 0,
                    lazy: {
                        loadPrevNext: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }
                }
            }
        }
    }

</script>
<style src="swiper/dist/css/swiper.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" type="text/scss"  >
	@import "src/vue/helpers/product-dependancies.scss";

	.swiper-lazy{
		opacity:0;
	}

	.lazy-preloader{
	//	background: red;
	//	height: 100%;
	//	width: 100%;
		display: block;
//background:purple;

		@include g-color-scheme(accent-default, (background:true, foreground:true,border:false,fill:true ));

	}

	.swiper-zoom-container{

	}

	.swiper-lazy-loaded{
		opacity:1;

		@include u-transition(opacity, .4s, ease,.5s);
		+ .lazy-preloader{
			display: none;

			//	height: 100%;
			//	width: 100%;
		}

	}

	.swiper-scrollbar{
		display: none;
	}
	.swiper-slide-shadow-left{
		background-image: linear-gradient(to left, rgba(255, 255, 255, 0.4),rgba(255, 255, 255, 0.9))!important;

		//linear-gradient(to left, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0))!important;
	}
	.slide-image {
		height: 100%;
		width: 400px;

		//width: 100%;
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
		justify-content: center;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
		/*text-align: center;
		font-size: 18px;
		background: #fff;
		!* Center slide text vertically *!
		display: -webkit-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;*/
	}
	.swiper-button-prev,.swiper-button-next, .swiper-container-rtl .swiper-button-next {
		//background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D 'http%3A%2F%2Fwww.w3.org%…19.9L22%2C44L0%2C22L0%2C22L0%2C22z' %20fill%3D '%23007aff' %2F%3E%3C%2Fsvg%3E);
//background: red;
		&:before{
			content: "<";
			//@include triangle(left,$square/2 ,$square*3,$color);
		}
		//background-image: none;
		//left: 10px;
		//right: auto;
	}
</style>

