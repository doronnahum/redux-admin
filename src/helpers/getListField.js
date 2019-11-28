/* eslint-disable func-names */
import React from 'react';
import startCase from 'lodash/startCase';
import { Tag, Tooltip } from 'antd';
import moment from 'moment';
import printObject from './printObject';

import { LOCALS } from '../local';

const getListField = function ({ key, title, type, render, sorter, width = 150, defaultValue = '', itemType, labelKey, dateFormat }) {
  const field = {
    title: title || startCase(key),
    key,
    dataIndex: key,
    width,
    sorter,
    type,
    className: `ra-listField-${key} ${type === 'link' ? 'ra-list-tr-ellipsis' : ''}`,
  };
  if (render) {
    field.render = render;
  } else if (type === Array || type === 'array') {
    field.render = function (fieldValue) {
      if (fieldValue && fieldValue.length) {
        return (
          <div className="ra-listTags">
            {
              fieldValue.map((val, index) => {
                if (itemType === Object || (val && typeof val === 'object')) return <Tag key={index} style={{ height: 'auto' }} color="geekblue">{labelKey ? val[labelKey] : printObject(val)}</Tag>;
                return <Tag key={index} color="geekblue">{val}</Tag>;
              })
            }
          </div>
        );
      }
      return defaultValue;
    };
  } else if (type === Date || type === 'date') {
    field.width = field.width || 100;
    field.render = function (fieldValue) { return fieldValue ? moment(fieldValue).format(dateFormat || LOCALS.TABLE_DATE_FIELD_FORMAT) : defaultValue; };
  } else if (type === Boolean || type === 'boolean') {
    field.width = field.width || 80;
    field.render = function (fieldValue) { return fieldValue ? <span>&#10004;</span> : <span>&#10008;</span>; };
  } else if (type === Object || type === 'object') {
    if (!labelKey) {
      field.render = function (fieldValue) {
        if (typeof fieldValue === 'string') return fieldValue;
        return JSON.stringify(fieldValue || {});
      };
    } else {
      field.render = function (fieldValue) {
        if (typeof fieldValue === 'string') return fieldValue;
        return fieldValue ? fieldValue[labelKey] : (fieldValue || '');
      };
    }
  } else if (type === 'link') {
    field.render = function (fieldValue) {
      return fieldValue ? (
        <a
          className="ra-linkStyle ra-list-text-ellipsis"
          onClick={(e) => {
            e.stopPropagation();
            window.open(fieldValue);
          }}
        >{fieldValue}
        </a>
      ) : '';
    };
  } else if (field.key === '_id') {
    field.width = 95;
    field.render = function (fieldValue) {
      if (!fieldValue) return;
      const str = fieldValue;
      const start = fieldValue.length - 6;
      return <Tooltip title={fieldValue}>{str.slice(start > 0 ? start : 0, fieldValue.length)}</Tooltip>;
    };
  }
  return field;
};

export default getListField;
