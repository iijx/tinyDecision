
class QuestionModel {
    constructor(question) {
        this.userOpenid = question.userOpenid;
        this.title = question.title;
        this.options = question.options;
        this.maxLotteryTimes = question.maxLotteryTimes || 1;
        this.lotteriedTimes = question.lotteriedTimes || 0;
        this.resolveInfo = {
            isResolved: question.isResolved || false,
            resolvedValue: question.resolvedValue || '',
            resolvedAngle: question.resolvedAngle || 0,
            resolvedTime: question.resolvedTime || new Date('1970-1-1')
        };
        this.meta = {
            created: question.created || Date.now(),
            updated: question.updated || Date.now()
        }
    }
}

module.exports = QuestionModel;