import React, { Component } from 'react';
import { Input, Form } from 'antd';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import { sanitizeFormItemProps, sanitizeFormikFieldProps, sanitizeAntdTextInputProps } from './util';
import { antdFormItem, antdTextInput, formikField } from './propTypes';

class TextAreaInput extends Component {
  render() {
    return (
      <Field {...sanitizeFormikFieldProps(this.props)}>
        {({ field, form }) => (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
            >
              <Input.TextArea {...field} {...sanitizeAntdTextInputProps(this.props)} autosize={this.props.autosize} />
            </Form.Item>
          )}
      </Field>
    );
  }
}

TextAreaInput.propTypes = {
  ...antdFormItem,
  ...antdTextInput,
  ...formikField,
  autosize: PropTypes.string,
};

export default TextAreaInput;
