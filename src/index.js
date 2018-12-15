import _Admin, {getListTargetKey as _getListTargetKey} from './Admin';
import Table from './listView/Table';
import {buildColumnFilterFromData} from './listView/Table/helpers'
import SideModal from './docWrappers/SideModal.js';
import SimpleDoc from './docView/SimpleDoc.js';
import _Translates from './Translates';
import {Layout} from 'antd';
export {Formik, Form, Field, ErrorMessage} from 'formik';
export {setRouteConfig} from './router'
export const layouts = {
  Admin: Layout
}
export const tableHelpers = {
  buildColumnFilterFromData
}
export const docWrappers = {
  SideModal
}
export const listViews = {
  Table
}
export const docViews = {
  SimpleDoc
}

export const Admin = _Admin;
export const Translates = _Translates;
export const getListTargetKey = _getListTargetKey;
