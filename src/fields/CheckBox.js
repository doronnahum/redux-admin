import React, { Component } from 'react';
import { Switch, Form, Icon } from 'antd';
import Consumer from './Consumer';
import {sanitizeFormItemProps, getFieldValueByName} from './util'
import {antdFormItem, formikField} from './propTypes';

const flex = {display: 'flex'}
class CheckboxInput extends Component {
  render() {
    const { name, disabled } = this.props;
    return (
      <Consumer>
        {(form) => {
          const { setFieldValue, values } = form
          const value = getFieldValueByName(name, values)
          return (
            <Form.Item
              style={flex}
              {...sanitizeFormItemProps(this.props, {name}, form)}
              label={disabled ? <span>{this.props.label}  {value ? <Icon type="check" /> : <Icon type="close" />}</span> : this.props.label}
            >
              {disabled
                ? null
                : <Switch
                  checked={value}
                  onChange={() => { setFieldValue(name, !value) }}
                  disabled={disabled}
                  checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />}
                />
              }
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
