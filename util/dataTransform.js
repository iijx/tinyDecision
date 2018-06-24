
const question_back2front = item => {
    return {
        id: item._id,
        options: item.options,
        question: item.question,
        isResolved: item.isResolved,
        resolvedValue: item.resolvedValue || undefined,
        resolvedAngle: item.resolvedAngle || 0,
        resolvedAt: item.resolvedAt || undefined, 
        sortedTime: item.resolvedTime || item.meta.updated,
        maxLotteryTimes: item.maxLotteryTimes,
        lotteriedTimes: item.lotteriedTimes,
    }
}


export default {
    question_back2front,
}