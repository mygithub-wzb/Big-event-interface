// 导入定义验证规则的模块
const joi = require('@hapi/joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.number().integer().valid(0,1).required()

// // 向外共享发布文章的规则对象
module.exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state
  }
}