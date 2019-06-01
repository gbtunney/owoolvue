import Vuex from 'vuex';
import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
const schema = require("schm");
import store from '@/store/index';

import shopifyAdminApi from "./shopify_admin_api";
import shopifyCart from "./shopify-cart.js";


import {parseOptions, parseVariants} from './functions/parse'
import {Slugify, GDatamapper,filterArrayByValue,IsJsonString} from '@/helpers/main.js'

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
	    metafield_dictionary:new Map(),
	    recently_viewed: []
    },
	getters: {
		Count: function(state) {
			return state.count
		},
		Cart: state => {
		return state._cart;
		},
		ImagesByProduct: (state) => (product) => {
			let _state = state;
			let _product = product;
            return product.images.map(function(image){
            	if ( image && image.variant_ids.length > 0 ){
                    var VariantsArr = image.variant_ids.map(function(variant_id){
                        return  _state.variant_dictionary.get(variant_id)
                    })
		            return  Object.assign(image,  { variants: VariantsArr})
                }else{
                    return _state.product_image_dictionary.get(image.id);
	            }
            	    })
		},
		OptionByProp: (state) => (value, prop="slug") => {
			return  filterArrayByValue( store.getters.Options, value, prop,true);
		},
		OptionsArrByProduct: (state) => (id) => {
			
			let self = this;
            
            if ( state.option_dictionary && state.option_dictionary.values().length > 0){
				
			}
			let optionDictionary = state.option_dictionary;
			
			if (state.product_dictionary.get(id) &&  state.product_dictionary.get(id).options){
				
				var uncoallatedOptions =   state.product_dictionary.get(id).options;
				
				return uncoallatedOptions.map(function(option){
					if ( option.id && optionDictionary && optionDictionary.get(option.id ) ){
						return optionDictionary.get(option.id );
					}else{
						return false;
					}
				})
			}else{
			
			
			}
		},
		LayoutToggle: function(state) {
			return state.layout_toggle
		},
		Variants: function(state) {
			return Array.from(state.variant_dictionary.values())//state.count
		},
		Metafields: function(state) {
			return Array.from(state.metafield_dictionary.values())//state.count
		},
		Options: function(state) {
			if (state.option_dictionary){
				if ( Array.from(state.option_dictionary.values()).length > 0 ){
                    return Array.from(state.option_dictionary.values())//state.count
                    
                }else{
					return false;
				}
			}else{
				return false;
			}
		},
		OptionsByProduct: (state) => (value) => {
			
			console.log("")
			return  filterArrayByValue( state.option_value_dictionary.values(), value, 'product_id',true);
		},
		OptionValueByProp: (state) => (value, prop="slug") => {
			return  filterArrayByValue( store.getters.OptionValuesArr, value, prop,true);
		},
		OptionValuesArr: function(state) {
			let option_value_dictionary  = [];
			
			if ( !store.getters.Options  ) return option_value_dictionary;
			store.getters.Options.forEach(function(option){
				option_value_dictionary.push(...option.values);
			})
			return option_value_dictionary;//store.getters.Options.find(option => option.slug === slug)
		},
		MetafieldsByProp: (state) => (value, prop="owner_id") => {
			return  filterArrayByValue( store.getters.Metafields, value, prop,true);
		},
		MetafieldsByProps : (state) => (valueObj) => {
			
			let _filterProps = valueObj;
			return  store.getters.Metafields.find(function(metafield) {
				
				var found = false;
				var keys = Object.keys(_filterProps)
				for (const key of keys) {
					found = ((metafield.hasOwnProperty(key) && metafield[key] == _filterProps[key])) ? true : false
				}
				
				if (found) return true;
				return false;
			})
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
			
			if ( payload.product ){
                var pendingProduct = payload.product;
                if ( payload.additionalProps){
                    pendingProduct = Object.assign(pendingProduct, payload.additionalProps);
                }
                state.product_dictionary = new Map(state.product_dictionary).set(parseInt(pendingProduct.id) ,pendingProduct)
				//console.log("adding to dictionary!", state.product_dictionary);
				
				
			}else if (payload.products ){
                var productArr = payload.products;
                
                var newMap = new Map(state.product_dictionary  );
                
                
                productArr.forEach( function(item){
                	
                	if ( item.hasOwnProperty('tags')){
                        var tags = String(item.tags).split(',');
                        item = Object.assign(item, {tags:tags })
                    }
                	
                	
                    newMap.set(item.id,item);
                })
                state.product_dictionary = newMap;
                
            }
			
		},
		add_variants_to_dictionary(state, payload) {
		    
		    var variantArr = payload.variants;
			
			var newMap = new Map(state.variant_dictionary  );
			
			variantArr.forEach( function(item){
				
				newMap.set(item.id,item);
            })
			state.variant_dictionary = newMap;
			
		},
		add_recently_viewed(state, payload) {
			
			var product = payload.product;
		
			//product
			 state.recently_viewed.push( String(product));
			
		},
		add_images_to_dictionary(state, payload) {
			
			var imagesArr = payload.images;
			
			var newMap = new Map(state.product_image_dictionary  );
			
			imagesArr.forEach( function(item){
				
				
				newMap.set(parseInt(item.id),Object.assign(item , {aspect_ratio : parseInt(item.width) / parseInt(item.height)}));
			})
			state.product_image_dictionary = newMap;
			
		},
		add_options_to_dictionary(state, payload) {
   
			
			console.log("OPTION TEST TEST:  ",payload.option_value_overrides)
            var parsedOptions  = parseOptions(payload.options,payload.optionconfig,payload.option_value_overrides);
            state.option_dictionary= GDatamapper.parseToDictionary(parsedOptions, "id");
			
			if ( state.variant_dictionary ){
				var newvariants =  parseVariants(Array.from(state.variant_dictionary.values()),Array.from(state.option_dictionary.values())) ;
				var newMap = new Map(state.variant_dictionary  );
				
				newvariants.forEach( function(item){
					newMap.set(item.id,item);
				})
				state.variant_dictionary = newMap;
			}
		},
		add_metafields_to_dictionary(state, payload) {
			
			var meta = payload.metafields;
			var unparsedMeta = payload.metafields;   ///GDatamapper.parseToDictionary(meta, "id");
			
			unparsedMeta = unparsedMeta.map(function(metafield) {
				
				if (metafield.hasOwnProperty('value') && IsJsonString(metafield['value'])){
					return Object.assign(metafield, {value:metafield['value']});
				} else {
					return metafield;
				}
			});
			state.metafield_dictionary = GDatamapper.parseToDictionary(unparsedMeta, "id");
		}
	},
  plugins: [vuexLocal.plugin],
}
main_store.mutations = {...main_store.mutations, ...shopifyAdminApi.mutations,...shopifyCart.mutations}
main_store.actions = {...main_store.actions, ...shopifyAdminApi.actions,...shopifyCart.actions}
main_store.state = {...main_store.state, ...shopifyAdminApi.state,...shopifyCart.state}

export default new Vuex.Store(main_store);