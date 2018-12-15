import React, { Component } from 'react';
import { DatePicker, Form } from 'antd';
import Consumer from './Consumer';
import {sanitizeFormItemProps, sanitizeAntdDatePickerInputProps, getFieldValueByName} from './util'
import {antdFormItem, formikField, antdDatePicker} from './propTypes';
import moment from 'moment';

const flex = {display: 'flex'}
class DatePickerInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: this.props.mode || 'date'
    }
  }

    handleOpenChange = (open) => {
      if (open) {
        this.setState({ mode: 'time' });
      }
    }

    handlePanelChange = (value, mode) => {
      this.setState({ mode });
    }
    render() {
      const { name } = this.props;
      return (
        <Consumer>
          {(form) => {
            const { setFieldValue, values } = form
            const value = getFieldValueByName(name, values)
            return (
              <Form.Item
                style={flex}
                {...sanitizeFormItemProps(this.props, {name}, form)}
              >
                <DatePicker
                  {...sanitizeAntdDatePickerInputProps(this.props)}
                  value={value ? moment(value) : null}
                  onChange={value => {
                    setFieldValue(name, value ? value._d.toISOString() : null)
                  }}
                  onBlur={() => {
                    form.setFieldTouched(name, true)
                  }}
                  mode={this.state.mode}
                />
              </Form.Item>
            )
          }}
        </Consumer>
      )
    }
}

DatePickerInput.propTypes = {
  ...antdFormItem,
  ...formikField,
  ...antdDatePicker
};

DatePickerInput.defaultProps = {
  showTime: true
}

export default DatePickerInput;
