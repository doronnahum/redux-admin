import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import {Button, Modal} from 'antd';
import {Input, InputNumber, Select, DatePicker, AutoComplete} from '../fields'
import {guid} from '../util'
import isEqual from 'lodash/isEqual'
import * as Yup from 'yup';
import moment from 'moment'

const TYPE_VALUE = 'type...'
// logical
const or = {
  value: 'or',
  mongooseCode: '$or',
  label: 'Or',
  info: 'Joins query clauses with a logical OR returns all documents that match the conditions of either clause.'
}
const nor = {
  value: 'nor',
  mongooseCode: '$nor',
  label: 'Not match',
  info: 'Joins query clauses with a logical NOR returns all documents that fail to match both clauses.'
}
const not = {
  value: 'not',
  mongooseCode: '$not',
  label: 'Not',
  info: 'Inverts the effect of a query expression and returns documents that do not match the query expression.'
}
const and = {
  value: 'and',
  mongooseCode: '$and',
  label: 'And',
  info: 'Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.'
}

export const allLogical = {
  or, nor, not, and
}

const equal = {
  renderInputComponent: (name, fieldData, advanceMode) => <InputNumber name={name} placeholder={TYPE_VALUE} />,
  value: 'equal',
  mongooseCode: '$eq',
  label: 'Equal to',
  info: 'Matches values that are equal to a specified value.',
  type: Number
}
const notEquals = {
  renderInputComponent: (name, fieldData, advanceMode) => (<InputNumber name={name} placeholder={TYPE_VALUE} />),
  value: 'notEquals',
  mongooseCode: '$ne',
  label: 'Not equal to',
  info: 'Matches all values that are not equal to a specified value.',
  type: Number
}

const stringEqual = {
  renderInputComponent: (name, fieldData, advanceMode) => {
    if(fieldData) return <AutoComplete data={fieldData} name={name} placeholder={TYPE_VALUE}/>
    return <Input name={name} placeholder={TYPE_VALUE} />
  },
  value: 'stringEqual',
  mongooseCode: '$eq',
  label: 'Equal to',
  info: 'Matches values that are equal to a specified value.',
  type: String
}
const stringNotEquals = {
  renderInputComponent: (name, fieldData, advanceMode) => {
    if(fieldData) return <AutoComplete data={fieldData} name={name} placeholder={TYPE_VALUE}/>
    return <Input name={name} placeholder={TYPE_VALUE} />
  },
  value: 'stringNotEquals',
  mongooseCode: '$ne',
  label: 'Not equal to',
  info: 'Matches all values that are not equal to a specified value.',
  type: String
}

const greaterThan = {
  renderInputComponent: (name, fieldData, advanceMode) => (<InputNumber name={name} placeholder={TYPE_VALUE} />),
  value: 'greaterThan',
  mongooseCode: '$gt',
  label: 'Greater Than',
  info: 'Matches values that are greater than a specified value.',
  type: Number
}
const greaterThanOrEqual = {
  renderInputComponent: (name, fieldData, advanceMode) => (<InputNumber name={name} placeholder={TYPE_VALUE} />),
  value: 'greaterThanOrEqual',
  mongooseCode: '$gte',
  label: 'Greater Than or Equal To',
  info: 'Matches values that are greater than or equal to a specified value.',
  type: Number
}

const lessThan = {
  renderInputComponent: (name, fieldData, advanceMode) => (<InputNumber name={name} placeholder={TYPE_VALUE} />),
  value: 'lessThan',
  mongooseCode: '$lt',
  label: 'Matches values that are less than a specified value.',
  type: Number
}
const lessThanOrEqual = {
  renderInputComponent: (name, fieldData, advanceMode) => (<InputNumber name={name} placeholder={TYPE_VALUE} />),
  value: 'lessThanOrEqual',
  mongooseCode: '$lte',
  label: 'Less Than or Equal To',
  info: 'Matches values that are less than or equal to a specified value.',
  type: Number
}

const matchInArray = {
  renderInputComponent: (name, fieldData, advanceMode) => (<Input name={name} placeholder={TYPE_VALUE} />),
  value: 'matchInArray',
  mongooseCode: '$in',
  label: 'Matches any in an array.',
  info: 'Matches any of the values specified in an array.',
  type: String
}
const noneInArray = {
  renderInputComponent: (name, fieldData, advanceMode) => (<Input name={name} placeholder={TYPE_VALUE} />),
  value: 'noneInArray',
  mongooseCode: '$nin',
  label: 'Matches any in an array.',
  info: 'Matches none of the values specified in an array.',
  type: String
}

const dateEqual = {
  renderInputComponent: (name, fieldData, advanceMode) => (<DatePicker showTime={false} name={name} placeholder={TYPE_VALUE} />),
  value: 'dateEqual',
  mongooseCode: '$eq',
  label: 'Equal to specific date.',
  info: 'Find by date field after specific date.',
  formatter: (value) => value && moment(value).format('MMMM Do YYYY, h:mm:ss a'),
  type: Date
}
const after = {
  renderInputComponent: (name, fieldData, advanceMode) => (<DatePicker showTime={false} name={name} placeholder={TYPE_VALUE} />),
  value: 'after',
  mongooseCode: '$gt',
  label: 'After specific date.',
  info: 'Find by date field after specific date.',
  formatter: (value) => value && moment(value).format('MMMM Do YYYY, h:mm:ss a'),
  type: Date
}
const before = {
  renderInputComponent: (name, fieldData, advanceMode) => (<DatePicker showTime={false} name={name} placeholder={TYPE_VALUE} />),
  value: 'before',
  mongooseCode: '$lt',
  label: 'Before specific date.',
  info: 'Find by date field before specific date.',
  formatter: (value) => value && moment(value).format('MMMM Do YYYY, h:mm:ss a'),
  type: Date
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

const getFieldsData = function(name, fields) {
  const fieldConfig = fields.find(item => item.key === name)
  if(fieldConfig && fieldConfig.getData) {
    return fieldConfig.getData()
  }
  return null;
}
const renderFieldByOperatorType = function(name, operator = '$eq', fieldName, fields, advanceMode) {
  const operatorConfig = allOperators[operator]

  if(!operatorConfig) {
    console.log('redux-admin Filters - missing operatorConfig', operator)
    return <Input name={name} />
  }
  const renderInput = operatorConfig.renderInputComponent
  const fieldData = null // operatorConfig.type === String ? getFieldsData(fieldName, fields) : null;

  return renderInput ? renderInput(name, fieldData, advanceMode) : <Input name={name} />
}
export const allOperators = {
  equal,
  greaterThan,
  greaterThanOrEqual,
  matchInArray,
  noneInArray,
  lessThan,
  lessThanOrEqual,
  notEquals,
  before,
  after,
  stringEqual,
  stringNotEquals,
  dateEqual
}
const getDefaultOperator = function(type) {
  switch (type) {
    case String:
      return stringEqual
    case Date:
      return dateEqual
    case Number:
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
    const {fields, advanceMode} = this.props
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
        return [stringEqual, stringNotEquals]
      case Number:
        return [equal, notEquals, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual]
      case Date:
        return [before, after]
      case Array:
        return [noneInArray, matchInArray]
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
    const _initialValues = (initialValues && initialValues.length) ? {...initialValues} : null
    if(advanceMode && _initialValues && _initialValues[0] && !_initialValues[0].advanceMode){
      _initialValues[0].advanceMode = true // This will convert an simple filter to advanceMode filter
    }
    const initValues = _initialValues ||  [this.getNewRow()];
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
