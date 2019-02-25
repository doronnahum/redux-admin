import startCase from 'lodash/startCase'
import { Tag } from 'antd';
import moment from 'moment'
import printObject from './printObject';

const getListField = function ({ key, title, type, render, sorter, width = 150, defaultValue = '', itemType, labelKey }) {
  const field = {
    title: title || startCase(key),
    key: key,
    dataIndex: key,
    width,
    sorter,
    type,
    className: key
  }
  if (render) {
    field.render = render
  } else {
    if (type === Array || type === 'array') {
      field.render = function (fieldValue) {
        if (fieldValue && fieldValue.length) return fieldValue.map((val, index) => {
          if(itemType === Object) return <Tag key={index} style={{ height: 'auto' }} color={'geekblue'}>{printObject(val)}</Tag>
          return <Tag key={index} color={'geekblue'}>{val}</Tag>
        });
        return defaultValue
      }
    } else if (type === Date || type === 'date') {
      field.width = field.width || 100
      field.render = function (fieldValue) { return fieldValue ? moment(fieldValue).format('MM/DD/YY HH:mm:ss') : defaultValue }
    } else if (type === Boolean || type === 'boolean') {
      field.width = 80
      field.render = function (fieldValue) { return fieldValue ? <span>&#10004;</span> : <span>&#10008;</span> }
    } else if(type === Object || type === 'object'){
      if(!labelKey) {
        field.render = function (fieldValue) { return JSON.stringify(fieldValue || {})}
      } else{
        field.render = function (fieldValue) { return fieldValue ? fieldValue[labelKey] : '' }
      }
    }
  }
  return field
}

export default getListField;