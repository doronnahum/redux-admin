import _Admin, { getListTargetKey as _getListTargetKey } from './Admin';
import Table from './listView/Table';
import { buildColumnFilterFromData } from './listView/Table/helpers';
import SideModal from './docWrappers/SideModal.js';
import SimpleDoc from './docView/SimpleDoc.js';
import _Translates from './Translates';
import * as _filters from './filters';
import * as _fields from './fields';
import * as _parseServer from './parse-server';
import * as _mongoose from './mongoose';
import _Layout from './Layout';
import { getDocField, getListField } from './helpers';

import enUS from './local/en-US';
import heIl from './local/he-IL';

export { FeathersAdmin } from './feathers';
export { setRouteConfig } from './router';
export { Field, Form } from 'formik';
export { setLocal } from './local';

export const locals = {
  enUS,
  heIl,
};
export const tableHelpers = {
  buildColumnFilterFromData,
};
export const docWrappers = {
  SideModal,
};
export const docHelpers = {
  getDocField,
};
export const listHelpers = {
  getListField,
};
export const listViews = {
  Table,
};
export const docViews = {
  SimpleDoc,
};

export const Layout = _Layout;
export const fields = _fields;
export const filters = _filters;
export const parseServer = _parseServer;
export const mongoose = _mongoose;
export const Admin = _Admin;
export const Translates = _Translates;
export const getListTargetKey = _getListTargetKey;
