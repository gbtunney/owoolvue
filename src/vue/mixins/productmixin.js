 
    export const ProductMixin={
        created: function () {
            console.log('mixin hook called')
        },
        data() {
            return {
                isShowing: false
            }
        },
        props: {
            productid: {
                required: false,
            },
            variantid: {
                required: false,
            },
        },
        methods: {
            toggleShow() {
                this.isShowing = !this.isShowing;
            }
        }
    };
    
    

