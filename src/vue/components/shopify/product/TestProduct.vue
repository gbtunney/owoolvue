<template>
	<div> I AM A HELLo
		<span>shop name is: {{this.shopname}}, count:{{CurrentProductTitle}} <button @click="increment">increment</button></span>
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

    export default {
	    props: {
		    shopname: String,
		    loadproduct: {
			    type: Boolean,
			    default: true
		    },
		    variantid: {
			    type: String,
			    default: '18250174431350'
		    },
		    productid: {
			    type: String,
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
			    CurrentProduct(state)
		    {
			    return state.product_dictionary.get(String(this.$props.productid));
		    }
        }),
	    CurrentProductTitle: function() {

		    return this.CurrentProduct.title;
	    },
	    CurrentProductID: function() {

		    return this.CurrentProduct.id;
	    }
    },
    created:function() {
	    let self = this;

	    //1919090589814
	    if (this.$props.loadproduct){
		    this.getProduct({params: {id: this.$props.productid}}).then(function(res) {
			    self.add_product_to_dictionary({product: res.data.product});
		    })
	    }

    }
    ,
    methods:{
    ...
	    mapActions([
		    'getProduct'
	    ]),
    ...
	    mapMutations(['increment', 'add_product_to_dictionary'])
    }
    }
    ;
</script>




