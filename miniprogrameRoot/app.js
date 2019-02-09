import Config from "./config";
import Storer from "./util/storage";
import Util from "./util/util";
import DataTransform from "./util/dataTransform.js";
import CloudRequest from './util/cloudRequest.js'

import Api from "./util/api";
const api = new Api({
    baseUrl: Config.baseUrl
});
import createStore from "./util/createStore";
import rootReducers from "./util/xReducers/index";
const XData = createStore(rootReducers);

console.log(Config)
App({
    onLaunch: function() {
        if (!wx.cloud) {
            console.error("请使用 2.2.3 或以上的基础库以使用云能力");
        } else {
            wx.cloud.init({
                env: Config.env,
                traceUser: true
            });
        }
    },
    Config,
    Storer,
    Api: api,
    Util,
    XData,
    DataTransform,
    CloudRequest
});
