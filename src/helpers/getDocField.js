import startCase from 'lodash/startCase'

import {
  Input,
  MultiSelect,
  Reference,
  Select,
  ArrayInput, DatePicker,
  CheckBox,
  InputNumber
} from '../fields'

const getItemTypeAsString = function (type) {
  if (type === Number) return 'number'
  if (type === Object) return 'object'
  if (type === String) return 'string'
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

const getDocField = function ({ key, type, label, required, ref, RefComponent = Reference, referenceKey, labelInValue, arrayItemType = String, multiSelect = false, disabled = false, documentRollConfig, isNewDoc, optionLabel, optionKey, options, getParamsByValue, placeholder, objectStructure }) {
  const _disabled = disabled || isFieldDisabled(key, documentRollConfig, isNewDoc)
  const _label = label || startCase(key)

  if (ref) {
    return (
      <RefComponent url={ref} targetKeyPrefix={referenceKey} key={referenceKey || key} getParamsByValue={getParamsByValue}>
        {({ data, onSearchValueChanged, loading, onFocus }) => {
          if (multiSelect) return <MultiSelect data={data} onSearchValueChanged={onSearchValueChanged} loading={loading} name={key} label={_label} onFocus={onFocus} disabled={_disabled} optionLabel={optionLabel} optionKey={optionKey} placeholder={placeholder} labelInValue={labelInValue} />
          return <Select data={data} onSearchValueChanged={onSearchValueChanged} loading={loading} name={key} label={_label} onFocus={onFocus} optionLabel={optionLabel} optionKey={optionKey} disabled={_disabled} placeholder={placeholder} labelInValue={labelInValue} />
        }}
      </RefComponent>
    )
  }
  if (options) {
    return <Select data={options} name={key} key={key} label={_label} optionLabel={optionLabel} optionKey={optionKey} placeholder={placeholder} />
  }
  if (type === String) {
    return (
      <Input name={key} required={required} label={_label} key={key} disabled={_disabled} placeholder={placeholder} />
    )
  }
  if (type === Number) {
    return (
      <InputNumber name={key} required={required} label={_label} key={key} disabled={_disabled} placeholder={placeholder} />
    )
  }
  if (type === Boolean) {
    return (
      <CheckBox name={key} label={_label} key={key} disabled={_disabled} placeholder={placeholder} />
    )
  }
  if (type === Array) {
    const itemType = getItemTypeAsString(arrayItemType)
    return (
      <ArrayInput name={key} label={_label} key={key} itemType={itemType} disabled={_disabled} placeholder={placeholder} objectStructure={objectStructure} />
    )
  }
  if (type === Date) {
    return (
      <DatePicker name={key} label={_label} key={key} disabled={_disabled} placeholder={placeholder} />
    )
  }
};
export default getDocField;