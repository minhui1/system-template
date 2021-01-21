import React, { useState } from 'react'
// import { apiReqs } from '@/api'
// import imgLogo from '@/common/images/logo.png'
import imgWorking from '@/common/images/working.png'
import './login.styl'
// 登录
import SignIn from '@/components/signIn'
// 注册
import Register from '@/components/register'
// 忘记密码
import ForgetPassword from '@/components/forgetPassword'

// http://111.13.175.197/u/userIndex_N.do?uuid=9a9d7b6e5cdb47f7b40ecee533cc8603 abc abc123!@#

function Login(props) {

    // 是否显示 登录模块
    const [isSignIn, setIsSignIn] = useState(true)

    // 是否显示 注册模块
    const [isRegMod,setIsRegMod] = useState(false)

    // 是否显示 忘记密码模块
    const [isForgetPass, setIsForgetPass] = useState(false)

    const regShow = () => {
        setIsRegMod(true)
        setIsSignIn(false)
        setIsForgetPass(false)
    }

    const forgetPassShow = () => {
        setIsForgetPass(true)
        setIsSignIn(false)
        setIsRegMod(false)
    }

    const signInShow = () => {
        setIsSignIn(true)
        setIsRegMod(false)
        setIsForgetPass(false)
    }



    return (
        <div className="P-login">
            <div className="login-con">
                <div className="left-con">
                    <h2>
                        {/* <img src={imgLogo} alt="" /> */}
                            媒体注册报名系统
                        </h2>
                    <div className="img-con">
                        <img src={imgWorking} alt="" />
                    </div>
                </div>
                <div className="right-con">
                    <div className="main-box">
                        {/* 登录模块 */}
                        {
                            isSignIn ? 
                            <SignIn 
                            regShow = { regShow } 
                            forgetPassShow = { forgetPassShow }
                            history = { props.history }
                            /> : 
                            null
                        }
                        
                        {/* 注册模块 */}
                        {
                            isRegMod ? 
                            <Register 
                            signInShow = { signInShow }
                            /> : 
                            null
                        }
                        
                        {/* 忘记密码模块 */}
                        {
                            isForgetPass ?
                            <ForgetPassword 
                            signInShow = { signInShow }
                            /> : 
                            null
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Login
