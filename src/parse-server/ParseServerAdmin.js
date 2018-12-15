import React, { Component } from 'react';
import Admin from '../Admin';
import isArray from 'lodash/isArray';

const parseServerGetParams = (
  { limit, skip, sort, filters },
  defaultFilter
) => {
  let filter;
  if ((filters && filters.length) || defaultFilter) {
    filter = [];
    if (defaultFilter) {
      if (isArray(defaultFilter)) {
        filter = [...defaultFilter];
      } else {
        filter.push(defaultFilter);
      }
    }
    filters.forEach(item => {
      if (item.type === "comparison" && item.active) {
        const fieldName = item.key;
        const mongooseCode = allOperators[item.operator].mongooseCode;
        const filterType = allOperators[item.operator].type;
        let value = item.value;
        if (filterType === Date) {
          value = new Date(value);
          // value = {"$date": "2013-10-01T00:00:00.000Z"}
        }
        filter.push({
          [fieldName]: { [mongooseCode]: value }
        });
      }
    });
    if (filter.length === 1) {
      filter = filter[0];
    } else if (filter.length === 0) {
      filter = filter[0];
    } else {
      filter = { $and: filter };
    }
  }
  let _sort = undefined;
  if (sort && !sort.undefined) {
    const firstKey = Object.keys(sort)[0];
    _sort = `${sort[firstKey] < 1 ? "-" : ""}${firstKey}`;
  }
  return {
    limit,
    skip,
    sort: _sort,
    where: filter,
    count: 1
  };
};

export default class ParseServerAdmin extends Component {
  render() {
    return (
      <Admin
        rowKey='objectId'
        getParams={(res) => parseServerGetParams(res, this.props.defaultFilter)}
        getListSource={({url, targetKey, params, body, onEnd}) => {
          return {
            targetKey: targetKey,
            url: url,
            params,
            body,
            onEnd,
            customHandleResponse: res => res.data.results,
            getCountFromResponse: res => res.data.count
          }
        }}
        getDocumentSource={({url, targetKey, params, body, id, data}) => {
          return {
            targetKey: targetKey,
            url: id ? `${url}/${id}` : url,
            params,
            id,
            refreshType: 'none',
            data
          }
        }}
        {...this.props}
      />
    );
  }
}
