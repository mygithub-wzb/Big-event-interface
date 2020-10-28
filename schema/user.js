const joi = require('@hapi/joi')
//定义用户名和密码校验规则
const username = joi.string().alphanum().min(2).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
//暴露出去
module.exports.reg_login_schema = {
    body: {
        username,
        password
    }
}

// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
// 更新用户基本信息的验证规则对象
module.exports.update_userinfo_schema = {
    body: {
      id,
      nickname,
      email,
    }
}
  // 重置密码验证规则对象
  module.exports.update_password_schema = {
    body: {
      oldPwd: password,
      newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    }
}
  // 验证头像数据
const avatar = joi.string().dataUri().required()

// 验证规则对象 - 更新头像
module.exports.update_avatar_schema = {
  body: {
    avatar
  }
}