const schema = require("schm");
import math from 'mathjs'

import {Slugify, GDatamapper,normalize,filterArrayByValue} from '@/helpers/main.js'
import {getSwatchSrc, getColorData} from './meta'
//            var exampleArr = [{ "slug": "alumroot", "swatch_image": "swatch-alumroot.png", "color": "#4b1b3f", "color_story": "A glorious maroon", "tags": ["maroon", "red", "warm"] }, { "slug": "ash", "swatch_image": "swatch-ash.png", "color": "#3e404c", "color_story": "A nice grey", "tags": ["neutral", "grey"] }, { "slug": "basswood", "swatch_image": "swatch-basswood.png", "color": "#191e2f", "color_story": "Dark blue", "tags": ["blue", "cool"] }];
/*

const demo_config= [{
    "slug": "color",
    "searchable": true,
    "value_config_default": {
        "swatch_image": true
    }
},
    {
        "slug": "size",
        "searchable": false,
        "value_config_default": {
            "color": "#ff0000"
        }
    }
]

const optionvaluemeta=[
    {
        "slug" : "alumroot",
        "swatch_image": "swatch-alumroot.png",
        "color": "#4b1b3f",
    },
    {
        "slug" : "ash",
        "swatch_image": "swatch-ash.png",
        "color": "#3e404c",
    },
    {
        "slug" : "basswood",
        "swatch_image": "swatch-basswood.png",
        "color": "#191e2f",
    }
]
*/


export function parseOptions(inOptions,option_config =false, option_value_overrides=false) {
	
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
		id: {type: Number, default: Math.round(math.random(11111111111, 999999999999999))},
		parent_id: {type: Number, default: false},
		slug: {type: String, required: true},
		$isDisabled:  {type: Boolean, default: false},
		title: {type: String},
		_index: {type: Number, required: true},
		swatch_image: {type:Boolean,String, default: false},
		color: {type: String, default: false},
		color_story:{type:String, default:false},
        tags:{type:Array, default:[]}
    })
}
	let optionsArray = inOptions;
	
	var newArray =[];
	for (let i = 0; i < optionsArray.length; i++) {
		var currentObj = optionsArray[i];
		var OPTIONS_SCHEMA = schema({
			
			///PARENT OPTION , not value.
			id: {type: Number, default: math.random(11111111111, 999999999999999)},
			name: {type: String, default: false},
			slug: {type: String, default: Slugify(currentObj["name"]), required: true},
			position: {type: Number},
			_index: {type: Number, default: i, required: true},
			product_id: {type: Number, required: true, default: false},
			searchable: false,
			values: {type: Array, default: false}
		});
		
		currentObj = OPTIONS_SCHEMA.parse(currentObj);
		
		//NEW !!! NEED TO MERGE CONFIG PROPS TO PARENT OPTION (like searchable)
		let configOptionforCurrent  =false;
		
		if ( option_config.length > 0){
			configOptionforCurrent= option_config.find(function(optionconfigval){
				if (optionconfigval.slug ==currentObj.slug  ) return true;
				return false;
			})
			if (configOptionforCurrent.hasOwnProperty('searchable') ){    //value_config_default:Object
				currentObj = Object.assign(currentObj,{searchable: configOptionforCurrent.searchable });
			}
			
		}

		for (var u = 0; u < currentObj.values.length; u++) {
			var newValueObj = GDatamapper.expandToObject(currentObj.values[u], "title", {
				slug: Slugify(currentObj.values[u]),
				color: 'none',//getColorData(Slugify(currentObj.values[u])), ///TODO : REWORK THIS
				swatch_image: false, //getSwatchData(Slugify(currentObj.values[u])),
				_index: u,
				parent_id: normalize(optionsArray[i].id),
				gillian: "test"
			})
			
			newValueObj = GDataMapOptionValues.validate().parse(newValueObj);
			
			if (configOptionforCurrent.hasOwnProperty('value_config_default') ){    //:Object
				newValueObj = Object.assign(newValueObj,configOptionforCurrent.value_config_default  );
			}
            
            if (option_value_overrides && option_value_overrides.length > 0){
                
                let valueSeekingOut = Slugify(currentObj.values[u]);
                
                var filteredExampleArr = option_value_overrides.find(function(optionvalueconfigitem) {
                    if (optionvalueconfigitem.slug == valueSeekingOut) return true;
                    return false;
                })
                if (filteredExampleArr && filteredExampleArr.hasOwnProperty('slug')){
                    newValueObj = Object.assign(newValueObj, filteredExampleArr)
                }
            }
			
            currentObj.values[u] = newValueObj;
		}
		
		currentObj.valueDictionary = GDatamapper.parseToDictionary(currentObj.values, "id");
		newArray.push(currentObj);
	}
	return newArray;
}

export function parseVariants(inVariants, inOptionsArr) {
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
			}
		}
		item.options = GDatamapper.parseToDictionary(newTargetArray, "parent_id");
	})
	return variantArr.slice(0);
}
