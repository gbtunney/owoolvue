import ShopifyApi from "vuex-rest-api";
export const SHOPIFY_DATA_INIT = 'SHOPIFY_DATA_INIT';

export const SHOPIFY_DATA_READY = 'SHOPIFY_DATA_READY';

export const CURRENT_VARIANT_CHANGED = 'CURRENT_VARIANT_CHANGED';
export const GET_SHOPIFY_DATA = 'GET_SHOPIFY_DATA';
export const SINGLE_OPTION_CHANGED = 'SINGLE_OPTION_CHANGED';
export const SINGLE_OPTION_SELECTED = 'SINGLE_OPTION_SELECTED';
export const SHOPIFY_DATA_COMPLETE = 'SHOPIFY_DATA_COMPLETE';
import {Slugify} from '@/gUtilities/main.js'

//https://2f1979b64fd471f8692c920838ab735a:e6b8f159238f02584327577ca8ec1a2e@o-wool-stage.myshopify.com/admin/orders.json
// products thru admin: https://o-wool-stage.myshopify.com/admin/products/#{id}.json

const SHOPIFY_API = new ShopifyApi({
	baseURL: "https://2f1979b64fd471f8692c920838ab735a:e6b8f159238f02584327577ca8ec1a2e@o-wool-stage.myshopify.com/admin/",
	state: {
		_products: [],
		_images: [],
	}
	
})
.get({
	action: "getProducts",
	property: "_products",
	path: "products.json",
    path: ({ producttype="" }) => `products.json?product_type=${producttype}`,

	onSuccess(state, payload, axios, { params, data }) {
		// if you define the onSuccess function you have to set the state by yourself
		console.log("trying to get products!!");
		///let product_id = params.product_id;
		//TODO: move this??????? processing actions??
        var formattedproducts = payload.data.products.map(function (product) {
        	var strToArray = product.tags.split(',')
        	var newTags= strToArray.map(function (tag) {
        		return Slugify(tag);
            })
            return Object.assign(product,{ tags: newTags } );
        });
        
	state._products = payload.data.products;
		console.log(`Post with id ${data} successfully fetched.`,state._products);
	},
	onError(state, error, axios, { params, data }) {
		// if you define the onSuccess function you have to set the state by yourself
	//	state.post = null;
		throw "REST ERROR"
	}
})
.get({
    action: "getVariantDefaultImage",
    property: "image",
    path: ({ productid,imageid }) => `/products/${productid}/images/${imageid}.json`,
    onSuccess(state, payload, axios, { params, data }) {
        // if you define the onSuccess function you have to set the state by yourself
        console.log(`TWEST  with id ${params} successfully fetched.`,params,payload.data);
    },
    onError(state, error, axios, { params, data }) {
        // if you define the onSuccess function you have to set the state by yourself
        state.post = null;
    }
})
.get({    //	        this.getProductMeta({params: {productid: 1919136071798}});
    
    action: "getProductMeta",
    property: "meta",
    path: ({ productid }) => `/products/${productid}/metafields.json`,
    onSuccess(state, payload, axios, { params, data }) {
    // if you define the onSuccess function you have to set the state by yourself
    console.log(`TWEST  with id ${params} successfully fetched.`,params,payload.data);
},
onError(state, error, axios, { params, data }) {
    // if you define the onSuccess function you have to set the state by yourself
    state.post = null;
}
})
//https://o-wool-stage.myshopify.com/admin/products/1919136071798/metafields.json
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
