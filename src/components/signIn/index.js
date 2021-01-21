import React, { useState } from 'react'
// antd
import { Button, Modal } from 'antd'
// MD5加密
import MD5 from 'js-md5'
// 随机码
import { randomNumber } from '@/common/js/commonLib'
// 接口api
import { apiReqs } from '@/api'
// 滑动解锁
import DragVerify from '@/components/dragVerify'
// 样式
import './signIn.styl'

// 登录密码加盐
const saltLogin = '6f98a978-44e5-11eb-b3aa-186590d96b3b'


function SignIn(props) {

    // 通过props接收值
    const { regShow, forgetPassShow, history } = props

    // 用户名
    const [username, setUserName] = useState('')
    // 密码
    const [password, setPassword] = useState('')
    // loading
    const [loading, setLoading] = useState(false)
    // 解锁
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
                history.push('/home')
            },
            fail: (result) => {
                console.log(324234)
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
            <p className="subtext">请登录。</p>
            <form>
                <div className="item">
                    <input
                        type="text"
                        className="ani"
                        placeholder="请输入账号"
                        autoComplete="off"
                        value={username}
                        onChange={handleUserNameChange}
                    />
                </div>
                <div className="item">
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
                <span onClick={ forgetPassShow }>找回密码</span><span onClick={ regShow }>注册账号</span>
            </div>
        </>
    )
}

export default SignIn