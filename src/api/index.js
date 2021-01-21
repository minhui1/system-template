import axios from 'axios'
import Qs from 'qs'
import { Modal } from 'antd'

// let API_DOMAIN = '/xmu-bj-server/api/admin/'
let API_DOMAIN = '/interactive/api/'
if(process.env.NODE_ENV === 'production') {
    // API_DOMAIN = '/xmu-bj-server/api/admin/'
    API_DOMAIN = 'http://10.10.13.246:8090/interactive/api'
}

// API请求正常，数据正常
export const API_CODE = {
    // API请求正常
    OK: 200,
    // API请求正常，数据异常
    ERR_DATA: 403,
    // API请求正常，空数据
    ERR_NO_DATA: 301,
    // API请求正常，登录异常
    ERR_LOGOUT: 401
}
// API请求异常
export const API_FAILED = '网络连接异常，请稍后再试';
export const API_LOGOUT = '您的账号已在其他设备登录，请重新登录';

export const apiReqs = {
    // 管理员登录
    adminSignIn: (data, callback) => {
        let axiosConfig = {
            method: 'post',
            url: API_DOMAIN + 'admin/login',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: Qs.stringify(data)
        }

        axios(axiosConfig).then((res) => {
            let result = res.data
            callback.done && callback.done()
            if (result.code === API_CODE.OK) {
                window.localStorage.setItem('loginInfo', JSON.stringify({
                    accessToken:'Bearer ' + result.data.accessToken,
                    username: result.data.username,
                    nickname: result.data.nickname,
                }))
                callback.succ && callback.succ()
            } else {
                callback.fail && callback.fail(result)
            }
        }).catch((err) => {
            callback.done && callback.done()
            callback.fail && callback.fail({
                message: API_FAILED
            })
        })
    },
    // 管理员登出
    adminSignOut: (self) => {
        const { uid, accessToken } = getLocalLoginInfo()
        let headers = {
            loginUid: uid,
            'access-token': accessToken
        }
        let axiosConfig = {
            method: 'post',
            url: API_DOMAIN + 'logout',
            headers
        }
        axios(axiosConfig).then((res) => {
            logout(self)
        }).catch(() => {
            logout(self)
        })
    },
    // 管理员修改本人信息
    modifySelfInfo: (config) => {
        config.url = API_DOMAIN + 'admin/modifySelfInfo'
        config.formData = true
        apiRequest(config)
    },
    // 修改管理员密码
    modifyAdminPassword: (config) => {
        config.url = API_DOMAIN + 'admin/modifySelfPwd'
        apiRequest(config)
    },
    // 获取管理员列表
    getAdminList: (config) => {
        config.url = API_DOMAIN + 'admin/getAdminList'
        config.method = 'get'
        apiRequest(config)
    },
    // 新增管理员
    createAdmin: (config) => {
        config.url = API_DOMAIN + 'admin/createAdmin'
        apiRequest(config)
    },
    // 编辑管理员
    modifyAdmin: (config) => {
        config.url = API_DOMAIN + 'admin/modifyAdmin'
        apiRequest(config)
    },
    // 改变管理员账号状态
    statusAdmin: (config) => {
        config.url = API_DOMAIN + 'admin/statusAdmin'
        apiRequest(config)
    },
     // 删除管理员
     deleteAdmin: (config) => {
        config.url = API_DOMAIN + 'admin/deleteAdmin'
        apiRequest(config)
     },
    // 团队管理
    getTeamData: (config) => {
        config.url = API_DOMAIN + 'team/all/ext'
        config.method = 'get'
        apiRequest(config)
    },
    // 连线管理
    getLineData: (config) => {
        config.url = API_DOMAIN + 'room/all/ext'
        config.method = 'get'
        apiRequest(config)
    },
    // 获取用户列表
    getUserData: (config) => {
        config.url = API_DOMAIN + 'user/all/ext'
        config.method = 'get'
        apiRequest(config)
    },
    // 改变用户账号状态
    statusUser: (config) => {
        config.url = API_DOMAIN + 'user/status/'
        config.method = 'put'
        if (config.hashId) {
            config.url = config.url + config.hashId
        }
        apiRequest(config)
    },
    // 创建团队
    createTeam: (config) => {
        config.url = API_DOMAIN + 'team'
        config.method = 'post'
        apiRequest(config)
    },
    // 创建用户
    createUser: (config) => {
        config.url = API_DOMAIN + 'user'
        config.method = 'post'
        apiRequest(config)
    },
    // 删除用户
    deleteUser: (config) => {
        config.url = API_DOMAIN + 'user/'
        config.method = 'delete'
        if (config.hashId) {
            config.url = config.url + config.hashId
        }
        apiRequest(config)
    },
    // 创建用户-查询团队
    queryTeamId: (config) => {
        config.url = API_DOMAIN + 'team/all/full'
        config.method = 'get'
        apiRequest(config)
    },
    // 团队设置
    teamSetup: (config) => {
        config.url = API_DOMAIN + 'team/detail/'
        config.method = 'get'
        if (config.hashId) {
            config.url = config.url + config.hashId
        }
        apiRequest(config)
    },
    // 团队设置弹层-成员列表
    getTeamListData: (config) => {
        config.url = API_DOMAIN + 'team/detail/'
        config.method = 'get'
        if (config.hashId) {
            config.url = config.url + config.hashId
        }
        apiRequest(config)
    },
    // 团队设置弹层-设置管理员
    statusSetupAdmin: (config) => {
        config.url = API_DOMAIN + 'team/admin/'
        config.method = 'put'
        if (config.hashId) {
            config.url = config.url + config.hashId + '?hashUserId=' + config.hashUserId
        }
        apiRequest(config)
    },
    // 团队设置弹层-移除团队用户
    statusRemoveTeamUser: (config) => {
        config.url = API_DOMAIN + 'team/user/'
        config.method = 'delete'
        if (config.hashId) {
            config.url = config.url + config.hashId + '?hashUserId=' + config.hashUserId
        }
        apiRequest(config)
    },
    // 团队设置弹层-手机号搜索
    queryPhoneNumber: (config) => {
        config.url = API_DOMAIN + 'user/search'
        config.method = 'get'
        apiRequest(config)
    },
    // 团队设置弹层- 加入成员
    addMember: (config) => {
        config.url = API_DOMAIN + 'team/user/'
        config.method = 'post'
        if (config.hashId) {
            config.url = config.url + config.hashId + '?hashUserId=' + config.hashId
        }
        apiRequest(config)
    },
    // 团队设置弹层- 保存
    saveSetup: (config) => {
        config.url = API_DOMAIN + 'team/'
        config.method = 'put'
        if (config.hashId) {
            config.url = config.url + config.hashId
        }
        apiRequest(config)
    },
    

}

