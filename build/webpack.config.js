const path = require('path');
const pkg = require('../package.json');
const webpack = require('webpack');
const vueconfig = require('./vue-loader.config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = function (libName, entry, isMinify) {
  const plugins = [
    new webpack.DefinePlugin({
      NODE_ENV: '"production"',
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.BannerPlugin([
      pkg.name + ' v' + pkg.version + ' (' + pkg.homepage + ')',
      'Copyright ' + new Date().getFullYear() + ', ' + pkg.author,
      pkg.license + ' license'
    ].join('\n'))
  ];
  if(isMinify){
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true
        }
      }));
  }

  if(typeof entry === 'string') {
    let entry0 = {}
    entry0[libName] = entry
    entry = entry0
  }

  const webpackConfig = {
    entry: entry,
    output: {
      path: path.join(__dirname, '../dist'),
      filename: isMinify ? '[name].min.js' : '[name].js',
      library: libName,
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        //'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src')
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: "vue-loader",
              options: vueconfig
            },
            /*
            {
              loader: "css-inject-loader",
              options: {
                lang: 'less',
                cssFile: path.join(__dirname, '../src/style/theme.less')
              }
            }*/
          ]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          include: [resolve('src'), resolve('test'), resolve('docSrc'), resolve('play')]
        },
      ]
    },
    plugins: plugins
  }
  return webpackConfig;
};
