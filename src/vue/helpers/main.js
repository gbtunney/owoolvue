export function Slugify(text) {
	// https://gist.github.com/mathewbyrne/1280286
	return text.toString().toLowerCase()
	.replace(/\s+/g, '-')           // Replace spaces with -
	.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	.replace(/\-\-+/g, '-')         // Replace multiple - with single -
	.replace(/^-+/, '')             // Trim - from start of text
	.replace(/-+$/, '')             // Trim - from end of text
	.replace(/[\s_-]+/g, '-');
	
}

export function ShopifyImgURL(src, size) {
	// remove any current image size then add the new image size
	if ( size == false ){
		return src;
	}
	return src
	.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
	.replace(/\.jpg|\.png|\.gif|\.jpeg/g, function(match) {
		return '_' + size + match;
	})
		;
}

export function updateHistory(variant) {
	var newurl =
		window.location.protocol +
		'//' +
		window.location.host +
		window.location.pathname +
		'?variant=' +
		variant.id;
	window.history.replaceState({path: newurl}, '', newurl);
}


export function setQueryStringParameter(name, value) {
	const params = new URLSearchParams(location.search);
	params.set(name, value);
	window.history.replaceState({}, "", decodeURIComponent(`${location.pathname}?${params}`));
}

export function normalize(value) {
	return parseInt(value);
}

export function firstValue(_array, _value, _prop=false, _first = true) {
	//todo: the first value so it dont break
}

export function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
export function filterArrayByValue(_array, _value, _prop=false, _first = true) {
	if (!_array || !_value || _array.length <= 0) return;
	
	let prop = _prop, value = _value;
	
	if ( _first ){
		
		///TODO: props fix - this needs to return single value
		return _array.find(function(item){
			if (item.hasOwnProperty(prop) && item[prop] == value) return true;
			if (_prop==false && item == _value ){
				console.log("!!!!the item is " ,prop, item,_value);
				return true;
			}
			return;
		})
	}else{
		return _array.filter(function(item){
			if (item.hasOwnProperty(prop) && item[prop] == value) return true;
			if (_prop==false && item == _value ){
				console.log("!!!!the item is " ,prop, item,_value);
				return true;
			}
			return;
		})
	}
	return;
	
}

export const GDatamapper = {
	mapData: function(obj, map, merge =true) {
		let data_map = map;
		let Obj = Object.assign(obj);
		Object.keys(obj).forEach(function(key) {
			console.log(`key ${ key} ,${data_map.hasOwnProperty(key)}map   ${Obj.hasOwnProperty(key) } obj`);
			
			if (data_map.hasOwnProperty(key) && (typeof data_map[key] == 'function')){
				Obj[key] = (data_map[key]).call(data_map[key], Obj, key);
			} else {
				if (Obj.hasOwnProperty(key)){
					if (merge){
						console.log("key for this being creeated", key);
						
						Obj[key] = Obj[key];
					} else {
						console.log("key for this being deleted", key);
						
						delete Obj[key];
					}
					
				} else {
				
				}
			}
		});
		return Obj;
	},
	expandToObject: function(_value, _newprop=false, _addprops={}) {
		if (typeof _value == "string" || typeof _value == "number"){
			if (_newprop){
				return Object.assign({[_newprop.toString()]: _value}, _addprops);
			} else {
				return Object.assign({}, _addprops);
			}
		} else {
			return _value;
		}
	},
	parseToDictionary: function(_array, _keyprop, _currentMap = new Map(), _currObject={}) {
		var _dictionary = _currentMap;//new Map();
		
		if (typeof _array == "object"){
			for (var i = 0; i < _array.length; i++) {
				var _currObject = _array[i];
				
				var _newObject = Object.assign({_index: i}, _currObject);
				if (_newObject && _currObject[_keyprop]){
					_dictionary.set(normalize(_currObject[_keyprop]), _newObject);
					
				}
			}
		} else {
			return false;
		}
		
		return _dictionary;
	}
};

export function isVariantAvailable(variant, inventory_count = 1 ) {

	if (variant && variant.hasOwnProperty('inventory_quantity') && variant.hasOwnProperty('inventory_management')){
		if (variant.inventory_management == null){
			return true;
		} else if (variant.inventory_quantity >= inventory_count){
			return true;
		} else {
			return false;
		}
	}
}
export function isGetMaxQuantity(variant, inventory_count = 1 ) {
	
	if (variant && variant.hasOwnProperty('inventory_quantity') && variant.hasOwnProperty('inventory_management')){
		if (variant.inventory_management == null){
			return 1;
		} else if (variant.inventory_quantity >= inventory_count){
			return true;
		} else {
			return false;
		}
	}
}

export function getVariantFromOptions(inOptions, inVariants) {
	let self = this;
	let optionArray = inOptions;
	
	//REMAP TO JUST THE IDS
	optionArray = optionArray.map(function(item) {
		if (item.hasOwnProperty('id')){
			return item.id;
		} else if (item.hasOwnProperty('slug')){
			
			return item.slug;
		} else {
			return item;
		}
	})
	let variantArray = inVariants;
	
	let filteredVariantArray = variantArray;
	
	for (let i = 0; i < optionArray.length; i++) {
		
		let mode = "id";
		let selectedOptionID = false;
		
		if (isNaN(optionArray[i])){
			///it is a string, not a number...
			mode = "slug";
			selectedOptionID = Slugify(optionArray[i]);
		} else {
			selectedOptionID = normalize(optionArray[i]);
		}
		
		filteredVariantArray = filteredVariantArray.filter(function(variant) {
			if (!variant.options){
				throw "does not have option for unparsed variants yet";
				return false;
				
			} else {
				
				///remap the values to ignore the main
				let found = false;
				variant.options.forEach(function(parentOption) {
					
					if (mode == 'id'){
						if (parentOption.id == selectedOptionID){
							found = true;
						}
					} else if (mode == "slug"){
						if (parentOption.slug == selectedOptionID){
							found = true;
						}
					}
				});
				if (found){
					return true;
				}
			}
		})
	}
	
	return filteredVariantArray;
}

export default {
	// Some data...
};