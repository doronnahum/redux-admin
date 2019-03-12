import React from 'react';
import { InputNumber, Form, Input, Icon, Button } from 'antd';
import {Field, FieldArray} from 'formik'
import {sanitizeFormItemProps, getFieldValueByName} from './util'
import Consumer from './Consumer'

class ArrayInput extends React.Component {
  renderField({index, name, itemType, objectKey, showRemoveBtn = true, arrayHelpers, form, label}) {
    const _objectKey = objectKey ? `.${objectKey}` : ''
    const fieldName = `ra-docField-${name}.${index}${_objectKey}`
    return (
      <Field name={fieldName} key={fieldName} className={fieldName}>
        {({field}) => {
          if(itemType === 'string' || itemType === String) {
            return (
              <Input {...field}
                placeholder={label}
                addonAfter={showRemoveBtn ? <Icon type="minus" onClick={() => arrayHelpers.remove(index)}/> : null}
              />
            )
          }else if(itemType === 'number' || itemType === Number) {
            return (
              <div className='ant-input-group ra-fieldsArrayGroupNumber'>
                <InputNumber
                  style={{width: '100%'}}
                  onChange={(value) => {
                    form.setFieldValue(fieldName, value)
                  }}
                  onBlur={() => {
                    form.setFieldTouched(fieldName, true)
                  }}
                  value={field.value}
                />
                <div className='ant-input-group-addon'>
                  <Icon type="minus" onClick={() => arrayHelpers.remove(index)}/>
                </div>
              </div>
            )
          }
        }}
      </Field>
    )
  }
  render() {
    const { name, label, itemType, objectStructure } = this.props;
    if(itemType === 'object' && !objectStructure) {
      return 'redux-admin ArrayInput, missing props.objectStructure: [{key, type, label}]'
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
                        return <div className='ra-fieldsArrayObjectRow'>
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
                                label: label || key
                              })
                            })
                          }
                        </div>
                      }
                      return this.renderField({
                        index,
                        name,
                        itemType,
                        objectKey: null,
                        showRemoveBtn: true,
                        arrayHelpers,
                        form
                      })
                    })}
                    <Button onClick={() => arrayHelpers.push(null)} >  Add {label} </Button>
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
