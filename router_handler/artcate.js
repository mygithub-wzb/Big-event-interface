// 导入数据库操作模块
const db = require('../db/index')

//获取文章分类列表成功
module.exports.getArticleCates = (req, res) => {
    // 定义查询分类列表数据的 SQL 语句
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, (err, data) => {
        // SQL 语句执行失败
        if (err) return res.cc(err)
        if (data.length === 0) return res.cc('没有数据')
        // SQL 语句执行成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: data,
        })
    })
}

// 新增文章分类的处理函数
module.exports.addArticleCates = (req, res) => {
    // 1. 定义查重的 sql 语句
    const sql = `select * from ev_article_cate where name=? or alias=?`

    // 2. 执行查重的 sql 语句
    db.query(sql, [req.body.name, req.body.alias], (err, data) => {
        // 3. SQL 语句执行失败
        if (err) return res.cc(err)

        // 4.1 判断数据的 length
        if (data.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 4.2 length 等于 1 的三种情况，分类名称 或 分类别名 被占用
        if (data.length === 1 && data[0].name === req.body.name && data[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (data.length === 1 && data[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (data.length === 1 && data[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        // 定义插入文章分类的 sql 语句
        const sqlstr = `insert into ev_article_cate set ?`
        // 执行插入文章分类的 sql 语句
        db.query(sqlstr, req.body, (err, data) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (data.affectedRows !== 1) return res.cc('新增文章分类失败！')

            // 新增文章分类成功
            res.cc('新增文章分类成功！', 0)
        })
    })
}

// 删除文章分类的处理函数
module.exports.deleteCateById = (req, res) => {
    // 1. 定义删除的 sql 语句
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query('sql', res.params.id, (err, data) => {
        if (err) return res.cc(err)
        if (data.affectedRows !== 1) return res.cc('删除失败')
        res.cc('成功', 0)
    })
}

// 根据 Id 获取文章分类的处理函数
module.exports.getArticleById = (req, res) => {
    // 1. 定义根据 id 获取文章分类的 sql 语句
    const sql = `select * from ev_article_cate where id=? and is_delete=0`
    // 2. 执行查询的 sql 语句
    db.query(sql, req.params.id, (err, data) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是没有查询到任何数据
        if (data.length !== 1) return res.cc('获取文章分类数据失败！')

        // 把数据响应给客户端
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: data[0],
        })
    })
}

// 更新文章分类的处理函数
module.exports.updateCateById = (req, res) => {
    // 1. 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
    // 2. 执行查重的 sql 语句
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, data) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 分类名称 和 分类别名 都被占用
        if (data.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (data.length === 1 && data[0].name === req.body.name && data[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (data.length === 1 && data[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (data.length === 1 && data[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // 更新分类的 sql 语句
        const sqlstr = `update ev_article_cate set ? where id=?`
        // 执行 sql 语句
        db.query(sqlstr, [req.body, req.body.id], (err, data) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)
 
            // SQL 语句执行成功，但是影响行数不等于 1
            if (data.affectedRows !== 1) return res.cc('更新文章分类失败！')

            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
        })
    })
}
