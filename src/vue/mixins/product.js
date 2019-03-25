import math from 'mathjs'
import isColor from 'is-color';
import randomColor from 'randomcolor';

export function Product(text) ={
    data() {
        return {
            isShowing: false
        }
    },
    methods: {
        toggleShow() {
            this.isShowing = !this.isShowing;
        }
    }
}