const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  "mode": "development",
  "entry": {
    "main": "./web/src/main.js"
  },
  "output": {
    "filename": "build.js",
    "path": path.resolve(__dirname, "web/dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'protected.html',
      template: './web/src/gametemplate.html',
      chunks: ["main"]
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './web/src/blocktemplate.html',
      chunks: []
    }),
    //new WorkboxPlugin.GenerateSW({})
  ]
}