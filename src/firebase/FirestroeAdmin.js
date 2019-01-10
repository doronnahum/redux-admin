import React, { Component } from 'react';
import Admin from '../Admin';
import PropTypes from 'prop-types';
import {getFirestore} from './initFirebase';

const getParams = ({limit, skip, sort, filters}) => {
  return {
    limit, skip, sort, filters
  }
}
const getShortAsArr = (sort) => {
  if(sort && !sort.undefined){
    const sortKeys = Object.keys(sort)
    const sortByKey = sortKeys[0]
    const sortType = sort[sortByKey] === -1 ? 'desc' : 'asc'
    return [sortByKey, sortType]
  }
}
export default class FirestroeAdmin extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount = () => {
    this.collectionRef = getFirestore().collection(this.props.url);
  }
  

  customDocFetch = async ({payload, data, method}) => {
    let result;
    debugger
    try {
      result = await new Promise((resolve, reject) => {
        if(method === 'delete') {
          this.collectionRef.doc(payload.id).delete()
          .then(doc => {
            resolve(doc)
          })
          .catch(error => {
            reject(error)
          })
        } else if(payload.id) {
          this.collectionRef.doc(payload.id).update(data)
          .then(doc => {
            resolve(doc)
          })
          .catch(error => {
            reject(error)
          })
        }else{
          this.collectionRef.add(data)
          .then(doc => {
            resolve(doc)
          })
          .catch(error => {
            reject(error)
          })
        }
      })
      return {data: {id: payload.id}}
    } catch (error) {
      console.log('error', error)
    }
    return {data: result}
  }
  render() {
    return (
      <Admin
      rowKey='id'
      customDocFetch={this.customDocFetch}
      customListFetch={this.customDocFetch}
      getParams={getParams}
      getListSource={({url, targetKey, params, body}) => {
        return {
          targetKey: targetKey,
          url: url,
          params,
          body,
          customFetch: async (res) => {
            const _params = res.params || {};
            let result;
            const sort = getShortAsArr(_params.sort)
            try {
              result = await new Promise((resolve, reject) => {
                let ref = this.collectionRef;
                let _ref
                if(sort && _params.limit && _params.skip){
                  _ref = ref.limit(_params.limit).startAfter(_params.skip).orderBy(sort[0], sort[1])
                }else if(sort && _params.limit && !_params.skip){
                  _ref = ref.limit(_params.limit).orderBy(sort[0], sort[1])
                } else if(_params.limit && _params.skip) {
                  _ref = ref.limit(_params.limit).startAfter(_params.skip)
                }else if(_params.limit && !_params.skip){
                  _ref = ref.limit(_params.limit)
                }else{
                  _ref = ref
                }
                debugger
                _ref.get().then(snapshot => {
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
        }}
        getDocumentSource={({url, targetKey, params, body, id, data}) => {
          debugger
          return {
            targetKey: targetKey,
            url: id ? `${url}/${id}` : url,
            id,
            refreshType: 'none',
            customFetch: async () => {
              let result;
              try {
                result = await new Promise((resolve, reject) => {
                  this.collectionRef.doc(id).get()
                    .then(doc => {
                      if (doc.exists) {
                        resolve({...doc.data(), id: doc.id})
                      } else {
                        // doc.data() will be undefined in this case
                        reject({error: 'undefined'})
                      }
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
        }}
        disabledFetchDocOnEdit={true}
        {...this.props}
      />
    );
  }
}
