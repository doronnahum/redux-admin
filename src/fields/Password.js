import React, { Component } from 'react';
import { Input, Form, Tooltip, Icon } from 'antd';
import { Field } from 'formik';
import { sanitizeFormItemProps, sanitizeFormikFieldProps, sanitizeAntdTextInputProps } from './util';
import { antdFormItem, antdTextInput, formikField } from './propTypes';

const redColor = { color: 'red' };
class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.renderSuffix = this.renderSuffix.bind(this);
    this.onShow = this.onShow.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  onShow() {
    this.setState({ visible: true });
  }

  onHide() {
    this.setState({ visible: false });
  }

  renderSuffix(s) {
    const { visible } = this.state;
    return (
      <Tooltip title={visible ? 'hide' : 'show'}>
        {visible
          ? <Icon type="eye-o" onClick={this.onHide} style={redColor} />
          : <Icon type="eye" onClick={this.onShow} />}
      </Tooltip>
    );
  }

  render() {
    const { visible } = this.state;
    return (
      <Field {...sanitizeFormikFieldProps(this.props)}>
        {({ field, form }) => (
            <Form.Item
              {...sanitizeFormItemProps(this.props, field, form)}
            >
              <Input
                {...field}
                {...sanitizeAntdTextInputProps(this.props)}
                type={visible ? 'text' : 'password'}
                suffix={this.renderSuffix()}
              />
            </Form.Item>
          )}
      </Field>
    );
  }
}

PasswordInput.propTypes = {
  ...antdFormItem,
  ...antdTextInput,
  ...formikField,
};

export default PasswordInput;
