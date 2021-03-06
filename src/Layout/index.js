import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Layout extends Component {
  render() {
    return (
      <div className="ra-adminLayout ant-layout noTableHeader ">
        {this.props.header}
        <div className="ant-layout-content">
          <div className="ra-tableWrapper">
            <div className="ra-tableContent">
              <div className="ant-table-wrapper overFlowScroll">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  header: PropTypes.element,
};

export default Layout;
