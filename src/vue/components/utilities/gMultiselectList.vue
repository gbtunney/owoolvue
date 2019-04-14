<template>
	<div
		class="multiselect__content-wrapper multiselectlist"
		:class="DisplayMode"

		tabindex="-1"
		@mousedown.prevent
		ref="list">
		{{ displayMode }}
		<ul class="multiselect__content " :style="contentStyle">
			<slot name="beforeList"></slot>
			<li v-if="multiple && max === internalValue.length">
              <span class="multiselect__option">
                <slot name="maxElements">Maximum of {{ max }} options selected. First remove a selected option to select another.</slot>
              </span>
			</li>
			<template v-if="!max || internalValue.length < max">
				<li class="multiselect__element" v-for="(option, index) of filteredOptions" :key="index">
                <span
	                v-if="!(option && (option.$isLabel || option.$isDisabled))"
	                :class="optionHighlight(index, option)"
	                @click.stop="select(option)"
	                @mouseenter.self="pointerSet(index)"
	                :data-select="option && option.isTag ? tagPlaceholder : selectLabelText"
	                :data-selected="selectedLabelText"
	                :data-deselect="deselectLabelText"
	                class="multiselect__option">
                    <slot name="option" :option="option" :search="search">
                      <span>{{ getOptionLabel(option) }}</span>
                    </slot>
                </span>
					<span
						v-if="option && (option.$isLabel || option.$isDisabled)"
						:data-select="groupSelect && selectGroupLabelText"
						:data-deselect="groupSelect && deselectGroupLabelText"
						:class="groupHighlight(index, option)"
						@mouseenter.self="groupSelect && pointerSet(index)"
						@mousedown.prevent="selectGroup(option)"
						class="multiselect__option">
                    <slot name="option" :option="option" :search="search">
                      <span>{{ getOptionLabel(option) }}</span>
                    </slot>
                </span>
				</li>
			</template>
			<li v-show="showNoResults && (filteredOptions.length === 0 && search && !loading)">
              <span class="multiselect__option">
                <slot name="noResult">No elements found. Consider changing the search query.</slot>
              </span>
			</li>
			<li v-show="showNoOptions && (options.length === 0 && !search && !loading)">
              <span class="multiselect__option">
                <slot name="noOptions">List is empty.</slot>
              </span>
			</li>
			<slot name="afterList"></slot>
		</ul>
	</div>
</template>

