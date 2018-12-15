import React, { Component } from 'react';
import { Checkbox, Form } from 'antd';
import Consumer from './Consumer';
import {sanitizeFormItemProps, getFieldValueByName} from './util'
import {antdFormItem, formikField} from './propTypes';

const flex = {display: 'flex'}
class CheckboxInput extends Component {
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
              <Checkbox
                checked={value}
                onChange={() => { setFieldValue(name, !value) }}
              />
            </Form.Item>
          )
        }}
      </Consumer>
    )
  }
}

CheckboxInput.propTypes = {
  ...antdFormItem,
  ...formikField,
};

export default CheckboxInput;
