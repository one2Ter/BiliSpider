const superagent = require('superagent');
const moment = require('moment');
moment.locale('zh-cn');

const {
    URL_GET_PACKAGE, URL_USER_INFO, URL_UPLOAD_PACKAGE
} = require('./constants');

/**
 * 休眠函数
 * @param {Number} time 休眠时间(单位毫秒)
 */
const sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
};

const httpGetAsync = (url, opts = { query: [ ] }) => {
    let req = superagent.get(url);
    if (opts && Array.isArray(opts.query) && opts.query.length > 0) {
        for (const q of opts.query) {
            req = req.query(q);
        }
    }
    return req.then((res) => res && res.text);
};

const nowStr = () => moment().format('YYYY-MM-DD HH:mm:ss');

// 区间数组生成 rangeArray(0,4) => [0,1,2,3,4]
const rangeArray = (start, end) => {
    return Array(end - start + 1).fill(0).map((v, i) => i + start);
};

// 按千生成区间数组
const packageArray = (packageId) => {
    return rangeArray(packageId * 1000 + 1, (packageId + 1) * 1000);
};

/**
 * 获取任务包
 */
const getPackageAsync = () => httpGetAsync(URL_GET_PACKAGE);

// 上传任务结果
const uploadPackageAsync = (pid, cardList) => {
    const data = {
        pid: pid,
        package: JSON.stringify(cardList)
    };
    return superagent.post(URL_UPLOAD_PACKAGE).type('form').send(data).then();
};

/**
 * 爬取用户信息
 */
const fetchUserInfo = (mid) => {
    return httpGetAsync(URL_USER_INFO, { query: [{ mid }] });
};

const setMock = (mockModule) => {
    return mockModule(superagent);
};

const OT = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
};

const setOutput = (obj) => {
    for (const method of Object.keys(OT)) {
        const fn = obj[method];
        if (fn && typeof fn === 'function') {
            OT[method] = fn;
        }
    }
};

module.exports = {
    sleep,
    httpGetAsync,
    nowStr,
    packageArray,
    getPackageAsync,
    uploadPackageAsync,
    fetchUserInfo,
    setMock,
    setOutput,
    OT
};
