const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 服务端的webpack
module.exports = {
  mode:"development",
  // 客户端入口
  entry:'./client/index.js',
  // 客户端输出
  output:{
    filename:'bundle.js',
    path:path.resolve(__dirname, 'public')
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename: 'index.csr.html',
      template: 'src/index.csr.html', //csr的模版
      inject: true
    })
  ],
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
        use:['style-loader',{
          loader:'css-loader',
          options:{
            modules:true
          }//开启这个css modules的功能，在js文件里面就能引用付给styles变量了，如container下的文件。
        }
        ]
      }
    ]
  }
}