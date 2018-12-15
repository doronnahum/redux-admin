import React, { Component } from 'react';
import { TimePicker, Form } from 'antd';
import Consumer from './Consumer';
import {sanitizeFormItemProps, sanitizeAntdTimePickerInputProps, getFieldValueByName} from './util'
import {antdFormItem, formikField, antdTimePicker} from './propTypes';
import moment from 'moment';

const flex = {display: 'flex'}
class DatePickerInput extends Component {
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
              <TimePicker
                {...sanitizeAntdTimePickerInputProps(this.props)}
                value={value ? moment(value) : null}
                onChange={value => {
                  setFieldValue(name, value ? value._d.toISOString() : null)
                }}
                onBlur={() => {
                  form.setFieldTouched(name, true)
                }}
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
  ...antdTimePicker
};

DatePickerInput.defaultProps = {
  showTime: true
}

export default DatePickerInput;
