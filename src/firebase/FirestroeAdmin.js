import React, { Component } from "react";
import Admin from "../Admin";
import PropTypes from "prop-types";
import {getFirestore} from './initFirebase';

export default class FirestroeAdmin extends Component {
  constructor(props) {
    super(props)
    
  }
  componentDidMount = () => {
    this.collectionRef = getFirestore().collection(this.props.url);
  }
  
  
  customDocFetch = async ({payload, data, method}) => {
    let result;
    try {
      result = await new Promise((resolve, reject) => {
        if(method === 'delete'){
          this.collectionRef.doc(payload.id).delete()
            .then(doc => {
              resolve(doc)
            })
            .catch(error => {
              reject(error)
            })
        } else if(payload.id){
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
      return {data: {id: result.id}}
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
        getListSource={({url, targetKey, params, body}) => {
          return {
            targetKey: targetKey,
            url: url,
            params,
            body,
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
        }}
        getDocumentSource={({url, targetKey, params, body, id, data}) => {
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
