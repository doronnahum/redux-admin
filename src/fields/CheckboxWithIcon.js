import React from 'react';
import { Radio, Icon, Form } from 'antd';
import { Field } from 'formik';
import toStartCase from 'lodash/startCase';
import { sanitizeFormItemProps, sanitizeFormikFieldProps } from './util';

class CheckboxWithIcon extends React.Component {
  renderLabel(option, optionLabel, optionKey, startCase, renderLabel) {
    const text = typeof option === 'object'
      ? option[optionLabel] || option[optionKey]
      : option;
    const label = startCase ? toStartCase(text) : text;
    if (renderLabel) {
      return renderLabel({ label, option, optionLabel, optionKey, startCase });
    }
    return label ? label.toString() : '';;
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
      classNames,
    } = this.props;
    return (
      <Field {...sanitizeFormikFieldProps(this.props)}>
        {({ field, form }) => {
          const value = field.value && typeof field.value === 'object'
            ? field.value[optionKey]
            : field.value;
          const setNewValue = (e) => {
            const { value } = e.target;
            if (labelInValue) {
              const newValue = data.find((item) => item[optionKey] === value);
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
          };
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
              className={classNames}
            >
              <Radio.Group
                style={{ width: '100%' }}
                value={value}
                onChange={setNewValue}
              >
                <div className="ra-checkboxWithIconRow">
                  {data
                    && data.map((d, index) => {
                      const val = d ? d[optionKey] || d : d;
                      return (
                        <div
                          className="ra-checkboxWithIcon"
                          key={d[optionKey] || index}
                          onClick={() => setNewValue({ target: { value: val } })}
                        >
                          <Radio value={val}>
                            <div className="ra-checkboxWithIconContent">
                              {!!(d && d.icon) && <Icon type={d.icon} />}
                              <p>{this.renderLabel(
                                d,
                                optionLabel,
                                optionKey,
                                startCase,
                                renderLabel,
                              )}
                              </p>
                            </div>
                          </Radio>
                        </div>
                      );
                    })}
                </div>
              </Radio.Group>
            </Form.Item>
          );
        }}
      </Field>
    );
  }
}
export default CheckboxWithIcon;

CheckboxWithIcon.defaultProps = {
  style: { width: 200 },
  data: [],
  optionKey: '_id',
  optionLabel: 'code',
  startCase: true, // When True it will show you label like this 'My Display'
  showSearch: true,
  placeholder: 'Type here...',
  parseValuesOnChange: (values) => values, // You can pass function that get values and return the values to send to server
  // onValuesChanged: (values,value, setFieldValue, form) => {} // Use if you want to change other field in each change
};
