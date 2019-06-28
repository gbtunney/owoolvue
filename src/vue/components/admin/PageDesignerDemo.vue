<template>
	<div>
		<div :style="styleObj" :class="['testing', classOptions]" class="g-Button">Im a container <h2>HUHUHUh</h2><p>{{ greeting }} World!</p>
		</div>
		{{classOptions}}
		<input type="checkbox" v-model="classOptions.resetheadings">
		<vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
<code>{{model}}</code>
	</div>

</template>

<script>
	
	import Vue from 'vue';
    import {mapGetters,mapActions,mapState, mapMutations} from 'vuex';
	import store from '@/store'
	import VueFormGenerator from "vue-form-generator";

	const selectvalues={
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
	module.exports = {
		name: '',
		mixins: [],
		components: {},
		data: function() {
			return {
				model: {
					id: 1,
					name: 'John Doe',
					password: 'J0hnD03!x4',
					skills: ['Javascript', 'VueJS'],

					email: 'john.doe@gmail.com',
					status: true
				},
				schema: {
					fields: [
						{
							type: 'select',
							label: 'Scheme',
							model: 'schemes',
							values: selectvalues._schemes
						},
						{
							type: 'input',
							inputType: 'text',
							label: 'ID (disabled text field)',
							model: 'id',
							readonly: true,
							disabled: true
						},
						{
							type: 'input',
							inputType: 'text',
							label: 'Name',
							model: 'name',
							placeholder: 'Your name',
							featured: true,
							required: true
						},
						{
							type: 'input',
							inputType: 'password',
							label: 'Password',
							model: 'password',
							min: 6,
							required: true,
							hint: 'Minimum 6 characters',
							validator: VueFormGenerator.validators.string
						},

						{
							type: 'input',
							inputType: 'email',
							label: 'E-mail',
							model: 'email',
							placeholder: 'User\'s e-mail address'
						},
						{
							type: 'checkbox',
							label: 'Status',
							model: 'status',
							default: true
						}
					]
				},
				formOptions: {
					validateAfterLoad: true,
					validateAfterChanged: true,
					validateAsync: true
				}
			,
				classOptions:{
					resetheadings: true
				},
				styleObj: {
				color:'red',background:'blue'
				},
				greeting: 'Hello'
			}
		},
		props: {
			exampleprop: {
				type: String,
				default: 'not set',
				required: false
			},
		},
		computed: {

			toggledClasses:function(){


			},
			...mapGetters([
				'Variants'
			]),
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
	.resetheadings {
		h1, h2, h3 {
			color: inherit;

			text-align: center;
		}

	}
</style>