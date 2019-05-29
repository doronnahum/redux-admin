import React from 'react';
import { Checkbox, Icon, Form } from 'antd';
import { Field } from 'formik';
import { sanitizeFormItemProps, sanitizeFormikFieldProps } from './util';
import toStartCase from 'lodash/startCase';

class BoxSelect extends React.Component {
  renderLabel(option, optionLabel, optionKey, startCase, renderLabel) {
    if (renderLabel) {
      return renderLabel({ option, optionLabel, optionKey, startCase });
    }
    const text =
      typeof option === 'object'
        ? option[optionLabel] || option[optionKey]
        : option;
    return startCase ? toStartCase(text) : text;
  }
  render() {
    const {
      loading,
      onSearchValueChanged,
      data,
      mode,
      onFocus,
      startCase,
      optionKey,
      optionLabel,
      showSearch,
      parseValuesOnChange,
      labelInValue,
      style,
      disabled,
      onValuesChanged,
      renderLabel,
      placeholder,
      classNames
    } = this.props;
    return (
      <Field {...sanitizeFormikFieldProps(this.props)}>
        {({ field, form }) => {
          const value =
            field.value && field.value[0] && typeof field.value[0] === 'object'
              ? field.value.map(item => item[optionKey])
              : field.value;
           const setNewValue = (values) => {
                  if(labelInValue) {
                    const newValue = values.map(itemValue => data.find(item => item[optionKey] === itemValue))
                    let valueToSet = parseValuesOnChange(newValue);
                    if(typeof values === 'undefined') {
                      valueToSet = null;
                    }
                    form.setFieldValue(field.name, valueToSet)
                    if(onValuesChanged) onValuesChanged(form.values, newValue, form.setFieldValue, form)
                  }else{
                    let valueToSet = parseValuesOnChange(values);
                    if(typeof values === 'undefined') {
                      valueToSet = null;
                    }
                    form.setFieldValue(field.name, valueToSet)
                    if(onValuesChanged) onValuesChanged(form.values, values, form.setFieldValue, form)
                  }
                }
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
              className={classNames}
            >
              <Checkbox.Group
                style={{ width: '100%' }}
                value={value}
                onChange={setNewValue}
              >
                <div className="ra-checkboxWithIconRow">
                  {data &&
                    data.map((d, index) => {
                      const val = d ? d[optionKey] || d : d;
                      return (
                        <div
                            className="ra-checkboxWithIcon"
                            key={d[optionKey] || index}
                            onClick={() => {
                                const isActive = value && value.includes(val)
                                const newValue = isActive ? value.filter(item => item !== val) : (value ? [...value, val] : [val]);
                                setNewValue(newValue)
                            }}
                        >
                          <Checkbox value={val}>
                            <div className='ra-checkboxWithIconContent'>
                            {!!(d && d.icon) && <Icon type={d.icon}/>}
                            <p>{this.renderLabel(
                              d,
                              optionLabel,
                              optionKey,
                              startCase,
                              renderLabel
                            ).toString()}</p>
                            </div>
                          </Checkbox>
                        </div>
                      )
 })}
                </div>
              </Checkbox.Group>
            </Form.Item>
          );
        }}
      </Field>
    );
  }
}
export default BoxSelect;

BoxSelect.defaultProps = {
  style: { width: 200 },
  data: [],
  optionKey: '_id',
  optionLabel: 'code',
  startCase: true, // When True it will show you label like this 'My Display'
  showSearch: true,
  placeholder: 'Type here...',
  parseValuesOnChange: values => values // You can pass function that get values and return the values to send to server
  // onValuesChanged: (values,value, setFieldValue, form) => {} // Use if you want to change other field in each change
};
