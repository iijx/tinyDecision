const { Api, Storer, Util, XData, DataTransform,CloudRequest } = getApp();

Page({
    staticData: {
    },
    data: {
        createType: '', // 创建类型
        question: '',
        options: ['', ''],
        submitLoading: false,
        canSubmit: false,
        isShowTplList: false,
        tplList: [],
    },
    typeInit(opt) {
        let _type = opt.type || '';
        if (_type === 'tpl') {
            this.setData({ createType: 'tpl' });
            wx.setNavigationBarTitle({ title: '创建模板' });
        } else if ( _type === 'tpl_edit') {
            this.setData({ createType: 'tpl_edit'});
            wx.setNavigationBarTitle({ title: '编辑模板'});
            this.staticData.id = opt.id;
            setTimeout( () => {
                let { tpls } = XData.getState();
                let tpl = tpls.find( item => item.id === opt.id );
                this.setData({
                    question: tpl.question,
                    options: tpl.options,
                });
                this.updateCanSubmit();
            }, 400);
        } 
        else {
            let _data = { createType: 'question', question: opt.title || ''}
            this.setData(_data)
            wx.setNavigationBarTitle({
                title: 'question create'
            })
        }
    },
    onLoad(opt = {}) {
        console.log('opt => ', opt)
        this.typeInit(opt );
    },
    addOption() {
        this.data.options.push('');
        this.setData({
            options: this.data.options
        })
    },
    questionInput(e) {
        this.data.question = e.detail.value;
        this.updateCanSubmit();
    },
    optionInput(e) {
        let index = e.currentTarget.dataset.index;
        this.data.options[index] = e.detail.value;
        this.updateCanSubmit();
    },
    optionsLengthCheck() {
        let validLength = 0;
        this.data.options.forEach(element => {
            if (element.length > 0) {
                validLength++;
            }
        });
        return validLength >= 2;
    },
    updateCanSubmit() {
        if (this.data.question.length > 0 && this.optionsLengthCheck()) {
            !this.data.canSubmit && this.setData({ canSubmit: true })
        } else {
            this.data.canSubmit && this.setData({ canSubmit: false })
        }
    },
    // data reset
    initDataReset() {
        this.setData({
            question: '',
            options: ['', ''],
            submitLoading: false,
            canSubmit: false,
            submitLoading: false,
        })
    },
    _createQuestion() {
        // 发送数据
        CloudRequest.createQuestion({
            title: this.data.question,
            options: Util.iFilter(this.data.options, item => item !== ''),
        }).then(res => {
            console.log('create res', res)
            let result = DataTransform.question_back2front(res.result)
            XData.dispatch({
                type: 'ADD_QUESTION',
                value: result
            });
            this.initDataReset();
            wx.redirectTo({
                url: '../detail/detail?id=' + result.id
            })
        })
        // Api.post('/question', {
        //     question: this.data.question,
        //     options: Util.iFilter(this.data.options, item => item !== ''),
        //     maxLotteryTimes: 1,
        //     lotteriedTimes: 0,
        // }).then(res => {
        //     // 本地保存
        //     let result = DataTransform.question_back2front(res.result)
        //     XData.dispatch({
        //         type: 'ADD_QUESTION',
        //         value: result
        //     });
        //     this.initDataReset();
        //     wx.redirectTo({
        //         url: '../detail/detail?id=' + result.id
        //     })
        // })
    },
    _createTpl(_formId) {
        Api.post('/tpl', {
            question: this.data.question,
            options: Util.iFilter(this.data.options, item => item !== ''),
            maxLotteryTimes: 1,
        }).then(res => {
            // let result = DataTransform.question_back2front(res.result)
            XData.dispatch({
                type: 'ADD_TPL',
                value: res.result,
            })
            wx.navigateBack({});
        })
    },
    _editTpl(_formId) {
        Api.put('/tpl', {
            id: this.staticData.id,
            question: this.data.question,
            options: Util.iFilter(this.data.options, item => item !== ''),
            
        }).then(res => {
            // let result = DataTransform.question_back2front(res.result)
            let { tpls } = XData.getState();
            let index = tpls.findIndex( item => item.id === res.result.id );
            tpls[index] === res.result;
            // curTpl = res.result;
            console.log('update_tpls', curTpl, tpls)
            XData.dispatch({
                type: 'UPDATE_TPLS',
                value: tpls,
            })
            wx.navigateBack({});
        })
    },
    submit(e) {
        let formId = e.detail.value;
        this.setData({ submitLoading: true });


        // 创建模板
        if (this.data.createType === 'tpl') {
            this._createTpl(formId);
        } 
        if (this.data.createType === 'tpl_edit') {
            this._editTpl(formId);
        } 
        // 创建问题
        else if (this.data.createType === 'question') {
            this._createQuestion(formId);
        }
        else {
            console.log('类型不存在')
        }

    },
    hiddenTplList() {
        this.setData({ isShowTplList: false, })
    },
    importTplBtn() {
        if (this.data.tplList.length <= 0) {
            let { tpls } = XData.getState();
            if (tpls.length <= 0) {
                Api.get('/tpl')
                    .then(res => {
                        let result = res.result.map(item => DataTransform.question_back2front(item))
                        this.setData({
                            tplList: result,
                            isShowTplList: true,
                        })
                    })
            } else {
                this.setData({
                    tplList: tpls,
                    isShowTplList: true,
                })
            }
        }
        else {
            this.setData({ isShowTplList: true })
        }
    },
    tplItemTap(e) {
        let index = Number(e.currentTarget.dataset.index);

        let item = this.data.tplList[index];

        let { question, options } = item;

        this.setData({
            question,
            options,
            isShowTplList: false,
        });
        this.updateCanSubmit();

    },
    showTplList() {
        this.setData({ isShowTplList: true })
        if (this.data.tplList.length <= 0) {
            wx.showModal({
                title: '无',
                content: '模板库是空的啦！',
                confirmText: '去创建',
                success: function (res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../tpl/tpl',
                        })
                    }
                }
            })
        } else {
            this.setData({ isShowTplList: true })
        }
    }
})