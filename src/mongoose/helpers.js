import {allOperators} from '../filters/FilterOptions'
import isArray from 'lodash/isArray';

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
  if(sort) options.sort = sort;
  return {
    options,
    filter,
  }
}
