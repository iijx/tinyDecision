// 云函数入口文件
const cloud = require('wx-server-sdk')
const DefaultTpls = require('./DefaultTpls');
cloud.init({
    env: "iijx-tinydesion-test-db8c7b",
    // env: "iijx-tinydecision-db8c7b"
})

const getUserTpls = async (user) => {
    const db = cloud.database();
    const tplCollections = db.collection('tpls');
    
}
// 云函数入口函数
exports.main = async (event, context) => {
    const { tplType } = event;
    switch( tplType ) {
        case 'defaultTpl': return { defaultTpls: DefaultTpls };
        case 'all': return {

            defaultTpls: DefaultTpls,
        }
    }
    return { defaultTpls: DefaultTpls }
}