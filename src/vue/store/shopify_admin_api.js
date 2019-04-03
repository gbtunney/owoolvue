
import ShopifyApi from "vuex-rest-api";

import {Slugify,GDatamapper} from '@/gUtilities/main.js'

//https://2f1979b64fd471f8692c920838ab735a:e6b8f159238f02584327577ca8ec1a2e@o-wool-stage.myshopify.com/admin/orders.json
// products thru admin: https://o-wool-stage.myshopify.com/admin/products/#{id}.json

const SHOPIFY_API = new ShopifyApi({
	baseURL: "https://2f1979b64fd471f8692c920838ab735a:e6b8f159238f02584327577ca8ec1a2e@o-wool-stage.myshopify.com/admin/",
	state: {
        _product:[]
	}
	
})
//**** SINGLE PRODUCT
.get({
    action: "getProduct",
    property: "_products",
    path: ({ id }) => `/products/${id}.json`,
    onSuccess({state}, payload, axios, { params, data }) {
    
    console.log(`!!Product with id: ${params.id} successfully fetched.`,payload.data);
    
    // if you define the onSuccess function you have to set the state by yourself
  // /  state.current_product = payload.data.product;
    
    //todo:this is wierd
   /* if (!state.product_dictionary ){
        state.product_dictionary= new Map();
        state.product_dictionary =     state.product_dictionary.set(payload.data.product.id, payload.data.product);
    }else if (state.product_dictionary.set) {
        console.log(state.product_dictionary);
        state.product_dictionary =     state.product_dictionary.set(payload.data.product.id, payload.data.product);
    
    }*/
   
  // state.products = [ payload.data.product ]//state.products.push(payload.data.product);
  
},
onError(state, error, axios, { params, data }) {
    // if you define the onSuccess function you have to set the state by yourself
    state.post = null;
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
.get({
   // https://o-wool-stage.myshopify.com/admin/variants/18250174333046.json
  
    action: "getVariant",
    property: "current_variant",
    path: ({ id }) => `/variants/${id}.json`,
    onSuccess(state, payload, axios, { params, data }) {
        // if you define the onSuccess function you have to set the state by yourself
        state.current_variant =payload.data.variant;
        console.log(`Post with id ${params.id} successfully fetched.`,payload.data);
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
.get({    //	        this.getProductMeta({params: {productid: 1919136071798}});
	
	action: "getVariantMeta",
	property: "meta",
	path: ({ productid ,variantid}) => `/products/${productid}/variants/${variantid}/metafields.json`,
	onSuccess(state, payload, axios, { params, data }) {
	// if you define the onSuccess function you have to set the state by yourself
	console.log(`TVARIANT META CALLED`,params,payload.data);
},
onError(state, error, axios, { params, data }) {
	// if you define the onSuccess function you have to set the state by yourself
	state.post = null;
}
})
.getStore();

export default SHOPIFY_API;

///admin/products/#{id}/variants/#{id}/metafields.json
