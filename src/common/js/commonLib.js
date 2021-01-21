// 正则格式化日期
export function formatDate(date, dateFormat) {
    /* 单独格式化年份，根据y的字符数量输出年份
   * 例如：yyyy => 2019
          yy => 19
          y => 9
   */
    if (/(y+)/.test(dateFormat)) {
        dateFormat = dateFormat.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
    }
    // 格式化月、日、时、分、秒
    let o = {
        'm+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'i+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(dateFormat)) {
            // 取出对应的值
            let str = o[k] + ''
            /* 根据设置的格式，输出对应的字符
             * 例如: 早上8时，hh => 08，h => 8
             * 但是，当数字>=10时，无论格式为一位还是多位，不做截取，这是与年份格式化不一致的地方
             * 例如: 下午15时，hh => 15, h => 15
             */
            dateFormat = dateFormat.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            )
        }
    }
    return dateFormat
}

// 日期时间补零
export function padLeftZero(str) {
    str = str + ''
    return ('00' + str).substr(str.length)
}

// 文件转base64
export function getBase64(cfg) {
    let config = {
        // inputElement[0].files[0]
        file: null,
        // 回调函数，
        callback: null,
        // 此数据仅进行回调返回，不做任何改动
        originData: null
    };
    Object.assign(config, cfg);
    let file = cfg.file;
    let result = {
        error: false,
        base64: null,
        originData: cfg.originData
    };
    if (file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            result.error = true;
            result.base64 = event.target.result;
            cfg.callback && cfg.callback(result);
        };
        reader.readAsDataURL(file);
    } else {
        cfg.callback && cfg.callback(result);
    }
}

/*
 * 解析url参数
 * @example ?id=12345&a=b
 * @return
 */
export function urlParse() {
    let url = window.location.href;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
    }
    return obj;
}

/*
 * 生成随机数字
 */
export function randomNumber(length) {
    return Math.random().toString(10).substr(2).substring(0, length);
}