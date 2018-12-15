import startCase from 'lodash/startCase'
import { Tag } from 'antd';
import moment from 'moment'
const getListField = function({key, title, type, render, sorter}) {
  const field = {
    title: title || startCase(key),
    key: key,
    dataIndex: key,
    width: 150,
    sorter,
    type
  }
  if(render){
    field.render = render
  }else{
    if(type === Array) {
      field.render = function(fieldValue) { 
        if(fieldValue) return fieldValue.map((val, index) => <Tag key={index} color={'geekblue'}>{val}</Tag>);
        return ''
    }
    }else if(type === Date) {
      field.width = 100
      field.render = function(fieldValue) { return fieldValue ? moment(fieldValue).format('MM/DD/YY HH:mm:ss') : '' }
    }
  }
  return field
}

export default getListField;