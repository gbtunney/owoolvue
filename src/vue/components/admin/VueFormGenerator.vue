<template>
	<div class="panel-body">
		<vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
	</div>
</template>

<script>
    import Vue from 'vue'
    import VueFormGenerator from 'vue-form-generator'
    import 'vue-form-generator/dist/vfg.css'

    Vue.use(VueFormGenerator)

    export default {
        props: {
            products: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            products: function(val) {

                console.log("setting products!hgh!",val);
                this.$data._productlist= val;

            }
        },
	    computed: {
            ProductList:function(){
	            return this.$data._productlist;

            }
	    },
        data () {
            let countries = [
                "USA",
                "Japan",
                "Germany",
                "France"
            ];
            return {
                countries: countries,

                _productlist: [],
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
                            type: 'select',
                            label: 'Skills',
                            model: 'skills',
                            values: () => {
                                return this.ProductList;
                            }                        },
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
            }
        }
    }
</script>
