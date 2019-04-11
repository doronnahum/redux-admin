# redux-admin

### Build fast admin screen with full CRUD functionality inside your react apps
 [![Edit redux-admin](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/kx0pv848v7)

### Basic example

```jsx
import React, { Component } from "react";
import { listViews, docViews, Admin, fields } from "redux-admin";

const getDocTitle = function(data) {
  if (data && data._id) {
    return `Item ${data.title|| data.objectId}`;
  } else {
    return "New Item";
  }
};

const getListFields = function() {
  return [
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
      width: 150,
      sorter: true,
      type: String
    },
    {
      title: "Likes",
      key: "likes",
      dataIndex: "likes",
      width: 150,
      sorter: true,
      type: Number
    }
  ];
};

const docFields = function() {
  return (
    <div>
      <fields.Input name={"title"} label={"Title"} />
      <fields.InputNumber name={"likes"} label={"Likes"} />
    </div>
  );
};

const renderDocViewComponent = function({ dataFromServer }) {
  return JSON.stringify(dataFromServer);
};

class Posts extends Component {
  render() {
    return (
      <div>
        <Admin
          title={"Posts"}
          getDocTitle={getDocTitle}
          url="classes/Post"
          list={<listViews.Table getColumns={getListFields} />}
          doc={
            <docViews.SimpleDoc
              getDocFields={docFields}
              renderDocViewComponent={renderDocViewComponent}
            />
          }
          roleConfig={{
            canCreate: true,
            canRead: true,
            canUpdate: true,
            canDelete: true,
            excludeFields: []
          }}
        />
      </div>
    );
  }
}

export default Posts;
```

## Installation

 1. You can install redux-admin with [NPM](https://npmjs.com/), [Yarn](https://yarnpkg.com/)
	```jsx
	npm install redux-admin --save
	```
 2. [Follow Net-Provider Installation instruction](https://github.com/doronnahum/net-provider#installation) 
 Net-provider is the connection to your api
 
 4. Router configuration - we sync parameters with URL to achieve a better UX

	```
	 // inside your root file (app.js)
	 import { setRouteConfig } from  'redux-admin';

	 setRouteConfig({
	  onReplaceParams: () => {...},
	  onSetParams: : () => {...},
	  onBack: : () => {...},
	  goHome: : () => {...},
	  onGetParams: : () => {...},
	});
	```
	Examples:
	- [Next-js Route config Example](https://github.com/doronnahum/redux-admin/blob/master/next-js-route-config-example.md)
	- [react-router](https://github.com/doronnahum/redux-admin/blob/master/react-router-route-config-example.md)

4. import style
	```jsx
	import  "redux-admin/lib/style.css";
	```
5. Install [antd](https://ant.design/)	 
 ## Admin Component
This is the main component that will render a list view and document view,
sync the doc view with the list view and keep everything to work nice and updating, display notification, update the list when the document is updating. sync filters with URL.
you can build your own list/doc view

 ```jsx
 import { Admin } from "redux-admin";
```
### Props
```jsx
Admin.propTypes  = {
	url:  PropTypes.string.isRequired, // Api endpoint
	list:  PropTypes.element,
	renderList:  PropTypes.func, // alternative to props.list
	doc:  PropTypes.element,
	renderDoc:  PropTypes.func, // alternative to props.doc
	title:  PropTypes.string,
	getDocTitle:  PropTypes.func, // function that get doc data and return the doc title that display inside the breadcrumb (DocData) => 'title'
	queryParamsPrefix:  PropTypes.string, // This is required when you render more then one component at the same page
	getListSource:  PropTypes.func,
	getDocumentSource:  PropTypes.func,
	allowViewMode:  PropTypes.bool, // set false to block user from watching the document
	syncWithUrl:  PropTypes.bool, // true by default, set false to disabled this feature
	showBreadcrumb:  PropTypes.bool, // true by default, set false, relevant when you render more then one component at the same page
	editAfterSaved:  PropTypes.bool, // true by default, when true new document will stay open after submit
	onChangeEnd:  PropTypes.func, // optional Call back After create/update/delete
	initialSearchValue:  PropTypes.string,
	onSearchValueChange:  PropTypes.func, // If You Want To Handle it By Your self
	searchValue:  PropTypes.string, // relevant when you pass onSearchValueChange
	initialLimit:  PropTypes.number, // default is 5, query limit
	initialSort:  PropTypes.object, // { <field1>: 1, <field2>: -1 ... }
	initialSkip:  PropTypes.number, // default is 0
	listClearOnUnMount:  PropTypes.bool, // true by default, when true we remove all data from store when componentWillUnmount
	adminWillUnmount:  PropTypes.func, // optional Call back when componentWillUnmount
	roleConfig:  PropTypes.shape({
	canCreate:  PropTypes.bool, // true by default
	canRead:  PropTypes.bool, // true by default
	canUpdate:  PropTypes.bool, // true by default
	canDelete:  PropTypes.bool, // true by default
	excludeFields:  PropTypes.array  // [] by default
	}),
	useDataFromList:  PropTypes.bool, // false by default, set true to save query and use the data the from list as document data
	getParams:  PropTypes.func.isRequired  // pass function that build query params from the filters parameters getParams({skip, sort, limit, searchValue})
};
 ```
### List Component
The default list view is Table From [antd](https://ant.design/components/table/)
You can pass other component 

How to use the default view?
```jsx
import { listViews, Admin, helpers } from  "redux-admin";

const getListFields = function(props) {
	return [
			{ title:"Title",
			  key:"title",
			  dataIndex: "title",
			  width:150,
			  sorter:true,
			  type: String
			},
			 // You can use helper to save time
			 helpers.getListField({key: 'body', type: String})
		   ]
}
class  Posts  extends  Component  {
	render() {
		return  (
			<Admin 
				url="classes/Post"
				title={"Posts"}
				getDocTitle={getDocTitle}
				list={<listViews.Table
					   getColumns={getListFields}/>
					  }
...
```
Each field inside the list columns need to contian this keys

 - title: string
 - key: string
 - dataIndex: string
 - width: number
 - sorter: boolean
 - type: one of: String | Object | Array | Number | Date
 - render : <small>optional</small> fucntion (cell, row) => <MyComponent data={cell} /\>

### listViews.Table props
<Admin \/> will pass the data and handle the row clicks and so on, the is the relevant props to pass directly to the table component
```
ReTable.propTypes  = {
	getColumns: PropTypes.func.isRequired, // getColumns(this.props) -> [{value: 'title', label: 'Title', type: String, render: () => 'OPTIONAL'}]
	getFilterFields: PropTypes.func, // if empty then we use getColumns
	rowKey: PropTypes.string, // default is _id
	renderInsideRowActions: PropTypes.func, // renderInsideRowActions(cell, row) => <button>Delete</button>
	allowFilters: PropTypes.bool,
	allowAdvanceFilters: PropTypes.bool, // true by default, allow the user to filter data with greater / less than, before/after and more...
	showColumnFilters: PropTypes.bool, // true by default, allow user to hide some of the table columns
	filtersFields: PropTypes.array, // when empty all table fields ar filters fields, pass array of fieldKeys to allow only some of them , Example [{key: 'status', options: {value: 'ctr', label: 'Create'}}]
	allowExportToExcel: PropTypes.bool, // true by default,
	onDownloadExcel: PropTypes.func, // to override local export pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
	expandedRowRender: PropTypes.func, // antd table expandedRowRender
	renderHeaders: PropTypes.func, // render content inside headers renderHeaders(props) => <div>Hello</div>
};
```
This is the full props option if you want to work with this component as a table outside of the <Admin \/> component
```
ReTable.propTypes  = {
	data: PropTypes.array,
	getColumns: PropTypes.func.isRequired, // getColumns(this.props) -> [{value: 'title', label: 'Title', type: String, render: () => 'OPTIONAL'}]
	getFilterFields: PropTypes.func, // if empty then we use getColumns
	rowKey: PropTypes.string,
	editable: PropTypes.bool,
	canUpdate: PropTypes.bool,
	canDelete: PropTypes.bool,
	renderInsideRowActions: PropTypes.func, // renderInsideRowActions(cell, row) => <button>Delete</button>
	onEditClick: PropTypes.func,
	onDeleteClick: PropTypes.func,
	skip: PropTypes.number,
	limit: PropTypes.number,
	onRow: PropTypes.func,
	onNewClick: PropTypes.func,
	onRefreshClick: PropTypes.func,
	enabledNew: PropTypes.bool,
	searchValue: PropTypes.string,
	showSearchField: PropTypes.bool,
	onSearch: PropTypes.func,
	onSearchValueChange: PropTypes.func,
	onFiltersChanged: PropTypes.func,
	allowAdvanceFilters: PropTypes.bool,
	allowFilters: PropTypes.bool,
	loading: PropTypes.bool,
	count: PropTypes.number,
	onPageChange: PropTypes.func,
	onPageSizeChange: PropTypes.func,
	onViewDocClick: PropTypes.func,
	showColumnFilters: PropTypes.bool,
	filtersFields: PropTypes.array, // when empty all table fields ar filters fields, pass array of fieldKeys to allow only some of them , Example [{key: 'status', options: {value: 'ctr', label: 'Create'}}]
	allowExportToExcel: PropTypes.bool, // true by default,
	onDownloadExcel: PropTypes.func, // to override local export pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
	allowExportToPdf: PropTypes.bool, // false by default
	onDownloadPdf: PropTypes.func, // pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
	expandedRowRender: PropTypes.func, // antd table expandedRowRender
	renderHeaders: PropTypes.func, // render content inside headers renderHeaders(props) => <div>Hello</div>
};
```
### Document Component
This is the default doc view for edit&create mode.
We use [formik](https://github.com/jaredpalmer/formik) to handle hower form 

You can pass other components if you want to take the controls to your hands 

How to use the default document?

```jsx
import { docViews, Admin, helpers, fields } from  "redux-admin";

const getDocFields = function(props) {
	return (
	<div>
		<fields.Input
			name={'email'}
			required label={'Email}
			key={'email'}
		/>
		<span>{helpers.getDocField({ // You can use helper to save time
				key: 'name',
				type: String,
				label: 'Name',
				required: true,
				documentRollConfig: props.documentRollConfig,
				isNewDoc: props.documentRollConfig,
			 })
		}</span>
	</div>
	)}
class  Posts  extends  Component  {
	render() {
		return  (
			<Admin 
				url="classes/Post"
				title={"Posts"}
				getDocTitle={getDocTitle}
				doc={<docViews.SimpleDoc
					   getDocFields={getDocFields}/>
					  }
...
```

### getDocFields()


getDocfields -  return the element that we will render inside the edit/create doc view.

the element can be any HTML element, we wrap your element with Formik/Form to handle the form state, your inputs need to include name, see  [Formik](https://github.com/jaredpalmer/formik) guide.

you can use redux-admin fields or use any fields that wrapped by Formik/Field

Examples-
- Simple input
	```jsx
	import  { Field }  from  'formik';

	const getDocFields = () => (<Field  type="email"  name="email"  placeholder="Email"  />
	)
	```
