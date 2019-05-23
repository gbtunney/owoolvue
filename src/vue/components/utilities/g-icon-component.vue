<template>
	<span  class="g-type--xxl">
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
	const values  = [
		".example-button",
		".example-button--accent-default",
		".example-button--accent-primary",
		".example-button--accent-secondary",
		".example-button--alt-light",
		".example-button--dark",
		".example-button--dark-accent-default",
		".example-button--dark-accent-primary",
		".example-button--dark-accent-secondary",
		".example-button--functional",
		".example-button--invert-functional",
		".example-button--light",
		".example-button--light-alt",
		".g-icon-absolute--base",
		".g-icon-absolute--lg",
		".g-icon-absolute--md",
		".g-icon-absolute--sm",
		".g-icon-absolute--xl",
		".g-icon-absolute--xs",
		".g-icon-absolute--xxl",
		".g-icon-absolute--xxs",
		".g-icon-absolute--xxxl",
		".g-icon-relative--base",
		".g-icon-relative--lg",
		".g-icon-relative--md",
		".g-icon-relative--sm",
		".g-icon-relative--xl",
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
		".g-type--base",
		".g-type--default",
		".g-type--font-reset",
		".g-type--font-san-serif",
		".g-type--font-serif",
		".g-type--font-serif-bold",
		".g-type--font-serif-italic",
		".g-type--font-small-caps",
		".g-type--font-test",
		".g-type--lg",
		".g-type--md",
		".g-type--sm",
		".g-type--xl",
		".g-type--xs",
		".g-type--xxl",
		".g-type--xxs",
		".g-type--xxxl",
		".u-color-schemes--accent-default",
		".u-color-schemes--accent-primary",
		".u-color-schemes--accent-secondary",
		".u-color-schemes--alt-light",
		".u-color-schemes--dark",
		".u-color-schemes--dark-accent-default",
		".u-color-schemes--dark-accent-primary",
		".u-color-schemes--dark-accent-secondary",
		".u-color-schemes--functional",
		".u-color-schemes--invert-functional",
		".u-color-schemes--light",
		".u-color-schemes--light-alt"
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
                default: 'dark',
            },
            font: {
                default: 'serif'
            },
            fontsize: {
                default: 'base'
            },
            iconsize: {
                default: 'false'
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
                    return `g-icon-relative--${this.$props.iconsize}`
                }
            },
            Scheme: {
                get: function() {
                    if (!this.$data._scheme){
                        return `u-color-schemes--${this.$props.scheme}`
                    } else {
                        return `u-color-schemes--${this.$data._scheme}`
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