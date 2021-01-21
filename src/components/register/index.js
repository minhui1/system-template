import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import MD5 from 'js-md5'
import { randomNumber } from '@/common/js/commonLib'
import { apiReqs } from '@/api'
import DragVerify from '@/components/dragVerify'
import './register.styl'
// 登录密码加盐
const saltLogin = '6f98a978-44e5-11eb-b3aa-186590d96b3b'


function Register(props) {
    // 通过props接收值
    const { signInShow } = props

    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [unlock, setUnlock] = useState(false)

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
            password.length > 0 &&
            unlock
        ) {
            return true
        }
        return false
    }

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
            <div className="main-box">
                {/* <h3>Welcome Back</h3>
                            <p className="subtext">please sign in.</p> */}
                <h3>欢迎回来</h3>
                <p className="subtext">请注册。</p>
                <form>
                    <div className="item">
                        <span className="sup">*</span>
                        <input
                            type="text"
                            className="ani"
                            placeholder="请输入用户名"
                            autoComplete="off"
                            value={username}
                            onChange={handleUserNameChange}
                        />
                    </div>
                    <div className="item">
                        <span className="sup">*</span>
                        <input
                            type="password"
                            className="ani"
                            placeholder="请输入密码"
                            autoComplete="off"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="item">
                        <span className="sup">*</span>
                        <input
                            type="password"
                            className="ani"
                            placeholder="请输入确认密码"
                            autoComplete="off"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="item">
                        <span className="sup"></span>
                        <input
                            type="password"
                            className="ani"
                            placeholder="请输入手机号"
                            autoComplete="off"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="item">
                        <span className="sup">*</span>
                        <input
                            type="password"
                            className="ani"
                            placeholder="请输入邮箱"
                            autoComplete="off"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="item">
                        <DragVerify
                            height={40}
                            background="#d1baf7"
                            border="solid 1px rgba(255,255,255,0.4)"
                            borderRadius={6}
                            textColor="#fff"
                            progressBg="#9192d1"
                            onFinished={() => {
                                setUnlock(true)
                            }}
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
                    <span onClick={ signInShow }>已有账号，返回登录</span>
                </div>
            </div>
        </>
    )
}

export default Register