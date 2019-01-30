// 云函数入口文件
const cloud = require('wx-server-sdk')
const QuestionModel = require('./model');
cloud.init({
    // env: "iijx-tinydesion-test-db8c7b",
    env: "iijx-tinydecision-db8c7b"
})

const createQuestion = async question => {
    const db = cloud.database();
    const qCollections = db.collection('questions');
    if (!question.userOpenid) {
        const wxContext = cloud.getWXContext();
        question.userOpenid = wxContext.OPENID
    }
    const curQuestion = new QuestionModel(question);
    return await qCollections.add({
        data: curQuestion
    }).then(res => {
        console.log(res);
        return {
            _id: res._id,
            ...curQuestion
        }
    })
}

const updateQuestion = async question => {
    const db = cloud.database();
    const qCollections = db.collection('questions');
    // question.resolveInfo = {
    //     isResolved: question.isResolved,
    //     resolveInfo
    // }
    console.log('will be update question', question)
    return qCollections.doc(question.id).update({
        data: {
            ...question,
            meta:{
                updated: Date.now()
            }
        }
    })
}
// 云函数入口函数
exports.main = async (event, context) => {
    const { type, question } = event;
    switch(type) {
        case 'create': return await createQuestion(question);
        case 'update': return await updateQuestion(question);
    }
}