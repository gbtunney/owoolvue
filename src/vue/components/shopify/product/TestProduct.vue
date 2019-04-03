<template>
	<div>
		<div class="product-single__meta">
			<h2 v-show="sectionsettings.product_vendor_enable && ProductVendor" class="product-single__vendor" itemprop="brand">{{ CurrentProductVendor }}</h2>
			<h1 class="product-single__title" itemprop="name">{{ CurrentProductTitle }}</h1>

			<div data-price-container>
				<span v-if="CurrentVariantOnSale" class="product-single__price--wrapper" aria-hidden="false">
                  <span id="ComparePrice" class="product-single__price--compare-at">
                   {{ CurrentVariantCompareAtPrice }}
                  </span>
                </span>
				<span id="ProductPrice"
				      class="product-single__price on-sale"
				      itemprop="price"
				      :content="CurrentVariantPrice">
                {{ CurrentVariantPrice }}
              </span>
			</div>
		</div>


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
		    sectionsettings: {
		    	default: {}
		    }
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
	    created:function(){
		    this.loadProduct();
		    console.log("settings are", this.$props.sectionsettings);
	    },
	    mounted:function(){
		    this.loadVariantMeta(this.NormalizedProductID, this.NormalizedVariantID)
	    },
    methods:{
     },
}
    ;
</script>




