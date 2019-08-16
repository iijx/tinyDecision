import cloudRequest from "../../util/cloudRequest";

const { Api, Storer, Util, XData, DataTransform,CloudRequest } = getApp();

Page({
    staticData: {
    },
    data: {
        createType: '', // 创建类型
        title: '',
        options: ['', ''],
        submitLoading: false,
        canSubmit: false,
        switch: false,
    },
    onLoad(opt = {}) {
        console.log('create opt =>', opt);
        this.typeInit(opt );
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
                this.tplInit(opt)
            }, 400);
        } 
        else {
            let _data = { createType: 'question'}
            this.setData(_data)
            this.tplInit(opt);
            wx.setNavigationBarTitle({
                title: '创建问题'
            })
        }
    },
    tplInit(opt) {
        let tplId = opt.tplId;
        if (!tplId) return;

        let { tpls } = XData.getState();
        let tpl = tpls.find( item => item.id === tplId );
        this.setData({
            title: tpl.title,
            options: tpl.options,
        });
        setTimeout(() => {
            this.updateCanSubmit();
        }, 60)

    },
    addOption() {
        this.data.options.push('');
        this.setData({
            options: this.data.options
        })
    },
    titleInput(e) {
        this.data.title = e.detail.value;
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
        if (this.data.title.length > 0 && this.optionsLengthCheck()) {
            !this.data.canSubmit && this.setData({ canSubmit: true })
        } else {
            this.data.canSubmit && this.setData({ canSubmit: false })
        }
    },
    // data reset
    initDataReset() {
        this.setData({
            title: '',
            options: ['', ''],
            submitLoading: false,
            canSubmit: false,
        })
    },
    _createQuestion() {
        Api.createQuestion({
            title: this.data.title,
            options: Util.iFilter(this.data.options, item => item !== ''),
            maxLotteryTimes: this.data.switch ? -1 : 1
        }).then(res => {
            console.log('create res', res)
            let result = DataTransform.question_back2front(res.result)
            console.log('result', result);
            XData.dispatch({
                type: 'ADD_QUESTION',
                value: result
            });
            this.initDataReset();
            wx.redirectTo({
                url: '../detail/detail?id=' + result.id
            })
        })
        // 发送数据
        // CloudRequest.createQuestion({
        //     title: this.data.title,
        //     options: Util.iFilter(this.data.options, item => item !== ''),
        //     maxLotteryTimes: this.data.switch ? -1 : 1
        // }).then(res => {
        //     console.log('create res', res)
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
        // Api.createQuestion({
        //     title: this.data.title,
        //     options: Util.iFilter(this.data.options, item => item !== ''),
        // }).then(res => {
        //     XData.dispatch({
        //         type: 'ADD_TPL',
        //         value: res,
        //     })
        //     wx.navigateBack({});
        // })
        // CloudRequest.createTpl({
        //     title: this.data.title,
        //     options: Util.iFilter(this.data.options, item => item !== ''),
        // }).then(res => {
        //     console.log(res)
        //     XData.dispatch({
        //         type: 'ADD_TPL',
        //         value: res,
        //     })
        //     wx.navigateBack({});
        // })
    },
    _editTpl(_formId) {
        Api.put('/tpl', {
            id: this.staticData.id,
            title: this.data.title,
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

        console.log(this.data.createType, typeof this.data.createType)
        // 创建模板
        if (this.data.createType === 'tpl') {
            this._createTpl(formId);
        } 
        else if (this.data.createType === 'tpl_edit') {
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
    onChange(event){
        const detail = event.detail;
        this.setData({
            'switch' : detail.value
        })

    }
})