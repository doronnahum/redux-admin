import React from 'react';
import PropTypes from 'prop-types';
import {NetProvider} from 'net-provider';
import {getFirestore} from '../firebase/initFirebase';

class FireStoreReference extends React.Component {
  constructor(props) {
    super(props)
    this.getPayload = this.getPayload.bind(this)
  }
  componentDidMount = () => {
    this.collectionRef = getFirestore().collection(this.props.url);
  }
  getPayload() {
    const {url, lazyLoad, params, getParamsByValue, targetKey} = this.props
    const _targetKey = targetKey || `${url}-Reference`
    return {
      targetKey: _targetKey,
      method: 'get',
      url: url,
      params: params,
      customFetch: async () => {
        let result;
        try {
          result = await new Promise((resolve, reject) => {
            let ref = this.collectionRef;
            if(params && params.sort){
              ref =  this.collectionRef.orderBy(params.sort)
            };
            ref.limit(5).get()
              .then(snapshot => {
                let data = [];
                snapshot.forEach(doc => {
                  data.push({...doc.data(), id: doc.id})
                })
                resolve(data)
              })
              .catch(error => {
                reject(error)
              })
          })
        } catch (error) {
          console.log('error', error)
        }
        return {data: result}
      }
  }
}
  render() {
    const {url, lazyLoad, params, getParamsByValue, targetKey, clearOnUnMount} = this.props
    const _targetKey = targetKey || `${url}-Reference`
    return (
      <NetProvider
        targetKey={_targetKey}
        loadData={lazyLoad ? this.getPayload() : null}
        clearOnUnMount={clearOnUnMount}
      >
        {({data, crudActions, loading, status}) => {
          return this.props.children({
            data,
            loading,
            onFocus: () => {
              if(!lazyLoad && !status) {
                crudActions.Refresh(this.getPayload())
              }
            },
            onSearchValueChanged: value => {
              crudActions.Refresh(this.getPayload())
            },
            crudActions,
            getPayload: this.getPayload
          })
        }}
      </NetProvider>
    )
  }
}
export default FireStoreReference;

FireStoreReference.defaultProps = {
  lazyLoad: false,
  getParamsByValue: (value) => {
    // eslint-disable-next-line no-console
    console.log('Reference Field - missing getParamsByValue')
    if((value && value !== '')) return {filter: {name: value}}
    return null
  }
};

FireStoreReference.propTypes = {
  url: PropTypes.string,
  lazyLoad: PropTypes.bool,
  params: PropTypes.object,
};
