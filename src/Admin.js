/* eslint-disable no-console */
import React, { Component, Fragment, cloneElement } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NetProvider, idKey, Selector, actions } from 'src/components/net-provider';
import { Layout, Breadcrumb, Modal } from 'antd'
import router from './router';
import { sendMessage } from './message'
import isEqual from 'lodash/isEqual';

const { Refresh, Delete, Update } = actions;

const NEW_DOC = 'New'
const EDIT_MODE = 'Edit Mode';
const VIEW_MODE = 'View Mode';
const SET_PARAMS = 'onSetParams';
const BACK = 'onBack'
const REPLACE_PARAMS = 'onReplaceParams'

const DEFAULT_ROLE_CONFIG = {
  canCreate: true,
  canRead: true,
  canUpdate: true,
  canDelete: true,
  excludeFields: []
}

const getDocTargetKey = url => `Admin-${url}-doc`
export const getListTargetKey = url => `Admin-${url}-list`

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSource: null,
      currentId: null,
      currentDocData: null,
      docSource: null,
      showDoc: false,
      docMode: null,
      searchValue: this.props.initialSearchValue,
      limit: this.props.initialLimit,
      skip: this.props.initialSkip,
      sort: this.props.initialSort,
      filters: []
    };
    this.renderList = this.renderList.bind(this)
    this.renderDoc = this.renderDoc.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onCloseFromBreadcrumb = this.onCloseFromBreadcrumb.bind(this)
    this.onEditClick = this.onEditClick.bind(this)
    this.onViewDocClick = this.onViewDocClick.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.renderBreadcrumb = this.renderBreadcrumb.bind(this)
    this.onNewClick = this.onNewClick.bind(this)
    this.onCreateEnd = this.onCreateEnd.bind(this)
    this.onUpdateEnd = this.onUpdateEnd.bind(this)
    this.onDeleteEnd = this.onDeleteEnd.bind(this)
    this.handleRoute = this.handleRoute.bind(this)
    this.getRoleConfig = this.getRoleConfig.bind(this)
    this.handleBackEvent = this.handleBackEvent.bind(this)
    this.onSearchValueChange = this.onSearchValueChange.bind(this)
    this.onPageSizeChange = this.onPageSizeChange.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.onSortChange = this.onSortChange.bind(this)
    this.onQueryParametersChanged = this.onQueryParametersChanged.bind(this)
    this.getParams = this.getParams.bind(this)
    this.onFiltersChanged = this.onFiltersChanged.bind(this)
    this.onUpdateFromList = this.onUpdateFromList.bind(this)
    this.onRefreshList = this.onRefreshList.bind(this)
    this.listTarget = getListTargetKey(this.props.url)
    this.previousRoutes = 0; // This we help us to navigate back only if needed
    this.routeByComponentStart = false; // This will help the popstate listener to not interfere if we are initiated the navigate
  };

  componentDidMount() {
    if(this.props.syncWithUrl) {
      this.syncDocIdFromQueryParams(null, null, null, 'handleListFetchOnLoad')
    }else{
      this.handleListFetchOnLoad()
    }

    this._isMounted = true;
    if (this.props.syncWithUrl) {
      this.popstateListenerAdded = true;
      window.addEventListener('popstate', this.handleBackEvent);
    }
  };

  detectBrowserBackButton(event) {
    if (event && event.currentTarget === window) {
      console.log('detectBrowserBackButton() - Need to test if this a cross browser solution')
      return true
    } else {
      return false
    }
  }

  handleBackEvent(event) {
    if (this._isMounted) {
      /*
        This is the Listener('popstate');
        We want to open/close a document
        but only if the event is from the browser and not from user button click
      */
      const hasBrowserBackButtonClick = this.detectBrowserBackButton(event)
      if (!hasBrowserBackButtonClick) return
      const params = router.onGetParams() || {};
      const { queryParamsPrefix, queryParamsNewKey, queryParamsViewKey, queryParamsEditKey } = this.props
      const routeParams = params || router.onGetParams() || {};
      const _queryParamsNew = routeParams[`${queryParamsPrefix}${queryParamsNewKey}`];
      const _queryParamsView = routeParams[`${queryParamsPrefix}${queryParamsViewKey}`];
      const _queryParamsEdit = routeParams[`${queryParamsPrefix}${queryParamsEditKey}`];
      if (!_queryParamsNew && !_queryParamsView && !_queryParamsEdit) { // This a navigate back
        this.onClose(false)
      } else { // this a navigate forward
        this.syncDocIdFromQueryParams(params, true, REPLACE_PARAMS)
      }
    }
  }

  handleRoute(type, data) {
    if (!this.props.syncWithUrl) return
    const { queryParamsPrefix, queryParamsNewKey, queryParamsViewKey, queryParamsEditKey } = this.props
    if (type === BACK) {
      if (this.previousRoutes > 0) {
        this.previousRoutes = this.previousRoutes - 1
        router[type](data)
      } else {
        const _queryParamsNewKey = `${queryParamsPrefix}${queryParamsNewKey}`;
        const _queryParamsViewKey = `${queryParamsPrefix}${queryParamsViewKey}`;
        const _queryParamsEditKey = `${queryParamsPrefix}${queryParamsEditKey}`;
        this.handleRoute(REPLACE_PARAMS, { [_queryParamsNewKey]: '', [_queryParamsViewKey]: '', [_queryParamsEditKey]: '' })
      }
    } else {
      this.previousRoutes = this.previousRoutes + 1
      router[type](data)
    }
  }

  getParams() {
    const { searchValue, limit, sort, skip, filters } = this.state
    if (this.props.params) {
      console.warn('redux-admin - please stop using params, it is deprecate, use getParams instep')
      return this.props.params
    }
    if (this.props.getParams) {
      return this.props.getParams({
        searchValue,
        filters,
        limit,
        sort,
        skip,
        props: this.props
      })
    }
  }

  handleListFetchOnLoad() {
    const { getListSource, url, onReadEnd } = this.props
    this.setState({
      listSource: getListSource({ url, targetKey: getListTargetKey(url), params: this.getParams(), onEnd: onReadEnd })
    })
  }

  /**
   * @function syncDocIdFromQueryParams
   * @description This will make the document to stay open on page reload
   */
  syncDocIdFromQueryParams(params, replaceParams = false, updateParamsType, handleListFetchOnLoad) {
    if (this.props.syncWithUrl) {
      const { queryParamsPrefix, queryParamsNewKey, queryParamsViewKey, queryParamsEditKey, allowViewMode } = this.props
      const routeParams = params || router.onGetParams() || {};
      const _queryParamsNew = routeParams[`${queryParamsPrefix}${queryParamsNewKey}`] || '';
      const _queryParamsView = routeParams[`${queryParamsPrefix}${queryParamsViewKey}`] || '';
      const _queryParamsEdit = routeParams[`${queryParamsPrefix}${queryParamsEditKey}`] || '';
      const { canCreate, canUpdate, canRead, excludeFields } = this.getRoleConfig()
      const _excludeFields = excludeFields && excludeFields.length
      if (_queryParamsNew.length && (canCreate || _excludeFields)) {
        this.onNewClick(replaceParams, updateParamsType)
      } else if (_queryParamsEdit.length && (canUpdate || _excludeFields)) {
        this.onEditClick(null, _queryParamsEdit, replaceParams, updateParamsType)
      } else if (_queryParamsView.length && (canRead || _excludeFields) && allowViewMode) {
        this.onViewDocClick(null, _queryParamsView, replaceParams, updateParamsType)
      }else{
        if(handleListFetchOnLoad) this.handleListFetchOnLoad() // We want to load list on load only id doc is not open
      }
    }
  }

  /**
   * @function onEditClick
   * @param {object} row Object that include id inside
   * @param {string} docId Document id
   * @param {*} syncParams default is true, set false to disabled the url params
   * @description This will open a document in Edit mode
   */
  onEditClick(row, docId, syncParams = true, updateParamsType = SET_PARAMS) {
    const { rowKey, getDocumentSource, url, queryParamsPrefix, queryParamsEditKey } = this.props
    const newCurrentId = docId || row[rowKey || idKey]
    const docSource = getDocumentSource({ url, id: newCurrentId, targetKey: getDocTargetKey(url) })
    this.setState({ docSource, showDoc: true, currentId: newCurrentId, docMode: EDIT_MODE, currentDocData: row })
    const _queryParamsEditKey = `${queryParamsPrefix}${queryParamsEditKey}`;
    if (syncParams) this.handleRoute(updateParamsType, { [_queryParamsEditKey]: newCurrentId })
  }
  /**
   * @function onViewDocClick
   * @param {object} row Object that include id inside
   * @param {string} docId Document id
   * @param {*} syncParams default is true, set false to disabled the url params
   * @description This will open a document in Edit mode
   */
  onViewDocClick(row, docId, syncParams = true, updateParamsType = SET_PARAMS) {
    const { rowKey, getDocumentSource, url, queryParamsPrefix, queryParamsViewKey } = this.props
    const newCurrentId = docId || row[rowKey || idKey]
    const docSource = getDocumentSource({ url, id: newCurrentId, targetKey: getDocTargetKey(url) })
    this.setState({ docSource, showDoc: true, currentId: newCurrentId, docMode: VIEW_MODE, currentDocData: row })
    const _queryParamsViewKey = `${queryParamsPrefix}${queryParamsViewKey}`;
    if (syncParams) this.handleRoute(updateParamsType, { [_queryParamsViewKey]: newCurrentId })
  }
  /**
   * @function onDeleteClick
   * @param {object} row Object that include id inside
   * @param {string} docId Document id
   * @param {*} syncParams default is true, set false to disabled the url params
   * @description This will open a document in Edit mode
   */
  onDeleteClick(row, docId, syncParams = true) {
    const { url, rowKey } = this.props
    if (!row && !docId) {
      console.warn('onDeleteClick Missing row or docId')
    }
    const title = row ? this.props.getDocTitle(row) : docId
    const id = row ? row[rowKey || idKey] : docId
    const _this = this;
    Modal.confirm({
      title: 'Please Confirm Your Request',
      content: `Are you sure delete ${title} ?`,
      okText: 'Delete',
      okType: 'danger',
      maskClosable: true,
      cancelText: 'Cancel',
      onOk() {
        return new Promise((resolve, reject) => {
          _this.props.actions.Delete({
            targetKey: getListTargetKey(url),
            id,
            onEnd: () => {
              sendMessage('Delete successfully');
              _this.onChangeEndFromList()
              resolve()
            },
            onFailed: () => {
              resolve()
              sendMessage('Delete failed');
            },
            customFetch: _this.props.customDocFetch
          })
        }).catch(() => console.log('Oops errors!'));
      },
    });
  }
  /**
   * Put data from list
   */
  onUpdateFromList({id, data}) {
    this.props.actions.Update({
      targetKey: getListTargetKey(this.props.url),
      id,
      data,
      onEnd: () => {
        sendMessage('Update successfully');
        this.onChangeEndFromList()
      },
      onFailed: () => {
        sendMessage('Update failed');
      },
      customFetch: this.props.customListFetch
    })
  }

  /**
   * @function onNewClick
   * @param {*} syncParams default is true, set false to disabled the url params
   * @description This will open a document on New mode
   */
  onNewClick(syncParams = true, updateParamsType = SET_PARAMS) {
    const { getDocumentSource, url, queryParamsPrefix, queryParamsNewKey } = this.props
    const docSource = getDocumentSource({ url, targetKey: getDocTargetKey(url) })
    this.setState({ docSource, showDoc: true, currentId: null, docMode: NEW_DOC, currentDocData: null })
    const _queryParamsNewKey = `${queryParamsPrefix}${queryParamsNewKey}`;
    if (syncParams) this.handleRoute(updateParamsType, { [_queryParamsNewKey]: NEW_DOC })
  }
  /**
   * @function onCreateEnd
   * @param {object} res net-provider onEnd callBack
   * @param {object} res.action the action payload that will be dispatch by net-provider
   * @param {object} res.response response from server
   * @param {object} res.data The data from the response
   * @description This function will be called by document net-provider onEnd callBack
   * The purpose of this is to switch new Doc with edit doc by the doc id that we received from the server
   * And to keep the list update on each document change
   */
  onCreateEnd(res) {
    const { data } = res
    const { queryParamsPrefix, queryParamsEditKey, queryParamsNewKey } = this.props
    if(this.state.listSource) { this.props.actions.Refresh({ targetKey: this.listTarget }) }
    const { getIdFromNewDocResponse, rowKey, idKey } = this.props
    const newDocId = getIdFromNewDocResponse ? getIdFromNewDocResponse(data) : data[rowKey || idKey]
    if (this.props.editAfterSaved) {
      this.onEditClick(null, newDocId, null)
      const _queryParamsNewKey = `${queryParamsPrefix}${queryParamsNewKey}`;
      const _queryParamsEditKey = `${queryParamsPrefix}${queryParamsEditKey}`;
      this.handleRoute(REPLACE_PARAMS, { [_queryParamsNewKey]: '', [_queryParamsEditKey]: newDocId })
    } else {
      this.onClose()
    }
    if (this.props.onChangeEnd) this.props.onChangeEnd(res)
  }

  /**
   * @function onCreateEnd
   * @param {object} res net-provider onEnd callBack
   * @param {object} res.action the action payload that will be dispatch by net-provider
   * @param {object} res.response response from server
   * @param {object} res.data The data from the response
   * @description This function will be called by document net-provider onEnd callBack
   * The purpose of this is to keep the list update on each document change
   */
  onDeleteEnd(res) {
    if(this.state.listSource) { this.props.actions.Refresh({ targetKey: this.listTarget }) }
    if (this.props.onChangeEnd) this.props.onChangeEnd(res)
  }

  /**
   * @function onChangeEndFromList
   * @param {object} res net-provider onEnd callBack
   * @param {object} res.action the action payload that will be dispatch by net-provider
   * @param {object} res.response response from server
   * @param {object} res.data The data from the response
   */
  onChangeEndFromList(res) {
    if (this.props.onChangeEnd) this.props.onChangeEnd(res)
  }

  /**
   * @function onUpdateEnd
   * @param {object} res net-provider onEnd callBack
   * @param {object} res.action the action payload that will be dispatch by net-provider
   * @param {object} res.response response from server
   * @param {object} res.data The data from the response
   * @description This function will be called by document net-provider onEnd callBack
   * The purpose of this is to keep the list update on each document change
   */
  onUpdateEnd(res) {
    if(this.state.listSource) { this.props.actions.Refresh({ targetKey: this.listTarget }) }
    if (this.props.onChangeEnd) this.props.onChangeEnd(res)
  }

  onCloseFromBreadcrumb() {
    this.onClose('syncWithUrl', false)
  }
  /**
   * @function onClose
   * @description This will close the document and navigate back to list
   */
  onClose(syncWithUrl = true, checkBackToParams = true) {
    const params = router.onGetParams() || {}
    if(checkBackToParams && params.backTo && params.backTo.length && !this.state.listSource) {
      // This a situation when we navigate from one list to document in other list
      // for example - from products we click on user and it take as to user doc in the users screen
      router.onBack()
    }else{
      if (this.state.showDoc) {
        if (syncWithUrl) this.handleRoute(BACK)
        if(!this.state.listSource) {
          this.handleListFetchOnLoad() // This append when the screen reload with an open doc, we want to load the list it this situation
        }
        this.setState({ currentId: null, docSource: null, showDoc: false, docMode: null, currentDocData: null })
      }
    }
  }

  /**
   * @function goHome
   * @description This will Replace current route with home route
   */
  goHome() {
    router.goHome()
  }

  onSearchValueChange(eventOrString) {
    const value = (eventOrString && eventOrString.target) ? eventOrString.target.value : eventOrString
    if (this.props.onSearchValueChange) {
      this.props.onSearchValueChange(value)
    } else {
      this.setState({ searchValue: value, skip: 0 }, this.onQueryParametersChanged)
    }
  }

  onFiltersChanged(filters) {
    this.setState({ filters, skip: 0 }, this.onQueryParametersChanged)
  }

  onPageChange(page) {
    const newSkip = (page - 1) * this.state.limit
    if (newSkip !== this.state.skip) this.setState({ skip: newSkip }, this.onQueryParametersChanged)
  }
  onPageSizeChange(current, limit) {
    if (limit !== this.state.limit) this.setState({ limit }, this.onQueryParametersChanged)
  }
  onSortChange(sort) {
    if (!isEqual(sort, this.state.sort)) this.setState({ sort }, this.onQueryParametersChanged)
  }
  onQueryParametersChanged() {
    if(!this.state.listSource) {
      this.handleListFetchOnLoad() // This append when the screen reload with an open doc, we want to load the list it this situation
    }else{
      const params = this.getParams()
      this.props.actions.Refresh({ targetKey: this.listTarget, params })
    }
  }

  getRoleConfig() {
    const { roleConfig } = this.props
    if (!roleConfig) return DEFAULT_ROLE_CONFIG
    else return roleConfig
  }

  onRefreshList() {
    if(!this.state.listSource) {
      this.handleListFetchOnLoad() // This append when the screen reload with an open doc, we want to load the list it this situation
    }else{
      this.props.actions.Refresh({ targetKey: this.listTarget })
    }
  }

  renderList() {
    const { listSource, showDoc } = this.state
    const { list, renderList, rowKey, listClearOnUnMount, allowViewMode } = this.props
    const { canCreate, canDelete, canUpdate, canRead, excludeFields } = this.getRoleConfig()
    if (listSource) {
      return (
        <Fragment>
          <NetProvider loadData={listSource} targetKey={listSource.targetKey} clearOnUnMount={listClearOnUnMount}>
            {props => {
              const propsToPass = {
                ...props,
                onEditClick: this.onEditClick,
                rowKey: rowKey || idKey,
                onNewClick: this.onNewClick,
                onViewDocClick: allowViewMode ? this.onViewDocClick : null,
                onRefreshClick: this.onRefreshList,
                onDeleteClick: this.onDeleteClick,
                onUpdate: this.onUpdateFromList,
                searchValue: this.state.searchValue,
                onSearch: this.onSearch,
                onSearchValueChange: this.onSearchValueChange,
                canCreate: canCreate || !!(excludeFields ? excludeFields.length : false),
                canUpdate: canUpdate || !!(excludeFields ? excludeFields.length : false),
                canDelete,
                canRead,
                skip: this.state.skip,
                limit: this.state.limit,
                onPageSizeChange: this.onPageSizeChange,
                onPageChange: this.onPageChange,
                onSortChange: this.onSortChange,
                onFiltersChanged: this.onFiltersChanged
              }
              if (showDoc) return null;
              if (renderList) return renderList(propsToPass)
              if (list) return cloneElement(list, propsToPass)
              return 'Missing list component or renderList'
            }}
          </NetProvider>
        </Fragment>
      )
    }
  }

  renderDoc() {
    if (!this.state.showDoc) return
    const { docSource, currentId, docMode, currentDocData } = this.state
    const { docWrapper, doc, renderDoc, url, getDocTitle, customDocFetch, disabledFetchDocOnEdit } = this.props
    const Wrapper = docWrapper || Fragment
    const newDocMode = docMode === NEW_DOC;
    const params = router.onGetParams() || {}
    const backToText = (params.backTo && params.backTo.length && !this.state.listSource) ? params.backTo : null;
    // TO OD
    // disabledFetchDocOnEdit NEED TO WORK ONLY WHEN DATA EXIST, NOT WHEN FULL RELOAD
    const loadDataOnMount = newDocMode ? false : (!disabledFetchDocOnEdit || !(disabledFetchDocOnEdit && currentDocData));
    const initialValues = currentDocData || this.props.initialValues;
    const wrapperProps = docWrapper ? { onClose: this.onClose, targetKey: docSource.targetKey } : {}
    const { canCreate, canDelete, canUpdate, excludeFields, canRead } = this.getRoleConfig()
    return (
      <Wrapper {...wrapperProps}>
        <NetProvider loadData={loadDataOnMount ? docSource : null} targetKey={docSource.targetKey} key={newDocMode ? 'new' : currentId}>
          {props => {
            const propsToPass = {
              ...props,
              onClose: this.onClose,
              id: currentId,
              targetKey: docSource.targetKey,
              initialLoadFinished: !props.status || props.status !== 'read-start' || (props.status === 'read-start' && props.data),
              btnSubmitLoading: ['update-start', 'delete-start', 'create-start'].includes(props.status),
              isNewDoc: newDocMode,
              viewMode: docMode === VIEW_MODE,
              url,
              onCreateEnd: this.onCreateEnd,
              onUpdateEnd: this.onUpdateEnd,
              onDeleteEnd: this.onDeleteEnd,
              enabledNew: doc,
              editable: doc,
              getTitle: getDocTitle,
              customFetch: customDocFetch,
              initialValues,
              canCreate,
              canDelete,
              canUpdate,
              canRead,
              excludeFields,
              backToText
            }
            if (renderDoc) return renderDoc(propsToPass);
            if (doc) return cloneElement(doc, propsToPass);
            return 'Missing doc component or renderDoc'
          }}
        </NetProvider>
      </Wrapper>
    )
  }

  renderBreadcrumb() {
    const { docSource, docMode, currentId } = this.state
    const newDocMode = docMode === NEW_DOC;
    const editDocMode = docMode === EDIT_MODE;
    const viewDocMode = docMode === VIEW_MODE;
    const targetKey = (editDocMode || viewDocMode) && docSource && docSource.targetKey
    return (
      <Selector targetKey={targetKey} toSelect='data' key={targetKey || 1}>
        {({ data }) => {
          const title = data ? this.props.getDocTitle(data) : currentId
          return (
            <Breadcrumb className='ra-breadcrumb'>
              <Breadcrumb.Item onClick={this.goHome}> Home </Breadcrumb.Item>
              <Breadcrumb.Item onClick={this.onCloseFromBreadcrumb}> {this.props.title} </Breadcrumb.Item>
              {(editDocMode || viewDocMode) && <Breadcrumb.Item>{title}</Breadcrumb.Item>}
              {newDocMode && <Breadcrumb.Item>New</Breadcrumb.Item>}
            </Breadcrumb>
          )
        }}
      </Selector>
    )
  }

  componentWillUnmount() {
    if (this.popstateListenerAdded) {
      window.removeEventListener('popstate', this.handleBackEvent)
    }
    if (this.props.adminWillUnmount) {
      this.props.adminWillUnmount()
    }
  }

  render() {
    return (
      <Layout className='ra-adminLayout'>
        {this.props.showBreadcrumb && this.renderBreadcrumb()}
        <Layout.Content className='ra-adminLayout-list-wrapper'>{this.renderList()}</Layout.Content>
        {this.props.doc && <Layout.Content className='ra-docWra'>{this.renderDoc()}</Layout.Content>}
      </Layout>
    );
  }
}

