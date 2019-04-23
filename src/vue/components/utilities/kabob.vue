<template>
	<div
		:class="[componentclass ,Scheme]"
		class="--no-border --divider --reflect">
		<div :class="[getElementClass('left'), getElementClass('left',true)]">
			<slot name="ornament">
				<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="66.755px" height="58.65px" viewBox="0 0 66.755 58.65" enable-background="new 0 0 66.755 58.65" xml:space="preserve">
<path fill="#808080" d="M66.755,30.095c-0.469-0.508-0.938-0.957-1.426-1.445c0.02-0.059,0.059-0.117,0.059-0.176
	c-0.059,0.01-0.117,0.029-0.195,0.029c-0.059-0.059-0.137-0.127-0.195-0.195l0,0C61.326,14.898,47.517,2.549,35.066,0
	c3.193,6.416,6.396,11.548,9.6,15.591C31.853,12.125,17.294,16.06,0,29.666c13.662,12.217,30.349,17.549,44.49,14.98
	c-2.441,3.857-4.814,8.477-7.139,14.004c10.557-2.881,21.611-13.066,26.26-24.541C64.744,32.869,65.798,31.55,66.755,30.095z"></path>
</svg>
			</slot>
		</div>
		<div :class="[getElementClass('center'), getElementClass('center',true)]">
			<div :class="getElementClass('inner',true)">

			</div>
		</div>

		<div :class="[getElementClass('right'), getElementClass('right',true)]">
			<slot name="ornament">
				<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="66.755px" height="58.65px" viewBox="0 0 66.755 58.65" enable-background="new 0 0 66.755 58.65" xml:space="preserve">
<path fill="#808080" d="M66.755,30.095c-0.469-0.508-0.938-0.957-1.426-1.445c0.02-0.059,0.059-0.117,0.059-0.176
	c-0.059,0.01-0.117,0.029-0.195,0.029c-0.059-0.059-0.137-0.127-0.195-0.195l0,0C61.326,14.898,47.517,2.549,35.066,0
	c3.193,6.416,6.396,11.548,9.6,15.591C31.853,12.125,17.294,16.06,0,29.666c13.662,12.217,30.349,17.549,44.49,14.98
	c-2.441,3.857-4.814,8.477-7.139,14.004c10.557-2.881,21.611-13.066,26.26-24.541C64.744,32.869,65.798,31.55,66.755,30.095z"></path>
</svg>
			</slot>
		</div>

	</div>
</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
	
	module.exports = {
		name: '',
		mixins: [],
		components: {},
		data: function() {
			return {
				greeting: 'Hello'
			}
		},
		props: {
			componentclass: {
				type: String,
				default: 'testc-kabob',
				required: false
			},
			scheme: {
				type: String,
				default: 'dark',
				required: false
			},
		},
		computed: {
			...mapGetters([
				'Variants'
			]),
			Scheme:function() {
				return `${this.$props.componentclass}--${this.$props.scheme}`
			},
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
			getElementClass:function(element, scheme=false ){
				if ( !scheme ){
					return `${this.$props.componentclass}__${element}`
				}else{
					return `${this.Scheme}__${element}`

				}
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	p {
		font-size: 2em;
		text-align: center;
	}
</style>