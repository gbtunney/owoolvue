<template>
	<div ref="MYCART" class="cart-wrapper">
	<button  class="c-button c-button--dark-accent-primary" :disabled="Loading" @click="addMultipletoCart">{{label}}<div v-show="Loading">
		LOADING SPINNER</div></button>

		<div v-show="metavisible" class="productMeta" >
			<h5>Includes: </h5>
			<ul>
				<li v-for="pendingCartItem in PendingItems">
					<PendingCartItem :item="pendingCartItem"></PendingCartItem>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import store from '@/store'
    import {mapState, mapGetters, mapActions} from "vuex";

    import PendingCartItem from '@/components/shopify/product/PendingCartItem.vue'

    const PromiseQueue = require("easy-promise-queue").default;

    const schema = require("schm");
    const pq_additems = new PromiseQueue({concurrency: 1});

    export default {
        name: 'Cart',
        components: {PendingCartItem},
        props: {
            metavisible: {
                type: Boolean,
                default: false
            },
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
                _pendingItems: []
            }
        },
        created: function() {
        },
        mounted: function() {
            this.PendingItems = this.PendingItemsChanged(this.$props.addtocartvariants)
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
            PendingItems: {
                get: function() {
                    return this.$data._pendingItems;
                },
                set: function(newVal) {
                    this.$data._pendingItems = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            ItemCount: function() {
                let total = 0;

                this.$props.addtocartvariants.forEach(function(item) {

                    total += item.quantity;
                })
                return total;
            }
        },
        methods: {
            ...mapActions([
                'getCart', 'getVariant', 'addItem'
            ]),
            PendingItemsChanged: function(itemArr) {
                // store.dispatch('increment')
                var requestedItemArr = itemArr;
                if (requestedItemArr instanceof Array){
                    requestedItemArr = requestedItemArr.map(function(item) {

                        const PENDING_ITEM_SCHEMA = schema(
                            {
                                id: {type: Number, required: true},
                                variant: {type: Object},
                                requested_quantity: {type: Number, required: true, default: item.quantity},
                                quantity: {type: Number, required: true, default: item.requested_quantity}
                            }
                        );
                        return PENDING_ITEM_SCHEMA.parse(item);

                    });

                    let self = this;

                    let retrievedDataArr = [];

                    requestedItemArr.forEach(function (item){
                        let _unprocessedItemArr = requestedItemArr;

                        self.getVariant({params: {id: item.id} }).then(function(res){

                            let variantData = res.data.variant;

                            var myObj =  requestedItemArr.find(function(item){
                                if ( item.id == Number(variantData.id) )
                                    return true;
                            });
                            retrievedDataArr.push(Object.assign( myObj, {variant:  res.data.variant}  ) );
                        })
                    });
                  return retrievedDataArr;

                }else{
                    //push it?
                }
            },
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
