//导入数据库
const db = require('../db/index')
//导入加秘bcrypt
const bcrypt = require('bcryptjs')
// 生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件密钥
const config = require('../config')

//暴露处理注册路由模块
module.exports.regUser = (req, res) => {
    // 获取到客户端提交到服务器的用户信息
    const userinfo = req.body
    //判断用户名和密码是否合法
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({
    //     //     status: 1,
    //     //     message: '用户名或密码不正确!'
    //     // })
    //     return res.cc('用户名和密码不正确')
    // }
    // 定义sql语句
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userinfo.username, (err, data) => {
        // 执行sql失败
        if (err) {
            // return res.send({
            //     status: 1,
            //     message: err.message
            // })
            return res.cc(err)
        }
        //判断库中是否有这个用户名
        if (data.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名被占用,请更换用户名'
            // })
            return res.cc('用户名被占用,请更换用户名')
        }

        // 对用户的密码，进行 bcrype 加密，返回值是加密以后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // console.log(userinfo)
        const sqlstr = 'insert into ev_users set ?'
        db.query(sqlstr, { username: userinfo.username, password: userinfo.password }, (err, data) => {
            // 执行sql失败
            if (err) {
                // return res.send({
                //     status: 1,
                //     message: err.message
                // })
                return res.cc(err)
            }
            if (data.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败' })
                return res.cc('注册用户失败')
            }
            // res.send({ status: 0, message: '注册用户成功' })
            res.cc('注册用户成功', 0)
        })
    })

}

//暴露处理登录路由模块
module.exports.login = (req, res) => {
    const userinfo = req.body
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userinfo.username, (err, data) => {
        // 执行sql失败
        if (err) {
            return res.cc(err)
        }
        // 执行 sql 语句成功，但是获取到的数据条数不等于 1
        if (data.length !== 1) {
            return res.cc('登录失败')
        }
        //判断密码是否于库中一致
        const loginResult = bcrypt.compareSync(userinfo.password, data[0].password)
        if (!loginResult) {
            return res.cc('登录失败')
        }
        //   res.send('logon ok')
        const user = { ...data[0], password: '', user_pic: '' }
        // 生成 Token 字符串内容
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.send({
            status: 0,
            message: '登录成功',
            token:'Bearer ' + tokenStr
        })
    })
}
