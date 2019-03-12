import React, { Component } from 'react';
import { Input, Form } from 'antd';

import Consumer from './Consumer';
import {sanitizeFormItemProps, getFieldValueByName} from './util'
import {antdFormItem, formikField} from './propTypes';
import { sendMessage } from '../message'


class ObjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputKey: 1
    };
  };
  
  render() {
    const { name, defaultValue } = this.props;
    return (
      <Consumer>
        {(form) => {
          const { setFieldValue, values } = form
          const currentValue = getFieldValueByName(name, values)
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, {name}, form)}
            >
              <Input.TextArea
                key={this.state.inputKey}
                defaultValue={JSON.stringify(currentValue || defaultValue)}
                onBlur={(e) => {
                  try {
                    const obj = JSON.parse(e.target.value)
                    setFieldValue(name, obj)
                    this.setState({inputKey: this.state.inputKey + 1})
                  }catch(e){
                    sendMessage('This is not valid json')
                  }
                }}
                autosize={this.props.autosize}
              />
            </Form.Item>
          )
        }}
      </Consumer>
    )
  }
}

ObjectEditor.propTypes = {
  ...antdFormItem,
  ...formikField,
};

ObjectEditor.defaultProps = {
  defaultValue: {}
};

export default ObjectEditor;
