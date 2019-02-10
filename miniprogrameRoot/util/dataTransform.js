
const question_back2front = item => {
    return {
        id: item._id,
        options: item.options,
        question: item.title,
        isResolved: item.resolveInfo.isResolved,
        resolvedValue: item.resolveInfo.resolvedValue || undefined,
        resolvedAngle: item.resolveInfo.resolvedAngle || 0,
        resolvedAt: item.resolveInfo.resolvedTime || undefined, 
        sortedTime: item.resolveInfo.resolvedTime || item.meta.updated,
        maxLotteryTimes: item.maxLotteryTimes,
        lotteriedTimes: item.lotteriedTimes,
    }
}

const question_front2back = item => {
    return {
        id: item.id,
        options: item.options,
        question: item.title,
        resolveInfo: {
            isResolved: item.resolveInfo.isResolved,
            resolvedValue: item.resolveInfo.resolvedValue || undefined,
            resolvedAngle: item.resolveInfo.resolvedAngle || 0,
            resolvedAt: item.resolveInfo.resolvedTime || undefined, 
        },
        maxLotteryTimes: item.maxLotteryTimes,
        lotteriedTimes: item.lotteriedTimes,
    }
}


export default {
    question_back2front,
}