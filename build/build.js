const webpack = require("webpack");
const webpackConfig = require('./webpack.config');

const success = function (stats) {
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
}

const libName = 'spd-page-manage'
const entry = './src/index.js'

webpack(webpackConfig(libName, entry), function (err, stats) {
  if (err) {
    console.log(err)
    throw err
  }
  success(stats)
  webpack(webpackConfig(libName, entry, true), function (err, stats) {
    if (err) {
      console.log(err)
      throw err
    }
    success(stats)
    console.log(' Build complete.\n')
  })

})
