//import "../../styles/theme.scss";
//import "../../styles/theme.scss.liquid";
//import "../../styles/testing.scss";
import {mountVue} from "../../vue/mountVue";
import AddToCart from "../../vue/components/shopify/product/AddToCartMultiple.vue";
import ProductVariantSelector from "../../vue/components/shopify/product/Product-Variant-Selector.vue";
import ProductApp from "../../vue/components/shopify/product/Product.vue";


const UNIQID = require('uniqid');

//mountVue('#owool-cart-app', Cart);
////MOUNT DYNAMIC COMPONENTS WITH MULTIPLE INSTANCES
const vueelements = document.querySelectorAll('[js-mount-vue]');

if ( vueelements && vueelements.length>0){
    vueelements.forEach( el => {
    
        var component = el.getAttribute("js-mount-vue");
        var uid = UNIQID(`${component}-`);
        el.id= uid;
        
        ///TODO : replace with something sane
        if (component == "AddToCart"){
            mountVue(`#${uid}`, AddToCart);
        }else if (component == "ProductVariantSelector"){
            mountVue(`#${uid}`, ProductVariantSelector);
        }
        else if (component == "ProductApp"){
            mountVue(`#${uid}`, ProductApp);
        }
    });
}


//ProductApp