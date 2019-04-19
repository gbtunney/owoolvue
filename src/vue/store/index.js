import Vuex from 'vuex';
import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
const schema = require("schm");
import store from '@/store/index';

import shopifyAdminApi from "./shopify_admin_api";
import {parseOptions, parseVariants} from './functions/parse'
import {Slugify, GDatamapper,filterArrayByValue} from '@/helpers/main.js'

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage || {},
});

const main_store = {
    state: {
        count: 0,
	    layout_toggle:2,
        product_dictionary: new Map(),
	    variant_dictionary: new Map(),
	    option_dictionary: new Map(),
	    product_image_dictionary: new Map(),
	    
    },
	getters: {
		Count: function(state) {
			return state.count
		},
		OptionByProp: (state) => (value, prop="slug") => {
			return  filterArrayByValue( store.getters.Options, value, prop,true);
		},
		LayoutToggle: function(state) {
			return state.layout_toggle
		},
		Variants: function(state) {
			return Array.from(state.variant_dictionary.values())//state.count
		},
		Options: function(state) {
			if (state.option_dictionary){
				return Array.from(state.option_dictionary.values())//state.count
			}else{
				return [];
			}
		},
		OptionValueByProp: (state) => (value, prop="slug") => {
			return  filterArrayByValue( store.getters.OptionValuesArr, value, prop,true);
		},
		OptionValuesArr: function(state) {
			let option_value_dictionary  = [];
			store.getters.Options.forEach(function(option){
				option_value_dictionary.push(...option.values);
			})
			return option_value_dictionary;//store.getters.Options.find(option => option.slug === slug)
		}
	},
	mutations: {
		increment(state, payload) {
			state.count += payload.amount
		},
		setlayoutButton(state, payload) {
			state.layout_toggle = payload.index
		},
		add_product_to_dictionary(state, payload) {
			state.product_dictionary = new Map(state.product_dictionary).set(parseInt(payload.product.id) , payload.product)
		},
		add_variants_to_dictionary(state, payload) {
		    
		    var variantArr = payload.variants;
			
			var newMap = new Map(state.variant_dictionary  );
			
			variantArr.forEach( function(item){
				
				newMap.set(item.id,item);
            })
			state.variant_dictionary = newMap;
			
		},
		add_images_to_dictionary(state, payload) {
			
			var imagesArr = payload.images;
			
			var newMap = new Map(state.product_image_dictionary  );
			
			imagesArr.forEach( function(item){
				newMap.set(parseInt(item.id),item);
			})
   
			state.product_image_dictionary = newMap;
			
		},
		add_options_to_dictionary(state, payload) {
			
			var parsedOptions = parseOptions(payload.options,["color"]);
			
			state.option_dictionary= GDatamapper.parseToDictionary(parsedOptions, "id");
			
			if ( state.variant_dictionary ){
				var newvariants =  parseVariants(Array.from(state.variant_dictionary.values()),Array.from(state.option_dictionary.values())) ;
				var newMap = new Map(state.variant_dictionary  );
				
				newvariants.forEach( function(item){
					newMap.set(item.id,item);
				})
				state.variant_dictionary = newMap;
				
			}
		}
	},
  plugins: [vuexLocal.plugin],
}

main_store.mutations = {...main_store.mutations, ...shopifyAdminApi.mutations}
main_store.actions = {...main_store.actions, ...shopifyAdminApi.actions}
main_store.state = {...main_store.state, ...shopifyAdminApi.state}

export default new Vuex.Store(main_store);