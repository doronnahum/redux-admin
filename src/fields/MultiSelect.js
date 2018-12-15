import React from 'react';
import { Select, Spin, Form } from 'antd';
import {sanitizeFormItemProps, getFieldValueByName} from './util'
import Consumer from './Consumer';
import toStartCase from 'lodash/startCase';
const Option = Select.Option;

class MultiSelect extends React.Component {
  renderLabel(option, optionLabel, optionKey, startCase, renderLabel) {
    if(renderLabel) return renderLabel({option, optionLabel, optionKey, startCase})
    const text = typeof option === 'object' ? (option[optionLabel] || option[optionKey]) : option
    return startCase ? toStartCase(text) : text
  }
  render() {
    const { loading, onSearchValueChanged, data, name, onFocus, startCase, optionKey, optionLabel, labelInValue, parseValuesOnChange, renderLabel } = this.props;
    return (
      <Consumer>
        {(form) => {
          const values = getFieldValueByName(name, form.values)
          const _values = (labelInValue && values) ? values.map(item => item[optionKey]) : values
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, {name}, form)}
            >
              <Select
                onFocus={onFocus}
                showSearch
                mode={'multiple'}
                placeholder="Type here..."
                notFoundContent={loading ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={onSearchValueChanged}
                onChange={(value) => {
                  if(labelInValue) {
                    const newValue = value.map(item => data.find(option => option[optionKey] === item))
                    form.setFieldValue(name, parseValuesOnChange(newValue))
                  }else{
                    form.setFieldValue(name, parseValuesOnChange(value))
                  }
                }}
                onBlur={() => {
                  form.setFieldTouched(name, true)
                }}
                value={_values}
                style={{ width: '100%' }}
              >
                {data && data.map(d => <Option key={d[optionKey]} value={d[optionKey]}>{this.renderLabel(d, optionLabel, optionKey, startCase, renderLabel)}</Option>)}
              </Select>
            </Form.Item>
          )
        }}
      </Consumer>
    )
  }
}
export default MultiSelect;

MultiSelect.defaultProps = {
  data: [],
  optionKey: '_id',
  optionLabel: 'code',
  startCase: true, // When True it will show you label like this 'My Display'
  parseValuesOnChange: values => values // You can pass function that get values and return the values to send to server
}
