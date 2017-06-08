'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _FormControl = require('react-bootstrap/lib/FormControl');

var _FormControl2 = _interopRequireDefault(_FormControl);

var _InputGroup = require('react-bootstrap/lib/InputGroup');

var _InputGroup2 = _interopRequireDefault(_InputGroup);

var _Overlay = require('react-bootstrap/lib/Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _Popover = require('react-bootstrap/lib/Popover');

var _Popover2 = _interopRequireDefault(_Popover);

var _Calendar = require('./Calendar');

var _Calendar2 = _interopRequireDefault(_Calendar);

var _CalendarHeader = require('./CalendarHeader');

var _CalendarHeader2 = _interopRequireDefault(_CalendarHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // See http://jszen.blogspot.com/2007/03/how-to-build-simple-calendar-with.html for calendar logic.

var instanceCount = 0;

var language = typeof window !== 'undefined' && window.navigator ? (window.navigator.userLanguage || window.navigator.language || '').toLowerCase() : '';
var dateFormat = !language || language === 'en-us' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';

var DatePicker = function (_Component) {
	_inherits(DatePicker, _Component);

	function DatePicker(props) {
		_classCallCheck(this, DatePicker);

		var _this = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this, props));

		_this.displayName = 'DatePicker';
		if (props.value && props.defaultValue) {
			throw new Error('Conflicting DatePicker properties \'value\' and \'defaultValue\'');
		}
		var state = _this.makeDateValues(props.value || props.defaultValue);
		if (props.weekStartsOn > 1) {
			state.dayLabels = props.dayLabels.slice(props.weekStartsOn).concat(props.dayLabels.slice(0, props.weekStartsOn));
		} else if (props.weekStartsOn === 1) {
			state.dayLabels = props.dayLabels.slice(1).concat(props.dayLabels.slice(0, 1));
		} else {
			state.dayLabels = props.dayLabels;
		}
		state.focused = false;
		state.inputFocused = false;
		state.placeholder = props.placeholder || props.dateFormat;
		state.separator = props.dateFormat.match(/[^A-Z]/)[0];
		_this.state = state;
		_this.handleBadInput = _this.handleBadInput.bind(_this);
		_this.handleBlur = _this.handleBlur.bind(_this);
		_this.handleFocus = _this.handleFocus.bind(_this);
		_this.handleHide = _this.handleHide.bind(_this);
		_this.handleInputChange = _this.handleInputChange.bind(_this);
		_this.handleKeyDown = _this.handleKeyDown.bind(_this);
		_this.clear = _this.clear.bind(_this);
		_this.getValue = _this.getValue.bind(_this);
		_this.getFormattedValue = _this.getFormattedValue.bind(_this);
		_this.getCalendarPlacement = _this.getCalendarPlacement.bind(_this);
		_this.onChangeDate = _this.onChangeDate.bind(_this);
		_this.onChangeMonth = _this.onChangeMonth.bind(_this);
		return _this;
	}

	_createClass(DatePicker, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(newProps) {
			var value = newProps.value;
			if (this.getValue() !== value) {
				this.setState(this.makeDateValues(value));
			}
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return !(this.state.inputFocused === true && nextState.inputFocused === false);
		}
	}, {
		key: 'makeDateValues',
		value: function makeDateValues(isoString) {
			var displayDate = void 0;
			var selectedDate = isoString ? new Date(isoString.slice(0, 10) + 'T12:00:00.000Z') : null;
			var minDate = this.props.minDate ? new Date(isoString.slice(0, 10) + 'T12:00:00.000Z') : null;
			var maxDate = this.props.maxDate ? new Date(isoString.slice(0, 10) + 'T12:00:00.000Z') : null;

			var inputValue = isoString ? this.makeInputValueString(selectedDate) : null;
			if (selectedDate) {
				displayDate = new Date(selectedDate);
			} else {
				var today = new Date(new Date().toISOString().slice(0, 10) + 'T12:00:00.000Z');
				if (minDate && Date.parse(minDate) >= Date.parse(today)) {
					displayDate = minDate;
				} else if (maxDate && Date.parse(maxDate) <= Date.parse(today)) {
					displayDate = maxDate;
				} else {
					displayDate = today;
				}
			}

			return {
				value: selectedDate ? selectedDate.toISOString() : null,
				displayDate: displayDate,
				selectedDate: selectedDate,
				inputValue: inputValue
			};
		}
	}, {
		key: 'clear',
		value: function clear() {
			if (this.props.onClear) {
				this.props.onClear();
			} else {
				this.setState(this.makeDateValues(null));
			}

			if (this.props.onChange) {
				this.props.onChange(null, null);
			}
		}
	}, {
		key: 'handleHide',
		value: function handleHide() {
			if (this.state.inputFocused) {
				return;
			}
			this.setState({
				focused: false
			});
			if (this.props.onBlur) {
				var event = document.createEvent('CustomEvent');
				event.initEvent('Change Date', true, false);
				_reactDom2.default.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
				this.props.onBlur(event);
			}
		}
	}, {
		key: 'handleKeyDown',
		value: function handleKeyDown(e) {
			if (e.which === 9 && this.state.inputFocused) {
				this.setState({
					focused: false
				});

				if (this.props.onBlur) {
					var event = document.createEvent('CustomEvent');
					event.initEvent('Change Date', true, false);
					_reactDom2.default.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
					this.props.onBlur(event);
				}
			}
		}
	}, {
		key: 'handleFocus',
		value: function handleFocus() {
			if (this.state.focused === true) {
				return;
			}

			var placement = this.getCalendarPlacement();

			this.setState({
				inputFocused: true,
				focused: true,
				calendarPlacement: placement
			});

			if (this.props.onFocus) {
				var event = document.createEvent('CustomEvent');
				event.initEvent('Change Date', true, false);
				_reactDom2.default.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
				this.props.onFocus(event);
			}
		}
	}, {
		key: 'handleBlur',
		value: function handleBlur() {
			this.setState({
				inputFocused: false
			});
		}
	}, {
		key: 'getValue',
		value: function getValue() {
			return this.state.selectedDate ? this.state.selectedDate.toISOString() : null;
		}
	}, {
		key: 'getFormattedValue',
		value: function getFormattedValue() {
			return this.state.displayDate ? this.state.inputValue : null;
		}
	}, {
		key: 'getCalendarPlacement',
		value: function getCalendarPlacement() {
			var tag = Object.prototype.toString.call(this.props.calendarPlacement);
			var isFunction = tag === '[object AsyncFunction]' || tag === '[object Function]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
			if (isFunction) {
				return this.props.calendarPlacement();
			} else {
				return this.props.calendarPlacement;
			}
		}
	}, {
		key: 'makeInputValueString',
		value: function makeInputValueString(date) {
			var month = date.getMonth() + 1;
			var day = date.getDate();

			//this method is executed during intialState setup... handle a missing state properly
			var separator = this.state ? this.state.separator : this.props.dateFormat.match(/[^A-Z]/)[0];
			if (this.props.dateFormat.match(/MM.DD.YYYY/)) {
				return (month > 9 ? month : '0' + month) + separator + (day > 9 ? day : '0' + day) + separator + date.getFullYear();
			} else if (this.props.dateFormat.match(/DD.MM.YYYY/)) {
				return (day > 9 ? day : '0' + day) + separator + (month > 9 ? month : '0' + month) + separator + date.getFullYear();
			} else {
				return date.getFullYear() + separator + (month > 9 ? month : '0' + month) + separator + (day > 9 ? day : '0' + day);
			}
		}
	}, {
		key: 'handleBadInput',
		value: function handleBadInput(originalValue) {
			var parts = originalValue.replace(new RegExp('[^0-9' + this.state.separator + ']'), '').split(this.state.separator);
			if (this.props.dateFormat.match(/MM.DD.YYYY/) || this.props.dateFormat.match(/DD.MM.YYYY/)) {
				if (parts[0] && parts[0].length > 2) {
					parts[1] = parts[0].slice(2) + (parts[1] || '');
					parts[0] = parts[0].slice(0, 2);
				}
				if (parts[1] && parts[1].length > 2) {
					parts[2] = parts[1].slice(2) + (parts[2] || '');
					parts[1] = parts[1].slice(0, 2);
				}
				if (parts[2]) {
					parts[2] = parts[2].slice(0, 4);
				}
			} else {
				if (parts[0] && parts[0].length > 4) {
					parts[1] = parts[0].slice(4) + (parts[1] || '');
					parts[0] = parts[0].slice(0, 4);
				}
				if (parts[1] && parts[1].length > 2) {
					parts[2] = parts[1].slice(2) + (parts[2] || '');
					parts[1] = parts[1].slice(0, 2);
				}
				if (parts[2]) {
					parts[2] = parts[2].slice(0, 2);
				}
			}
			this.setState({
				inputValue: parts.join(this.state.separator)
			});
		}
	}, {
		key: 'handleInputChange',
		value: function handleInputChange() {

			var originalValue = _reactDom2.default.findDOMNode(this.refs.input).value;
			var inputValue = originalValue.replace(/(-|\/\/)/g, this.state.separator).slice(0, 10);

			if (!inputValue) {
				this.clear();
				return;
			}

			var month = void 0,
			    day = void 0,
			    year = void 0;
			if (this.props.dateFormat.match(/MM.DD.YYYY/)) {
				if (!inputValue.match(/[0-1][0-9].[0-3][0-9].[1-2][0-9][0-9][0-9]/)) {
					return this.handleBadInput(originalValue);
				}

				month = inputValue.slice(0, 2).replace(/[^0-9]/g, '');
				day = inputValue.slice(3, 5).replace(/[^0-9]/g, '');
				year = inputValue.slice(6, 10).replace(/[^0-9]/g, '');
			} else if (this.props.dateFormat.match(/DD.MM.YYYY/)) {
				if (!inputValue.match(/[0-3][0-9].[0-1][0-9].[1-2][0-9][0-9][0-9]/)) {
					return this.handleBadInput(originalValue);
				}

				day = inputValue.slice(0, 2).replace(/[^0-9]/g, '');
				month = inputValue.slice(3, 5).replace(/[^0-9]/g, '');
				year = inputValue.slice(6, 10).replace(/[^0-9]/g, '');
			} else {
				if (!inputValue.match(/[1-2][0-9][0-9][0-9].[0-1][0-9].[0-3][0-9]/)) {
					return this.handleBadInput(originalValue);
				}

				year = inputValue.slice(0, 4).replace(/[^0-9]/g, '');
				month = inputValue.slice(5, 7).replace(/[^0-9]/g, '');
				day = inputValue.slice(8, 10).replace(/[^0-9]/g, '');
			}

			var monthInteger = parseInt(month, 10);
			var dayInteger = parseInt(day, 10);
			var yearInteger = parseInt(year, 10);
			if (monthInteger > 12 || dayInteger > 31) {
				return this.handleBadInput(originalValue);
			}

			if (!isNaN(monthInteger) && !isNaN(dayInteger) && !isNaN(yearInteger) && monthInteger <= 12 && dayInteger <= 31 && yearInteger > 999) {
				var selectedDate = new Date(yearInteger, monthInteger - 1, dayInteger, 12, 0, 0, 0);
				this.setState({
					selectedDate: selectedDate,
					displayDate: selectedDate,
					value: selectedDate.toISOString()
				});

				if (this.props.onChange) {
					this.props.onChange(selectedDate.toISOString(), inputValue);
				}
			}

			this.setState({
				inputValue: inputValue
			});
		}
	}, {
		key: 'onChangeMonth',
		value: function onChangeMonth(newDisplayDate) {
			this.setState({
				displayDate: newDisplayDate
			});
		}
	}, {
		key: 'onChangeDate',
		value: function onChangeDate(newSelectedDate) {
			var inputValue = this.makeInputValueString(newSelectedDate);
			this.setState({
				inputValue: inputValue,
				selectedDate: newSelectedDate,
				displayDate: newSelectedDate,
				value: newSelectedDate.toISOString(),
				focused: false
			});

			if (this.props.onBlur) {
				var event = document.createEvent('CustomEvent');
				event.initEvent('Change Date', true, false);
				_reactDom2.default.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
				this.props.onBlur(event);
			}

			if (this.props.onChange) {
				this.props.onChange(newSelectedDate.toISOString(), inputValue);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var calendarHeader = _react2.default.createElement(_CalendarHeader2.default, {
				previousButtonElement: this.props.previousButtonElement,
				nextButtonElement: this.props.nextButtonElement,
				displayDate: this.state.displayDate,
				minDate: this.props.minDate,
				maxDate: this.props.maxDate,
				onChange: this.onChangeMonth,
				monthLabels: this.props.monthLabels,
				dateFormat: this.props.dateFormat });

			var control = this.props.customControl ? _react2.default.cloneElement(this.props.customControl, {
				onKeyDown: this.handleKeyDown,
				value: this.state.inputValue || '',
				required: this.props.required,
				placeholder: this.state.focused ? this.props.dateFormat : this.state.placeholder,
				ref: 'input',
				disabled: this.props.disabled,
				onFocus: this.handleFocus,
				onBlur: this.handleBlur,
				onChange: this.handleInputChange,
				className: this.props.className,
				style: this.props.style,
				autoComplete: this.props.autoComplete
			}) : _react2.default.createElement(_FormControl2.default, {
				onKeyDown: this.handleKeyDown,
				value: this.state.inputValue || '',
				required: this.props.required,
				ref: 'input',
				type: 'text',
				className: this.props.className,
				style: this.props.style,
				autoFocus: this.props.autoFocus,
				disabled: this.props.disabled,
				placeholder: this.state.focused ? this.props.dateFormat : this.state.placeholder,
				onFocus: this.handleFocus,
				onBlur: this.handleBlur,
				onChange: this.handleInputChange,
				autoComplete: this.props.autoComplete
			});

			return _react2.default.createElement(
				_InputGroup2.default,
				{
					ref: 'inputGroup',
					bsClass: this.props.showClearButton ? this.props.bsClass : '',
					bsSize: this.props.bsSize,
					id: this.props.id ? this.props.id + '_group' : null },
				control,
				_react2.default.createElement(
					_Overlay2.default,
					{
						rootClose: true,
						onHide: this.handleHide,
						show: this.state.focused,
						container: function container() {
							return _this2.props.calendarContainer || _reactDom2.default.findDOMNode(_this2.refs.overlayContainer);
						},
						target: function target() {
							return _reactDom2.default.findDOMNode(_this2.refs.input);
						},
						placement: this.state.calendarPlacement,
						delayHide: 200 },
					_react2.default.createElement(
						_Popover2.default,
						{ id: 'date-picker-popover-' + this.props.instanceCount, className: 'date-picker-popover', title: calendarHeader },
						_react2.default.createElement(_Calendar2.default, {
							cellPadding: this.props.cellPadding,
							selectedDate: this.state.selectedDate,
							displayDate: this.state.displayDate,
							onChange: this.onChangeDate,
							dayLabels: this.state.dayLabels,
							weekStartsOn: this.props.weekStartsOn,
							showTodayButton: this.props.showTodayButton,
							todayButtonLabel: this.props.todayButtonLabel,
							minDate: this.props.minDate,
							maxDate: this.props.maxDate,
							roundedCorners: this.props.roundedCorners
						})
					)
				),
				_react2.default.createElement('div', { ref: 'overlayContainer', style: { position: 'relative' } }),
				_react2.default.createElement('input', { ref: 'hiddenInput', type: 'hidden', id: this.props.id, name: this.props.name, value: this.state.value || '', 'data-formattedvalue': this.state.value ? this.state.inputValue : '' }),
				this.props.showClearButton && !this.props.customControl && _react2.default.createElement(
					_InputGroup2.default.Addon,
					{
						onClick: this.props.disabled ? null : this.clear,
						style: { cursor: this.state.inputValue && !this.props.disabled ? 'pointer' : 'not-allowed' } },
					_react2.default.createElement(
						'div',
						{ style: { opacity: this.state.inputValue && !this.props.disabled ? 1 : 0.5 } },
						this.props.clearButtonElement
					)
				),
				this.props.children
			);
		}
	}]);

	return DatePicker;
}(_react.Component);

