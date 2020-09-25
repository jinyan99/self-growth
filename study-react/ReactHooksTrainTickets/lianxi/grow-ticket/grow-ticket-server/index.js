const express = require('express')
const path = require('path')
const apiMocker = require('mocker-api')

const app = express()
app.get('/rest',(req,res) => {
    res.json({ii:"90"})
})
apiMocker(app, path.resolve('./mocker/mocker.js'))
app.listen(9001,()=>{console.log('成功')});