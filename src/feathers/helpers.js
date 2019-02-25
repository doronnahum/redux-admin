import {allOperators} from '../filters/FilterOptions'
import isArray from 'lodash/isArray';
import {getDeepObjectValue} from '../util'
import isEqual from 'lodash/isEqual'

/*
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
*/
const buildFeathersQuery = function(fieldName, filterType, mongooseCode, value) {
  let _fieldName;
  let _value = value;
  if(mongooseCode === '$eq') {
    _fieldName = fieldName
  }else{
    _fieldName = `${fieldName}[${mongooseCode}]`;
  }
  return {[_fieldName]: _value};
};

export const mongooseGetParams = ({limit, skip, sort, filters}, defaultFilter, defaultOptions = {}) => {
  let filter;
  if(((filters && filters.length) || defaultFilter)) {
    filter = [];
    if(defaultFilter) {
      if(isArray(defaultFilter)) {
        filter = [...defaultFilter]
      }else{
        filter.push(defaultFilter)
      }
    }
    filters.forEach(item => {
      if(item.type === 'comparison' && item.active) {
        const fieldName = item.key
        const mongooseCode = allOperators[item.operator].mongooseCode
        const filterType = allOperators[item.operator].type
        let value = item.value;
        if(filterType === Date) {
          value = new Date(value)
          // value = {"$date": "2013-10-01T00:00:00.000Z"}
        }
        filter.push(buildFeathersQuery(fieldName, filterType, mongooseCode, value))
      }
    })
    if(filter.length === 1) {
      filter = filter[0]
    }else if(filter.length === 0) {
      filter = filter[0]
    } else{
      filter = {$and: filter}
    }
  }
  const options = {...defaultOptions}
  if(!filter && (limit || skip || sort)) filter = {};
  if(limit) options.limit = filter.$limit = limit;
  if(skip) options.skip = filter.$skip = skip;
  if(sort && !sort.undefined) {
    const sortKeys = Object.keys(sort)
    filter[`$sort[${sortKeys[0]}]`] = sort[sortKeys[0]]
  }// !sort.undefined - workaround to fix issue with initial value on Admin
  return filter;
}

export const getListWithCount = ({ url, targetKey, params, body, onEnd }) => {
  return {
    targetKey: targetKey,
    url: url,
    params,
    body,
    onEnd,
    getCountRequestConfig: ({actionPayload, response, fetchObject}) => {
      const currentCount = fetchObject.count
      const lastFilters = getDeepObjectValue(fetchObject, 'lastRead.params.filter')
      const newFilter = getDeepObjectValue(actionPayload, 'params.filter')
      if((currentCount || currentCount === 0) && isEqual(lastFilters, newFilter)) {
        return false // persist count
      }
      const config = {
        url: actionPayload.url + '/count',
        method: actionPayload.method,
      }
      const filter = getDeepObjectValue(response, 'config.params.filter')
      if(filter) { config.params = {filter} }
      return config
    },
    getCountFromResponse: (response) => {
      return getDeepObjectValue(response, 'data.count') || 0
    }
  }
}