DatePicker.propTypes = {
	defaultValue: _propTypes2.default.string,
	value: _propTypes2.default.string,
	required: _propTypes2.default.bool,
	className: _propTypes2.default.string,
	style: _propTypes2.default.object,
	minDate: _propTypes2.default.string,
	maxDate: _propTypes2.default.string,
	cellPadding: _propTypes2.default.string,
	autoComplete: _propTypes2.default.string,
	placeholder: _propTypes2.default.string,
	dayLabels: _propTypes2.default.array,
	monthLabels: _propTypes2.default.array,
	onChange: _propTypes2.default.func,
	onClear: _propTypes2.default.func,
	onBlur: _propTypes2.default.func,
	onFocus: _propTypes2.default.func,
	autoFocus: _propTypes2.default.bool,
	disabled: _propTypes2.default.bool,
	weekStartsOnMonday: function weekStartsOnMonday(props, propName, componentName) {
		if (props[propName]) {
			return new Error('Prop \'' + propName + '\' supplied to \'' + componentName + '\' is obsolete. Use \'weekStartsOn\' instead.');
		}
	},
	weekStartsOn: _propTypes2.default.number,
	clearButtonElement: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
	showClearButton: _propTypes2.default.bool,
	previousButtonElement: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
	nextButtonElement: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
	calendarPlacement: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
	dateFormat: _propTypes2.default.string, // 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'DD-MM-YYYY'
	bsClass: _propTypes2.default.string,
	bsSize: _propTypes2.default.string,
	calendarContainer: _propTypes2.default.object,
	id: _propTypes2.default.string,
	name: _propTypes2.default.string,
	showTodayButton: _propTypes2.default.bool,
	todayButtonLabel: _propTypes2.default.string,
	instanceCount: _propTypes2.default.number,
	customControl: _propTypes2.default.object,
	roundedCorners: _propTypes2.default.bool,
	children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node])
};

DatePicker.defaultProps = {
	cellPadding: '5px',
	dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	monthLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	clearButtonElement: '×',
	previousButtonElement: '<',
	nextButtonElement: '>',
	calendarPlacement: 'bottom',
	dateFormat: dateFormat,
	showClearButton: true,
	autoFocus: false,
	disabled: false,
	showTodayButton: false,
	todayButtonLabel: 'Today',
	autoComplete: 'on',
	instanceCount: instanceCount++,
	style: {
		width: '100%'
	},
	roundedCorners: false
};

exports.default = DatePicker;
module.exports = exports['default'];