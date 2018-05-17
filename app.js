
import Config from './config';
import Storer from './util/storage';
import Util from './util/util';

import Api from './util/api';
const api = new Api({
	baseUrl: Config.baseUrl,
})

App({
    Config,
    Storer,
    Api: api,
    Util
})