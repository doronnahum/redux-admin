import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Checkbox, Button } from 'antd';
import { LOCALS } from '../../local';

export default class FilterColumns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsFilters: (this.props.columnsFilters && this.props.columnsFilters.length) ? this.props.columnsFilters : this.props.fields.map((item) => item.key),
    };
  }

  onSelectAll = () => {
    this.setState({ columnsFilters: this.props.fields.map((item) => item.key) });
  }

  render() {
    return (
      <Modal
        title={LOCALS.FILTERS.COLUMNS_TO_DISPLAY_MODAL_TITLE}
        visible={this.props.visible}
        onOk={() => this.props.onOk(this.state.columnsFilters)}
        onCancel={this.props.onClose}
        okText={LOCALS.FILTERS.OK_BUTTON_TEXT}
        cancelText={LOCALS.FILTERS.RESET_BUTTON_TEXT}
        closable
        destroyOnClose
      >
        <div className="ra-columnsFiltersList">
          {
            this.props.fields.map(({ title, key }) => {
              const isActive = this.state.columnsFilters.includes(key);
              return (
                <Checkbox
                  key={key}
                  checked={this.state.columnsFilters.includes(key)}
                  onChange={() => {
                    if (isActive) {
                      const newValue = this.state.columnsFilters.filter((item) => item !== key);
                      this.setState({ columnsFilters: newValue });
                    } else {
                      const newValue = [...this.state.columnsFilters];
                      newValue.push(key);
                      this.setState({ columnsFilters: newValue });
                    }
                  }}
                >
                  {title}
                </Checkbox>
              );
            })
          }
          <Button onClick={this.onSelectAll}>{LOCALS.FILTERS.SELECT_ALL_BUTTON_TEXT}</Button>
        </div>
      </Modal>
    );
  }
}
