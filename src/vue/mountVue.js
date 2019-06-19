/* eslint-disable id-length */
import Vue from 'vue';
import store from './store/index';
import VueRouter from 'vue-router';

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
      return acc;
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

export function mountVue(selector, rootComponent, addl_props = {} ) {
  const el = document.querySelector(selector);
    const elnode = document.querySelector(selector + "#testingdata");

  //const eldata = JSON.parse(document.getElementById('testingdata').innerHTML);// document.getElementById('testingjson');
  if (el) {
      const props =Object.assign( getAttributes(el, 'prop-'),addl_props );
      //merge additional props..
     // var myelement =  JSON.stringify('' + el.innerHTML.toString() +'');

      var mytext = "'" + (el.innerText.substring(2, el.innerText.length-2)) + "'";


      console.log(JSON.parse(mytext));
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
