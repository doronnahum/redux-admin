import React from 'react';
import { InputNumber, Form, Input, Icon, Button, DatePicker } from 'antd';
import {Field, FieldArray} from 'formik'
import {sanitizeFormItemProps, getFieldValueByName} from './util'
import Consumer from './Consumer'
import getDocField from '../helpers/getDocField';

class ArrayInput extends React.Component {
  renderField({index, name, itemType, objectKey, showRemoveBtn = true, arrayHelpers, form, label, disabled}) {
    const _objectKey = objectKey ? `.${objectKey}` : ''
    const fieldName = `${name}.${index}${_objectKey}`
    const defaultLabel = `${index + 1} - ${_objectKey ? `${_objectKey} -` : ''} ${name} `
    return (
      <Field name={fieldName} key={fieldName} className={'ra-docField-' + fieldName}>
        {({field}) => {
          return (
            <React.Fragment>
              {getDocField({
                key: fieldName,
                type: itemType,
                label: label || defaultLabel,
                disabled
              })}
              {(showRemoveBtn && !disabled) && <Icon className='ra-fieldsArrayObjectRow_remove' type="close" onClick={() => arrayHelpers.remove(index)}/>
              }
            </React.Fragment>
          )
        }}
      </Field>
    )
  }
  render() {
    const { name, label, itemType, objectStructure, helpText, disabled } = this.props;
    if(itemType === 'object' && !objectStructure) {
      // eslint-disable-next-line quotes
      return "redux-admin ArrayInput, missing props.objectStructure: [{key: 'date', type: 'date', label: 'Date'}, {key: 'text', type: 'string', label: 'Text'}]"
    }
    return (
      <Consumer >
        {(form) => {
          const {values} = form
          const value = getFieldValueByName(name, values)
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, {name}, form)}
            >
              <FieldArray
                name={name}
                render={arrayHelpers => (
                  <div>
                    {value && value.map((item, index) => {
                      if(itemType === 'object') {
                        return <div className='ra-fieldsArrayObjectRow' key={index}>
                          {
                            objectStructure.map(({key, type, label}, i) => {
                              const showRemoveBtn = i === (objectStructure.length - 1);
                              return this.renderField({
                                index,
                                name,
                                itemType: type,
                                objectKey: key,
                                showRemoveBtn,
                                arrayHelpers,
                                form,
                                label: label || key,
                                disabled
                              })
                            })
                          }
                        </div>
                      }
                      return (
                        <div key={index} className='ra-fieldsArrayRow'>
                          {this.renderField({
                            index,
                            name,
                            itemType,
                            objectKey: null,
                            showRemoveBtn: true,
                            arrayHelpers,
                            form,
                            disabled
                          })
                          }
                        </div>
                      )
                    })}
                    {disabled && (!value || !value.length) && <Input disabled/>}
                    {(helpText && helpText.length > 0 && value && value.length > 0) && <p className='ra-helpText-underField'>{helpText}</p>}
                    {(!disabled) && <Button onClick={() => arrayHelpers.push(null)} >{(!value || value.length < 1) ? `Add - ${label}` : '+'} </Button>}
                  </div>
                )}
              />
            </Form.Item>
          )
        }}
      </Consumer>
    )
  }
}
export default ArrayInput;

ArrayInput.defaultValue = {
  numberInputStyle: {width: '100%'}
}

/*
              <Select
                onFocus={onFocus}
                showSearch
                mode={'multiple'}
                placeholder="Type here..."
                notFoundContent={loading ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={onSearchValueChanged}
                onChange={(value) => {
                  form.setFieldValue(name, value)
                }}
                onBlur={() => {
                  form.setFieldTouched(name, true)
                }}
                value={form.values[name]}
                style={{ width: '100%' }}
              >
                {data && data.map(d => <Option key={d._id}>{d.code}</Option>)}
              </Select>
*/
