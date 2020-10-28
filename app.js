//导入express
const express = require('express')
// 创建web服务器实例
const str = express()
//
const joi = require('@hapi/joi')
// 导入全局的配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJwt = require('express-jwt')
//导入cors
const cors = require('cors')
// 使用 .unless 方法指定哪些接口不需要进行 Token 的身份认证
str.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))
//导入跨域中间件
str.use(cors())
//导入解析表单中间件
str.use(express.urlencoded({ extended: false }))
//导入解析json格式中间件
str.use(express.json())
//res.cc函数
str.use((req, res, next) => {
    // status 的默认值为 1，表示失败的情况
    // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = (err, status = 1) => {
      res.send({
        status,
        message: err instanceof Error ? err.message : err
      })
    }
  
    next()
  })
//导入路由中间件
str.use('/api',require('./router/user'))
str.use('/my', require('./router/userinfo'))
str.use('/my/article', require('./router/artcate'))
str.use('/my/article', require('./router/article'))
// 托管静态资源文件
str.use('/uploads', express.static('./uploads'))
//定义错误中间件
str.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 在身份认证失败后，捕获并处理 Token 认证失败后的错误
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败！')
        // return res.send({ status: 1, message: '身份认证失败！' })
    }
    // 未知错误
    res.cc(err)
})
//启动服务器
str.listen(80, () => {
    console.log('端口于 http://127.0.0.1');
})