import {Request} from './request';

class Api extends Request {
    constructor(baseUrl) {
        super(baseUrl)
    }
   
    getCopyData() {
        return this.request({
            url: 'copyData',
        })
    }

    addQuestion(opt) {
        opt.updatedAt = opt.createdAt = Date.now();
        opt.isResolved = false;
        return Promise.resolve({
            success: true,
            result: opt,
        })
        // return this.request({

        // })
    }


}

export default Api