// 从localStorage获取用户信息
export function getLocalLoginInfo() {
    return JSON.parse(window.localStorage.loginInfo)
}

// 失效退出界面
export function logout(_this) {
    window.localStorage.removeItem('loginInfo')
    window.location.reload()
    //_this.props.history.push('/login')
}

/*
 * API请求封装（带验证信息）
 * config.this: [必填]组件作用域，用于页面跳转等逻辑
 * config.method: [必须]请求method
 * config.url: [必须]请求url
 * config.data: 请求数据
 * config.formData: 是否以formData格式提交（用于上传文件）
 * config.success(res): 请求成功回调
 * config.fail(err): 请求失败回调
 * config.done(): 请求结束回调
 */
export function apiRequest(config) {
    const loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
    if (config.data === undefined) {
        config.data = {}
    }
    config.method = config.method || 'post'

    let headers = {
        'Authorization': loginInfo.accessToken,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }

    let data = null
    if (config.formData) {
        headers['Content-Type'] = 'multipart/form-data'
        data = new FormData()
        Object.keys(config.data).forEach(function(key){
            data.append(key, config.data[key])       
       });
    } else if(config.method === 'post'){
        data = Qs.stringify(config.data)
    } else if(config.method === 'put'){
        data = config.data
        // config.url = config.url + data.id
    } else {
        data = config.data
    }

    
    let axiosConfig = {
        method: config.method,
        url: config.url,
        headers
    }
    if (config.method === 'get' || config.method === 'put') {
        axiosConfig.params = data
    } else {
        axiosConfig.data = data
    }
    // 上传图片专用
    if(config.file){
        headers['Content-Type'] = 'multipart/form-data'
        data = new FormData()
        data.append('file', config.file) 
        axiosConfig.data = data            
    }

    // console.log('axiosConfig', axiosConfig)
    axios(axiosConfig).then((res) => {
        let result = res.data
        config.done && config.done()
        // access-token验证失败
        if (result.code === API_CODE.ERR_LOGOUT) {
            Modal.error({
                title: result.message,
                onOk: () => {
                    logout(config.this)
                }
            })   
        } else { 
            config.success && config.success(result)
        }
    }).catch((err) => {
        Modal.error({
            title: API_FAILED
        })
        config.fail && config.fail()
        config.done && config.done()
    }) 
}
