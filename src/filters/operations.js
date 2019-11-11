import React from 'react';
import moment from 'moment';
import {
  Input,
  InputNumber,
  Select,
  DatePicker,
  AutoComplete,
} from '../fields';


import { LOCALS } from '../local';


export const equal = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <InputNumber name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />
  ),
  value: 'equal',
  mongooseCode: '$eq',
  label: LOCALS.FILTERS.EQUAL.LABEL,
  info: LOCALS.FILTERS.EQUAL.INFO,
  type: Number,
};
export const notEquals = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <InputNumber name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />
  ),
  value: 'notEquals',
  mongooseCode: '$ne',
  label: LOCALS.FILTERS.NOT_EQUAL.LABEL,
  info: LOCALS.FILTERS.NOT_EQUAL.INFO,
  type: Number,
};

export const renderSelectInput = (name, options) => (
  <Select
    showSearch
    data={options}
    optionLabel="label"
    optionKey="value"
    name={name}
    placeholder={LOCALS.FILTERS.SELECT_PLACE_HOLDER}
  // style={{width: 165}}
  />
);
export const stringEqual = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    if (fieldData) {
      return (
        <AutoComplete data={fieldData} name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />
      );
    }
    return <Input name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'stringEqual',
  mongooseCode: '$eq',
  label: LOCALS.FILTERS.STRING_EQUAL.LABEL,
  info: LOCALS.FILTERS.STRING_EQUAL.INFO,
  type: String,
};
export const stringNotEquals = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    if (fieldData) {
      return (
        <AutoComplete data={fieldData} name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />
      );
    }
    return <Input name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'stringNotEquals',
  mongooseCode: '$ne',
  label: LOCALS.FILTERS.STRING_NOT_EQUAL.LABEL,
  info: LOCALS.FILTERS.STRING_NOT_EQUAL.INFO,
  type: String,
};

export const greaterThan = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <InputNumber name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'greaterThan',
  mongooseCode: '$gt',
  label: LOCALS.FILTERS.GREATER_THAN.LABEL,
  info: LOCALS.FILTERS.GREATER_THAN.INFO,
  type: Number,
};
export const greaterThanOrEqual = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <InputNumber name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'greaterThanOrEqual',
  mongooseCode: '$gte',
  label: LOCALS.FILTERS.GREATER_THAN_OR_EQUAL.LABEL,
  info: LOCALS.FILTERS.GREATER_THAN_OR_EQUAL.INFO,
  type: Number,
};

export const lessThan = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <InputNumber name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'lessThan',
  mongooseCode: '$lt',
  label: LOCALS.FILTERS.LESS_THAN.LABEL,
  info: LOCALS.FILTERS.LESS_THAN.INFO,
  type: Number,
};
export const lessThanOrEqual = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <InputNumber name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'lessThanOrEqual',
  mongooseCode: '$lte',
  label: LOCALS.FILTERS.LESS_THAN_OR_EQUAL.LABEL,
  info: LOCALS.FILTERS.LESS_THAN_OR_EQUAL.INFO,
  type: Number,
};

export const allInArray = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <Input name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'allInArray',
  mongooseCode: '$ne',
  label: LOCALS.FILTERS.ALL_IN_ARRAY.LABEL,
  info: LOCALS.FILTERS.ALL_IN_ARRAY.INFO,
  type: String,
};
export const matchInArray = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <Input name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'matchInArray',
  mongooseCode: '$in',
  label: LOCALS.FILTERS.NONE_IN_ARRAY.LABEL,
  info: LOCALS.FILTERS.NONE_IN_ARRAY.INFO,
  type: String,
};
export const noneInArray = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <Input name={name} placeholder={LOCALS.FILTERS.TYPE_INPUT_PLACE_HOLDER} />;
  },
  value: 'noneInArray',
  mongooseCode: '$nin',
  label: LOCALS.FILTERS.NONE_IN_ARRAY.LABEL,
  info: LOCALS.FILTERS.NONE_IN_ARRAY.INFO,
  type: String,
};

export const dateEqual = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <DatePicker showTime={false} name={name} placeholder={LOCALS.FILTERS.DATE_INPUT_PLACE_HOLDER} />
  ),
  value: 'dateEqual',
  mongooseCode: '$eq',
  label: LOCALS.FILTERS.DATE_EQUAL.LABEL,
  info: LOCALS.FILTERS.DATE_EQUAL.INFO,
  formatter: (value) => value && moment(value).format(LOCALS.FILTERS.MOMENT_FORMAT_DATE),
  type: Date,
};
export const after = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <DatePicker showTime={false} name={name} placeholder={LOCALS.FILTERS.DATE_INPUT_PLACE_HOLDER} />
  ),
  value: 'after',
  mongooseCode: '$gt',
  label: LOCALS.FILTERS.AFTER.LABEL,
  info: LOCALS.FILTERS.AFTER.INFO,
  formatter: (value) => value && moment(value).format(LOCALS.FILTERS.MOMENT_FORMAT_DATE),
  type: Date,
};
export const before = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <DatePicker showTime={false} name={name} placeholder={LOCALS.FILTERS.DATE_INPUT_PLACE_HOLDER} />
  ),
  value: 'before',
  mongooseCode: '$lt',
  label: LOCALS.FILTERS.BEFORE.LABEL,
  info: LOCALS.FILTERS.BEFORE.INFO,
  formatter: (value) => value && moment(value).format(LOCALS.FILTERS.MOMENT_FORMAT_DATE),
  type: Date,
};
