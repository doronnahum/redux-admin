import React, { Component } from 'react';
import { Formik } from 'formik';
// import PropTypes from 'prop-types';
import { Button } from 'antd';
import { getChangedData, objDig } from '../util';
import { sendMessage } from '../message';
import { LOCALS } from '../local';

class SimpleDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.Create = this.Create.bind(this);
    this.Update = this.Update.bind(this);
    this.Delete = this.Delete.bind(this);
    this.onUpdateEnd = this.onUpdateEnd.bind(this);
    this.onCreateEnd = this.onCreateEnd.bind(this);
    this.onDeleteEnd = this.onDeleteEnd.bind(this);
    this.onUpdateFailed = this.onUpdateFailed.bind(this);
    this.onCreateFailed = this.onCreateFailed.bind(this);
    this.onDeleteFailed = this.onDeleteFailed.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onUpdateEnd(payload) {
    sendMessage(LOCALS.NOTIFICATION.UPDATE_SUCCESSFULLY, 'success');
    if (this.props.onUpdateEnd) { this.props.onUpdateEnd(payload); }
  }

  onUpdateFailed(payload) {
    const message = objDig(payload, 'error.response.data.message') || LOCALS.NOTIFICATION.UPDATE_FAILED;
    sendMessage(message, 'error');
    if (this.props.onUpdateFailed) { this.props.onUpdateFailed(payload); }
  }

  onCreateEnd(payload) {
    sendMessage(LOCALS.NOTIFICATION.CREATE_SUCCESSFULLY, 'success');
    if (this.props.onCreateEnd) { this.props.onCreateEnd(payload); }
  }

  onCreateFailed(payload) {
    const message = objDig(payload, 'error.response.data.message') || LOCALS.NOTIFICATION.CREATE_FAILED;
    sendMessage(message, 'error');
    if (this.props.onCreateFailed) { this.props.onCreateFailed(payload); }
  }

  onDeleteEnd(payload) {
    sendMessage(LOCALS.NOTIFICATION.DELETE_SUCCESSFULLY, 'success');
    if (this.props.onDeleteEnd) { this.props.onDeleteEnd(payload); }
  }

  onDeleteFailed(payload) {
    const message = objDig(payload, 'error.response.data.message') || LOCALS.NOTIFICATION.DELETE_FAILED;
    sendMessage(message, 'error');
    if (this.props.onDeleteFailed) { this.props.onDeleteFailed(payload); }
  }

  Update(payload) { this.props.crudActions.Update({ ...payload, refreshType: 'none', onEnd: this.onUpdateEnd, onFailed: this.onUpdateFailed, id: this.props.id, customFetch: this.props.customFetch }); }

  Create(payload) { this.props.crudActions.Create({ ...payload, refreshType: 'none', onEnd: this.onCreateEnd, onFailed: this.onCreateFailed, id: this.props.id, customFetch: this.props.customFetch }); }

  Delete(payload) { this.props.crudActions.Delete({ ...payload, refreshType: 'none', onEnd: this.onDeleteEnd, onFailed: this.onDeleteFailed, id: this.props.id, customFetch: this.props.customFetch }); }

  onSubmit(values) {
    // same shape as initial values
    if (this.props.isNewDoc) {
      const headers = this.props.getHeadersBeforeSubmit ? this.props.getHeadersBeforeSubmit({ dataToSend: values, values }) : null;
      this.Create({ data: this.props.parseDataBeforeSubmit({ dataToSend: values, values }), url: this.props.url, headers });
    } else {
      const dataToSend = getChangedData(values, this.props.data || this.props.initialValues, this.props.immutableKeys);
      if (dataToSend) {
        const headers = this.props.getHeadersBeforeSubmit ? this.props.getHeadersBeforeSubmit({ dataToSend, values }) : null;
        this.Update({ data: this.props.parseDataBeforeSubmit({ dataToSend, values }), headers });
      } else {
        console.log('redux-admin update data request is not send because data was not changed');
      }
    }
  }

  renderViewMode() {
    const { initialLoadFinished, data, validationSchema, getDocFields, crudActions, isNewDoc, status, getTitle, onClose, btnSubmitLoading, id, showFooter, canCreate,
      canDelete,
      canUpdate,
      viewMode,
      excludeFields, renderDocViewComponent } = this.props;
    const propsToPass = {
      dataFromServer: data,
      requestStatus: status,
      Create: this.Create,
      Update: this.Update,
      Delete: this.Delete,
      Read: crudActions.Read,
      Refresh: crudActions.Refresh,
      viewMode: true,
      // roll config
      documentRollConfig: {
        canCreate,
        canUpdate,
        excludeFields,
      },
    };
    return this.props.renderDocViewComponent(propsToPass);
  }

  render() {
    const { initialLoadFinished, data, validationSchema, validate, getDocFields, crudActions, isNewDoc, status, getTitle, onClose, btnSubmitLoading, id, showFooter, canCreate,
      validationSchemaOnCreate,
      validationSchemaOnUpdate,
      canDelete,
      canUpdate,
      viewMode,
      backToText,
      excludeFields,
      updateCounter,
      rtl,
      lang,
    } = this.props;
    const initialValuesToUse = isNewDoc ? (this.props.newDocInitialValues || this.props.initialValues) : this.props.initialValues;
    const dataFromServer = data || initialValuesToUse;
    if (!initialLoadFinished) {
      return (
        <div className="ra-docWrapper ra-simpleForm">
          <div className="ra-docContent">
            <div className="ra-docHeader">
              <Button type="default" icon="left" className="ra-docHeader-back" onClick={onClose}>{backToText || ''}</Button>
              <h1 className="ra-docHeader-title" />
            </div>
            <div className="ra-docBody">
              {LOCALS.DOC.LOADING_TEXT}
            </div>
          </div>
        </div>
      );
    }
    if (viewMode) {
      return (
        <div className="ra-docWrapper ra-simpleForm viewMode">
          <div className="ra-docContent">
            <div className="ra-docHeader">
              <Button type="default" icon="left" className="ra-docHeader-back" onClick={onClose}>{backToText || ''}</Button>
              <h1 className="ra-docHeader-title">{this.props.showTitle && getTitle(dataFromServer)}</h1>
            </div>
            <div className="ra-docBody"> {/* We didn't use <Formik.Form> because we want to enabled nested forms, (form inside form) */}
              <div className="ra-docFields">
                {this.renderViewMode()}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <Formik
        key={isNewDoc ? LOCALS.DOC.NEW_DOC_TITLE : (id + updateCounter)}
        initialValues={data ? { ...data, ...initialValuesToUse } : initialValuesToUse}
        validationSchema={isNewDoc ? validationSchemaOnCreate : validationSchemaOnUpdate || validationSchema}
        validate={validate}
        onSubmit={this.onSubmit}
      >
        {({ isValid, resetForm, touched, values, errors, setFieldTouched }) => {
          const changedData = getChangedData(values, dataFromServer);
          // TODO - make a better disabledSubmit
          const disabledSubmit = btnSubmitLoading
            || (!changedData || Object.keys(changedData).length === 0)
            || (errors && Object.keys(errors).length > 0);
          console.log({ values, changedData, errors, disabledSubmit });
          const propsToPass = {
            isValid,
            resetForm,
            touched,
            values,
            errors,
            dataFromServer,

            requestStatus: status,
            Create: this.Create,
            Update: this.Update,
            Delete: this.Delete,
            Read: crudActions.Read,
            Refresh: crudActions.Refresh,
            onSubmit: this.onSubmit,
            isNewDoc,
            // roll config
            documentRollConfig: {
              canCreate,
              canUpdate,
              excludeFields,
            },
            rtl,
            lang,
            props: this.props,
          };
          const showAllError = () => {
            Object.keys(errors).forEach((item) => {
              setFieldTouched(item, true);
            });
          };
          const showBtn = isNewDoc ? canCreate : canUpdate;
          return (
            <div className={`ra-docWrapper ra-simpleForm ${isNewDoc ? 'newDoc' : ''}`}>
              <div className="ra-docContent">
                <div className="ra-docHeader">
                  <Button type="default" icon="left" className="ra-docHeader-back" onClick={onClose}>{backToText || ''}</Button>
                  <h1 className="ra-docHeader-title">{getTitle(dataFromServer)}</h1>
                </div>
                <div className="ra-docBody"> {/* We didn't use <Formik.Form> because we want to enabled nested forms, (form inside form) */}
                  <div className="ra-docFields">
                    {getDocFields(propsToPass)}
                  </div>
                  {(showFooter && showBtn) && (
                    <div className="ra-docFooter">
                      {showBtn && (
                        <Button
                          type="primary"
                          className={`ra-submitBtn ra-submitBtn-${!disabledSubmit ? 'valid' : 'notValid'}`}
                          loading={btnSubmitLoading}
                          onClick={() => {
                            if (!disabledSubmit) {
                              this.onSubmit(values);
                            } else {
                              showAllError();
                            }
                          }}
                        >
                          {isNewDoc ? LOCALS.DOC.CREATE_BUTTON_TEXT : LOCALS.DOC.UPDATE_BUTTON_TEXT}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

SimpleDoc.defaultProps = {
  getTitle: () => 'Missing getTitle()',
  showFooter: true,
  initialValues: {},
  newDocInitialValues: null, // initailValues that pass only at new Document
  canUpdate: true,
  canCreate: true,
  parseDataBeforeSubmit: ({ dataToSend, values }) => dataToSend, // Use if you want to manipulate the data before PUT/POST to the server
  // getHeadersBeforeSubmit: ({dataToSend, values}) =>  {"content-type": "multipart/form-data"}, // Use if you want to add headers for specific request
  renderDocViewComponent: () => 'Missing renderDocViewComponent - <Admin renderDocViewComponent />',
  viewMode: false,
  showTitle: true,
  backToText: null, // Text to display after < In back button
  immutableKeys: null, // pass array of keys to remove before put
};

export default SimpleDoc;
