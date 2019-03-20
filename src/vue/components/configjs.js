
export function SWATCHES(text) {
    return [
        {
            "product_id": 1919179161718,
            "swatch_image": "swatch-alumroot.png",
            "color": "#4b1b3f",
            "slug" : "alumroot"
        },
        {
            "product_id": 1919179161718,
            "swatch_image": "swatch-ash.png",
            "color": "#3e404c",
            "slug" : "ash"
        },
        {
            "product_id": 1919179161718,
            "swatch_image": "swatch-basswood.png",
            "color": "#191e2f",
            "slug" : "basswood"
        }
    ];
    
    
}

export function METAFIELDS(text) {
    return [
        {
            "tag": "llama",
            "slug": "fibertype",
            "name": "Fiber Type",
            "options": [
                {
                    "tag": "llama",
                    "icon": "llama",
                    "slug": "fibertype",
                    "color": "#4b1b3f"
                },
                {
                    "tag": "sheep",
                    "icon": "sheep",
                    "color": "#3e404c",
                    "slug": "ash"
                }
            ]
        }
    ];
}

export function FILTERS(text) {
    return [
        //
        
      
        {
            "datatype":"tag",
            "type":"multiselect",
            "operation":"OR",
            "slug": "fibertype",
            "name": "Fiber Type",
            "options": [
                {
                    "tag": "patterns",
                    "icon": "llama",
                    "slug": "product-type-patterns",
                    "color": "#4b1b3f"
                },
                {
                    "tag": "yarns",
                    "icon": "sheep",
                    "color": "#3e404c",
                    "slug": "product-type-yarns"
                },
                {
                    "tag": "pdf-download",
                    "icon": "sheep",
                    "color": "#3e404c",
                    "slug": "pdf-download"
                }
    
                
            ]
        }
    ];
}