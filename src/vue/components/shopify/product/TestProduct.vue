<template>
	<div>
		<span>{{CurrentProductTitle}} {{CurrentVariantTitle}} <button @click="increment">increment</button></span>
		<p>
			The count will stay when you will move to different pages, thanks to <a href="https://github.com/championswimmer/vuex-persist">vuex-persist</a>.
			This is not a template for an SPA and should not be treated as one,
			make sure you use vue only for stuff you used to do with JQuery and not for generating content/meta tags,
			because that will hurt your SEO.
		</p>
	</div>
</template>

<script type="text/javascript">
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
    import {ProductMixin} from  '@/mixins/productmixin.js';

    const schema = require("schm");
  //  ProductMixin
    export default {
	    props: {
		    variantid: {
			    default: false
		    },
		    productid: {
			    default: false
		    },
	    },
	    mixins: [ProductMixin],
	    components: {},
	    data() {
		    return {

		    }
	    },
	    name: 'testcomponent',
	    computed: {

    },
    methods:{
     },
}
    ;
</script>




