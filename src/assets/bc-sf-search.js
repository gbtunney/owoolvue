// Override Settings
var bcSfSearchSettings = {
    search: {
        //suggestionMode: 'test',
        //suggestionWidth: 300,
        suggestionPosition: 'left',
        suggestionStyle2MainContainerSelector: 'body' // for style2
    }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
    if (jQ('.mfp-wrap').length > 0) {
        jQ(suggestionElement).parent().css({
            'position': 'fixed',
        });
        jQ(suggestionElement).css({
            'overflow-y': 'scroll',
            'height': '300px'
        });
    }
};
