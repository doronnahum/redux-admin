import React, { Component } from 'react';
import Admin from '../Admin';
import {mongooseGetParams} from './helpers'
export default class MongooseServerAdmin extends Component {
  render() {
    return (
      <Admin
        rowKey='_id'
        getParams={(res) => mongooseGetParams(res, this.props.defaultFilter)}
        {...this.props}
      />
    );
  }
}
