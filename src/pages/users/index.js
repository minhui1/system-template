import React, { useEffect, useState } from 'react'
import PageHeaderWrapper from '@/components/pageHeaderWrapper'
import { Input, Button, Table, Modal } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { API_CODE, apiReqs } from '@/api'
import CreateModal from './createModal'
import './users.styl'

const { confirm } = Modal

function Users() {

    // 用户列表
    const [listData, setListData] = useState({
        totalElements: 0, // 总数
        content: []
    })

    //分页
    const [page, setPage] = useState(1)

    // 根据用户名搜索
    const [username, setUsername] = useState(null)

    // loading模块
    const [loading, setLoading] = useState(true)

    // 列表pageSize
    const listPageSize = 20

    // const [valueItem, setValueItem] = useState(null)

    const [showCreateUser,setShowCreateUser] = useState(false)

    useEffect(() => {
        getUserData({
            page,
            username
        })
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    // 获取列表
    const getUserData = (config) => {
        setLoading(true)
        apiReqs.getUserData({
            data: {
                size: listPageSize,
                page: config.page - 1,
                username: config.username ? config.username : null
            },
            success: (res) => {
                // console.log(res)
                setLoading(false)
                if (res.code === API_CODE.OK) {
                    setListData({
                        totalElements: res.data.totalElements,
                        content: res.data.content,
                    })
                } else {
                    Modal.error({
                        title: res.message
                    })
                }
            }
        })
    }
    const columns = [
        {
            title: 'UID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: 60,
        },
        {
            title: '所属团队',
            dataIndex: 'team',
            key: 'teamName',
            width: 90,
            render: (record) => (
                <>
                    {
                        (record&&record.teamName) ? record.teamName : '-'
                    }
                </>
            )
                
               
                
            
        },
        {
            title: '团队人数',
            dataIndex: 'team',
            key: 'userCount',
            width: 70,
            render: (record) => (
                <>
                    {
                        (record&&record.userCount) ? record.userCount : '-'
                    }
                </>
            )
        },
        {
            title: '注册时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 110,
        },
        {
            title: '连线总数',
            dataIndex: 'lineStatisticsVo',
            key: 'lineTotalCount',
            width: 80,
            render: (record) => (
                <>
                    {
                        (record&&record.lineTotalCount) ? record.lineTotalCount : '-'
                    }
                </>
            ),
        },
        {
            title: '连线总时长（分钟）',
            dataIndex: 'lineStatisticsVo',
            key: 'lineTotalDuration',
            width: 120,
            render: (record) => (
                <>
                    {
                        (record&&record.lineTotalDuration) ? record.lineTotalDuration : '-'
                    }
                </>
            ),
        },
        {
            title: '状态',
            // dataIndex: 'status',
            key: 'status',
            width: 80,
            fixed: 'right',
            render: (record) => {
                if (record.lineStatus === 'ONLINE') {
                    return <span className="m-txt m-txt-green"><em></em>连线中</span>
                } else if (record.status === 'ACTIVE') {
                    return <span className="m-txt m-txt-black"><em></em>正常</span>
                } else if (record.status === 'INACTIVE') {
                    return <span className="m-txt m-txt-red"><em></em>冻结</span>
                } else if (record.status === 'DELETED') {
                    return <span className="m-txt m-txt-blue"><em></em>删除</span>
                }
                return <span className="m-txt m-txt-grey"><em></em>离线</span>
            }
        },
        {
            title: '操作',
            key: 'status',
            width: 80,
            fixed: 'right',
            render: (record) => {
                if (record.status === 'DELETED') {
                    return <div className="action-con" onClick={() => { deleteUser({ record })}}>删除</div>
                } else {
                    return <div className="action-con" >
                        <span onClick={() => { openDetailModal({ record }) }}>{record.status === 'ACTIVE' ? '冻结' : record.status === 'INACTIVE' ? '解冻' : '-'} </span>
                        <span onClick={() => { deleteUser({ record })}}>删除</span>
                    </div>

                }
            }
        }
    ]

    // input取值
    const onUsernameChanged = (e) => {
        setUsername(e.target.value)
    }

    // 用户搜索
    const search = () => {
        setPage(1)
        getUserData({
            page: 1,
            username: username
        })
    }

    // 显示全部
    const showAll = () => {
        setUsername(null)
        setPage(1)
        getUserData({
            page: 1,
            username: null
        })
    }

    // 删除用户
    const deleteUser = ({ record }) => {
        confirm({
            title: '是否删除？',
            onOk() {
                return new Promise((resolve, reject) => {
                    apiReqs.deleteUser({
                        id: record.id,
                        success: (res) => {
                            if (res.code === API_CODE.OK) {
                                Modal.success({
                                    title: '删除成功！',
                                    onOk(){
                                        getUserData({
                                            page,
                                            username
                                        })
                                    }
                                })
                                
                            } else {
                                Modal.error({
                                    title: res.message
                                })
                            }
                        },
                        fail: () => {
                            Modal.error({
                                title: '请求失败，请重新提交！'
                            })
                        },
                        done: () => {
                            resolve()
                        }
                    })
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }
    

    // 操作处理
    const userStatusTitle = {
        ACTIVE: {
            title: '是否冻结',
            changeState: 'INACTIVE',
        },
        INACTIVE: {
            title: '是否解冻？',
            changeState: 'ACTIVE'
        },
        DELETED: {
            title: '是否删除？',
            changeState: 'DELETED'
        }
    }
    const openDetailModal = ({ record }) => {
        confirm({
            title: userStatusTitle[record.status].title,
            onOk() {
                return new Promise((resolve, reject) => {
                    apiReqs.statusUser({
                        id: record.id,
                        data: {
                            id: record.id,
                            status: userStatusTitle[record.status].changeState
                        },
                        success: (res) => {
                            if (res.code === API_CODE.OK) {
                                record.status = userStatusTitle[record.status].changeState
                                setListData({
                                    totalElements: listData.totalElements,
                                    content: listData.content,
                                })
                            } else {
                                Modal.error({
                                    title: '服务异常，请重新提交！'
                                })
                            }
                        },
                        fail: () => {
                            Modal.error({
                                title: '请求失败，请重新提交！'
                            })
                        },
                        done: () => {
                            resolve()
                        }
                    })
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    return (
        <>
            <PageHeaderWrapper title="用户管理" subTitle={'共' + listData.totalElements + '人'} />
            <section className="G-main P-users">
                <div className="G-title">
                    <h3>团队管理</h3>
                    <span><Button type="primary" onClick={()=>{setShowCreateUser(true)}}>创建用户</Button></span>
                </div>
                <div className="G-search">
                    用户名：<Input placeholder="请输入" value={username} onChange={onUsernameChanged} />
                    <Button type="primary" icon={<SearchOutlined />} onClick={search}>搜索</Button>
                    <Button onClick={showAll}>显示全部</Button>
                </div>
                <div className="G-card">
                    <Table
                        rowKey={record => record.id}
                        className="G-table"
                        dataSource={listData.content}
                        columns={columns}
                        loading={loading}
                        scroll={{ x: 'calc(700px + 50%)' }}
                        pagination={{
                            total: listData.totalElements,
                            pageSize: listPageSize
                        }}
                        onChange={(next) => {
                            setPage(next.current)
                            getUserData({
                                page: next.current,
                                username
                            })
                        }}
                    />
                </div>
            </section>

            { showCreateUser ?
            <CreateModal 
            
                onRefresh={() => {
                    getUserData({
                        page,
                        username
                    })
                }}
                onClose={
                    () => {
                        // setIsCreateModalVisible(false)
                        setShowCreateUser(false)
                    }
                }
                // usernameOld = {valueItem.username}
                // phoneNumberOld = {valueItem.phoneNumber}
                // teamIdOld = {valueItem.teamId}

            
            /> : null
        }
        </>
    )
}



export default Users
