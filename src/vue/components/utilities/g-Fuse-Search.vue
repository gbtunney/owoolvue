<template>
	<div >
		FUSE SEARCH
		<v-text-field v-model="$data._input_query"
		              @input="_fuseSearch($data._input_query)"
		              label="Search colors"
		              append-outer-icon="search"
		></v-text-field>

		<button @click="_fuseSearch($data._input_query)" >Search btn</button>
	</div>
</template>


<script type="text/javascript">
	import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
	import Vue from 'vue';

	import Fuse from 'fuse.js';


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


	//  ProductMixin
	export default {
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
				default:[] ///base list to search - the "HAYSTACK"
			}
		},
		components: {},
		data() {
			return {
				_list: [], //base list to search - the "HAYSTACK"
				_input_query: "", //search string - the "NEEDLE",
			}
		},
		name: 'fuseSearch',
		computed: {

		List: function(){
			return this.$data._list
		}
	},
	created:function(){

	},
	mounted:function(){
	},
	methods:{
		_fuseSearch:function (query = this.$data._input_query, list = this.$props.list){

			console.log("SEARCHIING BEFORE",query, query.length,list);
			if ( query.length > 0 ){
				if ( this.$props){
					var fuse = new Fuse(list,this.$props);
					this.$emit('fuseResult', fuse.search(query), query, list, this.$props );
				}
			}
		}
	},
	};
</script>