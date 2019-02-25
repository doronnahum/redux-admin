import React, { Component } from 'react';
import { Input, Form, Icon } from 'antd';
import Consumer from './Consumer';
import {sanitizeFormItemProps, getFieldValueByName, sanitizeAntdTextInputProps} from './util'

import {antdFormItem, formikField} from './propTypes';
import ReactDropzone from 'react-dropzone';

class Dropzone extends Component {
  render() {
    const { name, multiple } = this.props;
    return (
      <Consumer>
        {(form) => {
          const { setFieldValue, values } = form
          const value = getFieldValueByName(name, values)
          const _isEmpty = !value || (typeof value === 'string' && value.trim().length === 0);
          const isUrl = !_isEmpty && typeof value === 'string';
          return (
            <Form.Item
              {...sanitizeFormItemProps(this.props, {name}, form)}
            >
              <section className='ra-dropZone'>
                {(_isEmpty || isUrl) && <span>
                  <label>Enter file url</label>
                  <Input
                    {...sanitizeAntdTextInputProps(this.props)}
                    value={value}
                    onChange={(e) => {
                      setFieldValue(name, e.target.value)
                    }}
                  />
                  {!_isEmpty && <Icon className='ra-dropZone__clear-url' type="close-circle" onClick={(e) => {
                    e.stopPropagation();
                    setFieldValue(name, null)
                  }} />}
                </span>
                }
                {_isEmpty && <p>OR</p>}
                {(_isEmpty || !isUrl) && <ReactDropzone
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    if(multiple) {
                      setFieldValue(name, acceptedFiles)
                    }else{
                      setFieldValue(name, acceptedFiles[0])
                    }
                  }}
                //   onFileDialogCancel={this.onCancel.bind(this)}
                >
                  {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()} className='ra-dropZone__file'>
                      <input {...getInputProps()} />
                      {_isEmpty
                        ? <p>Drop file here / click to select file</p>
                        : <span>{`${value.name} - ${value.size}`}<Icon className='ra-dropZone__clear-file' type="close-circle" onClick={() => setFieldValue(name, null)} /></span>
                      }
                    </div>
                  )}
                </ReactDropzone>
                }
              </section>
            </Form.Item>
          )
        }}
      </Consumer>
    )
  }
}

Dropzone.propTypes = {
  ...antdFormItem,
  ...formikField,
};

export default Dropzone;
