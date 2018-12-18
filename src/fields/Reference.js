import React from 'react';
import PropTypes from 'prop-types';
import { NetProvider } from 'net-provider';

class Reference extends React.Component {
  render() {
    const { url, lazyLoad, params, getParamsByValue, targetKey, clearOnUnMount } = this.props
    const _targetKey = targetKey || `${url}-Reference`
    return (
      <NetProvider
        targetKey={_targetKey}
        loadData={lazyLoad ? {
          targetKey: _targetKey,
          method: 'get',
          url: url,
          params: params,
        } : null}
        clearOnUnMount={clearOnUnMount}
      >
        {({ data, crudActions, loading, status }) => {
          return this.props.children({
            data,
            loading,
            onFocus: () => {
              if (!lazyLoad && !status) {
                crudActions.Refresh({
                  targetKey: _targetKey,
                  method: 'get',
                  url: url,
                  params: getParamsByValue(null)
                })
              }
            },
            onSearchValueChanged: value => {
              crudActions.Refresh({
                targetKey: _targetKey,
                method: 'get',
                url: url,
                params: getParamsByValue(value)
              })
            },
            crudActions
          })
        }}
      </NetProvider>
    )
  }
}
export default Reference;

Reference.defaultProps = {
  lazyLoad: false,
  getParamsByValue: (value) => {
    // eslint-disable-next-line no-console
    console.log('Reference Field - missing getParamsByValue')
    if ((value && value !== '')) return { filter: { name: value } }
    return null
  }
};

Reference.propTypes = {
  url: PropTypes.string,
  lazyLoad: PropTypes.bool,
  params: PropTypes.object,
};
