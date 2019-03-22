<template>
	<div ref="MYCART" class="cart-wrapper">
	<button  class="c-button c-button--dark-accent-primary"  :disabled="isDisabled" @click="addMultipletoCart">{{label}}
		<div v-show="Loading" class="aspinner">LOADING SPINNER</div>
	</button>

		<span v-show="disableunavailable && isDisabled">Product Unavailble </span>
		<div v-show="metavisible" class="productMeta" >
			<h5>Includes: </h5>
			<ul>
				<li v-for="pendingCartItem in PendingItems">
					<PendingCartItem @unavailable="updateAvailability" :item="pendingCartItem"></PendingCartItem>
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

    //disable if unavailable
    // (true) means if requested quantity ANY KIT item is unavailable
    //- (false) requested quantity will be replaced with max available
    // will ALWAYS BE DISABLED IF SOMETHINGS available quantity is 0

    export default {
        name: 'Cart',
        components: {PendingCartItem},
        props: {
            metavisible: {
                type: Boolean,
                default: true
            },
            addtocartvariants: {
                type: Array,
                default: []
            },
            label: {
                type: String,
                default: "nottt setAdd to Cart"
            },
            disableunavailable: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                _loading: false,
                _pendingItems: [],
                _isDisabled: false,
            }
        },
        created: function() {
        },
        mounted: function() {
            this.PendingItems = this.PendingItemsChanged(this.$props.addtocartvariants)

            // this.isDisabled=true;
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
            isDisabled: {
                get: function() {
                    return this.$data._isDisabled;
                },
                set: function(newVal) {
                    this.$data._isDisabled = newVal;  ///this.Variants[this.CurrentVariant._index];
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
            updateAvailability: function(id) {

                //todo: make some way of doing alternate number here.
                let _id = Number(id);

                console.log("TRYING TO REMOVE@!~!");
                let self = this;
                if (this.$props.disableunavailable){
                    this.isDisabled = true;

                }

                /*    var filteredArr = this.PendingItems.filter(function(item) {
						if (Number(item.id) == _id){
							return false;
						} else {
							return true;
						}
					});

					this.PendingItems = filteredArr;*/
            },
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

                    requestedItemArr.forEach(function(item) {
                        let _unprocessedItemArr = requestedItemArr;

                        self.getVariant({params: {id: item.id}}).then(function(res) {

                            let variantData = res.data.variant;

                            var myObj = requestedItemArr.find(function(item) {
                                if (item.id == Number(variantData.id))
                                    return true;
                            });
                            retrievedDataArr.push(Object.assign(myObj, {variant: res.data.variant}));
                        })
                    });
                    return retrievedDataArr;
                } else {
                    //push it?
                }
            },
            addMultipletoCart: function(_data, _promiseArr) {
                let self = this;
                let pq = new PromiseQueue({concurrency: 1});

                this.Loading = this.isDisabled = true;

                ///TODO THIS IS SOME DUMB BULLSHITTTTTT
                var dataObjArray = this.PendingItems.map(function(item) {

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
                            self.Loading = self.isDisabled = false;
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
