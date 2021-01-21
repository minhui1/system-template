import React, { useState } from 'react'
import { Button, Modal, Radio } from 'antd'
import MD5 from 'js-md5'
import { randomNumber } from '@/common/js/commonLib'
import { apiReqs } from '@/api'
import './forgetPassword.styl'

// 登录密码加盐
const saltLogin = '6f98a978-44e5-11eb-b3aa-186590d96b3b'


function ForgetPassword(props) {
    // 通过props接收值
    const { signInShow } = props

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    // 密码随机数
    let randomCode = randomNumber(6)

    const handleUserNameChange = (event) => {
        setUserName(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    // 密码加密
    const encryptPassword = () => {
        return MD5(MD5(password) + saltLogin + randomCode)
    }

    // 检查合法输入
    const checkValidate = () => {
        if (
            username.length > 0 &&
            password.length > 0 
        ) {
            return true
        }
        return false
    }

    // 单选按钮
    const [value, setValue] = React.useState(1);

    const onChange = e => {
        // console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const loginSubmit = () => {
        setLoading(true)
        let data = {
            username,
            password: encryptPassword(),
            randomCode
        }
        let callback = {
            succ: () => {
                props.history.push('/home')
            },
            fail: (result) => {
                Modal.error({
                    title: '登录失败',
                    content: result.message,
                })
            },
            done: () => {
                setLoading(false)
            },
        }
        apiReqs.adminSignIn(data, callback)
    }

    return (
        <>
            {/* <h3>Welcome Back</h3>
            <p className="subtext">please sign in.</p> */}
            <h3>欢迎回来</h3>
            <p className="subtext">请找回密码。</p>
            <form>
                <div className="item">
                    <input
                        type="text"
                        className="ani"
                        placeholder="请输入用户名"
                        autoComplete="off"
                        value={username}
                        onChange={handleUserNameChange}
                    />
                </div>
                <p className="txtTip">请选择手机号或者邮箱接收验证码</p>
                <div className="item">
                    <Radio.Group className="radioCheck" onChange={onChange} value={value}>
                        <Radio value={1}>手机号</Radio>
                        <Radio value={2}>邮箱</Radio>
                    </Radio.Group>
                    <span className="txtCode">发送验证码</span>
                </div>
                <div className="item">
                    <input
                        type="password"
                        className="ani"
                        placeholder="请输入验证码"
                        autoComplete="off"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className="item">
                    <input
                        type="password"
                        className="ani"
                        placeholder="请输入新密码"
                        autoComplete="off"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className="item btn-con">
                    <Button
                        type="primary"
                        size="large"
                        block={true}
                        loading={loading}
                        disabled={!checkValidate()}
                        onClick={loginSubmit}
                    >
                        登录
                    </Button>
                </div>
            </form>
            <div className="login-links">
                <span onClick={ signInShow }>返回登录</span>
            </div>
        </>
    )
}

export default ForgetPassword