import Vuex from 'vuex';
import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
import shopifyAdminApi from "./shopify_admin_api";
import {Slugify, GDatamapper} from '@/gUtilities/main.js'


Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage || {},
});

const main_store = {
    state: {
        count: 0,
        product_dictionary: new Map(),
	    variant_dictionary: new Map(),
	    product_image_dictionary: new Map(),
	
	
    },
	getters: {
		Count: function(state) {
			return state.count
		}
	},
	mutations: {
		increment(state, payload) {
			state.count += payload.amount
		},
		add_product_to_dictionary(state, payload) {
			state.product_dictionary = new Map(state.product_dictionary).set(parseInt(payload.product.id) , payload.product)
		},
		add_variants_to_dictionary(state, payload) {
		    
		    var variantArr = payload.variants;
			console.log("parsing",variantArr.length );
			
			var newMap = new Map(state.variant_dictionary  );
			
			variantArr.forEach( function(item){
				
				newMap.set(item.id,item);
            })
			state.variant_dictionary = newMap;
			console.log("parsedsize ",state.variant_dictionary.size );
			
		},
		add_images_to_dictionary(state, payload) {
			
			var imagesArr = payload.images;
			console.log("parsing",imagesArr.length );
			
			var newMap = new Map(state.product_image_dictionary  );
			
			imagesArr.forEach( function(item){
				newMap.set(parseInt(item.id),item);
			})
   
			state.product_image_dictionary = newMap;
			console.log("parsedsize ",state.product_image_dictionary.size );
			
		}
	},
  plugins: [vuexLocal.plugin],
}

main_store.mutations = {...main_store.mutations, ...shopifyAdminApi.mutations}
main_store.actions = {...main_store.actions, ...shopifyAdminApi.actions}
main_store.state = {...main_store.state, ...shopifyAdminApi.state}

export default new Vuex.Store(main_store);