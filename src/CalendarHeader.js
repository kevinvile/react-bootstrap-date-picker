/**
 * Created by kvile on 6/8/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CalendarHeader extends Component {
	constructor(props) {
		super(props);
		this.displayName = 'DatePickerHeader';

		this.handleClickNext = this.handleClickNext.bind(this);
		this.handleClickPrevious = this.handleClickPrevious.bind(this);
	}

	displayingMinMonth() {
		if (!this.props.minDate) return false;

		const displayDate = new Date(this.props.displayDate);
		const minDate = new Date(this.props.minDate);
		return minDate.getFullYear() == displayDate.getFullYear() && minDate.getMonth() == displayDate.getMonth();
	}

	displayingMaxMonth() {
		if (!this.props.maxDate) return false;

		const displayDate = new Date(this.props.displayDate);
		const maxDate = new Date(this.props.maxDate);
		return maxDate.getFullYear() == displayDate.getFullYear() && maxDate.getMonth() == displayDate.getMonth();
	}

	handleClickPrevious() {
		const newDisplayDate = new Date(this.props.displayDate);
		newDisplayDate.setDate(1);
		newDisplayDate.setMonth(newDisplayDate.getMonth() - 1);
		this.props.onChange(newDisplayDate);
	}

	handleClickNext() {
		const newDisplayDate = new Date(this.props.displayDate);
		newDisplayDate.setDate(1);
		newDisplayDate.setMonth(newDisplayDate.getMonth() + 1);
		this.props.onChange(newDisplayDate);
	}

	render() {
		return <div className="text-center">
			<div className="text-muted pull-left datepicker-previous-wrapper" onClick={this.handleClickPrevious} style={{cursor: 'pointer'}}>
				{this.displayingMinMonth() ? null : this.props.previousButtonElement}
			</div>
			<span>{this.props.monthLabels[this.props.displayDate.getMonth()]} {this.props.displayDate.getFullYear()}</span>
			<div className="text-muted pull-right datepicker-next-wrapper" onClick={this.handleClickNext} style={{cursor: 'pointer'}}>
				{this.displayingMaxMonth() ? null : this.props.nextButtonElement}
			</div>
		</div>;
	}
}

CalendarHeader.propTypes = {
	displayDate: PropTypes.object.isRequired,
	minDate: PropTypes.string,
	maxDate: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	monthLabels: PropTypes.array.isRequired,
	previousButtonElement: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]).isRequired,
	nextButtonElement: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]).isRequired,
};

export default CalendarHeader;