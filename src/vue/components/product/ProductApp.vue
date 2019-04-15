<template>
	<div>
		<adminOptionSelect></adminOptionSelect>
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

		<ProductImageSlideshow :currentvariant="CurrentVariant"></ProductImageSlideshow>

		<productOptionSelect class="--is-grid-2" :variants="Variants"  :selectedVariant="CurrentVariant" v-on:variant="variantChanged"></productOptionSelect>

		multiselect


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
    import ProductImageSlideshow from '@/components/product/ProductImageSlideshow.vue'
    import productOptionSelect from '@/components/product/ProductOptionSelector.vue'


    import adminOptionSelect from '@/components/admin/ProductOptionTestComponent.vue';

    //custom version of vuemultiselect - stripped down.
  //  import Multiselect from '@/components/utilities/gMultiselectList.vue'
    //  import Multiselect from '@/components/utilities/gMultiselectList.vue'


/*    <Multiselect v-model="CurrentVariant"
    :options="Variants" label="title"
    track-by="title"
		             @input="variantChanged"
    :multiple="false"
    :show-labels="false"
    placeholder="Pick a value"></Multiselect>
    */
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
	    components: {ProductImageSlideshow,productOptionSelect,adminOptionSelect},
	    data() {
		    return {
		    }
	    },
	    name: 'testcomponent',
	    computed: {

	    },
	    created:function(){

	    	let self = this;
		    this.loadProduct().then(function(res){

		    self.add_product_to_dictionary({product: res.data.product});
		    self.add_variants_to_dictionary({variants: res.data.product.variants});
		    self.add_images_to_dictionary({images: res.data.product.images});
		    self.add_options_to_dictionary({options: res.data.product.options});

			    console.log("DOUFUUODSUOUOSUOsettings are", self.CurrentVariant);
			    self.CurrentVariant  = self.CurrentVariant ;
		    })
	    },
	    mounted:function(){
		    this.loadVariantMeta(this.NormalizedProductID, this.NormalizedVariantID)
	    },
	    methods:{
	    	variantChanged: function(variant) {
	    		this.CurrentVariant  = variant;
	    		console.log("variant changed!!!!!",variant);
	    }
     },
};
</script>

<style lang="scss" type="text/scss">

</style>