Admin.propTypes = {
  url: PropTypes.string.isRequired, // Api endpoint
  list: PropTypes.element,
  renderList: PropTypes.func, // alternative to props.list
  doc: PropTypes.element,
  renderDoc: PropTypes.func, // alternative to props.doc
  title: PropTypes.string,
  getDocTitle: PropTypes.func, // function that get doc data and return the doc title that display inside the breadcrumb (DocData) => 'title'
  queryParamsPrefix: PropTypes.string, // This is required when you render more then one component at the same page
  getListSource: PropTypes.func,
  getDocumentSource: PropTypes.func,
  customDocFetch: PropTypes.func, // Net-provider customFetch That will pass to document
  customListFetch: PropTypes.func, // Net-provider customFetch That will pass to list
  allowViewMode: PropTypes.bool, // set false to block user from watching the document
  syncWithUrl: PropTypes.bool, // true by default, set false to disabled this feature
  showBreadcrumb: PropTypes.bool, // true by default, set false, relevant when you render more then one component at the same page
  editAfterSaved: PropTypes.bool, // true by default, when true new document will stay open after submit
  onChangeEnd: PropTypes.func, // optional Call back After create/update/delete
  onReadEnd: PropTypes.func, // optional Call back After list fetch end
  initialSearchValue: PropTypes.string,
  onSearchValueChange: PropTypes.func, // If You Want To Handle it By Your self
  searchValue: PropTypes.string, // relevant when you pass onSearchValueChange
  initialLimit: PropTypes.number, // default is 5, query limit
  initialSort: PropTypes.object, // { <field1>: 1, <field2>: -1 ... }
  initialSkip: PropTypes.number, // default is 0
  listClearOnUnMount: PropTypes.bool, // true by default, when true we remove all data from store when componentWillUnmount
  adminWillUnmount: PropTypes.func, // optional Call back when componentWillUnmount
  roleConfig: PropTypes.shape({
    canCreate: PropTypes.bool, // true by default
    canRead: PropTypes.bool, // true by default
    canUpdate: PropTypes.bool, // true by default
    canDelete: PropTypes.bool, // true by default
    excludeFields: PropTypes.array // [] by default
  }),
  disabledFetchDocOnEdit: PropTypes.bool, // false by default, set true to save query and use the data the from list as document data
  getParams: PropTypes.func.isRequired // pass function that build query params from the filters parameters getParams({skip, sort, limit, searchValue})
};
Admin.defaultProps = {
  queryParamsPrefix: '',
  queryParamsNewKey: 'n',
  queryParamsViewKey: 'v',
  queryParamsEditKey: 'e',
  getListSource: ({ url, targetKey, params, body, onEnd }) => {
    return {
      targetKey: targetKey,
      url: url,
      params,
      body,
      onEnd,
      // getCountFromResponse: res => res.data.count
    }
  },
  getDocumentSource: ({ url, targetKey, params, body, id, data }) => {
    return {
      targetKey: targetKey,
      url: id ? `${url}/${id}` : url,
      id,
      refreshType: 'none'
    }
  },
  allowViewMode: false,
  syncWithUrl: true,
  showBreadcrumb: true,
  editAfterSaved: true,
  onChangeEnd: null, // Call back After create/update/delete
  initialSearchValue: '',
  initialLimit: 5,
  initialSort: null, // { <field1>: 1, <field2>: -1 ... }
  initialSkip: 0,
  listClearOnUnMount: true, // list clearOnUnMount
  searchValue: null, // If You Want To Handle it By Your self
  adminWillUnmount: null, // Call back when Admin component will un mount
  roleConfig: {
    canCreate: true,
    canRead: true,
    canUpdate: true,
    canDelete: true,
    excludeFields: []
  },
  disabledFetchDocOnEdit: false,
  allowExportToPdf: false,
  allowExportToExcel: true,
  onDownloadPdf: null, // to override local export pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
  onDownloadExcel: null, // to override local export pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
  getParams: (res) => {
    console.log('Redux-admin missing getParams, getParams({skip, sort, limit, searchValue})', res)
  }
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ Refresh, Delete, Update }, dispatch)
  };
}
export default connect(null, mapDispatchToProps)(Admin);
//
/** Example of use the roleConfig with <SimpleDoc getDocFields={getDocFields} />
 *
  const isFieldDisabled = function(fieldName, documentRollConfig = {canCreate: true, canUpdate: true, excludeFields: []}, isNewDoc) {
    let isDisabled = false;
    if(documentRollConfig.excludeFields.includes(fieldName)) {
      isDisabled = false
    }else{
      if(isNewDoc) {
        isDisabled = !documentRollConfig.canCreate
      }else{
        isDisabled = !documentRollConfig.canUpdate
      }
    }
    return isDisabled
  }
  export const getDocFields = function({documentRollConfig, isNewDoc}) {
    return [
      <Input name={'company'} required={required} label={'Company'} disabled={isFieldDisabled('company', documentRollConfig, isNewDoc)}/>
    ]
  };
 *
 *
 */
