module.exports = {
  npm: {
    umd: {
      externals: {
        'net-provider': 'net-provider',
        'antd': 'antd',
        'react': 'React',
        'react-redux': 'react-redux',
        'react-dom': 'react-dom',
        'redux': 'redux',
        'redux-saga': 'redux-saga'
      }
    }
  }
}