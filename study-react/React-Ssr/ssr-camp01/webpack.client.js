const path = require('path')
// 客户端端的webpack
module.exports = {
  mode:"development",
  // 客户端入口
  entry:'./client/index.js',
  // 客户端输出
  output:{
    filename:'bundle.js',
    path:path.resolve(__dirname, 'public') //静态资源放在public目录下
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