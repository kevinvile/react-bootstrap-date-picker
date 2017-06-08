/**
 * Created by kvile on 6/8/2017.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

class Calendar extends Component {
	constructor(props) {
		super(props);
		this.displayName = 'DatePickerCalendar';
		this.handleClick = this.handleClick.bind(this);
		this.handleClickToday = this.handleClickToday.bind(this);
	}

	handleClick(day) {
		const newSelectedDate = this.setTimeToNoon(new Date(this.props.displayDate));
		newSelectedDate.setDate(day);
		this.props.onChange(newSelectedDate);
	}

	handleClickToday() {
		const newSelectedDate = this.setTimeToNoon(new Date());
		this.props.onChange(newSelectedDate);
	}

	setTimeToNoon(date) {
		date.setHours(12);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	}

	render() {
		const currentDate = this.setTimeToNoon(new Date());
		const selectedDate = this.props.selectedDate ? this.setTimeToNoon(new Date(this.props.selectedDate)) : null;
		const minDate = this.props.minDate ? this.setTimeToNoon(new Date(this.props.minDate)) : null;
		const maxDate = this.props.maxDate ? this.setTimeToNoon(new Date(this.props.maxDate)) : null;
		const year = this.props.displayDate.getFullYear();
		const month = this.props.displayDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const startingDay = this.props.weekStartsOn > 1
			? firstDay.getDay() - this.props.weekStartsOn + 7
			: this.props.weekStartsOn === 1
				? (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1)
				: firstDay.getDay();

		let monthLength = daysInMonth[month];
		if (month == 1) {
			if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
				monthLength = 29;
			}
		}

		const weeks = [];
		let day = 1;
		for (let i = 0; i < 9; i++) {
			const week = [];
			for (let j = 0; j <= 6; j++) {
				if (day <= monthLength && (i > 0 || j >= startingDay)) {
					let className = null;
					const date = new Date(year, month, day, 12, 0, 0, 0).toISOString();
					const beforeMinDate = minDate && Date.parse(date) < Date.parse(minDate);
					const afterMinDate = maxDate && Date.parse(date) > Date.parse(maxDate);
					if (beforeMinDate || afterMinDate) {
						week.push(<td
							key={j}
							style={{ padding: this.props.cellPadding }}
							className="text-muted"
						>
							{day}
						</td>);
					} else {
						if (Date.parse(date) === Date.parse(selectedDate)) {
							className = 'bg-primary';
						} else if (Date.parse(date) === Date.parse(currentDate)) {
							className = 'text-primary';
						}
						week.push(<td
							key={j}
							onClick={this.handleClick.bind(this, day)}
							style={{ cursor: 'pointer', padding: this.props.cellPadding, borderRadius: this.props.roundedCorners ? 5 : 0 }}
							className={className}
						>
							{day}
						</td>);
					}
					day++;
				} else {
					week.push(<td key={j} />);
				}
			}

			weeks.push(<tr key={i}>{week}</tr>);
			if (day > monthLength) {
				break;
			}
		}

		return <table className="text-center">
			<thead>
			<tr>
				{this.props.dayLabels.map((label, index)=>{
					return <td
						key={index}
						className="text-muted"
						style={{padding: this.props.cellPadding}}>
						<small>{label}</small>
					</td>;
				})}
			</tr>
			</thead>
			<tbody>
			{weeks}
			</tbody>
			{this.props.showTodayButton && <tfoot>
			<tr>
				<td colSpan={this.props.dayLabels.length} style={{ paddingTop: '9px' }}>
					<Button
						block
						bsSize="xsmall"
						className="u-today-button"
						onClick={this.handleClickToday}>
						{this.props.todayButtonLabel}
					</Button>
				</td>
			</tr>
			</tfoot>}
		</table>;
	}
}

Calendar.propTypes = {
	selectedDate: PropTypes.object,
	displayDate: PropTypes.object.isRequired,
	minDate: PropTypes.string,
	maxDate: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	dayLabels: PropTypes.array.isRequired,
	cellPadding: PropTypes.string.isRequired,
	weekStartsOn: PropTypes.number,
	showTodayButton: PropTypes.bool,
	todayButtonLabel: PropTypes.string,
	roundedCorners: PropTypes.bool
};

export default Calendar;