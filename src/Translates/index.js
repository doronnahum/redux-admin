/* eslint-disable no-console */
import React, { Component } from 'react';
// import {Modal, Tabs, Tooltip, Button} from 'antd';
import codes from './codes';
import {
  Consumer,
  AutoComplete
} from '../fields'

/*
  Example of use
  <Translates
    renderMainLangComponent={() => <FieldBasicInfo />}
    renderSupportLangComponent={(langCode) => <FieldBasicInfo prefix={`translates.${langCode}.`} translationsMode />}
  />
  Translates will work only with form.values that include translates object,
  How it work, each key in translates is a langCode
  For each key we render tab, by calling renderSupportLangComponent with langCode
  renderSupportLangComponent need to return Formik input with prefix, like that:
  <Input name={`translates.${langCode}.label`} required label={'Label'} />
  and renderMainLangComponent will return a field without prefix, like that:
  <Input name={'label} required label={'Label'} />
  after user Type your data look like that:
  values={{
    label: 'lorem ipsum',
    translates: {
      he: {
        label: 'לורם איפסום'
      }
    }
  }}
*/
const MAIN_LANG_KEY = 'MAIN_LANG_KEY';

class InitialValueHelpers extends Component {
  componentDidMount() {
    const {setFieldValue, initialLangSupport, langSupport, translates, location} = this.props
    if(initialLangSupport && initialLangSupport.length) {
      let missingLang;
      if(langSupport) {
        missingLang = []
        initialLangSupport.forEach(item => {
          if(!langSupport.includes(item)) {
            missingLang.push(item)
          }
        })
      }else{
        missingLang = initialLangSupport
      }
      if(missingLang && missingLang.length) {
        let newTranslates = [...translates]
        missingLang.forEach(lang => {
          const landFromCodesSource = codes.find(item => item.value === lang) // {'value': 'af', 'text': 'Afrikaans'}
          if(!landFromCodesSource) {
            console.warn('redux-admin Translates Initial Value get unknown language code', lang)
          }else{
            const newLang = {langCode: lang, langName: landFromCodesSource.text}
            newTranslates.push(newLang)
          }
        })
        setFieldValue(location, newTranslates)
      }
    }
  }
  render() {
    return (
      null
    );
  }
}

class Translates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: MAIN_LANG_KEY,
      showRemoveConfirmModal: false,
      tabToRemove: null
    };
    this.onEditTabs = this.onEditTabs.bind(this)
    this.closeModals = this.closeModals.bind(this)
    this.onChangeTab = this.onChangeTab.bind(this)
    this.onAddTab = this.onAddTab.bind(this)
  };
  onEditTabs(tabToRemove, actionType) {
    if(actionType === 'remove') {
      this.setState({ showRemoveConfirmModal: true, tabToRemove })
    }else{
      this.onAddTab()
    }
  }
  onAddTab() {
    this.setState({ showAddConfirmModal: true })
  }

  onChangeTab(activeKey) {
    this.setState({activeKey})
  }

  closeModals() {
    this.setState({ showAddConfirmModal: false, showRemoveConfirmModal: false, tabToRemove: null })
  }

  render() {
    const location = this.props.location
    return (
      <div>
        <Consumer>
          {({values, setFieldValue}) => {
            const translates = values[location] || []
            const langSupport = translates.map(item => item.langCode)
            return (
              <div className='ra-translates'>
                <InitialValueHelpers location={location} langSupport={langSupport} initialLangSupport={this.props.initialLangSupport} setFieldValue={setFieldValue} translates={translates}/>
                <Tooltip placement="topLeft" title={'Add another language'} visible={langSupport.length === 0}>
                  <Button icon='plus' className='addBtn' onClick={this.onAddTab} size='small' />
                </Tooltip>
                <Tabs
                  activeKey={this.state.activeKey}
                  type="editable-card"
                  onEdit={this.onEditTabs}
                  onChange={this.onChangeTab}
                  hideAdd
                >
                  <Tabs.TabPane tab={'Default language'} key={MAIN_LANG_KEY} closable={false}>
                    {this.props.renderMainLangComponent()}
                  </Tabs.TabPane>
                  {translates && translates.map((item, index) => {
                    const prefix = `${location}.${index}.`
                    return (
                      <Tabs.TabPane tab={item.langName} key={item.langCode} closable={true}>
                        {this.props.renderSupportLangComponent(item.langCode, prefix)}
                      </Tabs.TabPane>
                    )
                  })}
                </Tabs>
                <Modal
                  title="Add New Language support"
                  visible={this.state.showAddConfirmModal}
                  footer={null}
                  onCancel={this.closeModals}
                >
                  {this.state.showAddConfirmModal && <AutoComplete
                    dataSource={codes.filter(item => !langSupport.includes(item.value))}
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    style={{ width: 200 }}
                    onSelect={(value, res) => {
                      const langName = res.props.children;
                      if(!langSupport.includes(value)) {
                        const newLang = {langCode: value, langName}
                        const newTranslates = [...translates]
                        newTranslates.push(newLang)
                        setFieldValue(location, newTranslates)
                      }
                      this.closeModals()
                    }}
                    placeholder="Search...."
                  />}
                </Modal>
                <Modal
                  title={`Delete ${this.state.tabToRemove} language support`}
                  visible={this.state.showRemoveConfirmModal}
                  onCancel={this.closeModals}
                  onOk={() => {
                    setFieldValue(location, translates.filter(lang => lang.langCode !== this.state.tabToRemove))
                    this.closeModals()
                  }}
                  okType='danger'
                >
                  <p>{'Are you sure you want to delete this language support ?'}</p>
                </Modal>
                {/* {(langSupport.length === 0) && <div className='ra-translatesMessage'>
                  <Alert message="You Can Add More Language Support" type="info" />
                </div>} */}
              </div>
            )
          }}
        </Consumer>
      </div>
    );
  }
}

Translates.defaultProps = {
  location: 'translates',
  initialLangSupport: null // pass Array to work with initial values, like that ['en','he']
};

export default Translates;
