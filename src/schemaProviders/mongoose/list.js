import forOwn from 'lodash/forOwn';
import startCase from 'lodash/startCase';
import isArray from 'lodash/isArray';

const getTableFieldsFromDbSchema = function(schema) {
  const fields = [];
  forOwn(schema, function(value, key) {
    // const {type, ref} = value
    const field = {
      title: startCase(key),
      key: key,
      dataIndex: key,
      type: value.type,
      width: 200,
      render: value.render
    }
    if(isArray(value)) {
      field.render = function(fieldValue) { return fieldValue && fieldValue.join(', ') }
    }
    fields.push(field)
  })
  return fields
};

export default getTableFieldsFromDbSchema
