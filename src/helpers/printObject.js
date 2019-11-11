import React from 'react';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import startCase from 'lodash/startCase';

const fromObjToArray = function (obj) {
  const arr = [];
  forEach(obj, (value, key) => {
  	arr.push({ title: key, value });
  });
  return arr;
};
const _renderValue = function (value) {
  return renderValue(value);
};
const renderValue = function (value) {
  const type = typeof value;
  if (type === 'boolean') return value ? 1 : 0;
  if (type === 'string' || type === 'number') return value;
  if (isArray(value)) return value.map((item) => _renderValue(item)).join('');
  if (type === 'object') return JSON.stringify(value);
  return '';
};

const printObject = (objData) => (
    <div className="ra-printObject-item-wrapper">
      {fromObjToArray(objData).map(({ title, value }) => <span key={title} className="ra-printObject-item"><strong>{startCase(title)}</strong> : {renderValue(value)}</span>)}
    </div>
  );

export default printObject;