<script>
	import multiselectMixin from 'vue-multiselect/src/multiselectMixin'
	import pointerMixin from 'vue-multiselect/src/pointerMixin'

	export default {
		name: 'vue-multiselectlist',
		mixins: [multiselectMixin, pointerMixin],
		props: {
			/**
			 * name attribute to match optional label element
			 * @default ''
			 * @type {String}
			 */
			name: {
				type: String,
				default: ''
			},
			testMode: {
				type: String,
				default: 'not set'
			},
			/**
			 * String to show when pointing to an option
			 * @default 'Press enter to select'
			 * @type {String}
			 */
			selectLabel: {
				type: String,
				default: 'Press enter to select'
			},
			/**
			 * String to show when pointing to an option
			 * @default 'Press enter to select'
			 * @type {String}
			 */
			selectGroupLabel: {
				type: String,
				default: 'Press enter to select group'
			},
			/**
			 * String to show next to selected option
			 * @default 'Selected'
			 * @type {String}
			 */
			selectedLabel: {
				type: String,
				default: 'Selected'
			},
			/**
			 * String to show when pointing to an already selected option
			 * @default 'Press enter to remove'
			 * @type {String}
			 */
			deselectLabel: {
				type: String,
				default: 'Press enter to remove'
			},
			/**
			 * String to show when pointing to an already selected option
			 * @default 'Press enter to remove'
			 * @type {String}
			 */
			deselectGroupLabel: {
				type: String,
				default: 'Press enter to deselect group'
			},
			/**
			 * Decide whether to show pointer labels
			 * @default true
			 * @type {Boolean}
			 */
			showLabels: {
				type: Boolean,
				default: true
			},
			/**
			 * Limit the display of selected options. The rest will be hidden within the limitText string.
			 * @default 99999
			 * @type {Integer}
			 */
			limit: {
				type: Number,
				default: 99999
			},
			/**
			 * Sets maxHeight style value of the dropdown
			 * @default 300
			 * @type {Integer}
			 */
			maxHeight: {
				type: Number,
				default: 300
			},
			/**
			 * Set true to trigger the loading spinner.
			 * @default False
			 * @type {Boolean}
			 */
			loading: {
				type: Boolean,
				default: false
			},
			/**
			 * Disables the multiselect if true.
			 * @default false
			 * @type {Boolean}
			 */
			disabled: {
				type: Boolean,
				default: false
			},
			/**
			 * Fixed opening direction
			 * @default ''
			 * @type {String}
			 */
			openDirection: {
				type: String,
				default: ''
			},
			/**
			 * Shows slot with message about empty options
			 * @default true
			 * @type {Boolean}
			 */
			showNoOptions: {
				type: Boolean,
				default: true
			},
			showNoResults: {
				type: Boolean,
				default: true
			},
			tabindex: {
				type: Number,
				default: 0
			},
			displayMode: {
				type: String,
				default: "horizontal"
			},
			/**
			 * Function that process the message shown when selected
			 * elements pass the defined limit.
			 * @default 'and * more'
			 * @param {Int} count Number of elements more than limit
			 * @type {Function}
			 */
			limitText: {
				type: Function,
				default: count => `and ${count} more`
		},

	},
	computed: {
		DisplayMode:function(){
			return 	`multiselectlist--${this.$props.displayMode}`;
		},
		isSingleLabelVisible () {
			return (
				this.singleValue &&
				(!this.isOpen || !this.searchable) &&
				!this.visibleValues.length
			)
		},
		isPlaceholderVisible () {
			return !this.internalValue.length && (!this.searchable || !this.isOpen)
		},
		visibleValues () {
			return this.multiple ? this.internalValue.slice(0, this.limit) : []
		},
		singleValue () {
			return this.internalValue[0]
		},
		deselectLabelText () {
			return this.showLabels ? this.deselectLabel : ''
		},
		deselectGroupLabelText () {
			return this.showLabels ? this.deselectGroupLabel : ''
		},
		selectLabelText () {
			return this.showLabels ? this.selectLabel : ''
		},
		selectGroupLabelText () {
			return this.showLabels ? this.selectGroupLabel : ''
		},
		selectedLabelText () {
			return this.showLabels ? this.selectedLabel : ''
		},
		inputStyle () {
			if (
				this.searchable ||
				(this.multiple && this.value && this.value.length)
			) {
				// Hide input by setting the width to 0 allowing it to receive focus
				return this.isOpen
					? { width: 'auto' }
					: { width: '0', position: 'absolute', padding: '0' }
			}
		},
		contentStyle () {
			/*	return this.options.length
					? { display: 'inline-block' }
					: { display: 'block' }*/
		},
		isAbove () {
			if (this.openDirection === 'above' || this.openDirection === 'top') {
				return true
			} else if (
				this.openDirection === 'below' ||
				this.openDirection === 'bottom'
			) {
				return false
			} else {
				return this.prefferedOpenDirection === 'above'
			}
		},
		showSearchInput () {
			return (
				this.searchable &&
				(this.hasSingleSelectedSlot &&
				(this.visibleSingleValue || this.visibleSingleValue === 0)
					? this.isOpen
					: true)
			)
		}
	},
	created:function(){

		this.$data.isOpen=true;
	},
	mounted:function(){

		//	this.activate();
	},
	updated:function(){
		//console.log("updatedACTIVATING!!");
		//this.isOpen=true;
		//this.showPointer=false;
	}
	}
</script>

