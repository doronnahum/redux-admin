import React from 'react';
import { Select, Spin, Form } from 'antd';
import { Field } from 'formik';
import toStartCase from 'lodash/startCase';
import { sanitizeFormItemProps, sanitizeFormikFieldProps } from './util';

const { Option } = Select;

class SelectInput extends React.Component {
  renderLabel(option, optionLabel, optionKey, startCase, renderLabel) {
    if (renderLabel) return renderLabel({ option, optionLabel, optionKey, startCase });
    const text = typeof option === 'object' ? (option[optionLabel] || option[optionKey]) : option;
    return startCase ? toStartCase(text) : text;
  }

  render() {
    const { loading, onSearchValueChanged, data, mode, onFocus, startCase, optionKey, optionLabel, showSearch, parseValuesOnChange, labelInValue, style, disabled, onValuesChanged, renderLabel, placeholder, classNames, allowClear } = this.props;
    return (
      <Field {...sanitizeFormikFieldProps(this.props)}>
        {({ field, form }) => {
          const value = (field.value && typeof field.value === 'object') ? field.value[optionKey] : field.value;
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
              className={classNames}
            >
              <Select
                disabled={disabled}
                onFocus={onFocus}
                showSearch={showSearch}
                mode={mode}
                placeholder={placeholder}
                notFoundContent={loading ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={onSearchValueChanged}
                allowClear={allowClear}
                onChange={(value) => {
                  if (labelInValue) {
                    const newValue = data.find((option) => option[optionKey] === value);
                    let valueToSet = parseValuesOnChange(newValue);
                    if (typeof value === 'undefined') {
                      valueToSet = null;
                    }
                    form.setFieldValue(field.name, valueToSet);
                    if (onValuesChanged) onValuesChanged(form.values, newValue, form.setFieldValue, form);
                  } else {
                    let valueToSet = parseValuesOnChange(value);
                    if (typeof value === 'undefined') {
                      valueToSet = null;
                    }
                    form.setFieldValue(field.name, valueToSet);
                    if (onValuesChanged) onValuesChanged(form.values, value, form.setFieldValue, form);
                  }
                }}
                onBlur={() => {
                  form.setFieldTouched(field.name, true);
                }}
                value={value || undefined}
                style={style}
              >
                {data && data.map((d, index) => <Option key={d[optionKey] || index}>{this.renderLabel(d, optionLabel, optionKey, startCase, renderLabel).toString()}</Option>)}
              </Select>
            </Form.Item>
          );
        }}
      </Field>
    );
  }
}
export default SelectInput;

SelectInput.defaultProps = {
  style: { width: 200 },
  data: [],
  optionKey: '_id',
  optionLabel: 'code',
  startCase: true, // When True it will show you label like this 'My Display'
  showSearch: true,
  placeholder: 'Type here...',
  allowClear: true,
  parseValuesOnChange: (values) => values, // You can pass function that get values and return the values to send to server
  // onValuesChanged: (values,value, setFieldValue, form) => {} // Use if you want to change other field in each change

};
