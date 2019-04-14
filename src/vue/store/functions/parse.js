const schema = require("schm");
import {Slugify, GDatamapper} from '@/helpers/main.js'

export parseOptions =function (inOptions) {
	
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

export parseVariants=function(inVariants, inOptionsArr) {
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
