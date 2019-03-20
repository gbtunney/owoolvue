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
    state: {
        _cart: {"no cart": "set yet"}
    },
})
.get({
    action: "getCart",
    property: "_cart",
    path: "/cart.js",
    
    onSuccess(state, payload, axios, {params, data}) {
        // if you define the onSuccess function you have to set the state by yourself
        
        //let product_id = params.product_id;
        
        state._cart = payload.data;        console.log(`Post with id ${data} successfully fetched.`, state._cart);
    
    
        //console.log("STATE", params);
    },
    onError(state, error, axios, {params, data}) {
        // if you define the onSuccess function you have to set the state by yourself
        //	state.post = null;
        throw "REST ERROR"
    }
})
.post({
    action: "addItem",
    property: "_cart",
    path: "/cart/add.js",
    
    onSuccess(state, payload, axios, {params, data}) {
        // if you define the onSuccess function you have to set the state by yourself
        
        //let product_id = params.product_id;
        // state._cart = payload.data;
        console.log(`Post with id ${data} successfully fetched.`, payload.data, state._cart);
        //console.log("STATE", params);
    },
    onError(state, error, axios, {params, data}) {
        // if you define the onSuccess function you have to set the state by yourself
        //	state.post = null;
        throw "REST ERROR"
    }
})
.getStore();

export default SHOPIFY_API;
