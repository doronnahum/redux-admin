import React, { Component } from 'react';
import { Input, Form } from 'antd';
import {Field} from 'formik'
import {sanitizeFormItemProps, sanitizeFormikFieldProps, sanitizeAntdTextInputProps} from './util'
import {antdFormItem, antdTextInput, formikField} from './propTypes';
import PropTypes from 'prop-types';

class TextAreaInput extends Component {
  render() {
    return (
      <Field {...sanitizeFormikFieldProps(this.props)} >
        {({ field, form }) => {
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
            >
              <Input.TextArea {...field} {...sanitizeAntdTextInputProps(this.props)} autosize={this.props.autosize}/>
            </Form.Item>
          )
        }}
      </Field>
    )
  }
}

TextAreaInput.propTypes = {
  ...antdFormItem,
  ...antdTextInput,
  ...formikField,
  autosize: PropTypes.string
};

export default TextAreaInput;
