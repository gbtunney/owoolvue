<template>

	<div class="active announcement-bar">


			<swiper :options="swiperOption" ref="mySwiper"  >
				<!-- slides -->
				<swiper-slide v-for="slide,index in slides" :key="index">

					<FreeShippingMessage v-if="slide.component=='freeshipping'"></FreeShippingMessage>
					<span v-if="slide.component!='freeshipping'" class="announcement-bar__message">{{slide.message}}</span>

				</swiper-slide>

				<!-- Optional controls -->

			</swiper>


		<span v-show="false" class="announcement-bar__icon announcement-bar__close js-close"></span>
	</div>


</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import FreeShippingMessage from '@/components/header/FreeShippingMessage.vue'


    module.exports = {
		name: '',
		mixins: [],
		components: {  swiper,
            swiperSlide,
            FreeShippingMessage},
		data: function() {
			return {
			    slides:[
				    {
				        component: "freeshipping",
				        message: "test1",
				    },
                    {
                        message: "test2",
                    }
			],
                swiperOption: {
                    effect: 'fade',
			        fadeEffect: {
                        crossFade: true
                    },
                    grabCursor: false,
                    centeredSlides: true,
                    scrollbar:false,
                    zoom:false,
                    slidesPerView: 1,
                    autoplay: {
                        delay: 5000,
                    },
	                spaceBetween: 0,
                },
				greeting: 'Hello'
			}
		},
		props: {
            sectionsettings: {
                default: {}
            },
			exampleprop: {
				type: String,
				default: 'not set',
				required: false
			},
		},
		computed: {
			...mapGetters([
				'Variants'
			]),
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
		}
	}
</script>

<style lang="scss" type="text/scss" >

	.announcement-bar{

		.swiper-scrollbar{
			display: none;
		}
		.swiper-slide-shadow-left{
			background-image: linear-gradient(to left, rgba(255, 255, 255, 0.4),rgba(255, 255, 255, 0.9))!important;

			//linear-gradient(to left, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0))!important;
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
	}

</style>