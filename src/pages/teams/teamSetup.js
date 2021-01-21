import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Form, Select, Table, } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { API_CODE, apiReqs } from '@/api'
import defaultAvatar from '@/common/images/user_head.png'
import './teamSetup.styl'

function TeamSetup(props) {

    // 通过props接收值
    const { onClose, onRefresh, teamNameOld, commentOld, teamId, statusOld } = props

    const { Option } = Select;
    // input值
    const [teamName, setTeamName] = useState(teamNameOld)

    // textarea值
    const [comment, setComment] = useState(commentOld)

    // status值
    const [status] = useState(statusOld)

    // loading
    const [loading, setLoading] = useState(false)

    // 手机号搜索
    const [callPhone, setCallPhone] = useState(null)

    // 搜索卡片
    const [searchCard, setSearchCard] = useState(null)

    // 取消关闭
    const handleCancel = () => {
        onClose && onClose()
    };

    useEffect(() => {
        getTeamListData({
            page
        })

    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    

    const [form] = Form.useForm()

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const onFinish = values => { };

    // 团队设置
    const onTeamNameChange = (e) => {
        setTeamName(e.target.value)
    }

    const onCommentChange = (e) => {
        setComment(e.target.value)
    }



    // 表格用户列表
    const { confirm } = Modal
    const [listData, setListData] = useState({
        totalElements: 0,
        data: []
    })
    // 分页
    const [page, setPage] = useState(1)
    // 列表pagesize
    const listPageSize = 5
    // 获取列表数据
    const getTeamListData = (config) => {
        setLoading(true)
        apiReqs.getTeamListData({
            id: teamId,
            data: {
                size: listPageSize,
                page: config.page - 1
            },
            success: (res) => {
                // console.table(res)
                setLoading(false)
                if (res.code === API_CODE.OK) {
                    let userId = res.data.userId
                    let temp = res.data.userList.content
                    for (let index = 0; index < temp.length; index++) {
                        if (temp[index].id === userId) {
                            temp[index].isAdmin = true
                        }
                    }
                    setListData({
                        totalElements: res.data.userList.totalElements,
                        data: temp,
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
            title: '用户名',
            // dataIndex: 'username',
            key: 'username',
            width: 89,
            render: (record) => {
                // console.log('record:', record)
                if (record.isAdmin) {
                    return <span className="username">{record.username}<em className="isAdmin">管理员</em></span>
                } else {
                    return <span className="username">{record.username}</span>
                }
            }
        },
        {
            title: 'uid',
            dataIndex: 'hashId',
            key: 'hashId',
            width: 50,
        },
        {
            title: '状态',
            // dataIndex: 'status',
            key: 'status',
            width: 120,
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
            // dataIndex: 'status',
            key: 'status',
            width: 220,
            render: (record) => {
                if (record.isAdmin) {
                    return <div className="m-box">
                        <div className="action-con"><span className="m-txt m-txt-disable">移除成员</span></div>
                    </div>
                } else {
                    return <div className="m-box">
                        <div className="action-con" onClick={() => { openDetailModal(record) }}>移除成员</div>
                        <div className="action-con" onClick={() => { openSetUpAdminModal(record) }}>设为管理员</div>
                    </div>
                }

            },
        },
    ]; // rowSelection object indicates the need for row selection

    // 设置管理员
    const openSetUpAdminModal = (record) => {
        confirm({
            title: '是否设为管理员？',
            onOk() {
                apiReqs.statusSetupAdmin({
                    id: teamId,
                    userId: record.id,
                    success: (res) => {
                        if (res.code === API_CODE.OK) {
                            Modal.success({
                                title: '设置成功！',
                                onOk() {
                                    getTeamListData({
                                        page
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

                    }
                })
            }

        })
    }


    // 删除操作处理
    const openDetailModal = (record) => {
        confirm({
            title: '是否移除？',
            onOk() {
                return new Promise((resolve, reject) => {
                    apiReqs.statusRemoveTeamUser({
                        id: teamId,
                        userId: record.id,
                        success: (res) => {
                            if (res.code === API_CODE.OK) {
                                Modal.success({
                                    title: '移除成功！',
                                    onOk() {
                                        getTeamListData({
                                            page
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

    // 获取手机号 value值
    const onCallPhoneChange = (e) => {
        setCallPhone(e.target.value)
    }

    // 搜索手机号请求接口
    const getCallPhone = () => {
        setLoading(true)
        setSearchCard('')
        apiReqs.queryPhoneNumber({
            data: {
                phoneNumber: callPhone ? callPhone : ''
            },
            success: (res) => {
                setLoading(false)
                if (res.code === API_CODE.OK) {
                    setSearchCard(res.data)
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
                setLoading(false)
            }
        })
    }

    // 搜索
    const search = () => {
        getCallPhone()
    }

    // 加入成员
    const addMember = (record) => {
        apiReqs.addMember({
            id: teamId,
            userId: record.id,
            success: (res) => {
                setLoading(false)
                if (res.code === API_CODE.OK) {
                    getTeamListData({
                        page
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
                setLoading(false)
            }
        })
    }

    // 保存修改后的设置项
    const saveSetup = (values) => {
        setLoading(true)
        let data = {}
        data.teamName = values.teamName
        data.status = values.status
        data.comment = values.comment
        apiReqs.saveSetup({
            id: teamId,
            data,
            success: (res) => {
                if (res.code === API_CODE.OK) {
                    onClose()
                    Modal.success({
                        title: '设置成功！',
                        onOk() {
                            onRefresh()
                        },
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
                setLoading(false)
            }
        })
    }

    // 确定关闭
    const handleOk = () => {
        setLoading(true)
        form.validateFields()
            .then((values) => {
                saveSetup(values)
            })
            .catch((info) => {
                console.log('验证失败')
                setLoading(false)
            })
    };




    return (
        <Modal className="M-team-setup" title="团队设置" visible={true} width={800}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                    确定
                </Button>
            ]}
        >
            <Form form={form} {...layout} name="nest-messages" onFinish={onFinish} initialValues={{ teamName, comment, status }}>
                <Form.Item className="teamName" name="teamName" label="团队名称：" rules={[{ required: true, message: "请输入团队名称" }]}>
                    <Input placeholder="请输入" value={teamName} onChange={onTeamNameChange} />
                </Form.Item>
                <Form.Item className="status" name="status" label="状态：" rules={[{ required: false, message: "请选择状态" }]}>
                    <Select style={{ width: 120 }} placeholder="请选择">
                        <Option value="ACTIVE">正常</Option>
                        <Option value="INACTIVE">冻结</Option>
                    </Select>
                </Form.Item>
                <Form.Item className="comment" name="comment" label="团队备注：" rules={[{ required: false, message: "请输入备注" }]}>
                    <Input.TextArea value={comment} onChange={onCommentChange} />
                </Form.Item>
                <div className="memberList" >
                成员列表：
                </div>

                <Table
                    rowKey={record => record.id}
                    className="G-table"
                    columns={columns}
                    loading={loading}
                    dataSource={listData.data}
                    pagination={{
                        total: listData.totalElements,
                        pageSize: listPageSize
                    }}
                    onChange={(next) => {
                        setPage(next.current)
                        getTeamListData({
                            page: next.current
                        })
                    }}
                    showSizeChanger={false}
                />
                
                <div className="addMember">
                    <span className="addUser">新增成员：</span>
                    <Input name="comment" placeholder="请输入手机号" value={callPhone} onChange={onCallPhoneChange} />
                    <Button type="primary" icon={<SearchOutlined />} onClick={search}>查找</Button>
                    {
                        searchCard ?
                            <div className="userInfo" >
                                <div className="m-box">
                                    <div className="m-img-box">
                                        <img src={defaultAvatar} alt="defaultAvatar" />
                                    </div>
                                    <div className="m-left">
                                        <dl>
                                            <dd>{searchCard.team &&searchCard.team.username ?searchCard.team.username   : searchCard.username?searchCard.username : '-'}</dd>
                                            <dt>所属团队：{searchCard.team && searchCard.team.teamName ? searchCard.team.teamName : '-'}</dt>
                                        </dl>
                                    </div>
                                    <div className="m-right">
                                        <span><Button key="back" onClick={addMember}>加入</Button></span>
                                    </div>
                                </div>
                            </div> : null
                    }
                </div>

            </Form>
        </Modal>
    )

}

export default TeamSetup