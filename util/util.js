const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

// 是否是数组
const isArray = Array.isArray || function (object) { return object instanceof Array }

const absDate = date => {
	return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}
// 测试手机号 正则
const PatternTest_mobile = mobile => /^1[34578]\d{9}$/.test(mobile);
// Array 的filter函数（原生的有兼容问题）

const iFind = (data, fn) => {
	for( let i = 0; i < data.length; i++ ) {
		if( fn(data[i]) ) return i;
	}
	return -1;
}
// Array 的some函数（原生的有兼容问题）
const iSome = (data, fn) => {
	for( let i = 0, l = data.length; i < l; i++ ) {
		if( fn(data[i]) ) return true;
	}
	return false;
}
// 从参数字符串，生成对象（如 url 后面的参数解析
const parseQueryString = (query) => {
	if( query === '' ) return {};
	var res = {};
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		let key = decodeURIComponent(pair[0]);
		let value = decodeURIComponent(pair[1]);
		res[key] = value; 
	}
	return res;
}
// 字符串中过滤， 只留下汉字，
const strFilterInZH_CN = (str) => {
	let reg = /[\u4e00-\u9fa5]/g;
	let result = str.match(reg);
	if( !result ) return '';
	else return result.join("");
}
// “去抖”函数
const debounce = (fn, wait = 300) => {
	let timer = null, context, args;
	return function() {
		if (timer) clearTimeout(timer);
		else ;
		context = this;
		args = arguments;
		timer = setTimeout(function(){
			timer = null; // 时间到了，执行函数，置空 timer 避免内存泄漏
			fn.apply(context, args)
		}, wait);
	}
}
// “节流”函数（避免重复触发fn函数
const throttle = (fn, wait = 300) => {
	let lastTime = null;
	return function(){
	  let curTime = (new Date()).getTime();
		// 距离下次触发fn还需等待的时间(如果没有lastTime说明是第一次，可以表示执行，即等待时间为0
		let remainTime = lastTime ? wait - (curTime - lastTime) : 0;
		if (remainTime <= 0 || remainTime > wait) {
			lastTime = curTime;
			return fn.apply(this, arguments);
		} 
	}
}
const checkWxAuth = ( scopeStr ) => {
	return new Promise( (resolve, reject) => {
		wx.getSetting({
			success: function(res) {
				if (res.authSetting[`scope.${scopeStr}`]) {
					resolve(true);
				} else resolve(false);
			},
			fail: function() {
				resolve(false);
			}
		})

	})
}
// 不授权就一直打开设置，要求授权
const openSettingUntilAuth = (authPromptText) => {
	return new Promise( (resolve, reject) => {
		(function autoAuth() {
			wx.showModal({
				content: authPromptText || '需要您授权才能继续使用噢',
				comfirmText: '去授权',
				showCancel: false,
				success: function() {
					wx.openSetting({
						success: function(res) {
							if (res.authSetting['scope.userInfo']) resolve(true);
							else autoAuth();
						}
					})
				}
			});
		})();
	})
}
const linkParse = (str) => {
	let paramsArr = str.split('://');
	if (paramsArr.length !== 2) {
		console.log('链接格式错误');
		return 
	} else {
		let ret = {};
		// 跳转 h5
		if ( paramsArr[0] === 'https' || paramsArr[0] === 'http') {
			ret.type = 'H5';
			ret.path = str;
		}  // 跳转 本程序某个页面
		else if( paramsArr[0] === 'page' ){
			ret.type = 'page';
			ret.path = '/' + paramsArr[1];
		}  // 跳转到 其他小程序
		else if( paramsArr[0] === 'miniProgram' ) {
			ret.type = 'miniProgram';
			// 解析出 appid
			try {
				// 其他小程序 appid
				let detail = parseQueryString(paramsArr[1].split('?')[1]);
				ret.appid = detail.appid;
				// 从参数中去除appid参数
				ret.path = (function(){
					let returnPara;
					for (let i = 0; i < detail.length; i++) {
						if (detail[i].split('=')[0] !== 'appid') {
							returnPara = returnPara + detail[i].split('=')[0] + "=" + detail[i].split('=')[1] + "&";
						}
					}
					return returnPara;
				})();
			} catch(e) {
				console.log('跳转其他小程序appid解析错误 e => ', e);
				return;
			}
			ret.path = paramsArr[1];
		}
		return ret;
	}
	console.log('paramsArr', paramsArr);
}
// http协议全部替换为htpps
const linkReplace = (str) => {
  let paramsStr = str.split('://');
  if (paramsStr.length !== 2) {
    console.log('链接格式错误');
    return
  } else {
    let ret = "";
    if (paramsStr[0] === 'http') {
      ret = "https://" + paramsStr[1]
    }
    else if (paramsStr[0] === 'https') {
      ret = str
    }
    return ret;
    console.log('paramsStr', ret);
  }
}
const iFilter = (data, fn) => {
    if (Array.prototype.filter) {
        return data.filter(fn);
    } else {
        var ret = [];
        for( let i = 0; i < data.length; i++ ) {
            if( fn(data[i]) ) ret.push(data[i])
        }
        return ret;
    }
}

const isToday = _date => {
    let date;
    if (typeof _date === 'number') date = new Date(_date);
    else if (typeof date === 'string') date = new Date(Number(_date));
    else date = _date;

    return date.toDateString() === (new Date()).toDateString();
}
const isYestday = _date => {
    let date;
    if (typeof _date === 'number') date = new Date(_date);
    else if (typeof _date === 'string') date = new Date(Number(_date));
    else {
        date = _date;
    }
    console.log('date', date)
    let curDate = new Date();
    let todayStart = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()).getTime();
    let yestdayStart = new Date(todayStart - 24 * 3600 * 1000).getTime();

    return date.getTime() < todayStart && yestdayStart <= date.getTime();
}
export default {
	formatTime,
	isArray,
	absDate,
	PatternTest_mobile,
	parseQueryString,
    iSome,
    iFilter,
    iFind,
    isToday,
    isYestday,
	strFilterInZH_CN,
	debounce,
	throttle,
	checkWxAuth,
	openSettingUntilAuth,
	linkParse,
	linkReplace,
}