import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Modal, Checkbox, Button} from 'antd';

export default class FilterColumns extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columnsFilters: (this.props.columnsFilters && this.props.columnsFilters.length) ? this.props.columnsFilters : this.props.fields.map(item => item.key)
    };
  };

  onSelectAll = () => {
    this.setState({columnsFilters: this.props.fields.map(item => item.key)})
  }
  render() {
    return (
      <Modal
        title="Columns to display"
        visible={this.props.visible}
        onOk={() => this.props.onOk(this.state.columnsFilters)}
        onCancel={this.props.onClose}
        okText="Ok"
        cancelText="Reset"
        closable
        destroyOnClose
      >
        <div className='ra-columnsFiltersList'>
          {
            this.props.fields.map(({ title, key }) => {
              const isActive = this.state.columnsFilters.includes(key)
              return (
                <Checkbox
                  key={key}
                  checked={this.state.columnsFilters.includes(key)}
                  onChange={() => {
                    if(isActive) {
                      const newValue = this.state.columnsFilters.filter(item => item !== key)
                      this.setState({columnsFilters: newValue})
                    }else{
                      const newValue = [...this.state.columnsFilters]
                      newValue.push(key)
                      this.setState({columnsFilters: newValue})
                    }
                  }}
                >
                  {title}
                </Checkbox>
              )
            })
          }
          <Button onClick={this.onSelectAll}>Select All</Button>
        </div>
      </Modal>
    )
  }
}
