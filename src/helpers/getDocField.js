import React from 'react';

import startCase from 'lodash/startCase';
import { checkURL } from '../util';

import {
  Input,
  TextArea,
  MultiSelect,
  Reference,
  Select,
  ArrayInput, DatePicker,
  CheckBox,
  InputNumber,
  ObjectEditor,
  Dropzone,
  BoxSelect,
  CheckboxWithIcon,
  TimePicker,
  Consumer,
  InputWithImageView,
} from '../fields';


const getItemTypeAsString = function (type) {
  if (type === Number || type === 'number') return 'number';
  if (type === Object || type === 'object') return 'object';
  if (type === String || type === 'string') return 'string';
};

export const isFieldDisabled = function (fieldName, documentRollConfig = { canCreate: true, canUpdate: true, excludeFields: [] }, isNewDoc) {
  let isDisabled = false;
  if (documentRollConfig.excludeFields && documentRollConfig.excludeFields.includes && documentRollConfig.excludeFields.includes(fieldName)) {
    isDisabled = false;
  } else if (isNewDoc) {
    isDisabled = !documentRollConfig.canCreate;
  } else {
    isDisabled = !documentRollConfig.canUpdate;
  }
  return isDisabled;
};

const getDocField = function ({ key, type, label, required, ref, RefComponent = Reference, referenceKey, labelInValue, arrayItemType = String, multiSelect = false, disabled = false, documentRollConfig, isNewDoc, optionLabel, optionKey, options, getParamsByValue, placeholder, objectStructure, nestedArray, inputType, inputProps, helpText, renderLabel, customElements }) {
  const _disabled = disabled || isFieldDisabled(key, documentRollConfig, isNewDoc);
  const _label = label || startCase(key);
  if (inputType === 'file') {
    return (
      <Dropzone key={key} inputProps={inputProps} name={key} required={required} label={_label} disabled={_disabled} placeholder={placeholder} />
    );
  }
  if (ref) {
    const fieldProps = {
      name: key,
      label: _label,
      disabled: _disabled,
      optionLabel,
      optionKey,
      placeholder,
      labelInValue,
      multiSelect,
      required,
      helpText,
      disabled: _disabled,
      customElements
    };
    return (
      <RefComponent url={ref} targetKeyPrefix={referenceKey} key={referenceKey || key} getParamsByValue={getParamsByValue} fieldProps={fieldProps} disabled={_disabled} inputType={inputType}>
        {({ data, onSearchValueChanged, loading, onFocus }) => {
          const resProps = { data, onSearchValueChanged, loading, onFocus };
          if (multiSelect) return <MultiSelect {...fieldProps} {...resProps} />;
          return <Select {...fieldProps} {...resProps} />;
        }}
      </RefComponent>
    );
  }
  if (options) {
    let _options = options;
    let _optionKey = optionKey;
    let _optionLabel = optionLabel;
    if (multiSelect) {
      const Element = inputType === 'boxSelect' ? BoxSelect : MultiSelect;
      const itemType = getItemTypeAsString(arrayItemType);
      if (itemType === 'string' && options && typeof options[0] === 'string') {
        _optionKey = 'value';
        _options = options.map((item) => ({ value: item, label: startCase(item) }));
      }
      return <Element data={_options} name={key} key={key} inputProps={inputProps} label={_label} optionLabel={_optionLabel} optionKey={_optionKey} placeholder={placeholder} disabled={_disabled} />;
    }
    if (options && typeof options[0] === 'string') {
      _optionKey = 'value';
      _optionLabel = 'label';
      _options = options.map((item) => ({ value: item, label: startCase(item) }));
    }
    const Element = inputType === 'boxSelect' ? CheckboxWithIcon : Select;
    return <Element renderLabel={renderLabel} data={_options} name={key} key={key} inputProps={inputProps} label={_label} optionLabel={_optionLabel} optionKey={_optionKey} placeholder={placeholder} disabled={_disabled} />;
  }
  if (inputType === 'imageView') {
    return <InputWithImageView name={key} required={required} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />;
  }
  if (type === String || type === 'string') {
    const Element = inputType === 'textArea' ? TextArea : Input;
    return <Element name={key} required={required} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />;
  }
  if (type === Number || type === 'number') {
    return (
      <InputNumber name={key} required={required} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />
    );
  }
  if (type === Boolean || type === 'boolean') {
    return (
      <CheckBox name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} />
    );
  }
  if (type === Array || type === 'array') {
    const itemType = getItemTypeAsString(arrayItemType);
    if (nestedArray) {
      return <ObjectEditor name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} defaultValue={[]} required={required} />;
    }
    return (
      <ArrayInput name={key} label={_label} key={key} inputProps={inputProps} itemType={itemType} disabled={_disabled} placeholder={placeholder} objectStructure={objectStructure} helpText={helpText} required={required} />
    );
  }
  if (type === Date || type === 'date' || type === 'date-time') {
    if (inputType === 'timePicker') {
      return (
        <TimePicker name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} required={required} />
      );
    }
    return (
      <DatePicker name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} required={required} />
    );
  }
  if (type === Object || type === 'object') {
    return (
      <ObjectEditor name={key} label={_label} key={key} inputProps={inputProps} disabled={_disabled} placeholder={placeholder} required={required} />
    );
  }
};
export default getDocField;
