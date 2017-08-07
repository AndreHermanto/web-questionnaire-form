import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class DatePicker extends Component {
  static propTypes: {
    date: PropTypes.string.isRequired,
    dateSelected: PropTypes.func.isRequired,
    deleteAnswerValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
    if (props.date) {
      const parsedDate = moment(props.date, 'YYYY-MM-DD');
      const tempMonth = parsedDate.format('MMMM');
      const tempDay = parsedDate.format('DD');
      const tempYear = parsedDate.format('YYYY');
      this.state = {
        tempMonth,
        tempDay,
        tempYear
      };
    } else {
      this.state = {
        tempMonth: '',
        tempDay: '',
        tempYear: ''
      };
    }

    this.handleMonthChanged = this.handleMonthChanged.bind(this);
    this.handleYearChanged = this.handleYearChanged.bind(this);
    this.handleDayChanged = this.handleDayChanged.bind(this);
  }
  handleMonthChanged(e) {
    const value = e.target.value;
    this.setState({
      tempMonth: value
    });
    if (this.isValid(this.state.tempYear, value, this.state.tempDay)) {
      // its valid, use props
      const monthNumber = moment().month(value).format('MM');
      // they are complete, send them away
      this.props.dateSelected(
        `${this.state.tempYear}-${monthNumber}-${this.state.tempDay}`
      );
    } else {
      this.props.deleteAnswerValue();
    }
  }
  handleYearChanged(e) {
    // debugger;
    const value = e.target.value.slice(0, 4); // keep it to 4 digits
    this.setState({
      tempYear: value
    });
    if (this.isValid(value, this.state.tempMonth, this.state.tempDay)) {
      // its valid, use props
      const monthNumber = moment().month(this.state.tempMonth).format('MM');
      // they are complete, send them away
      this.props.dateSelected(`${value}-${monthNumber}-${this.state.tempDay}`);
    } else {
      this.props.deleteAnswerValue();
    }
  }
  isValid(year, month, day) {
    return month && day && day.length === 2 && year && year.length === 4;
  }
  handleDayChanged(e) {
    const value = e.target.value.slice(0, 2);
    this.setState({
      tempDay: value
    });
    if (this.isValid(this.state.tempYear, this.state.tempMonth, value)) {
      // its valid, use props
      const monthNumber = moment().month(this.state.tempMonth).format('MM');
      // they are complete, send them away
      this.props.dateSelected(`${this.state.tempYear}-${monthNumber}-${value}`);
    } else {
      this.props.deleteAnswerValue();
    }
  }
  render() {
    const { date } = this.props;
    const { tempMonth, tempDay, tempYear } = this.state;

    let month;
    let day;
    let year;

    if (!date) {
      month = tempMonth;
      day = tempDay;
      year = tempYear;
    } else {
      const parsedDate = moment(date, 'YYYY-MM-DD');
      month = parsedDate.format('MMMM');
      day = parsedDate.format('DD');
      year = parsedDate.format('YYYY');
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-4">
            <div className="form-group">
              <label>Month</label>
              <select
                className="form-control"
                value={month}
                onChange={this.handleMonthChanged}
                disabled={this.props.disabled}
              >
                <option disabled={true} />
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label>Day e.g. 01</label>
              <input
                disabled={this.props.disabled}
                type="number"
                className="form-control"
                placeholder="DD"
                value={day}
                onChange={this.handleDayChanged}
              />
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label>Year e.g. 1984</label>
              <input
                disabled={this.props.disabled}
                type="number"
                className="form-control"
                placeholder="YYYY"
                value={year}
                onChange={this.handleYearChanged}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DatePicker;
