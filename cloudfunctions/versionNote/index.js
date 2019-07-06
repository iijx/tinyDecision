// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // env: "iijx-tinydesion-test-db8c7b",
    env: "iijx-tinydecision-db8c7b"
})

// 云函数入口函数
exports.main = async (event, context) => {
    // const wxContext = cloud.getWXContext()
    return {
        versionsNote: [
            {
                versionNum: '1.0.0',
                releaseTime: '2019年2月1日',
                note: ['初次上线']
            }
        ],
        nextVersionNotice: {
            releaseTime: '2月13日',
            content: [
                '模版功能: 可以将自己常用的设定为模板，创建时即可快速创建',
                '高级参数设定: 创建时可自行设定随机次数或者无限次（目前只能随一次）'
            ]
        }
    }
    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}