import startCase from 'lodash/startCase'

import {
  Input,
  MultiSelect,
  Reference,
  Select,
  ArrayInput
} from '../fields'

const getItemTypeAsString = function (type) {
  if(type === Number) return 'number'
  if(type === Object) return 'object'
  if(type === String) return 'string'
}

export const isFieldDisabled = function(fieldName, documentRollConfig = {canCreate: true, canUpdate: true, excludeFields: []}, isNewDoc) {
  let isDisabled = false;
  if(documentRollConfig.excludeFields && documentRollConfig.excludeFields.includes && documentRollConfig.excludeFields.includes(fieldName)) {
    isDisabled = false
  }else{
    if(isNewDoc) {
      isDisabled = !documentRollConfig.canCreate
    }else{
      isDisabled = !documentRollConfig.canUpdate
    }
  }
  return isDisabled
}

const getDocField = function({key, type, label, required, ref, RefComponent = Reference, arrayItemType = String, multiSelect = false, disabled = false, documentRollConfig, isNewDoc, optionLabel, optionKey}) {
  const _disabled = disabled || isFieldDisabled(key, documentRollConfig, isNewDoc)
  const _label = label || startCase(key)
  if (type === String) {
    return (
      <Input name={key} required={required} label={_label} key={key} disabled={_disabled}/>
    )
  }
  if (type === Number) {
    return (
      <Input name={key} required={required} label={_label} key={key} disabled={_disabled}/>
    )
  }
  if (ref) {
    return(
      <RefComponent url={ref} key={key}>
        {({ data, onSearchValueChanged, loading, onFocus }) => {
          if (multiSelect) return <MultiSelect data={data} onSearchValueChanged={onSearchValueChanged} loading={loading} name={key} label={_label} onFocus={onFocus} disabled={_disabled} optionLabel={optionLabel} optionKey={optionKey}/>
          return <Select data={data} onSearchValueChanged={onSearchValueChanged} loading={loading} name={key} label={_label} onFocus={onFocus} optionLabel={optionLabel} optionKey={optionKey}/>
        }}
      </RefComponent>
    )
  }
  if (type === Array) {
    const itemType = getItemTypeAsString(arrayItemType)
    return (
      <ArrayInput name={key} label={_label} key={key} itemType={itemType} disabled={_disabled}/>
    )
  }
};
export default getDocField;