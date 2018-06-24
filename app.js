
import Config from './config';
import Storer from './util/storage';
import Util from './util/util';
import DataTransform from './util/dataTransform.js';

import Api from './util/api';
const api = new Api({
	baseUrl: Config.baseUrl,
})
import createStore from './util/createStore';
import rootReducers from './util/xReducers/index';
const XData = createStore(rootReducers)

App({
    Config,
    Storer,
    Api: api,
    Util,
    XData,
    DataTransform
})