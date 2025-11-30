'use strict'

const { merge } = require('webpack-merge')
const baseWebpackConfig = require('@siteminder/webpack-config/lib/dev')

delete(baseWebpackConfig.devServer.proxy)

const webpackConfig = merge(baseWebpackConfig, {
  devServer: {
    proxy: {
      '/api/goldeneye-beef': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          ['^/api/goldeneye-beef']: '',
        },
      },
    },
  },
})

module.exports = webpackConfig
