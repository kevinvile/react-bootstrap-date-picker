'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by kvile on 6/8/2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var Calendar = function (_Component) {
	_inherits(Calendar, _Component);

	function Calendar(props) {
		_classCallCheck(this, Calendar);

		var _this = _possibleConstructorReturn(this, (Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call(this, props));

		_this.displayName = 'DatePickerCalendar';
		_this.handleClick = _this.handleClick.bind(_this);
		_this.handleClickToday = _this.handleClickToday.bind(_this);
		return _this;
	}

	_createClass(Calendar, [{
		key: 'handleClick',
		value: function handleClick(day) {
			var newSelectedDate = this.setTimeToNoon(new Date(this.props.displayDate));
			newSelectedDate.setDate(day);
			this.props.onChange(newSelectedDate);
		}
	}, {
		key: 'handleClickToday',
		value: function handleClickToday() {
			var newSelectedDate = this.setTimeToNoon(new Date());
			this.props.onChange(newSelectedDate);
		}
	}, {
		key: 'setTimeToNoon',
		value: function setTimeToNoon(date) {
			date.setHours(12);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			return date;
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var currentDate = this.setTimeToNoon(new Date());
			var selectedDate = this.props.selectedDate ? this.setTimeToNoon(new Date(this.props.selectedDate)) : null;
			var minDate = this.props.minDate ? this.setTimeToNoon(new Date(this.props.minDate)) : null;
			var maxDate = this.props.maxDate ? this.setTimeToNoon(new Date(this.props.maxDate)) : null;
			var year = this.props.displayDate.getFullYear();
			var month = this.props.displayDate.getMonth();
			var firstDay = new Date(year, month, 1);
			var startingDay = this.props.weekStartsOn > 1 ? firstDay.getDay() - this.props.weekStartsOn + 7 : this.props.weekStartsOn === 1 ? firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 : firstDay.getDay();

			var monthLength = daysInMonth[month];
			if (month == 1) {
				if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
					monthLength = 29;
				}
			}

			var weeks = [];
			var day = 1;
			for (var i = 0; i < 9; i++) {
				var week = [];
				for (var j = 0; j <= 6; j++) {
					if (day <= monthLength && (i > 0 || j >= startingDay)) {
						var className = null;
						var date = new Date(year, month, day, 12, 0, 0, 0).toISOString();
						var beforeMinDate = minDate && Date.parse(date) < Date.parse(minDate);
						var afterMinDate = maxDate && Date.parse(date) > Date.parse(maxDate);
						if (beforeMinDate || afterMinDate) {
							week.push(_react2.default.createElement(
								'td',
								{
									key: j,
									style: { padding: this.props.cellPadding },
									className: 'text-muted'
								},
								day
							));
						} else {
							if (Date.parse(date) === Date.parse(selectedDate)) {
								className = 'bg-primary';
							} else if (Date.parse(date) === Date.parse(currentDate)) {
								className = 'text-primary';
							}
							week.push(_react2.default.createElement(
								'td',
								{
									key: j,
									onClick: this.handleClick.bind(this, day),
									style: { cursor: 'pointer', padding: this.props.cellPadding, borderRadius: this.props.roundedCorners ? 5 : 0 },
									className: className
								},
								day
							));
						}
						day++;
					} else {
						week.push(_react2.default.createElement('td', { key: j }));
					}
				}

				weeks.push(_react2.default.createElement(
					'tr',
					{ key: i },
					week
				));
				if (day > monthLength) {
					break;
				}
			}

			return _react2.default.createElement(
				'table',
				{ className: 'text-center' },
				_react2.default.createElement(
					'thead',
					null,
					_react2.default.createElement(
						'tr',
						null,
						this.props.dayLabels.map(function (label, index) {
							return _react2.default.createElement(
								'td',
								{
									key: index,
									className: 'text-muted',
									style: { padding: _this2.props.cellPadding } },
								_react2.default.createElement(
									'small',
									null,
									label
								)
							);
						})
					)
				),
				_react2.default.createElement(
					'tbody',
					null,
					weeks
				),
				this.props.showTodayButton && _react2.default.createElement(
					'tfoot',
					null,
					_react2.default.createElement(
						'tr',
						null,
						_react2.default.createElement(
							'td',
							{ colSpan: this.props.dayLabels.length, style: { paddingTop: '9px' } },
							_react2.default.createElement(
								_Button2.default,
								{
									block: true,
									bsSize: 'xsmall',
									className: 'u-today-button',
									onClick: this.handleClickToday },
								this.props.todayButtonLabel
							)
						)
					)
				)
			);
		}
	}]);

	return Calendar;
}(_react.Component);

Calendar.propTypes = {
	selectedDate: _propTypes2.default.object,
	displayDate: _propTypes2.default.object.isRequired,
	minDate: _propTypes2.default.string,
	maxDate: _propTypes2.default.string,
	onChange: _propTypes2.default.func.isRequired,
	dayLabels: _propTypes2.default.array.isRequired,
	cellPadding: _propTypes2.default.string.isRequired,
	weekStartsOn: _propTypes2.default.number,
	showTodayButton: _propTypes2.default.bool,
	todayButtonLabel: _propTypes2.default.string,
	roundedCorners: _propTypes2.default.bool
};

exports.default = Calendar;
module.exports = exports['default'];