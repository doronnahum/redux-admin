import React, { Component } from 'react';
import { Input, Form } from 'antd';
import {Field} from 'formik'
import {sanitizeFormItemProps, sanitizeFormikFieldProps, sanitizeAntdTextInputProps} from './util'
import {antdFormItem, antdTextInput, formikField} from './propTypes';

class TextInput extends Component {
  render() {
    return (
      <Field {...sanitizeFormikFieldProps(this.props)} >
        {({ field, form }) => {
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
            >
              <Input {...field} {...sanitizeAntdTextInputProps(this.props)}/>
            </Form.Item>
          )
        }}
      </Field>
    )
  }
}

TextInput.propTypes = {
  ...antdFormItem,
  ...antdTextInput,
  ...formikField
};

export default TextInput;
