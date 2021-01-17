import "../../styles/slate/layout/theme.scss";
import '../../assets/fonts.scss.liquid';
import Vue from 'vue';


import {mountVue} from "../../vue/mountVue";
/*import AddToCart from "../../vue/components/shopify/product/AddToCartMultiple.vue";
import ProductVariantSelector from "../../vue/components/shopify/product/Product-Variant-Selector.vue";
import ProductApp from "../../vue/components/shopify/product/Product.vue";

*/
import ProductApp from "../../vue/components/product/ProductApp.vue";
import CartIndicator from "../../vue/components/product/cart/CartIndicator.vue";

import CartPanel from "../../vue/components/product/cart/CartPanel.vue";
import KitEditorApp from "../../vue/components/admin/KitEditor.vue";
import AnnouncementBarApp from "../../vue/components/header/AnnouncementBarApp.vue";

import ProductCard from "../../vue/components/collection/ProductCard.vue";
import GIcon from "../../vue/components/utilities/GIcon.vue";

//import AdminProductApp from "../../vue/components/shopify/admin/AdminProductSelector.vue";
//import NewProduct from "../../vue/components/shopify/product/TestProduct.vue";
//import ProductVariantLinker from "../../vue/components/shopify/product/Product-Variant-Linker.vue"; //used for kits to link to variants

//import PageDesignerDemo from "../../vue/components/admin/PageDesignerDemo.vue";

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
        } else if (component == "CartPanel"){
            mountVue(`#${uid}`, CartPanel);
        }
        else if (component == "ProductApp"){
           // alert();
          mountVue(`#${uid}`, ProductApp);
        }
        else if (component == "KitEditorApp"){
            // alert();
            mountVue(`#${uid}`, KitEditorApp);
        }
        else if (component == "AnnouncementBarApp"){
            // alert();
            mountVue(`#${uid}`, AnnouncementBarApp);
        }
        else if (component == "AdminProductApp"){
           // mountVue(`#${uid}`, AdminProductApp);
        }else if (component=="CartIndicator"){
           mountVue(`#${uid}`, CartIndicator);
        }
        else if (component=="ProductCard"){mountVue(`#${uid}`, ProductCard);
        }
        else if (component=="GIcon"){mountVue(`#${uid}`, GIcon);
        }  else if (component=="PageDesignerDemo"){mountVue(`#${uid}`, PageDesignerDemo);
        }


    });
}

