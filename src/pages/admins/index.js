import React, { Component, Fragment } from 'react'
import PageHeaderWrapper from '@/components/pageHeaderWrapper'
import { Button, Table, Modal } from 'antd'
import {
    CheckCircleOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
    StopOutlined,
    UserAddOutlined
} from '@ant-design/icons'
import AdminModal from './adminModal'
import { getAdminCHS, getStatusCHS } from '@/common/js/constants'
import { API_CODE, apiReqs } from '@/api'
import './admins.styl'

const { confirm } = Modal

class Admins extends Component {

    state = {
        showAdminModal: false,
        listData: [],
        listLoading: false,
        pagination: {
            style: {
                marginRight: 20
            },
            pageSize: 20,
            total: 0,
            current: 1
        }
    }

    adminModalType = 'create'
    editRecord = null

    componentDidMount() {
        this.getAdminList()
    }

    // 解决在加载过程中Unmount组件warning
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
    }

    columns = [
        {
            title: 'uid',
            dataIndex: 'uid',
            key: 'uid',
            width: 80,
        },
        {
            title: '登录账号',
            dataIndex: 'account',
            key: 'account',
            width: 120,
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
            width: 100,
        },
        {
            title: '权限',
            dataIndex: 'admin',
            key: 'admin',
            width: 120,
            render: (admin) => {
                return getAdminCHS(admin)
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status) => {
                if (status === 1) {
                    return <span className="G-col-succ">{getStatusCHS(status)}</span>
                } else {
                    return <span className="G-col-error">{getStatusCHS(status)}</span>
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 280,
            fixed: 'right',
            render: (record) => (
                <div className="action-con">
                    <span onClick={() => { this.openAdminModal({ type: 'modify', record }) }}><EditOutlined />编辑</span>
                    <span onClick={() => { this.handleChangeStatus(record) }}>
                        {record.status ?
                            <span><StopOutlined />冻结</span> :
                            <span><CheckCircleOutlined />解冻</span>}</span>
                    <span onClick={() => { this.handleDelete(record) }}><DeleteOutlined />删除</span>
                </div>
            )
        }
    ]

    handleChangeStatus = (record) => {
        let chs = '冻结'
        if (record.status === 0) {
            chs = '解冻'
        }
        confirm({
            title: `确定要${chs}「${record.nickname}」么？`,
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                return new Promise((resolve, reject) => {
                    apiReqs.statusAdmin({
                        this: this,
                        data: {
                            uid: record.uid
                        },
                        success: (res) => {
                            if (res.code === API_CODE.OK) {
                                Modal.success({
                                    title: res.message,
                                    onOk: () => {
                                        this.getAdminList()
                                    }
                                })
                            } else {
                                Modal.error({
                                    title: res.message
                                })
                            }
                        },
                        done: () => {
                            resolve()
                        }
                    })
                })
            }
        })
    }

    handleDelete = (record) => {
        confirm({
            title: '确定要删除「' + record.nickname + '」么？',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                return new Promise((resolve) => {
                    apiReqs.deleteAdmin({
                        this: this,
                        data: {
                            uid: record.uid
                        },
                        success: (res) => {
                            if (res.code === API_CODE.OK) {
                                Modal.success({
                                    title: res.message,
                                    onOk: () => {
                                        this.getAdminList()
                                    }
                                })
                            } else {
                                Modal.error({
                                    title: res.message
                                })
                            }
                        },
                        done: () => {
                            resolve()
                        }
                    })
                })
            }
        })
    }

    handlePageChange = (pagination) => {
        const pager = { ...this.state.pagination }
        pager.current = pagination.current
        this.setState({
            pagination: pager,
        }, () => {
            this.getAdminList()
        });
    }

    openAdminModal = ({ type, record }) => {
        this.adminModalType = type
        this.editRecord = record
        this.setState({ showAdminModal: true })
    }

    getAdminList() {
        this.setState({ listLoading: true })
        apiReqs.getAdminList({
            this: this,
            data: {
                page: this.state.pagination.current,
                pageSize: this.state.pagination.pageSize
            },
            success: (res) => {
                if (res.code === API_CODE.OK) {
                    let list = res.data.list
                    for (let i = 0; i < list.length; i++) {
                        list[i].key = list[i].uid
                    }
                    let pagination = { ...this.state.pagination }
                    pagination.total = res.data.total
                    this.setState({
                        listData: list,
                        pagination
                    })

                } else {
                    Modal.error({
                        title: res.message
                    })
                }
            },
            done: () => {
                this.setState({ listLoading: false })
            }
        })
    }

    render() {
        return (
            <Fragment>
                <PageHeaderWrapper title="管理员" subTitle={'共' + this.state.pagination.total + '人'} />
                <section className="G-main P-admins">
                    <div className="G-card">
                        <div className="opt-bar">
                            <Button type="primary" icon={<UserAddOutlined />} onClick={() => {this.openAdminModal({ type: 'create' })}}>创建管理员</Button>
                        </div>
                        <Table
                            className="G-table"
                            dataSource={this.state.listData}
                            pagination={this.state.pagination}
                            columns={this.columns}
                            loading={this.state.listLoading}
                            onChange={this.handlePageChange}
                            scroll={{ x: '100%' }}
                        />
                        {
                            this.state.showAdminModal ?
                                <AdminModal
                                    onClose={() => { this.setState({ showAdminModal: false }) }}
                                    type={this.adminModalType}
                                    record={this.editRecord}
                                    onCreateOk={this.getAdminList.bind(this)}
                                    onModifyOk={this.getAdminList.bind(this)}
                                /> : null
                        }
                    </div>
                </section>
            </Fragment>
        )
    }
}

export default Admins