/* eslint-disable camelcase */
export let getFirestore = function () {
  console.log('Please set getFirestore function with import {set_getFirestore_function} from "redux-admin/firebase"');
};
export const set_getFirestore_function = function (func) {
  getFirestore = func;
};
