import React from 'react';
import { Select, Spin, Form } from 'antd';
import { sanitizeFormItemProps, getFieldValueByName } from './util'
import Consumer from './Consumer';
import toStartCase from 'lodash/startCase';
const Option = Select.Option;

/**
 * @function getDataWithValuesLabels
 * In some case the data not containt the label but the value containt key and label, for example - data ['key1','key2'] value {key: 'key1' label : 'Lorem'}
 * this funtion return [{key: 'key1' label : 'Lorem'},'key2']
 */
const getDataWithValuesLabels = function ({ data, values, optionKey, optionLabel }) {

  const _data = data ? [...data] : []

  let isObjValue = null;
  if (values) {
    values.forEach(item => {
      if (isObjValue === null) {
        isObjValue = (item && typeof item === 'object')
      };
      if (isObjValue && item[optionLabel]) {
        const itemInsideDataIndex = _data.findIndex(o => o[optionKey] === item[optionKey])
        if (itemInsideDataIndex > -1 && !_data[itemInsideDataIndex][optionLabel]) {
          _data[itemInsideDataIndex] = item
        } else {
          if(itemInsideDataIndex === -1)_data.push(item)
        }
      }
    })
  }
  return _data;
}

class MultiSelect extends React.Component {
  renderLabel(option, optionLabel, optionKey, startCase, renderLabel) {
    if (renderLabel) return renderLabel({ option, optionLabel, optionKey, startCase })
    const text = typeof option === 'object' ? (option[optionLabel] || option[optionKey]) : option
    return startCase ? toStartCase(text) : text
  }
  render() {
    const { loading, onSearchValueChanged, data, name, onFocus, startCase, optionKey, optionLabel, labelInValue, parseValuesOnChange, renderLabel, disabled, placeholder } = this.props;
    return (
      <Consumer>
        {(form) => {
          const values = getFieldValueByName(name, form.values)
          const _values = (labelInValue && values) ? values.map(item => item[optionKey]) : values
          const _data = getDataWithValuesLabels({ data, values, optionKey, optionLabel })
          
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, { name }, form)}
            >
              <Select
                disabled={disabled}
                onFocus={onFocus}
                showSearch
                mode={'multiple'}
                placeholder={placeholder}
                notFoundContent={loading ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={onSearchValueChanged}
                onChange={(value) => {
                  if (labelInValue) {
                    const newValue = value.map(item => data.find(option => option[optionKey] === item))
                    form.setFieldValue(name, parseValuesOnChange(newValue))
                  } else {
                    form.setFieldValue(name, parseValuesOnChange(value))
                  }
                }}
                onBlur={() => {
                  form.setFieldTouched(name, true)
                }}
                value={_values}
                style={{ width: '100%' }}
              >
                {_data && _data.map(d => <Option key={d[optionKey]} value={d[optionKey]}>{this.renderLabel(d, optionLabel, optionKey, startCase, renderLabel)}</Option>)}
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
  placeholder: 'Type here...',
  startCase: true, // When True it will show you label like this 'My Display'
  parseValuesOnChange: values => values // You can pass function that get values and return the values to send to server
}
