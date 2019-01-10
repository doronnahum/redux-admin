import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import {Button, Modal} from 'antd';
import {Input, InputNumber, Select, DatePicker} from '../../fields'
import {guid} from './helpers'
import isEqual from 'lodash/isEqual'
import * as Yup from 'yup';
import moment from 'moment'
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
  renderInputComponent: (name) => (<Input name={name} label='Value'/>),
  value: 'equal',
  mongooseCode: '$eq',
  label: 'Equal to',
  info: 'Matches values that are equal to a specified value.',
}
const notEquals = {
  renderInputComponent: (name) => (<Input name={name} label='Value'/>),
  value: 'notEquals',
  mongooseCode: '$ne',
  label: 'Not equal to',
  info: 'Matches all values that are not equal to a specified value.'
}

const greaterThan = {
  renderInputComponent: (name) => (<InputNumber name={name} label='Value'/>),
  value: 'greaterThan',
  mongooseCode: '$gt',
  label: 'Greater Than',
  info: 'Matches values that are greater than a specified value.'
}
const greaterThanOrEqual = {
  renderInputComponent: (name) => (<InputNumber name={name} label='Value'/>),
  value: 'greaterThanOrEqual',
  mongooseCode: '$gte',
  label: 'Greater Than or Equal To',
  info: 'Matches values that are greater than or equal to a specified value.'
}

const lessThan = {
  renderInputComponent: (name) => (<InputNumber name={name} label='Value'/>),
  value: 'lessThan',
  mongooseCode: '$lt',
  label: 'Matches values that are less than a specified value.'
}
const lessThanOrEqual = {
  renderInputComponent: (name) => (<InputNumber name={name} label='Value'/>),
  value: 'lessThanOrEqual',
  mongooseCode: '$lte',
  label: 'Less Than or Equal To',
  info: 'Matches values that are less than or equal to a specified value.'
}

const matchInArray = {
  renderInputComponent: (name) => (<Input name={name} label='Value'/>),
  value: 'matchInArray',
  mongooseCode: '$in',
  label: 'Matches any in an array.',
  info: 'Matches any of the values specified in an array.'
}
const noneInArray = {
  renderInputComponent: (name) => (<Input name={name} label='Value'/>),
  value: 'noneInArray',
  mongooseCode: '$nin',
  label: 'Matches any in an array.',
  info: 'Matches none of the values specified in an array.'
}

const after = {
  renderInputComponent: (name) => (<DatePicker name={name} label='Value'/>),
  value: 'after',
  mongooseCode: '$gt',
  label: 'After specific date.',
  info: 'Find by date field after specific date.',
  formatter: (value) => value && moment(value).format('MMMM Do YYYY, h:mm:ss a')
}
const before = {
  renderInputComponent: (name) => (<DatePicker name={name} label='Value'/>),
  value: 'before',
  mongooseCode: '$lt',
  label: 'Before specific date.',
  info: 'Find by date field before specific date.',
  formatter: (value) => value && moment(value).format('MMMM Do YYYY, h:mm:ss a')
}

const schema = Yup.object().shape({
  activeFilters: Yup.array()
    .of(
      Yup.object().shape({
        key: Yup.string()
          .required('Required'),
        // these constraints take precedence
        operator: Yup.string()
          .required('Required'),
        // these constraints take precedence
      })
    )
});

const renderFieldByOperatorType = function(name, operator = '$eq') {
  const renderInput = allOperators[operator] && allOperators[operator].renderInputComponent
  return renderInput ? renderInput(name) : <Input name={name} label='Value'/>
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
  after
}

const getNewRow = function() {
  return {key: null, operator: null, value: null, id: guid(), type: 'comparison'}
}
const getNewLogical = function() {
  let id = guid();
  return {key: id, value: 'and', operator: 'logical', id: id, type: 'logical'}
}
export default class FilterOptions extends React.Component {
  onClose = (oldActiveFilters, values) => {
    const newActiveFilters = values.activeFilters
    const _this = this;
    if(isEqual(oldActiveFilters, newActiveFilters)) {
      this.props.onClose()
    }else {
      Modal.confirm({
        title: 'Are you sure you want to cancel your choices?',
        onOk() {
          _this.props.onClose()
        },
      });
    }
  }

  getOperators(filedKey, fields) {
    if(!fields || !filedKey) return [];
    const filedType = fields.find(item => item.key === filedKey).type
    switch (filedType) {
      case String:
        return [equal, notEquals]
      case Number:
        return [equal, notEquals, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, notEquals]
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
    arrayHelpers.push(getNewLogical())
    setTimeout(() => {
      arrayHelpers.push(getNewRow())
    }, 150);
  }
  render() {
    const {initialValues, onSave, fields} = this.props
    const initValues = (initialValues && initialValues.length) ? initialValues : [getNewRow()];
    return (
      <Formik
        initialValues={{activeFilters: initValues}}
        validationSchema={schema}
        onSubmit={onSave}
        render={({ values, isValid, setFieldValue }) => {
          return (
            <div className='ra-filtersOptionsWrapper'>
              <h2 className='ra-filtersOptionsTitle'>Filters settings:</h2>
              <Form className='ant-form ant-form-inline'>
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
                              <Button ghost className='ra-removeFilterRow' icon="close" size={'small'} onClick={() => arrayHelpers.remove(index)}/>
                              <Select
                                showSearch
                                data={fields}
                                optionLabel={'label'}
                                optionKey={'key'}
                                name={`activeFilters[${index}]key`}
                                label='Field Name'
                                style={{width: 130}}
                              />
                              <Select
                                showSearch
                                data={this.getOperators(filter.key, fields)}
                                optionLabel={'label'}
                                optionKey={'value'}
                                name={`activeFilters[${index}]operator`}
                                label='Operator'
                                style={{width: 100}}
                                disabled={!filter.key}
                                onValuesChanged={(v, newValue) => {
                                  if(newValue !== filter.operator) {
                                    setFieldValue(`activeFilters[${index}]value`, null)
                                  }
                                }}
                              />
                              {renderFieldByOperatorType(`activeFilters[${index}]value`, filter.operator)}
                              {((index + 1) === values.activeFilters.length) && <Button className='ra-filtersOptionsAddRow' type="primary" shape="circle" icon="plus" size={'small'} onClick={() => this.addNewRow(arrayHelpers)}/>}
                            </div>
                          )
                        }
                        )
                      ) : (
                        <Button type="primary" size={'small'} onClick={() => this.addNewRow(arrayHelpers)}>Add Filter</Button>
                      )}
                      <div className='ra-filtersOptionsFooter'>
                        <Button type="danger" ghost onClick={() => this.onClose(initValues, values)} className='ra-mr15'>Cancel</Button>
                        <Button ghost type="primary" htmlType={'submit'} disabled={!isValid}>Apply</Button>
                      </div>
                    </div>
                  )}
                />
              </Form>
            </div>)
        }}
      />
    )
  }
}
FilterOptions.defaultProps = {
  fields: []//[{value: 'title', label: 'Title'}, {value: 'age', label: 'Age'}]
};
