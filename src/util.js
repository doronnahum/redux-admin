import forOwn from 'lodash/forOwn';
import isEqual from 'lodash/isEqual'
export const isString = function(value) {
  return typeof value === 'string';
}

export const getChangedData = function(values, dataFromServer, immutableKeys) {
  let dataToSend = null
  if(values && dataFromServer) {
    forOwn(values, function(value, key) {
      if(!isEqual(dataFromServer[key], value)) {
        if(!dataToSend) { dataToSend = {} }
        dataToSend[key] = value
      }
    })
  }
  if(immutableKeys && dataToSend) {
    immutableKeys.forEach(item => {
      delete dataToSend[item]
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

export const getDeepObjectValue = function(obj, keypath) {
  if (!isObject(obj)) {
    return undefined;
  }

  return forEachKeyInKeypath(obj, keypath, function(obj, key) {
    if (isObject(obj)) {
      return obj[key];
    }
  });
}

export const isObject = function(obj) {
  return obj === Object(obj);
}

let forEachKeyInKeypath = function(object, keypath, callback) {
  if (!isString(keypath)) {
    return undefined;
  }

  var key = '',
     i,
     escape = false;

  for (i = 0; i < keypath.length; ++i) {
    switch (keypath[i]) {
      case '.':
        if (escape) {
          escape = false;
          key += '.';
        } else {
          object = callback(object, key, false);
          key = '';
        }
        break;

      case '\\':
        if (escape) {
          escape = false;
          key += '\\';
        } else {
          escape = true;
        }
        break;

      default:
        escape = false;
        key += keypath[i];
        break;
    }
  }

  return callback(object, key, true);
}
