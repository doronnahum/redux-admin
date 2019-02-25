[[
# net-provider


This package depend on redux-saga and can be run inside react and react-native projects

with net-provider you can read and update your DB is with less of code and less effort by using the set of ready actions or with the data component provider

Demo:
[![Edit redux-admin and net-provider](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/oj541xz8v9)

### NetProvider  Component Basic example
```jsx
import  React  from  "react";
import { NetProvider } from  "net-provider"; 

export  default  class  NetProviderExample  extends  React.Component  {
	render() {
		return  (
			<div>
				<NetProvider
					loadData={{
					url:  "classes/Post",
					targetKey:  "Post-screen",
					customHandleResponse:  res  =>  res.data.results,
					getCountFromResponse:  res  =>  res.data.count,
					params: { limit:  5, count:  1 }
					}}
				>
					{res  => {
						const { data, error, loading, crudActions, count } =  res;
						console.log({ res });
						if  (!data  &&  loading)  return 'Loading...';
						if  (error)  return  "There was an error connecting to server";
						return  (
							<div>
								<h2>count: {count  ||  0}</h2>
								{loading  && 'Loading...'}
								<div>{data  &&  JSON.stringify(data)}</div>
								<button  onClick={crudActions.Refresh}>Refresh</button  >
								<button
									onClick={() => crudActions.Create({
										data: { title:  "New at -"  +  Date.now(), like:  0}
									})}
								>
									Create New
								</button>
							</div>
					);
				}}
			</NetProvider>
		</div>
		);
	}
}
```
### NetProvider  actions&selectors Basic example
```jsx
import  React  from  "react";
import { connect } from  "react-redux";
import { dispatchAction, selectors } from  "net-provider"; 

const  TARGET_KEY  =  "Post-screen";

class  DispatchActionsExample  extends  React.Component  {
componentDidMount() {
	dispatchAction.Read({
		url:  "classes/Post",
		targetKey:  TARGET_KEY,
		customHandleResponse:  res  =>  res.data.results,
		getCountFromResponse:  res  =>  res.data.count,
		params: { limit:  5, count:  1 }
	});
}

render() {
	const { data, error, loading, count } =  this.props;
	console.log({ res:  this.props });
	if  (!data  &&  loading)  return  "Loading...";
	if  (error)  return  "There was an error connecting to server";
	return  (
		<div>
			<div>
				<h2>count: {count  ||  0}</h2>
				{loading  &&  "Loading..."}
				<div>{data  &&  JSON.stringify(data)}</div>
			<button onClick={()  =>  dispatchAction.Refresh({ targetKey:  TARGET_KEY })}>
				Refresh
			</button>
			<button
				onClick={()  => dispatchAction.Create({
									targetKey:  TARGET_KEY,
									data: { title:  "New at -"  +  Date.now(), like:  0 }
								})
						}
				>
				Create New
			</button>
			</div>
		</div>
	);
}
}
const  mapStateToProps  =  (state, props)  => {
const  fetch_obj  =  selectors.getCrudObject(state, TARGET_KEY);
	return {
		data:  fetch_obj.data,
		count:  fetch_obj.count,
		error:  fetch_obj.error,
		loading:  fetch_obj.loading
	};
};

export  default  connect(mapStateToProps,null)(DispatchActionsExample);
```
## Installation

 1. You can install net-provider with [NPM](https://npmjs.com/), [Yarn](https://yarnpkg.com/)
	```jsx
	npm install net-provider--save
	```
 2. Configuration
	 ```jsx
	 import {setApiInstance, setDispatch, setDefaultIdKey, setErrorHandler} from  'net-provider'
	 import  axios  from  'axios';
	 
	 // Set an axios instance
	 setApiInstance(
		 axios.create({baseURL: 'www.myDomain.com'})
	)
	// Set Dispatch - Optional, if you want to use actions with any place without worry about redux-connect
	setDispatch(store.dispatch)
	// Set the unique id Key In Your database
	setDefaultIdKey('_id')
	// Set error handler - Optional,  function that will call whenever an error will catch
	setErrorHandler(
		function(err) {
			if(err  &&  err.response
			&& (err.response.statusText  ===  'Unauthorized'
			||  err.response.status  ===  401)) {
				store.dispatch(logout())}
			}}
	)
	```
3. Add to your reducers
	```jsx
	import { combineReducers } from  'redux';
	import { crudReduxReducer } from  'net-provider'
	export default combineReducers({
	  ...
	 crud: crudReduxReducer 
	});
	```
	<small>* the key must be crud</small>
4. Add your saga watchers
	```jsx
	import { all, call } from  'redux-saga/effects';
	import { crudReduxSaga } from  'net-provider';
	function*  rootSaga() {
	yield  all([
		....
		call(crudReduxSaga, 'crudReduxSaga'),
	]);
	}
	export  default  rootSaga;
	
	```
## Actions
### How to ?
You can dispatch an action from any part of your app like this:

```
import {dispatchAction} from  'net-provider'

dispatchAction.Read({url: 'users', targetKey: 'usersScreen'})
```
And you can use it with out the dispatchAction provider, like this:
if you want to put an action inside saga, use this option.
```
import {actions} from  'net-provider'
dispatch(
	actions.Read({url: 'users', targetKey: 'usersScreen'})
)
```
### Actions list

***Server actions***
 - Create - add  record to DB table
 - Read - Fetch data from server
 - Refresh - Fetch data from server with the last parameters
 - Update- update DB  record
 - Delete- Delete DB  record

**All the server actions accept an object with this parameters**

- **targetKey** {string}  <small> required </small>  the key to set the parameters in store
- **url** {string} API endpoint - required only for the first action to this targetKey
- **method** {string} one of ['get' , 'post' , 'put' , 'delete']
	  method will set by default base the action type but you can override this
	  defaults: Read() = 'get' | Create() = 'post' | Update() = 'put' | Delete() = 'delete'
-  **params** 	 {object}   request  params
-  **data** {object}   request  params
-  **dispatchId** {string} optional -pass dispatch Id that can help you track your specific request
- **customHandleResponse**  {func}  help us find the data from response when the structure is not response.data, this function will get the response from server and need to return the data
- **getCountRequestConfig** {func}- use it when you want to fetch the count from diffrent url, function that get ({actionPayload, response, fetchObject}) => ({url, method, params, data})
		- actionPayload  - the current action.payload that trigger this
		- response - the response from this current request
		- fetchObject - fetchObject from reduxStore.crud[targetKey]  contain  data, lastRead...<br />
		* If you want to skip the request and persist the current count (maybe filters didnt change and only pagination) then return false<br />
when you using this the getCountFromResponse is required and will run on this request response
example:
	```jsx
	<NetProvider onLoad={{
		url: 'products',
		targetKey: 'productsScreen'
		params: {filter: {active: 1}},
		getCountRequestConfig: ({actionPayload, response, fetchObject}) => {
			const currentCount = fetchObject.count
			const  lastFilters  =  getDeepObjectValue(fetchObject, 'lastRead.params.filter')
			const  newFilter  =  getDeepObjectValue(actionPayload, 'params.filter')
			if((currentCount  ||  currentCount  ===  0) &&  isEqual(lastFilters, newFilter)) {
				return  false  // persist count
			}
			const  config  = { url: actionPayload.url  +  '/count', method: actionPayload.method}
			const  filter  =  getDeepObjectValue(response, 'config.params.filter')
			if(filter) { config.params  = {filter} }
			return  config
		},
		getCountFromResponse: (response) => {
			return getDeepObjectValue(response,'data.count') ||  0
		}
	}} />
	```
- **getCountFromResponse**  {func}  help us find the count of your data from the response if it is possible
- **customAxiosInstance** {object} when the default axios is not relevant pass  a different instance
- **customFetch** {func} - when you want to take the control of the fetch to your hand, can be useful for custom requests or for request that need to be handle by SDK or somthing else
	your function will be call by saga like this
	```jsx
	response = yield call(customFetch, { url, method, data, params, payload:  action.payload})
	```
-  **onStart** {func} - call back that be call before the request
- **onEnd** {func} - call back that be call when request end
- **onFailed** {func} - call back that be call when request failed

- **refreshType** {string} - one of ['local', 'server', 'none'] - <small>server is the default</small>
	This parameter is relevant when we change a record inside a list, we let you decide how to keep your list update after any change(create,delete,update)
	
	* **local** - when you dispatch request to server we will update the data Immediately, before we send the request to server, and if the request failed we will restore the change
	this option save data transfer and good for user experience
	*  **server** - in each success change on one of the records we will refresh all the list data.
this option is the default, it will ensure that your data sync with the server, this default because sometimes one change can influencing other parameters
	- **none** - the list will not be affected

- **useResponseValues** - {boolean}- sometimes when we put data to server it will return us an object or a list of objects with the updating values, set true if this is the situation to set the result from server on store

***Local Actions***
- CreateLocal({targetKey, data}) - add record to data inside the redux store
- UpdateLocal({targetKey, data})- update record inside the redux store
- DeleteLocal({targetKey})- delete record from the redux store
- Clean({targetKey})- clean this targetKey from redux-store



## Selectors
All the data will be store inside redux > crud > {.....}
Example:
```jsx
store : {
	crud: {
		"Admin-orders-list" : {
			targetKey: "Admin-orders-list"
			url: "orders"
			status: "read-success"
			error: null
			loading: false
			count: 150
			data: [...]
		},
		"Admin-posts-list" : {
			targetKey: "Admin-posts-list"
			url: "posts"
			status: "read-start"
			error: null
			loading: true
			count: 0
			data: null
		}
	}
}
```
You can connect any component and find the data with our selectors, like that:
```jsx
import { connect } from  'react-redux';
import {selectors} from  'net-provider';

const postListTargetKey = 'Admin-posts-list' // This the target key from your action
const mapStateToProps = state => ({
  adminPostList: selectors.getCrudObject(state, postListTargetKey ),
});

export default connect(mapStateToProps , null)(MyComponent);
```
***Selectors list:***
- getCrudState(state) - will be return all the crud reducer
- getCrudObject(state, TARGET_KEY) - - will be one object that include (data, status, error...)
- getError(state, TARGET_KEY)
- getCount(state, TARGET_KEY)
- getData(state, TARGET_KEY)
- getStatus(state, TARGET_KEY)
## NetProvider component
<NetProvider /\> will handle all for you, when your screen mount the component will fetch data from the server and provide to your function component a query status, data, actions and more...when the screen un mount netProvider will clean the store

**props:**

 - **loadData** -  object or array - This data is the payload for the action, this can be an object, for component that depend on one resource or array for component that depends on more than one resource. <br/> ***see action payload for more details** 
- **clearOnUnMount** - boolean -  default - True <br /> 
- set false when you want to persist your data even when componentWillUnmount 


### NetProvider render methods and props

There are three ways to render things with  `<NetProvider />`

-  component =>  `<NetProvider component={<YourComponent />}>`
-  render props =>`<NetProvider render={(res) => <div></div>}>`
-  children =>`<NetProvider>`{(res) =>  <div\><\/div>} <\/NetProvider>

All three render methods will be passed the same props:
---------------
- **crudActions**: object

A collection of actions:

You can work directly with the dispactActions collection from this package, but when you work with crudActions from the NetProvider you didn't need to pass a targetKey in each request, all the rest is the same like the dispactActions collection

{**Read, Refresh, Create, Update, Delete, SetParameters, Clean, CreateLocal, DeleteLocal, UpdateLocal**} 

- **status: string**
- **error: object**
- **loading:boolean**
- **url: string**
- **count: number**
- **targetKey: string**
- **data: the response from server**
*When the loadData is array then the props will be groups by targetKey

](# redux-admin

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
- Use getDocField helper
- )](# redux-admin

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
)