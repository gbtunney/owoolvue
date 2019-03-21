
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

export function BULLETS(text) {
    return [
        {
            "name": "Yarn Weight",
            "options": [
                {
                    "icon": false,
                    "slug": "yarn-weight-worsted",
                    "name": "worsted",
                },
                {
                    "icon": false,
                    "message": "FINGERING WEIGHT",
                    "slug": "yarn-weight-fingering",
                    "name": "Fingering",
                }
                ,
                {
                    "icon": false,
                    "message": "BULKY WEIGHT",
                    "slug": "yarn-weight-bulky",
                    "name": "Bulky",
                }
            ]
        },
        {
            "name": "Yarn Fiber",
            "options": [
                {
                    "icon": "llama",
                    "slug": "yarn-fiber-alpaca",
                    "name": "Alpaca",
                },
                {
                    "icon": "sheep",
                    "slug": "yarn-fiber-merino",
                    "name": "Merino",
                }
            ]
        }
    ];
}



export function FILTERS(text) {
   return [
        {
            taggroup: 'File Type',
            operation:'OR',
            options: [
                { name: 'Download',tag: "pdf-download", category: 'Front-end' },
                { name: 'Patterns',tag: "product-type-patterns", category: 'Front-end' },
                { name: 'Yarns',tag: "product-type-yarns", category: 'Front-end' }
            ]
        },
       {
           taggroup: 'Product Vendor',
           operation:'OR',
    
           options: [
               { name: 'O-Wool',tag: "product-vendor-o-wool", category: 'Front-end' },
               { name: 'OtherVendor',tag: "product-vendor-othervendor", category: 'Front-end' },
           ]
       },
        {
            taggroup: 'Yarn Weight',
            operation:'OR',
    
            options: [
                { name: 'Worsted', category: 'Backend' },
                { name: 'Fingerling', category: 'Backend' },
                { name: 'Bulky', category: 'Backend' }
            ]
        },
       
       {
           taggroup: 'Fiber Type',
           operation:'OR',
        
           options: [
               { name: 'Alpaca', category: 'Backend' },
               { name: 'Merino', category: 'Backend' },
               { name: 'Bulky', category: 'Backend' }
           ]
       },
        {
            taggroup: 'Other',
            operation:'OR',
    
            options: [
                { name: 'Laravel', category: 'Backend' },
                { name: 'Phoenix', category: 'Backend' }
            ]
        }
    ]
   /* return [
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
                    "category": 'Backend',
                    "slug": "product-type-patterns",
                    "color": "#4b1b3f"
                },
                {
                    "category": 'fiber-type',
    
                    "tag": "yarns",
                    "icon": "sheep",
                    "color": "#3e404c",
                    "slug": "product-type-yarns"
                },
                {
                    "category": 'fiber-type',
    
                    "tag": "pdf-download",
                    "icon": "sheep",
                    "color": "#3e404c",
                    "slug": "pdf-download"
                }
    
                
            ]
        }
    ];*/
}