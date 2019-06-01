// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: bcSfFilterConfig.custom.products_per_page,
        // Optional
        loadProductFirst: true,
      	defaultDisplay: bcSfFilterConfig.custom.layout
    }
};

// Declare Templates
var bcSfFilterTemplate = {
    'soldOutClass': 'is-sold-out',

    'saleLabelHtml': '<div class="grid-product__on-sale"><p>{{saleLabel}}</p></div>',
    'soldOutLabelHtml': '<div class="grid-product__sold-out"><p>' + bcSfFilterConfig.label.sold_out + '</p></div>',
    'vendorHtml': '<p class="grid-product__vendor">{{vendor}}</p>',

    // Collage Template
    'productCollageItemHtml': '{{startCollageWrapper}}<div class="grid__item grid-product {{itemGridWidthClass}} {{soldOutClass}}">' +
                                '<script class="bc-sf-filter-product-script" data-id="bc-product-json-{{itemId}}" type="application/json">{{itemJson}}</script>' +
                                '<div class="grid-product__wrapper">' +
                                    '<div class="grid-product__image-wrapper">' +
                                        '<a class="grid-product__image-link" href="{{itemUrl}}">' +
                                            '<img class="grid-product__image" src="{{itemThumbUrl}}" alt="{{itemTitle}}">' +
                                        '</a>' +
                                        '{{itemSoldOutLabel}}' +
                                        '{{itemSaleLabel}}' +
                                    '</div>' +
                                    '<a href="{{itemUrl}}" class="grid-product__meta">' +
                                        '<span class="grid-product__title">{{itemTitle}}</span>' +
                                        '<span class="grid-product__price-wrap"><span class="long-dash">—</span><span class="grid-product__price">{{itemPrice}}</span></span>' +
                                        '{{itemVendor}}' +
                                    '</a>' +
                                '</div>' +
                            '</div>{{endCollageWrapper}}',

    // Grid Template
    'productGridItemHtml': '<div class="grid__item grid-product medium--one-half large--one-third {{soldOutClass}}">' +
                                '<script class="bc-sf-filter-product-script" data-id="bc-product-json-{{itemId}}" type="application/json">{{itemJson}}</script>' +
                                '<div class="grid-product__wrapper">' +
                                    '<div class="grid-product__image-wrapper">' +
                                        '<a class="grid-product__image-link" href="{{itemUrl}}">' +
                                            '{{imageStyle}}' +
                                            '{{itemImages}}' +
                                        '</a>' +
                                        '{{itemSoldOutLabel}}' +
                                        '{{itemSaleLabel}}' +
                                    '</div>' +
                                    '<a href="{{itemUrl}}" class="grid-product__meta">' +
                                        '<span class="grid-product__title">{{itemTitle}}</span>' +
                                        '<span class="grid-product__price-wrap"><span class="long-dash">—</span><span class="grid-product__price">{{itemPrice}}</span></span>' +
                                        '{{itemVendor}}' +
                                    '</a>' +
                                '</div>' +
                            '</div>',

    // Pagination Template
    'previousHtml': '<span class="prev"><a href="{{itemUrl}}"><span class="icon-fallback-text"><span class="icon icon-arrow-left" aria-hidden="true"></span><span class="fallback-text">Previous</span></span></a></span>',
    'nextHtml': '<span class="next"><a href="{{itemUrl}}"><span class="icon-fallback-text"><span class="icon icon-arrow-right" aria-hidden="true"></span><span class="fallback-text">Next</span></span></a></span>',
    'pageItemHtml': '<span class="page"><a href="{{itemUrl}}">{{itemTitle}}</a></span>',
    'pageItemSelectedHtml': '<span class="page current">{{itemTitle}}</span>',
    'pageItemRemainHtml': '<span>{{itemTitle}}</span>',
    'paginateHtml': '<div class="pagination">{{previous}}{{pageItems}}{{next}}</div>',
};

/************************** BUILD PRODUCT LIST **************************/

var is_three_row__product = false;
var is_reverse_row__product = false;
var three_row_index__product = 0;

