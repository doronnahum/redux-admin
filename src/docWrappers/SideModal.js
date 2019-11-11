import React, { Component } from 'react';
import { Layout } from 'antd';

const { Sider } = Layout;

class SideModal extends Component {
  render() {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed
        // style={sideStyle}
        width={0}
        className="ra-sideModal-full"
      >
        <button onClick={this.props.onClose}>X</button>
        {this.props.children}
      </Sider>
    );
  }
}

SideModal.propTypes = {

};

export default SideModal;
