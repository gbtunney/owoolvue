<template>
	<p>{{ greeting }} World!</p>
</template>

<script>
    
    import ProductImages from '@/components/shopify/product/ProductImages.vue'
    
    module.exports = {
        data: function() {
            return {
                greeting: 'Hello'
            }
        },
        components: {},
        props: {
            productid: {
                type: String,
                default: 'not set',
                required: true
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