// 云函数入口文件
const cloud = require('wx-server-sdk')
const QuestionModel = require('./model');
cloud.init({
    env: "iijx-tinydesion-test-db8c7b"
})

const createQuestion = async question => {
    const db = cloud.database();
    const qCollections = db.collection('questions');
    const curQuestion = new QuestionModel(question);
    consoel.log('will be store database:', curQuestion);
    return await qCollections.add({
        data: curQuestion
    })
    

} 
// 云函数入口函数
exports.main = async (event, context) => {
    const { type, question } = event;
    switch(type) {
        case 'create': return await createQuestion(question);
    }
}