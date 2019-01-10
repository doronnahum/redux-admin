import forOwn from 'lodash/forOwn';
import startCase from 'lodash/startCase';
import isArray from 'lodash/isArray';
import { Tag, Tooltip } from 'antd';
import printObject from '../../helpers/printObject';
export const renderId = (val) => {
  if (!val) return
  const str = val
  return <Tooltip title={val}>...{str.slice(val.length - 8, val.length)}</Tooltip>
}
const getTableFieldsFromDbSchema = function (schema) {
  const fields = [];
  forOwn(schema, function (value, key) {
    // const {type, ref} = value
    const field = {
      title: startCase(key),
      key: key,
      dataIndex: key,
      type: value.type,
      width: 100,
      render: value.render
    }
    if (value.ref && !field.render) {  // this is to render ther render method
      field.render = function (fieldValue) {
        if (isArray(value.type) && fieldValue) {
          return fieldValue.map(item => {
            const isObj = item && typeof item === 'object'
            const key = isObj ? item._id : item;
            return <Tag key={key}>{isObj ? (item[value.optionLabel] || item._id) : item}</Tag>
          })
        }
        if (fieldValue && typeof fieldValue === 'object') {
          return fieldValue[value.optionLabel] || fieldValue._id
        }
        return fieldValue
      }
    } else if ((isArray(value) || isArray(value.type)) && !field.render) {
      field.render = function (fieldValue) {
        if (fieldValue && fieldValue.length) {
          return fieldValue.map((val, index) => {
            const isValObj = val && typeof val === 'object'
            return <Tag key={index} color={'geekblue'} style={isValObj ? { height: 'auto' } : ''}>{
              (isValObj) ? printObject(val) : val
            }</Tag>
          }
          )
        }
      }
    }
    fields.push(field)
  })
  return fields
};

export default getTableFieldsFromDbSchema
