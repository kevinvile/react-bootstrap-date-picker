// See http://jszen.blogspot.com/2007/03/how-to-build-simple-calendar-with.html for calendar logic.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import FormControl from 'react-bootstrap/lib/FormControl';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';
import Calendar from './Calendar';
import CalendarHeader from './CalendarHeader';

let instanceCount = 0;

const language = typeof window !== 'undefined' && window.navigator ? (window.navigator.userLanguage || window.navigator.language || '').toLowerCase() : '';
const dateFormat = !language || language === 'en-us' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.displayName = 'DatePicker';
        if (props.value && props.defaultValue) {
            throw new Error('Conflicting DatePicker properties \'value\' and \'defaultValue\'');
        }
        const state = this.makeDateValues(props.value || props.defaultValue);
        if (props.weekStartsOn > 1) {
            state.dayLabels = props.dayLabels
                .slice(props.weekStartsOn)
                .concat(props.dayLabels.slice(0, props.weekStartsOn));
        } else if (props.weekStartsOn === 1) {
            state.dayLabels = props.dayLabels.slice(1).concat(props.dayLabels.slice(0,1));
        } else {
            state.dayLabels = props.dayLabels;
        }
        state.focused = false;
        state.inputFocused = false;
        state.placeholder = props.placeholder || props.dateFormat;
        state.separator = props.dateFormat.match(/[^A-Z]/)[0];
        this.state = state;
        this.handleBadInput = this.handleBadInput.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleHide = this.handleHide.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.clear = this.clear.bind(this);
        this.getValue = this.getValue.bind(this);
		this.getFormattedValue = this.getFormattedValue.bind(this);
        this.getCalendarPlacement = this.getCalendarPlacement.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
    }

	componentWillReceiveProps(newProps) {
		const value = newProps.value;
		if (this.getValue() !== value) {
			this.setState(this.makeDateValues(value));
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !(this.state.inputFocused === true && nextState.inputFocused === false);
	}

	makeDateValues(isoString) {
		let displayDate;
		const selectedDate = isoString ? new Date(`${isoString.slice(0,10)}T12:00:00.000Z`) : null;
		const minDate = this.props.minDate ? new Date(`${isoString.slice(0,10)}T12:00:00.000Z`) : null;
		const maxDate = this.props.maxDate ? new Date(`${isoString.slice(0,10)}T12:00:00.000Z`) : null;

		const inputValue = isoString ? this.makeInputValueString(selectedDate) : null;
		if (selectedDate) {
			displayDate = new Date(selectedDate);
		} else {
			const today = new Date(`${(new Date().toISOString().slice(0,10))}T12:00:00.000Z`);
			if (minDate && Date.parse(minDate) >= Date.parse(today)){
				displayDate = minDate;
			} else if (maxDate && Date.parse(maxDate) <= Date.parse(today)){
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

	clear() {
		if (this.props.onClear) {
			this.props.onClear();
		}
		else {
			this.setState(this.makeDateValues(null));
		}

		if (this.props.onChange) {
			this.props.onChange(null, null);
		}
	}

	handleHide() {
		if (this.state.inputFocused) {
			return;
		}
		this.setState({
			focused: false
		});
		if (this.props.onBlur) {
			const event = document.createEvent('CustomEvent');
			event.initEvent('Change Date', true, false);
			ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
			this.props.onBlur(event);
		}
	}

	handleKeyDown(e) {
		if (e.which === 9 && this.state.inputFocused) {
			this.setState({
				focused: false
			});

			if (this.props.onBlur) {
				const event = document.createEvent('CustomEvent');
				event.initEvent('Change Date', true, false);
				ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
				this.props.onBlur(event);
			}
		}
	}

	handleFocus() {
		if (this.state.focused === true) {
			return;
		}

		const placement = this.getCalendarPlacement();

		this.setState({
			inputFocused: true,
			focused: true,
			calendarPlacement: placement
		});

		if (this.props.onFocus) {
			const event = document.createEvent('CustomEvent');
			event.initEvent('Change Date', true, false);
			ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
			this.props.onFocus(event);
		}
	}

	handleBlur() {
		this.setState({
			inputFocused: false
		});
	}
    getValue() {
		return this.state.selectedDate ? this.state.selectedDate.toISOString() : null;
	}

	getFormattedValue() {
		return this.state.displayDate ? this.state.inputValue : null;
	}

	getCalendarPlacement() {
		const tag = Object.prototype.toString.call(this.props.calendarPlacement);
		const isFunction = tag === '[object AsyncFunction]' || tag === '[object Function]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
		if (isFunction) {
			return this.props.calendarPlacement();
		}
		else {
			return this.props.calendarPlacement;
		}
	}

	makeInputValueString(date) {
		const month = date.getMonth() + 1;
		const day = date.getDate();

		//this method is executed during intialState setup... handle a missing state properly
		const separator = (this.state ? this.state.separator : this.props.dateFormat.match(/[^A-Z]/)[0]);
		if (this.props.dateFormat.match(/MM.DD.YYYY/)) {
			return (month > 9 ? month : `0${month}`) + separator + (day > 9 ? day : `0${day}`) + separator + date.getFullYear();
		}
		else if (this.props.dateFormat.match(/DD.MM.YYYY/)) {
			return (day > 9 ? day : `0${day}`) + separator + (month > 9 ? month : `0${month}`) + separator + date.getFullYear();
		}
		else {
			return date.getFullYear() + separator + (month > 9 ? month : `0${month}`) + separator + (day > 9 ? day : `0${day}`);
		}
	}

	handleBadInput(originalValue) {
		const parts = originalValue.replace(new RegExp(`[^0-9${this.state.separator}]`), '').split(this.state.separator);
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
				parts[2] = parts[2].slice(0,4);
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
				parts[2] = parts[2].slice(0,2);
			}
		}
		this.setState({
			inputValue: parts.join(this.state.separator)
		});
	}

	handleInputChange() {

		const originalValue = ReactDOM.findDOMNode(this.refs.input).value;
		const inputValue = originalValue.replace(/(-|\/\/)/g, this.state.separator).slice(0,10);

		if (!inputValue) {
			this.clear();
			return;
		}

		let month, day, year;
		if (this.props.dateFormat.match(/MM.DD.YYYY/)) {
			if (!inputValue.match(/[0-1][0-9].[0-3][0-9].[1-2][0-9][0-9][0-9]/)) {
				return this.handleBadInput(originalValue);
			}

			month = inputValue.slice(0,2).replace(/[^0-9]/g, '');
			day = inputValue.slice(3,5).replace(/[^0-9]/g, '');
			year = inputValue.slice(6,10).replace(/[^0-9]/g, '');
		} else if (this.props.dateFormat.match(/DD.MM.YYYY/)) {
			if (!inputValue.match(/[0-3][0-9].[0-1][0-9].[1-2][0-9][0-9][0-9]/)) {
				return this.handleBadInput(originalValue);
			}

			day = inputValue.slice(0,2).replace(/[^0-9]/g, '');
			month = inputValue.slice(3,5).replace(/[^0-9]/g, '');
			year = inputValue.slice(6,10).replace(/[^0-9]/g, '');
		} else {
			if (!inputValue.match(/[1-2][0-9][0-9][0-9].[0-1][0-9].[0-3][0-9]/)) {
				return this.handleBadInput(originalValue);
			}

			year = inputValue.slice(0,4).replace(/[^0-9]/g, '');
			month = inputValue.slice(5,7).replace(/[^0-9]/g, '');
			day = inputValue.slice(8,10).replace(/[^0-9]/g, '');
		}

		const monthInteger = parseInt(month, 10);
		const dayInteger = parseInt(day, 10);
		const yearInteger = parseInt(year, 10);
		if (monthInteger > 12 || dayInteger > 31) {
			return this.handleBadInput(originalValue);
		}

		if (!isNaN(monthInteger) && !isNaN(dayInteger) && !isNaN(yearInteger) && monthInteger <= 12 && dayInteger <= 31 && yearInteger > 999) {
			const selectedDate = new Date(yearInteger, monthInteger - 1, dayInteger, 12, 0, 0, 0);
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

	onChangeMonth(newDisplayDate) {
		this.setState({
			displayDate: newDisplayDate
		});
	}

	onChangeDate(newSelectedDate) {
		const inputValue = this.makeInputValueString(newSelectedDate);
		this.setState({
			inputValue: inputValue,
			selectedDate: newSelectedDate,
			displayDate: newSelectedDate,
			value: newSelectedDate.toISOString(),
			focused: false
		});

		if (this.props.onBlur) {
			const event = document.createEvent('CustomEvent');
			event.initEvent('Change Date', true, false);
			ReactDOM.findDOMNode(this.refs.hiddenInput).dispatchEvent(event);
			this.props.onBlur(event);
		}

		if (this.props.onChange) {
			this.props.onChange(newSelectedDate.toISOString(), inputValue);
		}
	}



	render() {
		const calendarHeader = <CalendarHeader
            previousButtonElement={this.props.previousButtonElement}
            nextButtonElement={this.props.nextButtonElement}
            displayDate={this.state.displayDate}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            onChange={this.onChangeMonth}
            monthLabels={this.props.monthLabels}
            dateFormat={this.props.dateFormat} />;

		const control = this.props.customControl
			? React.cloneElement(this.props.customControl, {
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
				autoComplete: this.props.autoComplete,
			})
			: <FormControl
                onKeyDown={this.handleKeyDown}
                value={this.state.inputValue || ''}
                required={this.props.required}
                ref="input"
                type="text"
                className={this.props.className}
                style={this.props.style}
                autoFocus={this.props.autoFocus}
                disabled={this.props.disabled}
                placeholder={this.state.focused ? this.props.dateFormat : this.state.placeholder}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleInputChange}
                autoComplete={this.props.autoComplete}
            />;

		return <InputGroup
            ref="inputGroup"
            bsClass={this.props.showClearButton ? this.props.bsClass : ''}
            bsSize={this.props.bsSize}
            id={this.props.id ? `${this.props.id}_group` : null}>
			{control}
          <Overlay
              rootClose={true}
              onHide={this.handleHide}
              show={this.state.focused}
              container={() => this.props.calendarContainer || ReactDOM.findDOMNode(this.refs.overlayContainer)}
              target={() => ReactDOM.findDOMNode(this.refs.input)}
              placement={this.state.calendarPlacement}
              delayHide={200}>
            <Popover id={`date-picker-popover-${this.props.instanceCount}`} className="date-picker-popover" title={calendarHeader}>
              <Calendar
                  cellPadding={this.props.cellPadding}
                  selectedDate={this.state.selectedDate}
                  displayDate={this.state.displayDate}
                  onChange={this.onChangeDate}
                  dayLabels={this.state.dayLabels}
                  weekStartsOn={this.props.weekStartsOn}
                  showTodayButton={this.props.showTodayButton}
                  todayButtonLabel={this.props.todayButtonLabel}
                  minDate={this.props.minDate}
                  maxDate={this.props.maxDate}
                  roundedCorners={this.props.roundedCorners}
              />
            </Popover>
          </Overlay>
          <div ref="overlayContainer" style={{position: 'relative'}} />
          <input ref="hiddenInput" type="hidden" id={this.props.id} name={this.props.name} value={this.state.value || ''} data-formattedvalue={this.state.value ? this.state.inputValue : ''} />
			{this.props.showClearButton && !this.props.customControl && <InputGroup.Addon
                onClick={this.props.disabled ? null : this.clear}
                style={{cursor:(this.state.inputValue && !this.props.disabled) ? 'pointer' : 'not-allowed'}}>
              <div style={{opacity: (this.state.inputValue && !this.props.disabled) ? 1 : 0.5}}>
				  {this.props.clearButtonElement}
              </div>
            </InputGroup.Addon>}
			{this.props.children}
        </InputGroup>;
	}
}

DatePicker.propTypes = {
	defaultValue: PropTypes.string,
	value: PropTypes.string,
	required: PropTypes.bool,
	className: PropTypes.string,
	style: PropTypes.object,
	minDate: PropTypes.string,
	maxDate: PropTypes.string,
	cellPadding: PropTypes.string,
	autoComplete: PropTypes.string,
	placeholder: PropTypes.string,
	dayLabels: PropTypes.array,
	monthLabels: PropTypes.array,
	onChange: PropTypes.func,
	onClear: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	autoFocus: PropTypes.bool,
	disabled: PropTypes.bool,
	weekStartsOnMonday: (props, propName, componentName) => {
		if (props[propName]) {
			return new Error(`Prop '${propName}' supplied to '${componentName}' is obsolete. Use 'weekStartsOn' instead.`);
		}
	},
	weekStartsOn: PropTypes.number,
	clearButtonElement: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]),
	showClearButton: PropTypes.bool,
	previousButtonElement: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]),
	nextButtonElement: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]),
	calendarPlacement: React.PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func
	]),
	dateFormat: PropTypes.string, // 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'DD-MM-YYYY'
	bsClass: PropTypes.string,
	bsSize: PropTypes.string,
	calendarContainer: PropTypes.object,
	id: PropTypes.string,
	name: PropTypes.string,
	showTodayButton: PropTypes.bool,
	todayButtonLabel: PropTypes.string,
	instanceCount: PropTypes.number,
	customControl: PropTypes.object,
	roundedCorners: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	])
};

DatePicker.defaultProps = {
	cellPadding: '5px',
	dayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	monthLabels: ['January', 'February', 'March', 'April',
		'May', 'June', 'July', 'August', 'September',
		'October', 'November', 'December'],
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

export default DatePicker;