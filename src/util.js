import forOwn from 'lodash/forOwn';

export const isString = function(obj) {
  return Object.prototype.toString.call(obj) === '[object String]'
};

export const getChangedData = function(values, dataFromServer) {
  let dataToSend = null
  if(values && dataFromServer) {
    forOwn(values, function(value, key) {
      if(dataFromServer[key] !== value) {
        if(!dataToSend) { dataToSend = {} }
        dataToSend[key] = value
      }
    })
  }
  return dataToSend
}

export const guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4()
}
export const getDefaultValueByType = function(type) {
  switch (type) {
    case String:
      return ''
    case Number:
      return 0
    default:
      return 'NULL'
  }
}
export const convertColumnsToCsvFields = function(columns = []) {
  return columns.map(({title, key, type}) => ({
    label: title,
    value: (row, field) => row[key],
    default: getDefaultValueByType(type),
  }))
}
