import Vuex from 'vuex';
import Vue from 'vue';
import VuexPersistence from 'vuex-persist';
import shopifyAdminApi from "./shopify_admin_api";
import {Slugify, GDatamapper} from '@/gUtilities/main.js'
const schema = require("schm");
import math from 'mathjs';
import randomColor from 'randomcolor';


const getColorData = function(slug) {
	
	let _slug = slug;
	
	var new_arr = [];
	/*var new_arr = SWATCHES().filter(function(swatch) {
		if (swatch.slug == _slug){
			return true;
			
		} else {
			return false;
		}
	});*/
	
	if (new_arr.length > 0){
		return `${new_arr[0].color}`;
	} else {
		return randomColor();
	}
}


const 	parseOptions =function (inOptions) {
	
	const GDataMapOptionValues = {
			adapters: {
				default: {
					id: (obj, key) => ( !obj[key] ) ? false : true,
				slug: (obj, key) => ( !obj[key] ) ? Slugify(obj['title']) : false,
			title: (obj, key) => obj[key],
		swatch_image: (obj,key)=> "helllo!!",
		testing: "gillintunney"
}
},
	validate: () => schema({
		id: {type: String, default: Math.round(math.random(11111111111, 999999999999999))},
		parent_id: {type: String, default: false},
		slug: {type: String, required: true},
		$isDisabled:  {type: Boolean, default: false},
		title: {type: String},
		_index: {type: Number, required: true},
		swatch_image: {type: String, default: false},
		color: {type: String, default: false}
	})
}
	
	let optionsArray = inOptions;
	
	var newArray =[];
	for (let i = 0; i < optionsArray.length; i++) {
		var currentObj = optionsArray[i];
		var OPTIONS_SCHEMA = schema({
			
			id: {type: String, default: math.random(11111111111, 999999999999999)},
			name: {type: String, default: false},
			slug: {type: String, default: Slugify(currentObj["name"]), required: true},
			position: {type: Number},
			_index: {type: Number, default: i, required: true},
			product_id: {type: String, required: true, default: false},
			values: {type: Array, default: false}
		});
		
		currentObj = OPTIONS_SCHEMA.parse(currentObj);
		for (var u = 0; u < currentObj.values.length; u++) {
			var newValueObj = GDatamapper.expandToObject(currentObj.values[u], "title", {
				slug: Slugify(currentObj.values[u]),
				color: getColorData(Slugify(currentObj.values[u])), ///TODO : REWORK THIS
				swatch_image: false,//getSwatchData(Slugify(currentObj.values[u])),
				_index: u,
				parent_id: optionsArray[i].id,
				gillian: "test"
			})
			
			// throw newValueObj;
			newValueObj = GDataMapOptionValues.validate().parse(newValueObj);
			currentObj.values[u] = newValueObj;
			
		}
		
		
		currentObj.valueDictionary = GDatamapper.parseToDictionary(currentObj.values, "id");
		newArray.push(currentObj);
	}
	//throw newArray;
	
	return newArray;//GDatamapper.parseToDictionary(newArray, "id")
}

const parseVariants=function(inVariants, inOptionsArr) {
	var optionCount = 3;
	let variantArr = inVariants;
	
	variantArr.forEach(function(item, key) {
		
		let newTargetArray = new Array();
		
		for (var u = 1; u < optionCount + 1; u++) {
			
			//make array with chosen optiosn.
			
			if (!item[`option${u}`]){
				continue;
			} else {
				
				
				let searchString = Slugify(item[`option${u}`]);
				
				console.log("currobk", searchString, inOptionsArr, item);
				
				var myArr = inOptionsArr[u - 1].values.filter(function(option) {
					
					if (option.slug == searchString){
						return true;
					} else {
						return false;
					}
				})
				
				//check to make sure there is only one
				if (myArr.length != 1){
					throw "ERROR OPTION NOT FOUND";
				} else {
					newTargetArray.push(myArr[0]);
				}
				//console.log("finsihed array",newTargetArray);}
				
			}
		}
		item.options = GDatamapper.parseToDictionary(newTargetArray, "parent_id");
	})
	return variantArr.slice(0);
}



Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage || {},
});

const main_store = {
    state: {
        count: 0,
        product_dictionary: new Map(),
	    variant_dictionary: new Map(),
	    option_dictionary: new Map(),
	    product_image_dictionary: new Map(),
	    
    },
	getters: {
		Count: function(state) {
			return state.count
		},
		Variants: function(state) {
			return Array.from(state.variant_dictionary.values())//state.count
		},
		Options: function(state) {
			if (state.option_dictionary){
				return Array.from(state.option_dictionary.values())//state.count
				
			}else{
				return [];
			}
		}
	},
	mutations: {
		increment(state, payload) {
			state.count += payload.amount
		},
		add_product_to_dictionary(state, payload) {
			state.product_dictionary = new Map(state.product_dictionary).set(parseInt(payload.product.id) , payload.product)
		},
		add_variants_to_dictionary(state, payload) {
		    
		    var variantArr = payload.variants;
			console.log("parsing",variantArr.length );
			
			var newMap = new Map(state.variant_dictionary  );
			
			variantArr.forEach( function(item){
				
				newMap.set(item.id,item);
            })
			state.variant_dictionary = newMap;
			console.log("parsedsize ",state.variant_dictionary.size );
			
		},
		add_images_to_dictionary(state, payload) {
			
			var imagesArr = payload.images;
			console.log("parsing",imagesArr.length );
			
			var newMap = new Map(state.product_image_dictionary  );
			
			imagesArr.forEach( function(item){
				newMap.set(parseInt(item.id),item);
			})
   
			state.product_image_dictionary = newMap;
			console.log("parsedsize ",state.product_image_dictionary.size );
			
		},
		add_options_to_dictionary(state, payload) {
			
			var parsedOptions = parseOptions(payload.options);
			state.option_dictionary = GDatamapper.parseToDictionary(parsedOptions, "id");
			
			
			if ( state.variant_dictionary ){
				var newvariants =  parseVariants(Array.from(state.variant_dictionary.values()),Array.from(state.option_dictionary.values())) ;
				console.log("parsing options",	state.option_dictionary,newvariants );
				//todo, make this commit something
				//state.variant_dictionary = new
				
				var newMap = new Map(state.variant_dictionary  );
				
				newvariants.forEach( function(item){
					
					newMap.set(item.id,item);
				})
				state.variant_dictionary = newMap;
				
			}
			
			//state.product_image_dictionary = newMap;
			
		}
	},
  plugins: [vuexLocal.plugin],
}

main_store.mutations = {...main_store.mutations, ...shopifyAdminApi.mutations}
main_store.actions = {...main_store.actions, ...shopifyAdminApi.actions}
main_store.state = {...main_store.state, ...shopifyAdminApi.state}

export default new Vuex.Store(main_store);