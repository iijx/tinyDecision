// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require("wx-server-sdk");

// 初始化 cloud
cloud.init({
    // env: "iijx-tinydesion-test-db8c7b",
    env: "iijx-tinydecision-db8c7b"
});

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 *
 * event 参数包含小程序端调用传入的 data
 *
 */
exports.main = async (event, context) => {
    // console.log 的内容可以在云开发云函数调用日志查看
    // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
    const wxContext = cloud.getWXContext();
    const db = cloud.database();
    const userCollections = db.collection("users");
    const userData = { openid: wxContext.OPENID };
    try {
        let curUserPromise = await userCollections.where({ openid: userData.openid }).limit(1).get();
        if (curUserPromise.data.length >= 1) return userData;
        else {
            await userCollections.add({
                data: {
                    ...userData,
                    unionid: wxContext.UNIONID || "",
                    meta: {
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            });
            await cloud.callFunction({
                name: 'question',
                data: {
                    type: 'create',
                    question: {
                        userOpenid: userData.openid,
                        title: '他日，我们还会再见吗？',
                        options: ['会', '不会'],
                        maxLotteryTimes: -1,
                        lotteriedTimes: 0,
                    }
                }
            })
            return userData;
        }
    } catch (error) {
        console.log(error);
        return userData;
    }
};