// Build Product Collage Item
BCSfFilter.prototype.buildProductCollageItem = function(data, index, totalProduct) {
    
    console.log("BUILDING collage item ", data,index,totalProduct );
    /*** Prepare data ***/
    var images = data.images_info;
     // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/

    if (index == 1) {
        is_three_row__product = false;
        is_reverse_row__product = false;
        three_row_index__product = 0;
    }

    // Get Template
    var itemHtml = bcSfFilterTemplate.productCollageItemHtml;

    var collection_product_count__product = totalProduct;
    var divisible_by_three__product = collection_product_count__product % 3;
    var remaining_length__product = collection_product_count__product - index;

    if (remaining_length__product > 3) {
        is_three_row__product = true;
    }
    if (remaining_length__product < 4 && three_row_index__product > 2) {
        is_three_row__product = false;
    }
    if (divisible_by_three__product == 0) {
        is_three_row__product = true;
    }

    // Wrapper for collage
    var startCollageWrapper = '';
    var endCollageWrapper = '';
    // Grid Width class
    var itemGridWidthClass = 'one-whole medium--one-half large--one-half';
    if (totalProduct == 1) {
        itemGridWidthClass = '';
    }
    if (is_three_row__product == true) {
        if (three_row_index__product > 2) {
            is_reverse_row__product = is_reverse_row__product ? false : true;
            three_row_index__product = 0;
        }

        // Add a specific class for grid item
        switch(three_row_index__product) {
            case 0:
                if (is_reverse_row__product) {
                    itemGridWidthClass = 'grid__item--small one-whole reverse';
                } else {
                    itemGridWidthClass = 'grid__item--large one-whole medium--two-thirds large--two-thirds';
                }
                break;
            case 1:
                if (is_reverse_row__product) {
                    itemGridWidthClass = 'grid__item--small one-whole reverse';
                } else {
                    itemGridWidthClass = 'grid__item--small one-whole medium--one-third large--one-third';
                }
                break;
            case 2:
                if (is_reverse_row__product) {
                    itemGridWidthClass = 'grid__item--large one-whole medium--two-thirds large--two-thirds reverse clearfix';
                } else {
                    itemGridWidthClass = 'grid__item--small one-whole medium--one-third large--one-third clearfix';
                }
                break;
            default:
                break;
        }

        if (three_row_index__product == 0) {
            startCollageWrapper += '<div class="grid__item collage-grid__row"><div class="grid">';
        }

        if (is_reverse_row__product && three_row_index__product == 0) {
            startCollageWrapper += '<div class="grid__item collage-grid__reverse--wrapper one-whole medium--one-third large--one-third"><div class="grid">';
        }

        if (is_reverse_row__product && three_row_index__product == 1) {
            endCollageWrapper += '</div></div>';
        }

        if (three_row_index__product == 2) {
            endCollageWrapper += '</div></div><div class="grid__row-separator"></div>';
        }

        if (three_row_index__product <= 2) {
            three_row_index__product += 1;
        }
    } else {
        if (collection_product_count__product == 1) {
        } else {
            if (remaining_length__product == 2) {
                endCollageWrapper = '<div class="grid__row-separator"></div>';
            }
            if (three_row_index__product <= 2) {
                three_row_index__product += 1;
            }
        }
    }
    itemHtml = itemHtml.replace(/{{startCollageWrapper}}/g, startCollageWrapper);
    itemHtml = itemHtml.replace(/{{endCollageWrapper}}/g, endCollageWrapper);
    itemHtml = itemHtml.replace(/{{itemGridWidthClass}}/g, itemGridWidthClass);

    // Add soldOut class
    var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
    itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);

    // Add soldOut and onSale label
    if (soldOut) {
        itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, bcSfFilterTemplate.soldOutLabelHtml);
    } else {
        itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, '');
        if (onSale) {
            itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, bcSfFilterTemplate.saleLabelHtml.replace(/{{saleLabel}}/g, bcSfFilterConfig.label.save_price));
            itemHtml = itemHtml.replace(/{{ saved_amount }}/g, this.formatMoney(data.compare_at_price_min - data.price_min, this.moneyFormat));
        }
    }
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, '');

    // Add Thumbnail
    var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], 'grande') : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

    // Add Vendor
    var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorHtml.replace(/{{vendor}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

    // Add Price
    var itemPriceHtml = '';
    if (onSale) {
        itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.sale_price + '</span>';
    } else {
        itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.regular_price + '</span>';
    }
    if (priceVaries) {
        itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
        itemPriceHtml += '<span class="icon-fallback-text"><span class="icon icon-plus grid-product__price-min" aria-hidden="true"></span><span class="fallback-text">+</span></span>';
    } else {
        itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
    }
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add data json
    var self = this;
    var itemJson = {
      "id": data.id,
      "title": data.title,
      "handle": data.handle,
      "vendor": data.vendor,
      "variants": data.variants,
      "url": self.buildProductItemUrl(data),
      "options_with_values": data.options_with_values,
      "images": data.images,
      "available": data.available,
      "price_min": data.price_min,
  		"price_max": data.price_max,
  		"compare_at_price_min": data.compare_at_price_min,
  		"compare_at_price_max": data.compare_at_price_max,
    };
    itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(itemJson));

    // Add main attribute
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    return itemHtml;
};

// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {
    /*** Prepare data ***/
    var images = data.images_info;
     // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/

    // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    // Add soldOut class
    var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
    itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);

    // Add soldOut and onSale label
    if (soldOut) {
        itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, bcSfFilterTemplate.soldOutLabelHtml);
    } else {
        itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, '');
        if (onSale) {
            itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, bcSfFilterTemplate.saleLabelHtml.replace(/{{saleLabel}}/g, bcSfFilterConfig.label.save_price));
            itemHtml = itemHtml.replace(/{{ saved_amount }}/g, this.formatMoney(data.compare_at_price_min - data.price_min, this.moneyFormat));
        }
    }
    itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, '');

    // Build Image style
    var imageStyle = buildImageStyle(data);
    itemHtml = itemHtml.replace(/{{imageStyle}}/g, imageStyle);

    // Add Images
    var img_id_class = 'ProductCardImage-{{itemId}}';
    var wrapper_id = 'ProductCardImageWrapper-{{itemId}}';
    var itemImagesHtml = '';
    if (images.length > 0) {
        var aspect_ratio = images[0]['width'] / images[0]['height'];

        itemImagesHtml += '<div id="' + wrapper_id + '" class="product--wrapper">';
        itemImagesHtml += '<div style="padding-top:' + (1 / aspect_ratio * 100) + '%;">' +
                                '<img class="product--image lazyload ' + img_id_class + '"' +
                                ' src="' + this.getFeaturedImage(images, '150x150') +  '"' +
                                ' data-src="' + this.getFeaturedImage(images, '{width}x') + '"' +
                                ' data-widths="[180, 370, 590, 740, 900, 1080, 1296, 1512, 1728, 2048]"' +
                                ' data-aspectratio="' + aspect_ratio + '"' +
                                ' data-sizes="auto"' +
                                ' alt="{{itemTitle}}">' +
                            '</div>';
        itemImagesHtml += '</div>';
        itemImagesHtml += '<noscript><img class="grid-product__image" src="' + this.getFeaturedImage(images, '1024x') + '" alt="{itemTitle}}"></noscript>';
    } else {
        itemImagesHtml += '<img class="grid-product__image" src="' + this.getFeaturedImage(images, '1024x') + '" alt="{{itemTitle}}">';
    }
    itemHtml = itemHtml.replace(/{{itemImages}}/g, itemImagesHtml);

    // Add Vendor
    var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorHtml.replace(/{{vendor}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

    // Add Price
    var itemPriceHtml = '';
    if (onSale) {
        itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.sale_price + '</span>';
    } else {
        itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.regular_price + '</span>';
    }
    if (priceVaries) {
        itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
        itemPriceHtml += '<span class="icon-fallback-text"><span class="icon icon-plus grid-product__price-min" aria-hidden="true"></span><span class="fallback-text">+</span></span>';
    } else {
        itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
    }
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

    // Add data json
    var self = this;
    var itemJson = {
      "id": data.id,
      "title": data.title,
      "handle": data.handle,
      "vendor": data.vendor,
      "variants": data.variants,
      "url": self.buildProductItemUrl(data),
      "options_with_values": data.options_with_values,
      "images": data.images,
      "available": data.available,
      "price_min": data.price_min,
  		"price_max": data.price_max,
  		"compare_at_price_min": data.compare_at_price_min,
  		"compare_at_price_max": data.compare_at_price_max,
    };
    itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(itemJson));

    // Add main attribute
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    return itemHtml;
};

function buildImageStyle(data) {
    var images = data.images_info;
    var img_id_class = 'ProductCardImage-{{itemId}}';
    var wrapper_id = 'ProductCardImageWrapper-{{itemId}}';
    var imageStyle = '';
    if (images.length > 0) {
        var image = images[0];
        var width = bcSfFilterConfig.custom.max_height;
        var height = bcSfFilterConfig.custom.max_height;
        var small_style = true;
        var aspect_ratio = image.width / image.height;

        if (aspect_ratio <= 1) {
            var max_width = height * aspect_ratio;
            if (image.height < height) {
                var max_height = image.height;
                var max_width = image.width;
            } else {
                var max_height = height;
            }
        } else {
            var max_height = width / aspect_ratio;
            if (image.width < width) {
                var max_height = image.height;
                var max_width = image.width;
            } else {
                var max_width = width;
            }
        }

        imageStyle += '<style>';
        if (small_style) imageStyle += '@media screen and (min-width: 591px) {';
            imageStyle +=   '.' + img_id_class +' {' +
                                'max-width: ' + max_width + 'px;' +
                                'max-height: ' + max_height + 'px;' +
                            '}' +
                            '#' + wrapper_id + ' {' +
                                'max-width: ' + max_width + 'px;' +
                            '}';
        if (small_style) imageStyle += '}';

        if (small_style) {
            if (aspect_ratio <= 1) {
                max_width = 295 * aspect_ratio;
            } else {
                if (image.width < 590) {
                    max_width = image.width;
                } else {
                    max_width = 590;
                }
            }
            imageStyle +=   '@media screen and (max-width: 590px) {'
                                '.' + img_id_class + '{' +
                                    'max-width: {{ max_width }}px;' +
                                '}' +
                                '#' + wrapper_id + '{' +
                                    'max-width: {{ max_width }}px;' +
                                '}' +
                            '}';
        }
        imageStyle += '</style>';
    }
    return imageStyle;
}