<style lang="scss" type="text/scss" scoped>

	.multiselect * {
		box-sizing: border-box;
	}

	.multiselect:focus {
		outline: none;
	}

	.multiselect{
		&--disabled{
			pointer-events: none;
			opacity: 0.6;
		}
		&--active {
			z-index: 0;
		}

	}

	.multiselect__content-wrapper {

	}
	.multiselectlist--horizontal{
		width: fit-content;
		.multiselect__content{
			display: flex;
			justify-content: space-between;
		}
	}

	.multiselect__content {
		list-style: none;
		padding: 0;
		margin: 0;
		vertical-align: top;
	}

	.multiselect__content::webkit-scrollbar {
		display: none;
	}

	.multiselect__element {
		display: block;
	}

	.multiselect__option {
		display: block;
		//padding: 12px;
		//min-height: 40px;
		//line-height: 16px;
		//text-decoration: none;
		//text-transform: none;
		//	vertical-align: middle;
		position: relative;
		cursor: pointer;
		white-space: nowrap;

		//	@include g-simple-component(accent-secondary,font-san-serif,1);
	}

	.multiselect__option:after {
		display: none;
		/*	top: 0;
		right: 0;
		position: absolute;
		line-height: 40px;
		padding-right: 12px;
		padding-left: 20px;
		font-size: 13px;*/
	}

	.multiselect__option--highlight {
		//background: #41b883;
		outline: none;
		//color: white;
	}

	.multiselect__option--highlight:after {
		content: attr(data-select);
		//background: #41b883;
		//color: white;
	}

	.multiselect__option--selected {


		//@include c-button(dark-accent-default);

	}

	.multiselect__option--selected:after {
		content: attr(data-selected);
		color: silver;
	}

	.multiselect__option--selected.multiselect__option--highlight {
		//background: #ff6a6a;
		//color: #fff;
	}

	.multiselect__option--selected.multiselect__option--highlight:after {
		//background: #ff6a6a;
		content: attr(data-deselect);
		//color: #fff;
	}

	.multiselect--disabled {
		background: #ededed;
		pointer-events: none;
	}

	.multiselect--disabled .multiselect__current,
	.multiselect--disabled .multiselect__select {
		background: #ededed;
		color: #a6a6a6;
	}

	.multiselect__option--disabled {
		background: #ededed !important;
		color: #a6a6a6 !important;
		cursor: text;
		pointer-events: none;
	}

	.multiselect__option--group {
		background: #ededed;
		color: #35495e;
	}

	.multiselect__option--group.multiselect__option--highlight {
		background: #35495e;
		color: #fff;
	}

	.multiselect__option--group.multiselect__option--highlight:after {
		background: #35495e;
	}

	.multiselect__option--disabled.multiselect__option--highlight {
		background: #dedede;
	}

	.multiselect__option--group-selected.multiselect__option--highlight {
		//background: #ff6a6a;
		color: #fff;
	}

	.multiselect__option--group-selected.multiselect__option--highlight:after {
		//background: #ff6a6a;
		content: attr(data-deselect);
		color: #fff;
	}

	.multiselect-enter-active,
	.multiselect-leave-active {
		transition: all 0.15s ease;
	}

	.multiselect-enter,
	.multiselect-leave-active {
		opacity: 0;
	}

	.multiselect__strong {
		margin-bottom: 8px;
		line-height: 20px;
		display: inline-block;
		vertical-align: top;
	}

	*[dir="rtl"] .multiselect {
		text-align: right;
	}

	*[dir="rtl"] .multiselect__select {
		right: auto;
		left: 1px;
	}

	*[dir="rtl"] .multiselect__tags {
		padding: 8px 8px 0px 40px;
	}

	*[dir="rtl"] .multiselect__content {
		text-align: right;
	}

	*[dir="rtl"] .multiselect__option:after {
		right: auto;
		left: 0;
	}

	*[dir="rtl"] .multiselect__clear {
		right: auto;
		left: 12px;
	}

	*[dir="rtl"] .multiselect__spinner {
		right: auto;
		left: 1px;
	}

	@keyframes spinning {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(2turn);
		}
	}
</style>
