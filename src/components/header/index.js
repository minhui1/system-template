import React, { Component } from 'react'
import { Layout, Menu, Dropdown, Modal } from 'antd'
import {
    // IdcardOutlined,
    KeyOutlined,
    ExportOutlined,
    // MenuFoldOutlined,
    // MenuUnfoldOutlined,
    CaretDownOutlined
} from '@ant-design/icons'
import { apiReqs } from '@/api'
import AccountModal from '../modals/accountModal'
import SecurityModal from '@/components/modals/securityModal'
import logoImg from '@/common/images/logo.png'
import './header.styl'

const AntdHeader = Layout.Header
const { confirm } = Modal

class Header extends Component {

    state = {
        // showAccountModal: false,
        showSecurityModal: false
    }

    logout() {
        confirm({
            title: '确定要退出系统么？',
            onOk: () => {
                apiReqs.adminSignOut(this)
            }
        })
    }

    loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))

    menu = () => {
        return (
            <Menu>
                {/* <div style={{ padding: '5px 12px', fontWeight: 'bold' }}>{this.loginInfo.nickname}</div> */}
                {/* <div style={{ padding: '5px 12px', fontWeight: 'bold' }}></div> */}
                {/* <Menu.Divider /> */}
                {/* <Menu.Item key="0" onClick={() => { this.setState({ showAccountModal: true }) }}>
                    <IdcardOutlined style={{ marginRight: 8 }} />
                    <span>账号信息</span>
                </Menu.Item>*/}
                <Menu.Item key="1" onClick={() => { this.setState({ showSecurityModal: true }) }}>
                    <KeyOutlined style={{ marginRight: 8 }} />
                    <span>修改密码</span>
                </Menu.Item> 
                {/* <Menu.Divider /> */}
                <Menu.Item key="3" onClick={this.logout.bind(this)}>
                    <ExportOutlined style={{ marginRight: 8 }} />
                    <span>退出登录</span>
                </Menu.Item>
            </Menu>
        )
    }

    language = () => {
        return (
            <Menu>
                <Menu.Item key="1">
                    <span>en-US</span>
                </Menu.Item> 
               
                <Menu.Item key="3">
                    <span>zh-CN</span>
                </Menu.Item>
            </Menu>
        )
    }

    render() {
        return (
            <AntdHeader
                className="M-header"
                style={{
                    left: this.props.collapsed ? 80 : 0,
                    transition: 'left 0.2s'
                }}
            >
                
                    <div className="logo-con">
                        <img src={logoImg} alt="LOGO" />
                        <div className="logo-title">
                            <p>媒体注册报名系统</p>
                        </div>
                    </div>
                
               
                <Dropdown overlay={this.menu}>
                    <div className="user-menu">
                        <span>{this.loginInfo.nickname}</span>
                        <CaretDownOutlined className="arrow" />
                    </div>
                </Dropdown>
                <Dropdown overlay={this.language}>
                    <div className="user-menu">
                        <span>zh-CN</span>
                        <CaretDownOutlined className="arrow" />
                    </div>
                </Dropdown>
                {
                    this.state.showAccountModal ?
                        <AccountModal
                            onClose={() => { this.setState({ showAccountModal: false }) }}
                        /> : null
                }
                {
                    this.state.showSecurityModal ?
                        <SecurityModal
                            onClose={() => { this.setState({ showSecurityModal: false }) }}
                        /> : null
                }
            </AntdHeader>
        )
    }
}

export default Header