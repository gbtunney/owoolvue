<template>
	<div> I AM A HELLo
		<span>shop name is: {{this.shopname}}, count:{{CurrentProductTitle}} {{CurrentVariantTitle}} <button @click="increment">increment</button></span>
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
    const schema = require("schm");

    const PROPS_SCHEMA = schema({
	    variantid: {type: Number },
	    productid: {type: Number },
	    loadproduct: {type:Boolean ,default: false },
	    loadvariant: {type:Boolean ,default: false }
    });

    export default {
	    props: {
		    shopname: String,
		    loadproduct: {
			    default: true
		    },
		    loadvariant: {
			    default: true
		    },
		    variantid: {
			    default: false
		    },
		    productid: {
			    default: false
		    },
	    },
	    components: {},
	    data() {
		    return {
			    value: null,
			    options: ['list', 'of', 'options']
		    }
	    },
	    name: 'testcomponent',
	    computed: {
	    ...mapState({product_dictionary: state => state.product_dictionary,
		    variant_dictionary: state => state.variant_dictionary,
			    CurrentProduct(state)
		    {
			    return state.product_dictionary.get(this.NormalizedProductID);
		    },
    CurrentVariant(state)
    {
	    return state.variant_dictionary.get(this.NormalizedVariantID);
    }
        }),
	    CurrentProductTitle: function() {

	    	if ( this.CurrentProduct ){
			    return this.CurrentProduct.title;

		    }else{
			    return "NO TITLE";
		    }
	    },
	    CurrentProductID: function() {

		    return this.CurrentProduct.id;
	    },
	    CurrentVariantID: function() {

		    return this.CurrentVariant.id;
	    },
	    CurrentVariantTitle: function() {
		    if ( this.CurrentVariant ){
			    return this.CurrentVariant.title;

		    }else{
			    return "NO variant TITLE";
		    }

	    },
	    NormalizedProductID: function() {
		    return parseInt(this.$props.productid);
	    },
	    NormalizedVariantID: function() {
		    return parseInt(this.$props.variantid);
	    }
    },
    created:function() {

	    let self = this;

	   // if (this.$props.loadproduct != "false"){
		    this.getProduct({params: {id: this.$props.productid}}).then(function(res) {
			    self.add_product_to_dictionary({product: res.data.product});
			    self.add_variants_to_dictionary({variants: res.data.product.variants});
			   // self.add_images_to_dictionary({images: res.data.product.images});
//18249590177910

			    console.log("current variant !!",self.CurrentVariant);
			   // console.log(this.variant_dictionary.get(this.NormalizedVariantID));
		    })
	   // }
/*

	    if (this.$props.loadvariant && this.$props.variantid ){
		    this.getVariant({params: {id: this.$props.variantid}}).then(function(res) {
			    //self.add_product_to_dictionary({product: res.data.product});
			    self.add_variants_to_dictionary({variants: [res.data.variant]});
			    console.log("currenty variant ", this.variant_dictionary)
		    })
	    }
*/

    }
    ,
    methods:{
	    ...mapActions([
			    'getProduct','getVariant'
		    ]),
	    ...mapMutations(['increment', 'add_product_to_dictionary','add_variants_to_dictionary','add_images_to_dictionary'])
	    }
    }
    ;
</script>




