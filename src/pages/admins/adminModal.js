/**
 * 创建/编辑用户弹层
 * @param type: 类型。'create'=创建，'modify'=修改 
 */
import React, { useState } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import { API_CODE, apiReqs } from '@/api'
import { getAdminCHS } from '@/common/js/constants'

const { Option } = Select

const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}

const AdminModal = ({ onClose, type, record, onCreateOk, onModifyOk }) => {
    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm()

    const handleSubmit = values => {
        setLoading(true)

        if (type === 'create') {
            apiReqs.createAdmin({
                this: this,
                data: {
                    account: values.account,
                    nickname: values.nickname,
                    admin: values.admin,
                    password: values.password
                },
                success: (res) => {
                    if (res.code === API_CODE.OK) {
                        Modal.success({
                            title: res.message
                        })
                        onCreateOk && onCreateOk()
                    } else {
                        Modal.error({
                            title: res.message
                        })
                    }
                },
                done: () => {
                    setLoading(false)
                    onClose()
                }
            })
        } else if (type === 'modify') {
            apiReqs.modifyAdmin({
                this: this,
                data: {
                    uid: record.uid,
                    account: values.account,
                    nickname: values.nickname,
                    admin: values.admin,
                },
                success: (res) => {
                    if (res.code === API_CODE.OK) {
                        Modal.success({
                            title: res.message
                        })
                        onModifyOk && onModifyOk()
                    } else {
                        Modal.error({
                            title: res.message
                        })
                    }
                },
                done: () => {
                    setLoading(false)
                    onClose()
                }
            })
        }


    }

    let modalConfig = {
        title: '创建管理员',
        okText: '创建',
        cancelText: '取消'
    }

    let initialValues = {
        status: true,
        ticketStatus: true
    }

    if (type === 'modify') {
        modalConfig.title = '编辑管理员'
        modalConfig.okText = '修改'
        initialValues = {
            account: record.account,
            nickname: record.nickname,
            admin: record.admin,
        }
    }

    return (
        <Modal
            className="M-adminModal"
            visible={true}
            {...modalConfig}
            onCancel={() => {
                onClose()
            }}
            onOk={() => {
                setLoading(true)
                form.validateFields().then(values => {
                    handleSubmit(values)
                }).catch(info => {
                    console.log('验证失败')
                    setLoading(false)
                })
            }}
            confirmLoading={loading}
        >
            <Form
                form={form}
                {...formLayout}
                initialValues={initialValues}
            >
                <Form.Item
                    name="account"
                    label="登录账号"
                    rules={[{ required: true, message: '请输入登录账号' }]}
                >
                    <Input placeholder="请输入登录账号" />
                </Form.Item>
                <Form.Item
                    name="nickname"
                    label="用户昵称"
                    rules={[{ required: true, message: '请输入昵称' }]}
                >
                    <Input placeholder="请输入昵称" />
                </Form.Item>
                <Form.Item
                    name="admin"
                    label="管理权限"
                    rules={[{ required: true, message: '请选择管理权限' }]}
                >
                    <Select style={{ width: 120 }} placeholder="请选择...">
                        <Option value={1}>{getAdminCHS(1)}</Option>
                        <Option value={2}>{getAdminCHS(2)}</Option>
                    </Select>
                </Form.Item>
                {
                    type === 'create' ?
                        <Form.Item
                            name="password"
                            label="初始密码"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (/^[a-zA-Z0-9]{6,10}$/.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('请输入6-10位密码，仅支持数字和英文');
                                    },
                                }),
                            ]}
                        >
                            <Input placeholder="请输入初始密码" />
                        </Form.Item> : null
                }
            </Form>
        </Modal>
    )
}

export default AdminModal