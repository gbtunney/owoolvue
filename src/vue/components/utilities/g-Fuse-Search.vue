<template>
	<div >
		<div id="sb-search" :class="[ UID,{'sb-search-open' : $data._active}]" class="  sb-search">
				<input class="sb-search-input c-input--accent-default "
				       v-model="$data._input_query"
				       @input="_fuseSearch($data._input_query)"
				       @blur="_inputLoseFocus"
				       placeholder="Enter your search term..." type="text" value="" name="search" id="search">
			<button @click="_openSearch" class="sb-btn-open c-icon--accent-default ">
				<span class="sb-icon">
					<svg aria-hidden="true" focusable="false" role="presentation"  viewBox="0 0 32 32"><path fill="#444" d="M21.839 18.771a10.012 10.012 0 0 0 1.57-5.39c0-5.548-4.493-10.048-10.034-10.048-5.548 0-10.041 4.499-10.041 10.048s4.493 10.048 10.034 10.048c2.012 0 3.886-.594 5.456-1.61l.455-.317 7.165 7.165 2.223-2.263-7.158-7.165.33-.468zM18.995 7.767c1.498 1.498 2.322 3.49 2.322 5.608s-.825 4.11-2.322 5.608c-1.498 1.498-3.49 2.322-5.608 2.322s-4.11-.825-5.608-2.322c-1.498-1.498-2.322-3.49-2.322-5.608s.825-4.11 2.322-5.608c1.498-1.498 3.49-2.322 5.608-2.322s4.11.825 5.608 2.322z"/></svg>
				</span>
			</button>
		</div>
	</div>
</template>


<script type="text/javascript">

	import {UIDMixin} from  '@/mixins/uid-mixin.js';
	import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
	import Vue from 'vue';
	import Fuse from 'fuse.js';
	import math from 'mathjs'


	const fuse_options = {
		shouldSort: false,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: [
			"title",
			"author.firstName"
		]
	};

	export default {
		name: 'fuseSearch',
		mixins: [UIDMixin],
		components: {},
		props: {
			keys:{
				type: Array,
				default: () => ['title']
			},
			autocomplete:{
				type:Boolean,
				default: true
			},
			shouldSort: {
				type:Boolean,
				default: true
			},
			threshold: {
				type:Number,
				default: .6
			},
			location: {
				type:Number,
				default: 0
			},
			distance:{
				type:Number,
				default: 100
			},
			maxPatternLength: {
				type:Number,
				default: 1
			},
			minMatchCharLength: {
				type:Number,
				default: 2
			},
			list:{
				default: () => []
			},
			minimize:{  ///closes the search when done
				type:Boolean,
				default: true
			}
		},
		data() {
				return {
					_list: [], //base list to search - the "HAYSTACK"
					_input_query: "", //search string - the "NEEDLE",
					_active: true,
				}
		},
		computed: {
			List: function(){
				return this.$data._list
			}
		},
		created:function(){

		},
		mounted:function(){
			if (!this.$props.minimize ){
				this.$data._active = true;
			}else{
				this.$data._active = false;
			}
		},
		methods:{
			_openSearch:function() {
				this.$data._active = true;
				console.log("query selector " , this.UID ,document.querySelector(`.${this.UID}`) )
				document.querySelector(`.${this.UID} .sb-search-input`).focus();
				//UID
			},
			_closeSearch:function() {
				if (this.$props.minimize){
					this.$data._active = false;
				}
			},
			_inputLoseFocus:function(list = this.$props.list) {

				///clear query when looses focus
				this.$data._input_query = "";
				this._closeSearch();
				this.$emit('fuseInactive', this.$props.list, this.$props);
			},
			_fuseSearch:function(query = this.$data._input_query, list = this.$props.list) {

				if (query.length > 0){
					if (this.$props){
						var fuse = new Fuse(list, this.$props);
						this.$emit('fuseResult', fuse.search(query), query, list, this.$props);
					}
				} else {
					//reset list if no query
					this.$emit('fuseResult', list, "", list, this.$props);
				}
			}
		},
	};
</script>

