# redux-admin

**Use Redux-admin to build  admin screens for any API in your react app.**

**This component used net-provider to fetch data from server and display a table(or any other component) with form(base the best Formik package) to edit/create documents.**

Demo: [![Edit redux-admin](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/kx0pv848v7)
### NetProvider  Component Basic example
this example will display table (you can customize to another component) with full of spring, pagination, filters and the ability to Create/Edit/Update any document.
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
 3. router configuration - we sync parameters with URL
	 - [Next-js Example](https://github.com/doronnahum/redux-admin/blob/master/next-js-route-config-example.md)
	 - [react-router](https://github.com/doronnahum/redux-admin/blob/master/react-router-route-config-example.md)
 ```
	 setRouteConfig({
	  onReplaceParams: () => {...},
	  onSetParams: : () => {...},
	  onBack: : () => {...},
	  goHome: : () => {...},
	  onGetParams: : () => {...},
	});
```
4. import style
	```jsx
	import  "redux-admin/lib/style.css";
	```
	 
 ## Admin Component
 This is the main component that will be render a list and document
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
	disabledFetchDocOnEdit:  PropTypes.bool, // false by default, set true to save query and use the data the from list as document data
	allowExportToExcel:  PropTypes.bool, // true by default,
	onDownloadExcel:  PropTypes.func, // to override local export pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
	allowExportToPdf:  PropTypes.bool, // false by default
	onDownloadPdf:  PropTypes.func, // pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
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
		{ title:"Title", key:"title", dataIndex: "title", width:150, sorter:true, type: String},
		// You can use helper to save some time
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
				list={<listViews.Table  getColumns={getListFields}  />}
...
```
Each field inside the list columns need to contian this keye

 - title: string
 - key: string
 - dataIndex: string
 - width: number
 - sorter: boolean
 - type: one of: String | Object | Array | Number | Date
 - render : <small>optional</small> fucntion (cell, row) => <MyComponent data={cell} /\>
