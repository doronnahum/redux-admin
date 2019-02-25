import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import {Button, Modal} from 'antd';
import {Input, Select} from '../fields'
import {guid} from '../util'
import isEqual from 'lodash/isEqual'
import * as Yup from 'yup';
import {
  equal, // $eq
  greaterThan, // $st
  greaterThanOrEqual, //$gte
  matchInArray, // $in
  noneInArray, // $nin
  allInArray, // $ne
  lessThan, // $lt
  lessThanOrEqual, // $lte
  notEquals, // $ne
  before, // $lt
  after, // $gt
  stringEqual, // $eq
  stringNotEquals, // $ne
  dateEqual
} from './operations'

import {
  or, nor, not, and
} from './logicalOptions'

export const allLogical = {
  or, nor, not, and
}

const schema = Yup.object().shape({
  activeFilters: Yup.array()
    .of(
      Yup.object().shape({
        key: Yup.string().nullable()
          .required('Required'),
        // these constraints take precedence
        operator: Yup.string().nullable()
          .required('Required'),
        // these constraints take precedence
      })
    )
});

const getFieldConfig = function(name, fields) {
  return fields.find(item => item.key === name)
}

const renderFieldByOperatorType = function(name, operator = '$eq', fieldName, fields, advanceMode) {
  const operatorConfig = allOperators[operator]

  if(!operatorConfig) {
    console.log('redux-admin Filters - missing operatorConfig', operator)
    return <Input name={name} />
  }
  const renderInput = operatorConfig.renderInputComponent
  const fieldData = null // operatorConfig.type === String ? getFieldsData(fieldName, fields) : null;
  const fieldConfig = getFieldConfig(fieldName, fields)
  const fieldOption = fieldConfig.options
  return renderInput ? renderInput(name, fieldData, advanceMode, fieldOption) : <Input name={name} />
}
export const allOperators = {
  equal, // $eq
  greaterThan, // $st
  greaterThanOrEqual, //$gte
  matchInArray, // $in
  noneInArray, // $nin
  allInArray, // $ne
  lessThan, // $lt
  lessThanOrEqual, // $lte
  notEquals, // $ne
  before, // $lt
  after, // $gt
  stringEqual, // $eq
  stringNotEquals, // $ne
  dateEqual // $eq
}
const getDefaultOperator = function(type) {
  switch (type) {
    case String:
    case 'string':
      return stringEqual
    case Date:
    case 'date':
      return dateEqual
    case Number:
    case 'number':
      return equal
    default:
      return stringEqual
  }
}

const getNewLogical = function() {
  let id = guid();
  return {key: id, value: 'and', operator: 'logical', id: id, type: 'logical'}
}
export default class FilterOptions extends React.Component {
  getNewRow = () => {
    const {advanceMode} = this.props
    if(advanceMode) {
      return {key: null, operator: null, value: null, id: guid(), type: 'comparison', active: true, advanceMode}
    }else{
      return {key: null, operator: equal.value, value: null, id: guid(), type: 'comparison', active: true, advanceMode}
    }
  }

  onClose = (oldActiveFilters, values) => {
    const newActiveFilters = values.activeFilters
    const _this = this;
    if(isEqual(oldActiveFilters, newActiveFilters)) {
      this.props.hideAdvanceOptions()
    }else {
      Modal.confirm({
        title: 'Are you sure you want to cancel your choices?',
        onOk() {
          _this.props.hideAdvanceOptions()
        },
      });
    }
  }