<style lang="scss" type="text/scss" >
	@import "src/vue/helpers/product-dependancies.scss";

	$search-padding: 5px 0;
	.sb-icon{
		@include dimensions(1.5em);

	}

	.sb-btn-open{
	width:auto;
		height:100%;
		display: flex;
		border: 0px solid black;
		padding: $search-padding;

	}
	.sb-search.sb-search-open,
	.no-js .sb-search {
		//background:red;
		width: 100%;

	}

	.sb-search.sb-search-open .sb-icon-search,
	.no-js .sb-search .sb-icon-search {
		//background: #da6d0d;
	//	color: #fff;
	z-index: 11;
	}

	.sb-search.sb-search-open .sb-search-submit,
	.no-js .sb-search .sb-search-submit {
		z-index: 90;
	}
	.sb-search-input {
		//width: 100%;
		width: 0px;
		//height: 60px;
		margin: 0;
		padding: $search-padding;
		z-index: 10;
		border-width:0px;
		@include border-single-side(bottom, 1px);
		-webkit-transition: width 0.3s;
		-moz-transition: width 0.3s;
		transition: width 0.3s;
		-webkit-backface-visibility: hidden;


	}
	.sb-search{
		display: flex;
		justify-content: flex-end;
				align-items: center;

	}
	.sb-search.sb-search-open{
		.sb-search-input {

			width: 100%;
			//height: 60px;
			margin: 0;
			z-index: 10;
			//padding: 10px 0;


		}
	}
/*


	$example-component-render: (
		(
			description: "color schemes",
			selector:false,
			parent: color-schemes,
			suffix:false,
			variant-key: dark,
			variants:(
				options: (
					obj: (
						background: true,
						foreground: true,
						accent:true,
						border: lighten foreground 10%,
						fill:foreground,
						hover-background:true,
						hover-foreground:true
					)
				)
			)
		),
		(
			description: "font size",
			selector: false,
			parent: font-size,
			variant-key: xl,
			suffix:false,
		)
	);


	.sb-search {
		position: relative;
		margin-top: 10px;
		width: 0%;
		min-width: 60px;
		height: 60px;
		float: right;
		overflow: hidden;
		-webkit-transition: width 0.3s;
		-moz-transition: width 0.3s;
		transition: width 0.3s;
		-webkit-backface-visibility: hidden;
	}

	.sb-search-input {
		position: absolute;
		top: 0;
		right: 0;
		border: none;
		outline: none;
		background: #fff;
		width: 100%;
		height: 60px;
		margin: 0;
		z-index: 10;
		padding: 20px 65px 20px 20px;
		font-family: inherit;
		font-size: 20px;
		color: #2c3e50;
border:1px solid black;

		$props: (
			background: true,
			foreground: true,
			border: true,
			fill:foreground,
			hover-background: invert,
			hover-foreground:invert
		);
	//	@include g-color-scheme(dark, $props...);
	}

	.sb-search-input::-webkit-input-placeholder {
		color: #efb480;
	}

	.sb-search-input:-moz-placeholder {
		color: #efb480;
	}

	.sb-search-input::-moz-placeholder {
		color: #efb480;
	}

	.sb-search-input:-ms-input-placeholder {
		color: #efb480;
	}

	.sb-icon-search,
	.sb-search-submit  {
		border:1px solid black;

		width: 60px;
		height: 60px;
		display: block;
		position: absolute;
		right: 0;
		top: 0;
		padding: 0;
		margin: 0;
		line-height: 60px;
		text-align: center;
		cursor: pointer;
	}

	.sb-search-submit {
		background: #fff; !* IE needs this *!
		-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; !* IE 8 *!
		filter: alpha(opacity=0); !* IE 5-7 *!
		opacity: 0;
		color: transparent;
		border: none;
		outline: none;
		z-index: -1;
	}


	.sb-icon-search {
		border: 1px solid red;
		//color: #fff;
		!*background: #e67e22;
		z-index: 90;
		font-size: 22px;
		font-family: 'icomoon';
		speak: none;
		font-style: normal;
		font-weight: normal;
		font-variant: normal;
		text-transform: none;*!
		-webkit-font-smoothing: antialiased;
	//	@include render-queue(get-collection($example-component-render));

	}


	//@include c-button(sb-icon-search,dark);

	!* Open state *!

*/

</style>