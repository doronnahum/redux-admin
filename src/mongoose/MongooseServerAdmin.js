import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Admin from '../Admin';
import { getDeepObjectValue } from '../util';
import { mongooseGetParams } from './helpers';

export default class MongooseServerAdmin extends Component {
  getListWithCount = ({ url, targetKey, params, body, onEnd }) => ({
      targetKey,
      url,
      params,
      body,
      onEnd,
      getCountRequestConfig: ({ actionPayload, response, fetchObject }) => {
        const currentCount = fetchObject.count;
        const lastFilters = getDeepObjectValue(fetchObject, 'lastRead.params.filter');
        const newFilter = getDeepObjectValue(actionPayload, 'params.filter');
        if ((currentCount || currentCount === 0) && isEqual(lastFilters, newFilter)) {
          return false; // persist count
        }
        const config = {
          url: `${actionPayload.url}/count`,
          method: actionPayload.method,
        };
        if (newFilter) { config.params = { filter: newFilter }; }
        return config;
      },
      getCountFromResponse: (response) => getDeepObjectValue(response, 'data.count') || 0,
      customHandleResponse: this.props.customHandleResponse,
    })

  render() {
    const { count, customHandleResponse } = this.props;
    const _props = {};
    if (count) {
      _props.getListSource = this.getListWithCount;
    }
    return (
      <Admin
        rowKey="_id"
        getParams={(res) => mongooseGetParams(res, this.props.defaultFilter, this.props.defaultOptions)}
        getDocumentSource={({ url, targetKey, params, body, id, data }) => {
          let _params = null;
          if (this.props.defaultDocOptions) {
            _params = { options: this.props.defaultDocOptions };
          }
          const config = {
            targetKey,
            url: id ? `${url}/${id}` : url,
            id,
            refreshType: 'none',
          };
          if (_params) {
            config.params = _params;
          }
          return config;
        }}
        getListSource={({ url, targetKey, params, body, onEnd }) => ({
            targetKey,
            url,
            params,
            body,
            onEnd,
            customHandleResponse, // Optional
            // getCountFromResponse: res => res.data.count
          })}
        // onReadEnd={({response}) => {
        //   const filters = getDeepObjectValue(response, 'config.params.options').config
        //   debugger
        // }}
        {..._props}
        {...this.props}
      />
    );
  }
}

MongooseServerAdmin.propTypes = {
  count: PropTypes.bool, // Set true if you want to fetch count from {url}/count in each time collection is fetching
  defaultFilter: PropTypes.object,
};
