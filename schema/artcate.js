// 1. 导入定义验证规则的模块
const joi = require('@hapi/joi')

// 2/ 定义 name 和 alias 的校验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
// 定义 分类 Id 的校验规则
const id = joi.number().integer().min(1).required()

// 向外共享验证规则对象
module.exports.add_cate_schema = {
  body: {
    name,
    alias
  }
}
// 向外共享删除分类的规则对象
module.exports.delete_cate_schema = {
  params: {
    id
  }
}

// 向外共享根据 Id 获取分类的规则对象
module.exports.get_cate_schema = {
  params: {
    id
  }
}

// 向外共享更新分类的规则对象
module.exports.update_cate_schema = {
  body: {
    id: id,
    name,
    alias 
  }
}