/************************** END BUILD PRODUCT LIST **************************/

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.pagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Build Previous
        var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousHtml : '';
        previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage -1));
        paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

        // Build Next
        var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextHtml : '';
        nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
        paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

        // Create page items array
        var beforeCurrentPageArr = [];
        for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
            beforeCurrentPageArr.unshift(iBefore);
        }
        if (currentPage - 4 > 0) {
            beforeCurrentPageArr.unshift('...');
        }
        if (currentPage - 4 >= 0) {
            beforeCurrentPageArr.unshift(1);
        }
        beforeCurrentPageArr.push(currentPage);

        var afterCurrentPageArr = [];
        for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
            afterCurrentPageArr.push(iAfter);
        }
        if (currentPage + 3 < totalPage) {
            afterCurrentPageArr.push('...');
        }
        if (currentPage + 3 <= totalPage) {
            afterCurrentPageArr.push(totalPage);
        }

        // Build page items
        var pageItemsHtml = '';
        var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
        for (var iPage = 0; iPage < pageArr.length; iPage++) {
            if (pageArr[iPage] == '...') {
                pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
            } else {
                pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
            }
            pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
            pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
        }
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

        jQ(this.selector.pagination).html(paginationHtml);
    }
};

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {
    /* start-initialize-bc-al */
    var self = this;
    var alEnable = true;
    if(self.getSettingValue('actionlist.qvEnable') != '' || self.getSettingValue('actionlist.atcEnable') != ''){
      alEnable = self.getSettingValue('actionlist.qvEnable') || self.getSettingValue('actionlist.atcEnable');
    }
    if (alEnable === true && typeof BCActionList !== 'undefined') {
        if (typeof bcActionList === 'undefined') {
            bcActionList = new BCActionList();
        }else{
          if (typeof bcAlParams !== 'undefined' && typeof bcSfFilterParams !== 'undefined') {
              bcActionList.initFlag = false;
              bcActionList.alInit(bcSfFilterParams, bcAlParams);
          } else {
              bcActionList.alInit();
          }
        }
    }
    /* end-initialize-bc-al */
    $(document).ready(function() {
        theme.init();
        var sections = new theme.Sections();
        sections.register('collection-template', theme.Collection);
    });
};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {};


    // Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};

    BCSfFilter.prototype.prepareProductData = function(data) { var countData = data.length; for (var k = 0; k < countData; k++) { data[k]['images'] = data[k]['images_info']; if (data[k]['images'].length > 0) { data[k]['featured_image'] = data[k]['images'][0] } else { data[k]['featured_image'] = { src: bcSfFilterConfig.general.no_image_url, width: '', height: '', aspect_ratio: 0 } } data[k]['url'] = '/products/' + data[k].handle; var optionsArr = []; var countOptionsWithValues = data[k]['options_with_values'].length; for (var i = 0; i < countOptionsWithValues; i++) { optionsArr.push(data[k]['options_with_values'][i]['name']) } data[k]['options'] = optionsArr; if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) { var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim(); function updateMultiCurrencyPrice(oldPrice, newPrice) { if (typeof newPrice != 'undefined') { return newPrice; } return oldPrice; } data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]); data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]); data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]); data[k].compate_at_price_max = updateMultiCurrencyPrice(data[k].compate_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]); } data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100; data[k]['price'] = data[k]['price_min']; data[k]['compare_at_price'] = data[k]['compare_at_price_min']; data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max']; var firstVariant = data[k]['variants'][0]; if (getParam('variant') !== null && getParam('variant') != '') { var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant') }); if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0] } else { var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { if (data[k]['variants'][i].available) { firstVariant = data[k]['variants'][i]; break } } } data[k]['selected_or_first_available_variant'] = firstVariant; var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { var variantOptionArr = []; var count = 1; var variant = data[k]['variants'][i]; var variantOptions = variant['merged_options']; if (Array.isArray(variantOptions)) { var countVariantOptions = variantOptions.length; for (var j = 0; j < countVariantOptions; j++) { var temp = variantOptions[j].split(':'); data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1]; data[k]['variants'][i]['option_' + temp[0]] = temp[1]; variantOptionArr.push(temp[1]) } data[k]['variants'][i]['options'] = variantOptionArr } data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100; data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100 } data[k]['description'] = data[k]['content'] = data[k]['body_html']; } return data };