//导入express
const express = require('express')
//创建路由
const router = express.Router()
//导入路由处理程序
const userHandler = require('../router_handler/user')
//导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入验证规则
const {reg_login_schema}=require('../schema/user')
//注册用户
router.post('/regustr',expressJoi(reg_login_schema), userHandler.regUser)
//登录用户
router.post('/login',expressJoi(reg_login_schema),userHandler.login)
//暴露出去
module.exports=router
