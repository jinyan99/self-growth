const path = require('path')
//需要这个库来做external处理规避nodemodules代码
const nodeExternals = require('webpack-node-externals')
// 服务端的webpack
module.exports = {
  target:"node",//指明构建出的代码是要运行在 node 环境里
  mode:"development",
  entry:'./server/index.js',  //服务端的入口文件，即那个serve端
  externals:[nodeExternals()],
  output:{
    filename:'bundle.js',
    path:path.resolve(__dirname, 'build')
  },
  module:{
    rules:[
      { 
        test:/\.js$/,
        // 才能支持import 支持jsx
        loader:'babel-loader',
        exclude:/node_modules/,
        options:{
          presets:['@babel/preset-react', ['@babel/preset-env']]
        }
      },
      {
        test:/\.css$/,
        use:['isomorphic-style-loader', 'css-loader']
      }
    ]
  }
}