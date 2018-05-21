const { Api, Storer, Util} = getApp();
Page({
    data: {
        question: '',
        options: ['', ''],
        submitLoading: false,
        canSubmit: false,
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
        console.log('..', validLength)
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
    submit(e) {
        this.setData({ submitLoading: true });
        // 发送数据
        Api.addQuestion({
            question: this.data.question,
            options: Util.iFilter(this.data.options, item => item !== ''),
            maxLotteryTimes: 1,
            lotteriedTimes: 0,
        }).then( res => {
            // 本地保存
            res.result.id = Storer.QuestionList.length;
            Storer.QuestionList.unshift( res.result );
            Storer.setData('QuestionList');
            this.initDataReset();
            wx.redirectTo({
                url: '../detail/detail?id=' + res.result.id
            })
        })
    }
})