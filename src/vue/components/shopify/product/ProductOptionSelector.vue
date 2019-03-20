<template>
    <div >
        <ul class="--debug temp-meta">
            <li>SELECTED VARIANT {{selectedVariant.title}} </li>
            <li>VARIANT ID: {{selectedVariant.id}}</li>
            <li>INVENTORY AVAILABLE {{selectedVariant.inventory_quantity}</li>
        </ul>
        <div class="attribute-panel" v-for="option,index in Options">
        <h3 class="option__name"> {{option.name}}</h3>
            <slot name="search-icon"></slot>

            <multiselect :options="option.values" class="--is-open"

                         v-model="selectedOptions[index]"
                         @input="_getVariantFromOptions()"
                         :class="GetMultiselectClass(option)"
                         :optionid="option.id"
                         v-on:close=""
                         v-on:open="selectOpen(option)"

                         :key="index"
                         :taggable="false"
                         label="title"
                         ref="gillian"
                         :multiple="false"
                         track-by="title"
                         :closeOnSelect="false"
                         :searchable="_getSearchable(option)"
                         :allow-empty="false">

                <template slot="singleLabel"  slot-scope="props">
                    <div class="optionbutton" >{{ props.option.title }}</div>
                </template>
                <template slot="selection" slot-scope="{ values, searchable,search, isOpen }"><div v-if="option.name == 'Color'">
                    <div class="c-input-group__icon c-icon c-icon--light-alt --no-border">
                        <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-search" viewBox="0 0 32 32"><path fill="#444" d="M21.839 18.771a10.012 10.012 0 0 0 1.57-5.39c0-5.548-4.493-10.048-10.034-10.048-5.548 0-10.041 4.499-10.041 10.048s4.493 10.048 10.034 10.048c2.012 0 3.886-.594 5.456-1.61l.455-.317 7.165 7.165 2.223-2.263-7.158-7.165.33-.468zM18.995 7.767c1.498 1.498 2.322 3.49 2.322 5.608s-.825 4.11-2.322 5.608c-1.498 1.498-3.49 2.322-5.608 2.322s-4.11-.825-5.608-2.322c-1.498-1.498-2.322-3.49-2.322-5.608s.825-4.11 2.322-5.608c1.498-1.498 3.49-2.322 5.608-2.322s4.11.825 5.608 2.322z"/></svg>
                    </div></div>
                    <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>

                <template slot="option" class="is-grid-2" slot-scope="props">
                    <div class="option__swatch"  v-bind:style="{ backgroundColor: props.option.color}"  style=""><img v-if="option.name == 'Color' && props.option.swatch_image != 'false'" class="option__image" :src="props.option.swatch_image">
                    </div>
                    <div class="option__desc"><span class="option__title">{{_getIsDisabled(props.option)}} {{ props.option.title }}</span></div>
                </template>
            </multiselect>
        </div>



        <multiselect :options="Variants"
                     v-model="selectedVariant"
                     @input="variantSelectorChanged"
                     track-by="title"
                     label="title"
                     ref="multiselectmaster"
                     :taggable="false"
                     :multiple="true"
                     :closeOnSelect="false"
                     placeholder="Select one"
                     :searchable="searchable"
                     :allow-empty="false">

            <template slot="singleLabel" slot-scope="{ option }">
                <strong>{{ option.id }}</strong> ID:<strong>  {{ option.title }}</strong>
            </template>

        </multiselect>

        <pre class="--debug language-json"><code>{{ selectedVariant  }}</code></pre>


    </div>
</template>

<script type="text/javascript">

    import Vue from 'vue';
    import Multiselect from 'vue-multiselect'
    import {mapGetters} from 'vuex'
    import store from '@/store'

    export default {
        name: 'HelloWorld',
        components: {
            Multiselect
        }, props: {
            searchable: {
                type: Boolean,
                default: false
            },
        },
        mounted: function() {
            this.$refs.gillian.forEach(function(optionselect) {
                optionselect.isOpen = true;
            });
        },
        watch: {
            selectedVariant: function(val) {
                this.$emit("variant", this.$data.selectedVariant);
                if (val != this.$data.selectedVariant){
                    // this.$data.selectedVariant=val;
                }
            },
            CurrentVariant: function(val) {
                this.$data.selectedVariant = val;
                //this is the first time thru only.
                this._setSelectedOptions();
            }
        },
        computed: {

            SelectedVariant: {
                get: function() {
                    return this.$data.selectedVariant;
                },
                set: function(newVal) {
                    this.$data.selectedVariant = newVal;  ///this.Variants[this.CurrentVariant._index];
                }
            },
            SelectedOptions: function() {
                return this.$data.selectedOptions;
            },
            ...mapGetters([
                'VariantDictionary',
                'Variants',
                'Options',
                'OptionsDictionary',
                'CurrentVariant'
                // ...
            ])
        },
        methods: {
            GetMultiselectClass: function(option) {
                return `attribute-${option.slug}`;
            },
            selectOpen: function(option) {
                if (option.isOpen){
                    Vue.set(option, 'isOpen', !option.isOpen);

                } else {
                    Vue.set(option, 'isOpen', !true);

                }
            },
            selectClosed: function(option) {
                //Vue.set(option, 'isOpen', false);
            },
            _getSearchable: function(option) {
                return ( option.slug == "color") ? true : false;
            },
            _getIsDisabled: function(option) {
                var inverseMap = new Map(this.OptionsDictionary)  //.delete(option.id);
                inverseMap.delete(option.parent_id);

                let newFilteredArray = this.Variants;
                let optionSelf = option;

                newFilteredArray = newFilteredArray.filter(function(variant) {

                    var foundArray = [];

                    var optionID = optionSelf.parent_id;
                    var optionValueID = optionSelf.id;

                    if (optionValueID == variant.options.get(optionID).id){
                        return true;
                    }
                })

                let self = this;
                inverseMap.forEach(function(value, key, map) {
                    let currentSelectedOption = self.$data.selectedOptions[value._index];
                    if (currentSelectedOption){
                        newFilteredArray = newFilteredArray.filter(function(variant) {

                            var foundArray = [];

                            var optionID = currentSelectedOption.parent_id;
                            var optionValueID = currentSelectedOption.id;

                            if (optionValueID == variant.options.get(optionID).id){
                                return true;
                            }
                        })
                    }
                });

                if (newFilteredArray.length < 1){
                    Vue.set(option, '$isDisabled', true);
                } else {
                    Vue.set(option, '$isDisabled', false);
                }
                return;

            },
            clickMe: function() {
            },
            customLabel({title, desc}) {
                return `${title} – ${desc}`
            },
            _getVariantFromOptions: function() {
                let self = this;
                let mySelectedOptions = this.$data.selectedOptions;
                let newFilteredArray = this.Variants;

                for (let i = 0; i < mySelectedOptions.length; i++) {

                    newFilteredArray = newFilteredArray.filter(function(variant) {

                        var foundArray = [];

                        var optionID = mySelectedOptions[i].parent_id;
                        var optionValueID = mySelectedOptions[i].id;

                        if (optionValueID == variant.options.get(optionID).id){
                            return true;
                        }
                    })
                }
                var arrayAfterFilter = newFilteredArray;
                if (arrayAfterFilter.length == 1){
                    console.log(" VARIANT THAT MEET CRITERIA FOUND ", this.$data.selectedOptions)
                    if (arrayAfterFilter[0] != this.SelectedVariant){
                        this.SelectedVariant = arrayAfterFilter[0];
                    }
                } else if (arrayAfterFilter.length >= 1){
                    console.log(` ${arrayAfterFilter.length}MASTER VARIANT THAT MATCHES `, this.$data.selectedOptions)
                } else {
                    console.log("NO MASTER VARIANT THAT MATCHES ", this.$data.selectedOptions)
                    this._setSelectedOptions();
                }
            },
            _setSelectedOptions: function() {
                var selectedArr = new Array()
                if (this.$data.selectedVariant){
                    this.$data.selectedOptions = [];
                    for (var i = 0; i < this.Options.length; i++) {
                        this.$data.selectedOptions.push(this.$data.selectedVariant.options.get(this.Options[i].id));
                    }
                }
            },
            variantSelectorChanged: function() {
                console.log("VUEX ::VARIANT CHANGED!!! ", this.$data.selectedVariant);
                this._setSelectedOptions();
            }
        },
        filters: {
            toString: function(value) {
                if (!value) return ''
                value = value.toString()
                return value;
            }
        },
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                totalOptions: 3,
                selectedOptions: [],
                selectedVariant: [],
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>

    @mixin aspect-ratio($width, $height) {
        position: relative;
        &:before {
            display: block;
            content: "";
            width: 100%;
            padding-top: ($height / $width) * 100%;
        }
        > .content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }

    .multiselect__tags {
    }

    /*SVG ICON SYSTEM*/
    .icon {
        display: inline-flex;
        align-self: center;
    }

    .icon svg, .icon img {
        height: 1em;
        width: 1em;
        fill: currentColor;
    }

    .icon.baseline svg, .icon img {
        top: .125em;
        position: relative;
    }

    .demo-button {
        $demo-obj: (
            color: (
                scheme: dark,
                props: (
                    background: true,
                    foreground: true,
                    accent:false,
                    border:true,
                    fill:foreground
                )
            ),
            font:(
                font-key: font-san-serif,
                scale-key:type,
                value: xxl
            ),
            spacing:(
                (css-prop: padding,
                    scale-key: button,
                    value: (
                        top: xl,
                        bottom: xl,
                        left: xl,
                        right: xl
                    ),
                ), (
                    css-prop: margin,
                    scale-key: button,
                    value: lg
                ),
            )
        );
    }

    /*-----------------*/
    /*-----------------*/
    /*-----------------*/
    /*PROTOTYPE EXAMPLE*/

    /*Red Lining*/
    h1:after, h2:after, h3:after, h4:after, h5:after, h6:after {
        width: 100%;
        height: 1px;
        content: "";
        position: absolute;
        bottom: .145833em;
        left: 0;
        background-color: rgba(255, 0, 0, 0.23);
        z-index: -100;
    }

    h1:before, h2:before, h3:before, h4:before, h5:before, h6:before {
        width: 100%;
        height: 1px;
        content: "";
        position: absolute;
        top: .27em;
        left: 0;
        background-color: rgba(255, 0, 0, 0.23);
        z-index: -100;
    }

    .newbutton {

        & > * {
            // background: green;
        }
    }

    .__icon-wrap {
    }

    .__icon {
    }

    .testgrid {
        display: grid;
        grid-template-columns: 1fr 3fr;
    }

    .wrapper-with-intrinsic-ratio {
        position: relative;
        padding-bottom: 20%;
        height: 0;
    }

    .element-to-stretch {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: teal;
    }

    .testicon {
    }

    .--debug {
        display: none;
    }

    .multiselect__content-wrapper {
        display: block;
        position: relative;
        height: 100%;
        max-height: 220.438px;
    }

    .optionbutton {
        border: 0px solid red;
    }

    .attribute-panel {
        background: #eeeeee;
        padding: 30px;
        margin-bottom: 20px;
    }

    .option__swatch {
        border: 1px solid black;
        height: 50px;
        width: 50px;
    }

    code {

    }

    //real
    .multiselect__tag {
    }
</style>