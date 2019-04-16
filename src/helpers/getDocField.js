import React from 'react';

import startCase from 'lodash/startCase'

import {
  Input,
  MultiSelect,
  Reference,
  Select,
  ArrayInput, DatePicker,
  CheckBox,
  InputNumber,
  ObjectEditor,
  Dropzone
} from '../fields'

const getItemTypeAsString = function (type) {
  if (type === Number || type === 'number') return 'number'
  if (type === Object || type === 'object') return 'object'
  if (type === String || type === 'string') return 'string'
}

export const isFieldDisabled = function (fieldName, documentRollConfig = { canCreate: true, canUpdate: true, excludeFields: [] }, isNewDoc) {
  let isDisabled = false;
  if (documentRollConfig.excludeFields && documentRollConfig.excludeFields.includes && documentRollConfig.excludeFields.includes(fieldName)) {
    isDisabled = false
  } else {
    if (isNewDoc) {
      isDisabled = !documentRollConfig.canCreate
    } else {
      isDisabled = !documentRollConfig.canUpdate
    }
  }
  return isDisabled
}

const getDocField = function ({ key, type, label, required, ref, RefComponent = Reference, referenceKey, labelInValue, arrayItemType = String, multiSelect = false, disabled = false, documentRollConfig, isNewDoc, optionLabel, optionKey, options, getParamsByValue, placeholder, objectStructure, nestedArray, inputType, inputProps }) {
  const _disabled = disabled || isFieldDisabled(key, documentRollConfig, isNewDoc)
  const _label = label || startCase(key)
  if(inputType === 'file'){
    return (
      <Dropzone key={key} inputProps={inputProps} name={key} required={required} label={_label} disabled={_disabled} placeholder={placeholder} />
    ) 
  }
  if (ref) {
    const fieldProps = {
      name: key,
      label: _label,
      disabled: _disabled,
      optionLabel: optionLabel,
      optionKey: optionKey,
      placeholder: placeholder,
      labelInValue: labelInValue,
      multiSelect,
      required,
      disabled: _disabled
    }
    return (
      <RefComponent url={ref} targetKeyPrefix={referenceKey} key={referenceKey || key} getParamsByValue={getParamsByValue} fieldProps={fieldProps} disabled={_disabled}>
        {({ data, onSearchValueChanged, loading, onFocus }) => {
          const resProps = {data, onSearchValueChanged, loading, onFocus}
          if (multiSelect) return <MultiSelect  {...fieldProps} {...resProps}/>
          return <Select  {...fieldProps} {...resProps}/>
        }}
      </RefComponent>
    )
  }
  if (options) {
    let _options = options;
    let _optionKey = optionKey;
    let _optionLabel = optionLabel;
    if(multiSelect){
      const itemType = getItemTypeAsString(arrayItemType)
      if(itemType === 'string' && options && typeof options[0] === 'string'){
        _optionKey = 'value'
        _options = options.map(item => ({value: item, label: startCase(item)}))
      }
      return <MultiSelect data={_options} name={key} key={key} inputProps={inputProps} label={_label} optionLabel={_optionLabel} optionKey={_optionKey} placeholder={placeholder} disabled={_disabled}/>
    }
    if (options && typeof options[0] === 'string'){
      _optionKey = 'value'
      _optionLabel = 'label'
      _options = options.map(item => ({value: item, label: startCase(item)}))
    }
    return <Select data={_options} name={key} key={key} inputProps={inputProps} label={_label} optionLabel={_optionLabel} optionKey={_optionKey} placeholder={placeholder} disabled={_disabled} />
  }
  if (type === String || type === 'string') {
    return (
      <Input name={key} required={required} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />
    )
  }
  if (type === Number || type === 'number') {
    return (
      <InputNumber name={key} required={required} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />
    )
  }
  if (type === Boolean || type === 'boolean') {
    return (
      <CheckBox name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />
    )
  }
  if (type === Array || type === 'array') {
    const itemType = getItemTypeAsString(arrayItemType)
    if(nestedArray){
      return <ObjectEditor name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} defaultValue={[]}/>
    }
    return (
      <ArrayInput name={key} label={_label} key={key} inputProps={inputProps} itemType={itemType} disabled={_disabled} placeholder={placeholder} objectStructure={objectStructure} />
    )
  }
  if (type === Date || type === 'date' || type === 'date-time') {
    return (
      <DatePicker name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />
    )
  }
  if (type === Object || type === 'object') {
    return (
      <ObjectEditor name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />
    )
  }
};
export default getDocField;