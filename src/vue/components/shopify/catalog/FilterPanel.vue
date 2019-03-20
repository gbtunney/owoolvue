<template>
	<p>{{ greeting }} World!</p>
</template>

<script>
    
    import ProductImages from '@/components/shopify/product/ProductImages.vue'
    
    module.exports = {
        data: function() {
            return {
                prefix: false,
	            label: false,
	            options:[
	                slug: 'product-type-'

	            ]
                greeting: 'Hello'
            }
        },
        components: {},
        props: {
            exampleprop: {
                type: String,
                default: 'not set',
                required: false
            },
        },
        computed: {
            example: {
                get: function() {
                    return;
                },
                set: function(newVal) {
                    //=newVal;
                }
            },
            example2: function() {
                
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
	p {
		font-size: 2em;
		text-align: center;
	}
</style>