import React, { Component } from 'react';
import { InputNumber, Form } from 'antd';
import { Field } from 'formik';
import { sanitizeFormItemProps, sanitizeFormikFieldProps } from './util';
import { antdFormItem, antdNumberInput, formikField } from './propTypes';

class InputNumberField extends Component {
  render() {
    return (
      <Field {...sanitizeFormikFieldProps(this.props)}>
        {({ field, form }) => {
          const defaultValue = Number(field.value);
          const isValidNumber = !isNaN(defaultValue);
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
            >
              <InputNumber
                // {...sanitizeAntdNumberInputProps(this.props)}
                onChange={(value) => {
                  const newValue = Number(value);
                  if (!isNaN(newValue)) {
                    form.setFieldValue(field.name, newValue);
                  }
                }}
                onBlur={() => {
                  form.setFieldTouched(field.name, true);
                }}
                defaultValue={isValidNumber ? defaultValue : null}
              />
            </Form.Item>
          );
        }}
      </Field>
    );
  }
}

InputNumberField.propTypes = {
  ...antdFormItem,
  ...antdNumberInput,
  ...formikField,
};
InputNumberField.defaultProps = {
  style: { width: '100%' },
};

export default InputNumberField;
