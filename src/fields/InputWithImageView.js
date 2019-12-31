/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Input, Form, Popover, Icon, Empty } from 'antd';
import { Field } from 'formik';
import { sanitizeFormItemProps, sanitizeFormikFieldProps, sanitizeAntdTextInputProps, validURL } from './util';
import { antdFormItem, antdTextInput, formikField } from './propTypes';

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

class InputWithImageView extends Component {
  render() {
    return (
      <Field {...sanitizeFormikFieldProps(this.props)}>
        {({ field, form }) => {
          const showImage = field.value && validURL(field.value);
          return (
            <div>
              <label>{this.props.label}</label> :
              <p />
              <div className='imageViewBorder'>
                {!showImage && <Icon type="minus" size={65} />}
                {(!!showImage) && <img src={field.value} width={65} height={65} />}
              </div>
            </div>
          )
        }}
      </Field>
    );
  }
}

InputWithImageView.propTypes = {
  ...antdFormItem,
  ...antdTextInput,
  ...formikField,
};

export default InputWithImageView;
