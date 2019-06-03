<template>
	<div>
		<button :disabled="$props.disabled" @click="$emit('click')" :style="addl_styles" :class="Styles">
			<slot name="content">
				<span v-if="text">{{text}}</span>
			</slot>
		</button>

		<button v-if="showpicker" v-for="myscheme in $data._schemes" @click="Scheme = myscheme ">{{myscheme}}</button>
		<button v-if="showpicker" v-for="prop in Props" @click="AddlProps = prop ">{{props}}</button>
	</div>

</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'


	const values  = [
        ".font--base",
        ".font--lg",
        ".font--md",
        ".font--sm",
        ".font--xl",
        ".font--xs",
        ".font--xxl",
        ".font--xxs",
        ".font--xxxl",
        "g",
        ".icon--base",
        ".icon--lg",
        ".icon--md",
        ".icon--sm",
        ".icon--xl",
        ".margin--lg",
        ".margin--md",
        ".margin--sm",
        ".margin--xl",
        ".margin--xs",
        ".margin--xxs",
        ".padding--lg",
        ".padding--md",
        ".padding--sm",
        ".padding--xl",
        ".padding--xs",
        ".padding--xxs",
        "path",
        "rect",
        ".scheme--accent-default",
        ".scheme--accent-primary",
        ".scheme--accent-secondary",
        ".scheme--alt-light",
        ".scheme--dark",
        ".scheme--dark-accent-default",
        ".scheme--dark-accent-primary",
        ".scheme--dark-accent-secondary",
        ".scheme--functional",
        ".scheme--invert-functional",
        ".scheme--light",
        ".scheme--light-alt",
        ".type--default",
        ".type--font-san-serif",
        ".type--font-serif",
        ".type--font-serif-bold",
        ".type--font-serif-italic",
        ".type--font-small-caps",
        ".type--font-test"
	]
	module.exports = {
		name: '',
		mixins: [],
		components: {},
		data: function() {
			return {
			    _addlProps:[],
				_scheme: false,
				_flags:['button','--border'],
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
            text: {
                type: String,

                default: false
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
                default: 'base'
            },
            addl_styles:{
                default: false
            },
            showpicker: {
                default: true
            }
		},


		computed: {
			...mapGetters([
				'Variants'
			]),
			Props:function(){

			    return [
                    ".font--base",
                    ".font--lg",
                    ".font--md",
                    ".font--sm",
                    ".font--xl",
                    ".font--xs",
                    ".font--xxl",
                    ".font--xxs",
                    ".font--xxxl",
                    "g",
                    ".icon--base",
                    ".icon--lg",
                    ".icon--md",
                    ".icon--sm",
                    ".icon--xl",
                    ".margin--lg",
                    ".margin--md",
                    ".margin--sm",
                    ".margin--xl",
                    ".margin--xs",
                    ".margin--xxs",
                    ".padding--lg",
                    ".padding--md",
                    ".padding--sm",
                    ".padding--xl",
                    ".padding--xs",
                    ".padding--xxs",
                    "path",
                    "rect",
                    ".scheme--accent-default",
                    ".scheme--accent-primary",
                    ".scheme--accent-secondary",
                    ".scheme--alt-light",
                    ".scheme--dark",
                    ".scheme--dark-accent-default",
                    ".scheme--dark-accent-primary",
                    ".scheme--dark-accent-secondary",
                    ".scheme--functional",
                    ".scheme--invert-functional",
                    ".scheme--light",
                    ".scheme--light-alt",
                    ".type--default",
                    ".type--font-san-serif",
                    ".type--font-serif",
                    ".type--font-serif-bold",
                    ".type--font-serif-italic",
                    ".type--font-small-caps",
                    ".type--font-test"
                ];
			},
            Padding: function() {
			    if ( this.$props.padding){
			        return `padding--${this.$props.padding}`
			    }
            },
            Margin: function() {
                if ( this.$props.margin){
                    return `margin--${this.$props.margin}`
                }
            },
            FontSize: function() {
                if ( this.$props.fontsize){
                    return `font--${this.$props.fontsize}`
                }
            },
            Font: function() {
                if ( this.$props.fontsize){
                    return `type--font-${this.$props.font}`
                }
            },
            IconSize: function() {
                if ( this.$props.iconsize){
                    return `icon--${this.$props.iconsize}`
                }
            },
            Scheme: {
                get: function() {
                    if (!this.$data._scheme){
                        return `scheme--${this.$props.scheme}`
                    } else {
                        return `scheme--${this.$data._scheme}`
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
                },
                set: function(newVal) {
                    //=newVal;
                    this.$data._addlProps = newVal;
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
			   return [this.Scheme,this.FontSize,this.Font,this.Margin,this.Padding,...this.Flags] ;
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
		}
	}
</script>

<style lang="scss" type="text/scss" >
	@import "src/vue/helpers/product-dependancies.scss";

	.button {
		display: flex;
		align-items: center;
		@include u-transition(background-color, 0.3s, ease);
	}

	.icon{
		@include u-icon-svg(false,1em);

		&.icon-right,&.icon-left{
			//width:0;
			visibility: hidden;
		}

	}


	.--border{
		border-width: 1px;
		border-style: solid;
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