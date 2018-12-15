import React, { Component } from 'react';
import Admin from '../Admin';

export default class ParseServerAdmin extends Component {
  render() {
    return (
      <Admin
        rowKey='objectId'
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
