import {mountVue} from "../../vue/mountVue";
/*import AddToCart from "../../vue/components/shopify/product/AddToCartMultiple.vue";
import ProductVariantSelector from "../../vue/components/shopify/product/Product-Variant-Selector.vue";
import ProductApp from "../../vue/components/shopify/product/Product.vue";

*/
import ProductApp from "../../vue/components/shopify/product/TestProduct.vue";
//import AdminProductApp from "../../vue/components/shopify/admin/AdminProductSelector.vue";
//import NewProduct from "../../vue/components/shopify/product/TestProduct.vue";
//import ProductVariantLinker from "../../vue/components/shopify/product/Product-Variant-Linker.vue"; //used for kits to link to variants


//mountVue('#owool-test-app', NewProduct);


const UNIQID = require('uniqid');

//mountVue('#owool-cart-app', Cart);
////MOUNT DYNAMIC COMPONENTS WITH MULTIPLE INSTANCES
const vueelements = document.querySelectorAll('[js-mount-vue]');

if ( vueelements && vueelements.length>0){
    vueelements.forEach( el => {
        
        var component = el.getAttribute("js-mount-vue");
        var uid = UNIQID(`${component}-`);
        el.id = uid;
    
        ///TODO : replace with something sane
        if (component == "AddToCart"){
//            mountVue(`#${uid}`, AddToCart);
        } else if (component == "ProductVariantLinker"){
           // mountVue(`#${uid}`, ProductVariantLinker);
        }
        else if (component == "ProductApp"){
            mountVue(`#${uid}`, ProductApp);
        }
        else if (component == "AdminProductApp"){
           // mountVue(`#${uid}`, AdminProductApp);
        }else if (component=="TestApp"){
           // mountVue(`#${uid}`, NewProduct);
    
    
        }
    });
}

