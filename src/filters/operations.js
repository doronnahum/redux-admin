import React from 'react';
import moment from 'moment';
import {
  Input,
  InputNumber,
  Select,
  DatePicker,
  AutoComplete
} from '../fields';
const TYPE_VALUE = 'type...';

export const equal = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <InputNumber name={name} placeholder={TYPE_VALUE} />
  ),
  value: 'equal',
  mongooseCode: '$eq',
  label: 'Equal to',
  info: 'Matches values that are equal to a specified value.',
  type: Number
};
export const notEquals = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <InputNumber name={name} placeholder={TYPE_VALUE} />
  ),
  value: 'notEquals',
  mongooseCode: '$ne',
  label: 'Not equal to',
  info: 'Matches all values that are not equal to a specified value.',
  type: Number
};

export const renderSelectInput = (name, options) => (
  <Select
    showSearch
    data={options}
    optionLabel={'label'}
    optionKey={'value'}
    name={name}
    placeholder={'Select...'}
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
        <AutoComplete data={fieldData} name={name} placeholder={TYPE_VALUE} />
      );
    }
    return <Input name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'stringEqual',
  mongooseCode: '$eq',
  label: 'Equal to',
  info: 'Matches values that are equal to a specified value.',
  type: String
};
export const stringNotEquals = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    if (fieldData) {
      return (
        <AutoComplete data={fieldData} name={name} placeholder={TYPE_VALUE} />
      );
    }
    return <Input name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'stringNotEquals',
  mongooseCode: '$ne',
  label: 'Not equal to',
  info: 'Matches all values that are not equal to a specified value.',
  type: String
};

export const greaterThan = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <InputNumber name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'greaterThan',
  mongooseCode: '$gt',
  label: 'Greater Than',
  info: 'Matches values that are greater than a specified value.',
  type: Number
};
export const greaterThanOrEqual = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <InputNumber name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'greaterThanOrEqual',
  mongooseCode: '$gte',
  label: 'Greater Than or Equal To',
  info: 'Matches values that are greater than or equal to a specified value.',
  type: Number
};

export const lessThan = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <InputNumber name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'lessThan',
  mongooseCode: '$lt',
  label: 'Matches values that are less than a specified value.',
  type: Number
};
export const lessThanOrEqual = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <InputNumber name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'lessThanOrEqual',
  mongooseCode: '$lte',
  label: 'Less Than or Equal To',
  info: 'Matches values that are less than or equal to a specified value.',
  type: Number
};

export const allInArray = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <Input name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'allInArray',
  mongooseCode: '$ne',
  label: 'Matches all in an array.',
  info: 'Matches all values that are not equal to a specified value.',
  type: String
};
export const matchInArray = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <Input name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'matchInArray',
  mongooseCode: '$in',
  label: 'Matches any in an array.',
  info: 'Matches any of the values specified in an array.',
  type: String
};
export const noneInArray = {
  renderInputComponent: (name, fieldData, advanceMode, options) => {
    if (options) {
      return renderSelectInput(name, options);
    }
    return <Input name={name} placeholder={TYPE_VALUE} />;
  },
  value: 'noneInArray',
  mongooseCode: '$nin',
  label: 'Matches any in an array.',
  info: 'Matches none of the values specified in an array.',
  type: String
};

export const dateEqual = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <DatePicker showTime={false} name={name} placeholder={TYPE_VALUE} />
  ),
  value: 'dateEqual',
  mongooseCode: '$eq',
  label: 'Equal to specific date.',
  info: 'Find by date field after specific date.',
  formatter: value => value && moment(value).format('MMMM Do YYYY, h:mm:ss a'),
  type: Date
};
export const after = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <DatePicker showTime={false} name={name} placeholder={TYPE_VALUE} />
  ),
  value: 'after',
  mongooseCode: '$gt',
  label: 'After specific date.',
  info: 'Find by date field after specific date.',
  formatter: value => value && moment(value).format('MMMM Do YYYY, h:mm:ss a'),
  type: Date
};
export const before = {
  renderInputComponent: (name, fieldData, advanceMode) => (
    <DatePicker showTime={false} name={name} placeholder={TYPE_VALUE} />
  ),
  value: 'before',
  mongooseCode: '$lt',
  label: 'Before specific date.',
  info: 'Find by date field before specific date.',
  formatter: value => value && moment(value).format('MMMM Do YYYY, h:mm:ss a'),
  type: Date
};
