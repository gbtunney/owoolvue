/// project related functions utilitized by the store.
import math from 'mathjs'
import isColor from 'is-color';
import randomColor from 'randomcolor';

export getSwatchSrc=function (option){
	
	let newFilteredArray = this.Variants;
	
	newFilteredArray = newFilteredArray.filter(function(variant) {
		
		var foundArray = [];
		
		var optionID = option.parent_id;
		var optionValueID = option.id;
		
		if (optionValueID == variant.options.get(optionID).id){
			return true;
		}
	})
	if (newFilteredArray.length>=1 ) {
		
		var variant= newFilteredArray[0];
		
		var img = this.product_image_dictionary.get( variant.image_id)
		console.log("AERT CLLUNG ",img,this.product_image_dictionary);
		
		
		
	}
	console.log("got to  here!!!");
	
	return ShopifyImgURL(img.src,'100x100') ;
	/*



					let mySelectedOptions = this.$data.selectedOptions;
					let newFilteredArray = this.Variants;

					for (let i = 0; i < mySelectedOptions.length; i++) {

						newFilteredArray = newFilteredArray.filter(function(variant) {

							var foundArray = [];

							var optionID = mySelectedOptions[i].parent_id;
							var optionValueID = mySelectedOptions[i].id;

							if (optionValueID == variant.options.get(optionID).id){
								return true;
							}
						})
					}*/
	
	//
};

export getColorData = function(slug) {
	
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
