

const env = 'DEV'; // PROD || DEV
// const env = 'UAT'; // PROD || DEV
// const env = 'PROD'; // PROD || DEV
const uatConf = {
    // baseUrl: 'http://192.168.1.3:3008/tinydec/api'
    baseUrl: 'http://192.168.1.3:3009'
}


// 开发环境相关配置 
const devConf = {
    baseUrl: 'http://localhost:4000',
    env: 'iijx-tinydesion-test-db8c7b'
}
// 生产环境相关配置
const prodConf = {
    baseUrl: 'https://www.iijx.site/tinydec/api',
    env: 'iijx-tinydecision-db8c7b'
}

// 通用配置
const commonConf = {
    turntable: {
        minBlock: 8, // 此配置不可更改，否则会引起决议角度 resolvedAngle 发生错乱
        colors: ['#ef5350', '#ffa626', '#ffca28', '#66ba6a', '#42a5f5', '#5c6bc0', '#ab47bc', '#ec407a', '#dc1846',
                 '#ef5350', '#ffa626', '#ffca28', '#66ba6a', '#42a5f5', '#5c6bc0', '#ab47bc', '#ec407a', '#dc1846'], 
    },
  
}

// 根据开发/生产环境不同，生成配置
let envConf = (() => {
    switch (env) {
        case 'PROD': return prodConf;
        case 'DEV': return devConf;
        case 'UAT': return uatConf;
        default: return {};
    }
})();

export default {
    ...commonConf,
    ...envConf
}

console.log('this is master1')
