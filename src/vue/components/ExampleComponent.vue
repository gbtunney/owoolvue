<template>
    <div>
        <multiselect v-model="value" :options="options"></multiselect>
        <span>hello! shop name is: {{this.shopname}}, count: {{this.count}}<button @click="savevariant">save variant</button> <button @click="increment">increment</button></span>
        {{this.Testvariant}}    HI!
       <Product productid=1919179161718 variantid="18250174726262" producthandle="local">GILLIAN</Product>
        <p>
            The count will stay when you will move to different pages, thanks to <a href="https://github.com/championswimmer/vuex-persist">vuex-persist</a>.
            This is not a template for an SPA and should not be treated as one,
            make sure you use vue only for stuff you used to do with JQuery and not for generating content/meta tags,
            because that will hurt your SEO.
        </p>
    </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import Multiselect from 'vue-multiselect'
  import Product from './shopify/product/Product.vue'


  export default {
    props: {
      shopname: String,
    },
    name: 'ThemeComponent',
    computed: mapGetters(['count','Testvariant'],['Testvariant']),
    methods: mapMutations(['increment','savevariant'],['savevariant']),
      components: { Multiselect,Product },
      data () {
          return {
              value: null,
              options: ['list', 'of', 'options']
          }
      }
  };
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>


