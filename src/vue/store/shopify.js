import ShopifyApi from "vuex-rest-api";
export const SHOPIFY_DATA_INIT = 'SHOPIFY_DATA_INIT';

export const SHOPIFY_DATA_READY = 'SHOPIFY_DATA_READY';

export const CURRENT_VARIANT_CHANGED = 'CURRENT_VARIANT_CHANGED';
export const GET_SHOPIFY_DATA = 'GET_SHOPIFY_DATA';
export const SINGLE_OPTION_CHANGED = 'SINGLE_OPTION_CHANGED';
export const SINGLE_OPTION_SELECTED = 'SINGLE_OPTION_SELECTED';
export const SHOPIFY_DATA_COMPLETE = 'SHOPIFY_DATA_COMPLETE';

//https://2f1979b64fd471f8692c920838ab735a:e6b8f159238f02584327577ca8ec1a2e@o-wool-stage.myshopify.com/admin/orders.json
// products thru admin: https://o-wool-stage.myshopify.com/admin/products/#{id}.json

const SHOPIFY_API = new ShopifyApi({
	baseURL: "https://2f1979b64fd471f8692c920838ab735a:e6b8f159238f02584327577ca8ec1a2e@o-wool-stage.myshopify.com/admin/",
	state: {
		_products: [],
	}
	
})
.get({
	action: "getProducts",
	property: "_products",
	path: "/products.json",

	onSuccess(state, payload, axios, { params, data }) {
		// if you define the onSuccess function you have to set the state by yourself
		
		let product_id = params.product_id;
	state._products = payload.data.products;
		console.log(`Post with id ${data} successfully fetched.`,state._products);
		//console.log("STATE", params);
	},
	onError(state, error, axios, { params, data }) {
		// if you define the onSuccess function you have to set the state by yourself
	//	state.post = null;
		throw "REST ERROR"
	}
})
.get({
	action: "getProduct",
	property: "products",
	path: ({ id }) => `/products/${id}.json`,
	onSuccess(state, payload, axios, { params, data }) {
		// if you define the onSuccess function you have to set the state by yourself
		//state._products =[ payload.data];
		console.log(`Post with id ${params.id} successfully fetched.`,payload.data);
	},
	onError(state, error, axios, { params, data }) {
		// if you define the onSuccess function you have to set the state by yourself
		state.post = null;
	}
})
.get({
   // https://o-wool-stage.myshopify.com/admin/variants/18250174333046.json
  
    action: "getVariant",
    property: "variant",
    path: ({ id }) => `/variants/${id}.json`,
    onSuccess(state, payload, axios, { params, data }) {
        // if you define the onSuccess function you have to set the state by yourself
        //state._products =[ payload.data];
        console.log(`Post with id ${params.id} successfully fetched.`,payload.data);
    },
    onError(state, error, axios, { params, data }) {
        // if you define the onSuccess function you have to set the state by yourself
        state.post = null;
    }
})
.getStore();

export default SHOPIFY_API;
