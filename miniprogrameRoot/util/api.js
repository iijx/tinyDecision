import {Request} from './request';
import Storer from './storage.js';

class Api extends Request {
    constructor(baseUrl) {
        super(baseUrl)
        
    }

    getCopyData() {
        return this.request({
            url: 'copyData',
        })
    }

    createQuestion(opt) {
        return this.post('/question', {
            ...opt
        })
    }
    getQuestionById(id) {
        return this.get(`/question/${id}`)
    }
    updateQuestion(opt) {
        return this.put('/question', {
            ...opt
        })
    }
   
    getQuestionList() {
        return this.get('/question')
            .then(res => {
                return res.result;
            })
        // return new Promise((resolve, reject) => {
        //     if (Storer.QuestionList.length <= 0) {
        //         this.get('/question')
        //             .then(res => {
        //                 resolve(res.result);
        //             })

        //     } else resolve(Storer.QuestionList);
        // })
    }

    addQuestion(opt) {
        // opt.updatedAt = opt.createdAt = Date.now();
        // opt.isResolved = false;
        // return Promise.resolve({
        //     success: true,
        //     result: opt,
        // })
        return this.request({
            url: '/question',
            data: opt,
        })
    }
    
}

export default Api
