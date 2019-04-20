<template>
	<div>
		<adminOptionSelect></adminOptionSelect>

		<Multiselect :options="VariantArr"
		             v-model="CurrentVariant"
		             @input="variantChanged"
		             track-by="title"
		             label="title"
		             ref="multiselectmaster"
		             :taggable="false"
		             :multiple="false"
		             :closeOnSelect="false"
		             placeholder="Select one"
		             searchable="true"
		             :allow-empty="false">

			<template slot="singleLabel" slot-scope="{ option }">
				<strong>{{ option.id }}</strong> ID:<strong>  {{ option.title }}</strong>
			</template>

			<template slot="option" class="is-grid-2" slot-scope="props" disabled="true">
				<div disabled="true"  class="option__desc"><span class="option__title">qty{{ props.option.inventory_quantity}}:  {{ props.option.title }}</span></div>
			</template>

		</Multiselect>

		<productOptionPicker :inSelectedVariant="CurrentVariant" @optionChanged="optionChanged" :options="CurrentProductOptions"></productOptionPicker>


		option 2

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
		{{Layout}}
		<v-btn-toggle mandatory @change="testBtn" v-model="LayoutToggle">
			<v-btn flat>
				<v-icon>format_grid</v-icon>
			</v-btn>
			<v-btn flat>
				<v-icon>format_list</v-icon>
			</v-btn>
			<v-btn flat>
				<v-icon>format_align_right</v-icon>
			</v-btn>
			<v-btn flat>
				<v-icon>format_align_justify</v-icon>
			</v-btn>
		</v-btn-toggle>


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

    import singleProductOptionPicker from '@/components/product/options/SingleProductOptionPicker.vue' //single option picker

    import productOptionPicker from '@/components/product/options/ProductOptionsPicker.vue'


    import Multiselect from 'vue-multiselect'

    import { getVariantFromOptions} from '@/helpers/main.js'
    import 'vuetify/dist/vuetify.min.css'

    import Vue from 'vue';

    import Vuetify from 'vuetify'

    Vue.use(Vuetify, {
	    theme: {
		    primary: '#ee44aa',
		    secondary: '#424242',
		    accent: '#82B1FF',
		    error: '#FF5252',
		    info: '#2196F3',
		    success: '#4CAF50',
		    warning: '#FFC107'
	    },
	    iconfont: 'md',
    })
    import adminOptionSelect from '@/components/admin/ProductOptionTestComponent.vue';
/*		<singleProductOptionPicker searchable="true" :selectedoptionslug="Slug" @optionChanged="optionChanged" :option="OptionByProp('color')"></singleProductOptionPicker>
*/
    //custom version of vuemultiselect - stripped down.
  //  import Multiselect from '@/components/utilities/gMultiselectList.vue'
    //  import Multiselect from '@/components/utilities/gMultiselectList.vue'

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
		    },
		    swatch:{
			    default: "color"    ///the slug of the option to show a swatch on.
		    }
	    },
	    mixins: [ProductMixin],
	    components: {ProductImageSlideshow,productOptionSelect,adminOptionSelect,singleProductOptionPicker,productOptionPicker,Multiselect},
	    data() {
		    return {
		    	toggle_classes:['layout-grid','layout-list','layout-lg','layout-sm' ],
			    toggle_exclusive:2
		    }
	    },
	    name: 'testcomponent',
	    computed: {
	    ...mapGetters([
		    'LayoutToggle',
		    'OptionByProp',
		    'OptionValueByProp',
		    'OptionsArrByProduct'
	    ]
    ),
	    Slug:function(){
		    return "wild-geranium"
	    },
	    VariantArr: function() {
		    return this._mapDisabledVariants(this.Variants, [] /*this._getVariantFromOptions( [value.id], this.Variants)*/);
	    },
	    Layout:function(){
			return this.$data.toggle_classes[this.LayoutToggle];
	    },
	    SelectedOptions:function(){
		    return this.$data.toggle_classes[this.LayoutToggle];
	    }
	    /*_setSelectedOptions: function() {
			var selectedArr = new Array()

			if (this.$data.selectedVariant){
				this.$data.selectedOptions = [];
				for (var i = 0; i < this.Options.length; i++) {
					console.log("selected variant is ",this.$data.selectedVariant,this.Options,this.$data.selectedVariant.options );

					this.$data.selectedOptions.push(this.$data.selectedVariant.options.get(this.Options[i].id));
				}
			}
		},*/
	    },
	    created:function(){

	    	let self = this;

		    this.loadProduct().then(function(res){

		    self.add_product_to_dictionary({product: res.data.product});
		    self.add_variants_to_dictionary({variants: res.data.product.variants});
		    self.add_images_to_dictionary({images: res.data.product.images});
		    self.add_options_to_dictionary({options: res.data.product.options});

			    self.CurrentVariant  = self.CurrentVariant ;

			    ///example - --::
			   // console.log("kjkkhhkhkhhkhkOPTIN!!!!!!!!!!",self.OptionValueByProp("gray-birch"));
			     console.log("arr nby product!!!!!!!!!!",self.OptionsArrByProduct(self.CurrentProduct.id));


		    })
	    },
	    mounted:function(){
		    this.loadVariantMeta(this.NormalizedProductID, this.NormalizedVariantID)
	    },
	    methods:{
	    ...mapMutations(['setlayoutButton']),

			    testBtn:function(target){
		    	console.log("changed",target);
		    	this.setlayoutButton({index: target})
		    },
	    	variantChanged: function(variant) {
	    		this.CurrentVariant  = variant;
	    		console.log("variant changed!!!!!",variant)

	        },
		    optionChanged: function(requestedVariant,option_dictionary) {
			    console.log("master option changed!!!!!",requestedVariant,option_dictionary);
			    this.variantChanged(requestedVariant);
		    },
		    _getVariantFromOptions: function( optionArray, variantsArr ) {   //move to a mixin.
			    return   getVariantFromOptions(optionArray, variantsArr);
		    },
		    setVariantsDisabled:function(variantsArr){
			    if (newFilteredArray.length < 1){
				    Vue.set(option, '$isDisabled', true);
			    } else {
				    Vue.set(option, '$isDisabled', false);
			    }
		    },
		    _mapDisabledVariants:function(variantsArr,flaggedVariants,bool=true){   ///TODO: remap oos too seperate out

			    var newVariantArr =Array.from(variantsArr);

			    let _flaggedVariants =flaggedVariants;
			    newVariantArr=     newVariantArr.map(function(variant){
				    let ID = variant.id;

				    var result =  _flaggedVariants.find(function(item){
					    if (ID == item.id ){
						    return true;
					    }else{
						    return false;
					    }
				    })
				    if ( result || variant.inventory_quantity <=0  ){
					    return  Object.assign(variant, {$isDisabled :bool })
				    }else{
					    return  Object.assign(variant, {$isDisabled :!bool  })
				    }

			    })
			    return newVariantArr;
		    }
	    },
};
</script>
<!--
<style src="vue-multiselect/dist/vue-multiselect.min.css" ></style>
-->

<style lang="scss" type="text/scss">

</style>





