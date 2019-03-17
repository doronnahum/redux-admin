
import React from 'react';
import * as Yup from 'yup';
import forOwn from 'lodash/forOwn';

const getDocFieldsValidationSchema = function(schema) {
  const shape = {
    // name: Yup.string()
    //   .min(2, 'Too Short!')
    //   .required('Required'),
    // inputNumber: Yup.number().min(2).max(5),
    // code: Yup.string()
    //   .required('Required'),
  }
  forOwn(schema, function(value, key) {
    const {type, require} = value
    const required = require && require[0]
    if(!shape[key]) {
      if(type === String) { shape[key] = Yup.string() }
      if(type === Object) { shape[key] = Yup.object() }
      if(type === Array) { shape[key] = Yup.array() }
      if(type === Number) { shape[key] = Yup.number() }
    }
    if(required) {
      shape[key] = shape[key].required('Required')
    }
  })
  const validationSchema = Yup.object().shape(shape);
  return validationSchema
}

export default getDocFieldsValidationSchema
