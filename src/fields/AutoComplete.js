import React from 'react';
import { AutoComplete, Spin, Form } from 'antd';
import {Field} from 'formik'
import {sanitizeFormItemProps, sanitizeFormikFieldProps} from './util'
import toStartCase from 'lodash/startCase';

class SelectInput extends React.Component {
  render() {
    const { loading, onSearchValueChanged, data, mode, onFocus, startCase, optionKey, optionLabel, showSearch, parseValuesOnChange, labelInValue, style, disabled, onValuesChanged } = this.props;
    return (
      <Field {...sanitizeFormikFieldProps(this.props)}>
        {({ field, form }) => {
          const value = field.value
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
            >
              <AutoComplete
                dataSource={data}
                disabled={disabled}
                onFocus={onFocus}
                placeholder="Type here..."
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                onSearch={onSearchValueChanged}
                onChange={(value) => {
                  if(labelInValue) {
                    const newValue = data.find(option => option[optionKey] === value)
                    const valueToSet = parseValuesOnChange(newValue);
                    form.setFieldValue(field.name, valueToSet)
                    if(onValuesChanged) onValuesChanged(form.values, newValue, form.setFieldValue, form)
                  }else{
                    const valueToSet = parseValuesOnChange(value);
                    form.setFieldValue(field.name, valueToSet)
                    if(onValuesChanged) onValuesChanged(form.values, value, form.setFieldValue, form)
                  }
                }}
                onBlur={() => {
                  form.setFieldTouched(field.name, true)
                }}
                value={value}
                style={style}
              />
            </Form.Item>
          )
        }}
      </Field>
    )
  }
}
export default SelectInput;

SelectInput.defaultProps = {
  style: {width: 200},
  data: [],
  startCase: true, // When True it will show you label like this 'My Display'
  showSearch: true,
  parseValuesOnChange: values => values, // You can pass function that get values and return the values to send to server
  // onValuesChanged: (values,value, setFieldValue, form) => {} // Use if you want to change other field in each change

}
