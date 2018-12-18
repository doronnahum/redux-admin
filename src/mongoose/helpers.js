import {allOperators} from '../filters/FilterOptions'
import isArray from 'lodash/isArray';
import {getDeepObjectValue} from '../util'
import isEqual from 'lodash/isEqual'

export const mongooseGetParams = ({limit, skip, sort, filters}, defaultFilter) => {
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
        filter.push({
          [fieldName]: {[mongooseCode]: value}
        })
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
  const options = {}
  if(limit) options.limit = limit;
  if(skip) options.skip = skip;
  if(sort && !sort.undefined) options.sort = sort; // !sort.undefined - workaround to fix issue with initial value on Admin
  return {
    options,
    filter,
  }
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