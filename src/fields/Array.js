import React from 'react';
import { InputNumber, Form, Input, Icon, Button } from 'antd';
import {Field, FieldArray} from 'formik'
import {sanitizeFormItemProps, getFieldValueByName} from './util'
import Consumer from './Consumer'

class MultiSelect extends React.Component {
  render() {
    const { name, label, itemType } = this.props;
    return (
      <Consumer>
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
                    {value && value.map((item, index) => (
                      <Field name={`${name}.${index}`} key={index}>
                        {({field}) => {
                          if(itemType === 'string') {
                            return (
                              <Input {...field}
                                addonAfter={<Icon type="minus" onClick={() => arrayHelpers.remove(index)}/>}
                              />
                            )
                          }else if(itemType === 'number') {
                            return (
                              <div className='ant-input-group ra-fieldsArrayGroupNumber'>
                                <InputNumber
                                  style={{width: '100%'}}
                                  onChange={(value) => {
                                    form.setFieldValue(field.name, value)
                                  }}
                                  onBlur={() => {
                                    form.setFieldTouched(field.name, true)
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
                    ))}
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
export default MultiSelect;

MultiSelect.defaultValue = {
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
