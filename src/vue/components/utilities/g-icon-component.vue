<template>
	<span  class="">
		<slot name="icon">
			<div :class="Styles" :style="addl_styles" class="c-icon-base" v-if="icon_id" v-html='IconHTML'></div>
		</slot>
				<button v-if="showpicker" v-for="my_props in Props" @click="AddlProps = my_props ">{{my_props}}</button>

	</span>

</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'

//<button v-if="showpicker" v-for="prop in Props" @click="AddlProps = prop ">{{props}}</butto
	const values  =  [
        ".--reflectX",
        ".--reflectY",
        ".--scheme-hover",
        ".g-font--base",
        ".g-font--lg",
        ".g-font--md",
        ".g-font--sm",
        ".g-font--xl",
        ".g-font--xs",
        ".g-font--xxl",
        ".g-font--xxs",
        ".g-font--xxxl",
        ".g-margin--lg",
        ".g-margin--md",
        ".g-margin--sm",
        ".g-margin--xl",
        ".g-margin--xs",
        ".g-margin--xxs",
        ".g-padding--lg",
        ".g-padding--md",
        ".g-padding--sm",
        ".g-padding--xl",
        ".g-padding--xs",
        ".g-padding--xxs",
        ".g-scheme--accent-default",
        ".g-scheme--accent-primary",
        ".g-scheme--accent-secondary",
        ".g-scheme--alt-light",
        ".g-scheme--dark",
        ".g-scheme--dark-accent-default",
        ".g-scheme--dark-accent-primary",
        ".g-scheme--dark-accent-secondary",
        ".g-scheme--functional",
        ".g-scheme--invert-functional",
        ".g-scheme--light",
        ".g-scheme--light-alt",
        ".g-size-abs--base",
        ".g-size-abs--lg",
        ".g-size-abs--md",
        ".g-size-abs--sm",
        ".g-size-abs--xl",
        ".g-size-abs--xs",
        ".g-size-abs--xxl",
        ".g-size-abs--xxs",
        ".g-size-abs--xxxl",
        ".g-size-rel--base",
        ".g-size-rel--lg",
        ".g-size-rel--md",
        ".g-size-rel--sm",
        ".g-size-rel--xl",
        ".g-type--default",
        ".g-type--font-reset",
        ".g-type--font-san-serif",
        ".g-type--font-serif",
        ".g-type--font-serif-bold",
        ".g-type--font-serif-italic",
        ".g-type--font-small-caps",
        ".g-type--font-test",
        ".u-color-swatches--acadia",
        ".u-color-swatches--black",
        ".u-color-swatches--brown-bramble",
        ".u-color-swatches--copper",
        ".u-color-swatches--crowshead",
        ".u-color-swatches--dark-gray",
        ".u-color-swatches--fuscous-gray",
        ".u-color-swatches--gum-leaf",
        ".u-color-swatches--highball",
        ".u-color-swatches--jacko-bean",
        ".u-color-swatches--khaki",
        ".u-color-swatches--kilamanjaro",
        ".u-color-swatches--kournikova",
        ".u-color-swatches--light-gray",
        ".u-color-swatches--lightning-yellow",
        ".u-color-swatches--madras",
        ".u-color-swatches--onion",
        ".u-color-swatches--oslo-gray",
        ".u-color-swatches--saffron",
        ".u-color-swatches--sandstone",
        ".u-color-swatches--schooner",
        ".u-color-swatches--silver-chalice",
        ".u-color-swatches--silverleaf",
        ".u-color-swatches--slugger",
        ".u-color-swatches--spice",
        ".u-color-swatches--tana",
        ".u-color-swatches--west-coast",
        ".u-color-swatches--white",
        ".u-color-swatches--woodrush"
    ]
	module.exports = {
		name: '',
		mixins: [],
		components: {},
		data: function() {
			return {
			    _addlProps:[],
				_scheme: false,
				_flags:[],
                _schemes: [  "accent-default",
                    "accent-primary",
                    "accent-secondary",
                    "alt-light",
                    "dark",
                    "dark-accent-default",
                    "dark-accent-primary",
                    "dark-accent-secondary",
                    "functional",
                    "invert-functional",
                    "light",
                    "light-alt"]

            }
		},
		props: {
            exampleprop: {
                type: String,
                default: 'not set',
                required: false
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            icon_id: {
                default: false,
            },
            flags: {
                type: [Array, Boolean],
                default: false
            },
            margin: {
                default: false
            },
            padding: {
                default: false
            },
            scheme: {
                default: false,
            },
            font: {
                default: 'serif'
            },
            fontsize: {
                default: 'base'
            },
            iconsize: {
                default: 'base'
            },
            showpicker: {
                default: true
            },
			addl_styles:{
				default: false
			}
		},


		computed: {
			...mapGetters([
				'Variants'
			]),
			Props:function(){


			},
			IconHTML:function(){

               return this.getIconSVG(this.$props.icon_id)
			},
            Padding: function() {
			    if ( this.$props.padding){
			        return `g-padding--${this.$props.padding}`
			    }
            },
            Margin: function() {
                if ( this.$props.margin){
                    return `g-margin--${this.$props.margin}`
                }
            },
            FontSize: function() {
                if ( this.$props.fontsize){
                    return `g-font--${this.$props.fontsize}`
                }
            },
            Font: function() {
                if ( this.$props.fontsize){
                    return `g-type--font-${this.$props.font}`
                }
            },
            IconSize: function() {

                if ( this.$props.iconsize){
                    return `g-size-${this.$props.iconsize}`
                }
            },
            Scheme: {
                get: function() {
                    if (!this.$data._scheme && !this.$props.scheme ) return "";

                    if (!this.$data._scheme ){

                        return `g-scheme--${this.$props.scheme}`
                    } else {
                        return `g-scheme--${this.$data._scheme}`
                    }
                },
                set: function(newVal) {
                    //=newVal;
                    this.$data._scheme = newVal;
                }
            },
            AddlProps: {
                get: function() {
                   return  this.$data._addlProps;
	               // return ['icon', 'testing']
                },
                set: function(newVal) {
                    //=newVal;

                   this.$data._addlProps.push( newVal.substr(1));
                }
            },
			Flags:function(){

			    var disabledClass = "--enabled";

			    if ( this.$props.disabled){
                    disabledClass="--disabled";
			    }
			    if ( this.$props.flags){
			        return [...this.$data._flags,...this.$props.flags,disabledClass];
			    }else{
                    return  this.$data._flags;

                }
			},
            Styles:function(){
			   return [this.IconSize,this.Scheme,this.FontSize,this.Font,this.Margin,this.Padding,...this.Flags] ;
			},
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
		},
		methods: {
            getIconSVG:function( icon_id ){
                var element = document.getElementById(icon_id);
                return element.innerHTML;
            }
		}
	}
</script>

<style lang="scss" type="text/scss">
	@import "src/vue/helpers/product-dependancies.scss";

	.button {
		display: flex;
		align-items: center;
		@include u-transition(background-color, 0.3s, ease);
	}


	.testing{
		background: red;
	}


	.c-icon-base{
		border-width: 1px;
		border-style: solid;

		&.--no-border{
			border-width: 0px;
		}

	}

	.--no-border{

	}
	.--no-background{
		background-color: none;
	}
	.--icon-right{
		.icon-right{
			display: block;
			visibility: visible;

		}
	}
	.--icon-left{
		.icon-left{
			display: block;
			visibility: visible;

		}
	}

	.--no-icon{
		.icon-left,.icon-right{
			display: none;
//			visibility: visible;

		}
	}

	.--disabled{
	opacity:.6;
	}


</style>