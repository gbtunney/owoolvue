/* eslint-disable id-length */
import Vue from 'vue';
import store from './store/index';
import VueRouter from 'vue-router';

var unflatten = require('flat').unflatten

/**
 * retrieves attributes from an element and turn them into an object
 * @param el: htmlElement
 * @param prefix
 * @returns {{}}
 */
function getAttributes(el, prefix = null) {
    // turn the nodelist into an array
    return Array.prototype
        .slice.call(el.attributes)
        .reduce((acc, attributeNode) => {
            // turn the array into an object
            let name = attributeNode.nodeName;
            let value = attributeNode.nodeValue.trim();
            if (prefix) {
                if (name.startsWith(prefix)) {
                    name = name.replace(prefix, '');
                } else {
                    return acc;
                }
            }

            // parse objects or arrays
            if (value.charAt(0) === '{' && value.charAt(value.length - 1) === '}') {
                value = JSON.parse(value);
            } else if (value.charAt(0) === '[' && value.charAt(value.length - 1) === ']') {
                value = JSON.parse(value);
            }
            acc[name] = value;
            return unflatten(acc);
        }, {});
}

/**
 * renders the vue component into an element, you can pass props to it
 * by adding to the .liquid file on the root element attributes with the vue- prefix
 * @param selector
 * @param rootComponent
 * @returns boolean
 */


const router = new VueRouter({
    mode: 'history',
    routes: []
});

export function mountVue(selector, rootComponent, addl_props = {}) {
    const el = document.querySelector(selector);

    if (el) {
        const props = (getAttributes(el).hasOwnProperty('prop')) ? getAttributes(el)['prop'] : {};

        var myvue = new Vue({
            store,
            router,
            render: (h) => h(rootComponent, {
                props
            }),
        }).$mount(`${selector}`);
        return myvue;
    } else {
        console.error(`Failed to find selector ${selector}`);
        return false;
    }
}
