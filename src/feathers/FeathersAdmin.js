import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Admin from '../Admin';
import { getDeepObjectValue } from '../util';
import { mongooseGetParams } from './helpers';

export default class FeathersAdmin extends Component {
  render() {
    const { customHandleResponse, regexFilters } = this.props;
    const _props = {};
    return (
      <Admin
        rowKey="_id"
        getParams={(res) => mongooseGetParams(res, this.props.defaultFilter, this.props.defaultOptions, regexFilters)}
        getIdFromNewDocResponse={(res) => res.response && res.response.data && res.response.data._id}
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
            customHandleResponse: (res) => res.data,
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
          customHandleResponse: (res) => {
            return res.data.data ? res.data.data : res.data;
          },
          getCountFromResponse: (res) => res.data.total,
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

FeathersAdmin.propTypes = {
  count: PropTypes.bool, // Set true if you want to fetch count from {url}/count in each time collection is fetching
  defaultFilter: PropTypes.object,
};
