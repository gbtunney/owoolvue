<template>
	<div ref="MYCART" class="cart-wrapper">
	<button  class="c-button c-button--dark-accent-primary" :disabled="Loading" @click="addMultipletoCart">{{label}}<div v-show="Loading">
		LOADING SPINNER</div></button>
		meta:
		item count: {{ItemCount}}</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {mapState, mapGetters, mapActions} from "vuex";

    const PromiseQueue = require("easy-promise-queue").default;

    const schema = require("schm");
    const pq_additems = new PromiseQueue({concurrency: 1});

    export default {
        name: 'Cart',
        components: {}, props: {
            addtocartvariants: {
                type: Array,
                default: []
            },
            label: {
                type: String,
                default: "nottt setAdd to Cart"
            },
        },

        data() {
            return {
                _loading: false,
                _selectedVariants: []
            }
        },
        created: function() {
            store.subscribe((mutation, state) => {
                console.log(mutation.type)
                console.log(mutation.payload)
            })

            this.getCart();
        },
        mounted: function() {
        }, computed: {
            ...mapGetters([
                'Cart'
                // ...
            ]),
            Loading: {
                get: function() {
                    return this.$data._loading;
                },
                set: function(newVal) {
                    this.$data._loading = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            ItemCount: function() {
                console.log("SUM, ", this.$props.addtocartvariants);

                let total = 0;

                this.$props.addtocartvariants.forEach(function(item) {

                    total += item.quantity;
                })
                return total;
            }
        },
        methods: {
            ...mapActions([
                'getCart', 'addItem'
            ]),
            addMultipletoCart: function(_data, _promiseArr) {
                let self = this;
                let pq = new PromiseQueue({concurrency: 1});
                this.Loading = true;

                ///TODO THIS IS SOME DUMB BULLSHITTTTTT
                var dataObjArray = this.$props.addtocartvariants.map(function(item) {

                    const ITEM_SCHEMA = schema(
                        {
                            id: {type: Number, required: true},
                            quantity: {type: Number, default: 1}
                        });

                    const data = ITEM_SCHEMA.parse(item);
                    const params = {}
                    return {params, data};
                });
                pq.add([() => {
                    return new Promise(function(resolve, reject) {
                        setTimeout(function() {
                            console.log('task 1');
                            resolve();
                        }, 1000)
                    });
                }, ...dataObjArray.map(function(item) {
                    return () => {
                        return self.addItem(item);
                    }
                }), () => {
                    return new Promise(function(resolve, reject) {
                        setTimeout(function() {
                            console.log('QUEUE COMPLETE', pq, self);
                            self.Loading = false;
                            resolve();
                        }, 5)
                    });
                }]);
            },
        }
    }

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss">
</style>
