'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by kvile on 6/8/2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CalendarHeader = function (_Component) {
	_inherits(CalendarHeader, _Component);

	function CalendarHeader(props) {
		_classCallCheck(this, CalendarHeader);

		var _this = _possibleConstructorReturn(this, (CalendarHeader.__proto__ || Object.getPrototypeOf(CalendarHeader)).call(this, props));

		_this.displayName = 'DatePickerHeader';

		_this.handleClickNext = _this.handleClickNext.bind(_this);
		_this.handleClickPrevious = _this.handleClickPrevious.bind(_this);
		return _this;
	}

	_createClass(CalendarHeader, [{
		key: 'displayingMinMonth',
		value: function displayingMinMonth() {
			if (!this.props.minDate) return false;

			var displayDate = new Date(this.props.displayDate);
			var minDate = new Date(this.props.minDate);
			return minDate.getFullYear() == displayDate.getFullYear() && minDate.getMonth() == displayDate.getMonth();
		}
	}, {
		key: 'displayingMaxMonth',
		value: function displayingMaxMonth() {
			if (!this.props.maxDate) return false;

			var displayDate = new Date(this.props.displayDate);
			var maxDate = new Date(this.props.maxDate);
			return maxDate.getFullYear() == displayDate.getFullYear() && maxDate.getMonth() == displayDate.getMonth();
		}
	}, {
		key: 'handleClickPrevious',
		value: function handleClickPrevious() {
			var newDisplayDate = new Date(this.props.displayDate);
			newDisplayDate.setDate(1);
			newDisplayDate.setMonth(newDisplayDate.getMonth() - 1);
			this.props.onChange(newDisplayDate);
		}
	}, {
		key: 'handleClickNext',
		value: function handleClickNext() {
			var newDisplayDate = new Date(this.props.displayDate);
			newDisplayDate.setDate(1);
			newDisplayDate.setMonth(newDisplayDate.getMonth() + 1);
			this.props.onChange(newDisplayDate);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ className: 'text-center' },
				_react2.default.createElement(
					'div',
					{ className: 'text-muted pull-left datepicker-previous-wrapper', onClick: this.handleClickPrevious, style: { cursor: 'pointer' } },
					this.displayingMinMonth() ? null : this.props.previousButtonElement
				),
				_react2.default.createElement(
					'span',
					null,
					this.props.monthLabels[this.props.displayDate.getMonth()],
					' ',
					this.props.displayDate.getFullYear()
				),
				_react2.default.createElement(
					'div',
					{ className: 'text-muted pull-right datepicker-next-wrapper', onClick: this.handleClickNext, style: { cursor: 'pointer' } },
					this.displayingMaxMonth() ? null : this.props.nextButtonElement
				)
			);
		}
	}]);

	return CalendarHeader;
}(_react.Component);

CalendarHeader.propTypes = {
	displayDate: _propTypes2.default.object.isRequired,
	minDate: _propTypes2.default.string,
	maxDate: _propTypes2.default.string,
	onChange: _propTypes2.default.func.isRequired,
	monthLabels: _propTypes2.default.array.isRequired,
	previousButtonElement: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]).isRequired,
	nextButtonElement: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]).isRequired
};

exports.default = CalendarHeader;
module.exports = exports['default'];