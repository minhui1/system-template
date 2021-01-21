import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// mock数据
//import './mock'
import { ConfigProvider } from 'antd'
// 中文语言
import 'moment/locale/zh-cn';
import zhCN from 'antd/es/locale/zh_CN'
// 框架样式
import '@/common/stylus/frame.styl'

// 国际化 默认英文，置为中文
const antdConfig = {
    locale: zhCN
}

ReactDOM.render(
    <ConfigProvider {...antdConfig}>
        <App />
    </ConfigProvider>,
    document.getElementById('root')
)
