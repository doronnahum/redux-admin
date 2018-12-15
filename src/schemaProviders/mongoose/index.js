/* eslint-disable no-console */
/* mongoose
The permitted SchemaTypes are: String Number Date Buffer Boolean Mixed _id Array Decimal128 Map
*/
import forOwn from 'lodash/forOwn';
import startCase from 'lodash/startCase';
import isArray from 'lodash/isArray';
import {
  Input,
  MultiSelect,
  Reference,
  Select,
  ArrayInput
} from '../../fields'
import validation from './validation'
import list from './list'

const getItemTypeAsString = function (type) {
  if(type === Number) return 'number'
  if(type === Object) return 'object'
  if(type === String) return 'string'
  console.warn('redux-admin mongose missing getItemTypeAsString')
}

export const getDocFieldsFromDbSchema = function(schema) {
  const fields = [];
  forOwn(schema, function(value, key) {
    const {type, ref, require} = value
    const required = require && require[0]
    const isTypeArray = isArray(type);
    const isValueArray = isArray(value);
    if(type === String) { // => { type: String, require: [true] }
      fields.push(<Input name={key} required={required} label={startCase(key)} key={key} />)
      return
    }
    if(type === Number) { // =>{ type: Number, require: [true] }
      fields.push(<Input name={key} required={required} label={startCase(key)} key={key} />)
      return
    }
    if(ref) { // =>{ type: mongoose.Schema.Types._id, ref: 'ActionType' }
      fields.push(
        <Reference url={ref} key={key}>
          {({data, onSearchValueChanged, loading, onFocus}) => {
            return <Select data={data} onSearchValueChanged={onSearchValueChanged} loading={loading} name={key} label={startCase(key)} onFocus={onFocus}/>
          }}
        </Reference>
      )
      return
    }
    if(isTypeArray) { // => { type: [String] } -or- { type: [Number] } -or- { type: [Object] }
      const itemType = getItemTypeAsString(type[0])
      fields.push(<ArrayInput name={key} label={startCase(key)} key={key} itemType={itemType}/>)
      return
    }
    if(isValueArray && value[0] && value[0].ref) { // => [{ type: mongoose.Schema.Types._id, ref: 'Vertical'}]
      fields.push(
        <Reference url={value[0].ref} key={key}>
          {({data, onSearchValueChanged, loading, onFocus}) => {
            return <MultiSelect data={data} onSearchValueChanged={onSearchValueChanged} loading={loading} name={key} label={startCase(key)} onFocus={onFocus}/>
          }}
        </Reference>
      )
      return
    }
    console.log('redux-admin > schemaProviders > mongoose - missing field render', key, value)
  })
  return fields
};

export const getDocFieldsValidationSchema = validation;

export const getTableFieldsFromDbSchema = list;

export const mongoose = {Schema: {Types: { _id: '' }}}
