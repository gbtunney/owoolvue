<template>
    <div>
        <span>shop name is: {{this.shopname}}, count: {{this.count}} <button @click="increment">increment</button></span>
        <p>
            The count will stay when you will move to different pages, thanks to <a href="https://github.com/championswimmer/vuex-persist">vuex-persist</a>.
            This is not a template for an SPA and should not be treated as one,
            make sure you use vue only for stuff you used to do with JQuery and not for generating content/meta tags,
            because that will hurt your SEO.
        </p>
        <multiselect v-model="value" :options="options"></multiselect>
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
      components: { Multiselect,Product },
      data () {
          return {
              value: null,
              options: ['list', 'of', 'options']
          }
      },
    name: 'ThemeComponent',
    computed: mapGetters(['count']),
    methods: mapMutations(['increment']),
  };
</script>