  getOperators(filedKey, fields) {
    if(!fields || !filedKey) return [];
    const filedType = fields.find(item => item.key === filedKey).type
    switch (filedType) {
      case String:
      case 'string':
        return [stringEqual, stringNotEquals]
      case Number:
      case 'number':
        return [equal, notEquals, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual]
      case Date:
      case 'date':
        return [before, after]
      case Array:
      case 'array':
        return [allInArray, noneInArray, matchInArray]
      default:
        return []
    }
  }
  getLogical(filedKey, fields) {
    return [or, nor, not, and]
  }
  addNewRow(arrayHelpers) {
    arrayHelpers.push(this.getNewRow())
  }
  getValidFields = () => {
    return this.props.fields.filter(item => {
      return item.type
    })
  }
  render() {
    const {initialValues, onSave, fields, advanceMode} = this.props
    const _initialValues = (initialValues && initialValues.length) ? [...initialValues] : null
    if(advanceMode && _initialValues && _initialValues[0] && !_initialValues[0].advanceMode) {
      _initialValues[0].advanceMode = true // This will convert an simple filter to advanceMode filter
    }
    const initValues = _initialValues || [this.getNewRow()];
    return (
      <Formik
        initialValues={{activeFilters: initValues}}
        validationSchema={advanceMode ? schema : null}
        onSubmit={onSave}
        render={({ values, isValid, setFieldValue, setValues }) => {
          return (
            <Form className={'ant-form ant-form-inline'}>
              <FieldArray
                name="activeFilters"
                render={arrayHelpers => (
                  <div className='ra-filtersOptions'>
                    {values.activeFilters && values.activeFilters.length > 0 ? (
                      values.activeFilters.map((filter, index) => {
                        if(filter.type === 'logical') {
                          return (
                            <div key={index} className='ra-filtersOptionsRow'>
                              <Button ghost className='ra-removeFilterRow' icon="close" size={'small'} onClick={() => arrayHelpers.remove(index)}/>
                              <Select
                                showSearch
                                data={this.getLogical(filter.key, fields)}
                                optionLabel={'label'}
                                optionKey={'value'}
                                name={`activeFilters[${index}]value`}
                                style={{width: 130}}
                              />
                            </div>
                          )
                        }
                        return (
                          <div key={index} className='ra-filtersOptionsRow'>
                            {advanceMode && <Button ghost className='ra-removeFilterRow' icon="close" size={'small'} onClick={() => arrayHelpers.remove(index)}/>}
                            <Select
                              showSearch
                              data={this.getValidFields()}
                              optionLabel={'label'}
                              optionKey={'key'}
                              name={`activeFilters[${index}]key`}
                              className={advanceMode ? '' : 'ra-hideSelectBorder'}
                              style={{width: 165}}
                              placeholder='Filter by'
                              onValuesChanged={(v, newValue) => {
                                const fieldsType = fields.find(item => item.key === newValue).type
                                const newValues = {...values}
                                newValues.activeFilters[index].key = newValue
                                newValues.activeFilters[index].operator = getDefaultOperator(fieldsType).value
                                newValues.activeFilters[index].value = null
                                setValues(newValues)
                              }}
                            />
                            {advanceMode && <Select
                              showSearch
                              data={this.getOperators(filter.key, fields)}
                              optionLabel={'label'}
                              optionKey={'value'}
                              name={`activeFilters[${index}]operator`}
                              placeholder={'Select operator'}
                              style={{width: 165}}
                              disabled={!filter.key}
                              onValuesChanged={(v, newValue) => {
                                if(newValue !== filter.operator) {
                                  setFieldValue(`activeFilters[${index}]value`, null)
                                }
                              }}
                            />
                            }
                            {(advanceMode || filter.key) && renderFieldByOperatorType(`activeFilters[${index}]value`, filter.operator, filter.key, fields, advanceMode)}
                            {advanceMode && ((index + 1) === values.activeFilters.length) && <Button className='ra-filtersOptionsAddRow' type="primary" shape="circle" icon="plus" size={'small'} onClick={() => this.addNewRow(arrayHelpers)}/>}
                            {(!advanceMode && filter.key) && <Button className='ra-simpleSearchBtn' ghost htmlType={'submit'} icon="check" size={'small'} />}
                            {(!advanceMode && filter.key) && <Button className='ra-simpleSearchBtn' ghost onClick={() => {
                              const values = {activeFilters: [this.getNewRow()]}
                              setValues(values)
                              onSave(values)
                            }} icon="close" size={'small'} />}
                          </div>
                        )
                      }
                      )
                    ) : (
                      <Button type="primary" size={'small'} onClick={() => this.addNewRow(arrayHelpers)}>Add Filter</Button>
                    )}
                    {advanceMode && <div className='ra-filtersOptionsFooter'>
                      <Button type="danger" ghost onClick={() => this.onClose(initValues, values)} className='ra-mr15'>Cancel</Button>
                      <Button ghost type="primary" htmlType={'submit'} disabled={!isValid}>Apply</Button>
                    </div>
                    }
                  </div>
                )}
              />
            </Form>
          )
        }}
      />
    )
  }
}
FilterOptions.defaultProps = {
  fields: []//[{value: 'title', label: 'Title'}, {value: 'age', label: 'Age'}]
};
