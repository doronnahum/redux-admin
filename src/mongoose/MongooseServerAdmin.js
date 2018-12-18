import React, { Component } from 'react';
import Admin from '../Admin';
import PropTypes from 'prop-types';
import {mongooseGetParams, getListWithCount} from './helpers'

export default class MongooseServerAdmin extends Component {
  render() {
    const {count} = this.props
    const props = {}
    if(count) {
      props.getListSource = getListWithCount
    }
    return (
      <Admin
        rowKey='_id'
        getParams={(res) => mongooseGetParams(res, this.props.defaultFilter)}
        // onReadEnd={({response}) => {
        //   const filters = getDeepObjectValue(response, 'config.params.options').config
        //   debugger
        // }}
        {...props}
        {...this.props}
      />
    );
  }
}

MongooseServerAdmin.propTypes = {
  count: PropTypes.bool, // Set true if you want to fetch count from {url}/count in each time collection is fetching
  defaultFilter: PropTypes.object
};
