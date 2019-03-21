//import "../../styles/theme.scss";
//import "../../styles/theme.scss.liquid";
//import "../../styles/testing.scss";
import {mountVue} from "../../vue/mountVue";
import Cart from "../../vue/components/shopify/product/Cart.vue";
import AddToCart from "../../vue/components/shopify/product/AddToCartMultiple.vue";
const UNIQID = require('uniqid');

//mountVue('#owool-cart-app', Cart);
////MOUNT DYNAMIC COMPONENTS WITH MULTIPLE INSTANCES
const vueelements = document.querySelectorAll('[js-mount-vue]');
vueelements.forEach( el => {
    var component = el.getAttribute("js-mount-vue");
    var uid = UNIQID(`${component}-`);
    el.id= uid;
    
    ///TODO : replace with something sane
    if (component == "AddToCart"){
        mountVue(`#${uid}`, AddToCart);
    }
});


