import Vuex from 'vuex';
import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
import shopifyAdminApi from "./shopify_admin_api";


Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage || {},
});

const main_store = {
    state: {
        count: 0,
        product_dictionary: new Map()
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
			state.product_dictionary = new Map(state.product_dictionary).set(String(payload.product.id), payload.product)
		}
	},
  plugins: [vuexLocal.plugin],
}

main_store.mutations = {...main_store.mutations, ...shopifyAdminApi.mutations}
main_store.actions = {...main_store.actions, ...shopifyAdminApi.actions}
main_store.state = {...main_store.state, ...shopifyAdminApi.state}

export default new Vuex.Store(main_store);