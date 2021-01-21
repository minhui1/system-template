import React, { useState } from 'react'
import { Form, Input, Modal } from 'antd'
import MD5 from 'js-md5'
import { API_CODE, apiReqs } from '@/api'

const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}

const SecurityModal = ({ onClose }) => {
    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm()

    const handleSubmit = values => {
        setLoading(true)
        apiReqs.modifyAdminPassword({
            this: this,
            data: {
                oldPassword: MD5(values.oldPassword),
                newPassword: values.newPassword
            },
            success: (res) => {
                if (res.code === API_CODE.OK) {
                    Modal.success({
                        title: res.message
                    })
                } else {
                    Modal.error({
                        title: res.message
                    })
                }
            },
            done: () => {
                setLoading(false)
                form.resetFields()
                onClose && onClose()
            }
        })
    }

    const initNickname = JSON.parse(window.localStorage.getItem('loginInfo')).nickname


    return (
        <Modal
            className="M-securityModal"
            visible={true}
            title="修改密码"
            okText="修改"
            cancelText="取消"
            onCancel={() => {
                onClose()
            }}
            onOk={() => {
                setLoading(true)
                form.validateFields().then(values => {
                    form.resetFields()
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
                initialValues={{ nickname: initNickname }}
            >
                <Form.Item
                    label="原始密码"
                    name="oldPassword"
                    rules={[{ required: true, message: '请输入原始密码' }]}
                >
                    <Input type="password" placeholder="请输入原始密码" autoComplete="off" />
                </Form.Item>
                <Form.Item
                    label="新密码"
                    name="newPassword"
                    rules={[
                        { required: true, message: '请输入新密码' },
                        () => ({
                            validator(rule, value) {
                                if (/^[a-zA-Z0-9]{6,10}$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('请输入6-10位密码，仅支持数字和英文');
                            },
                        }),
                    ]}
                    validateTrigger="onSubmit"
                >
                    <Input type="password" placeholder="至少6-10位，仅支持数字和英文" autoComplete="off" />
                </Form.Item>
                <Form.Item
                    label="重复新密码"
                    name="newPassword2"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: '请再次输入新密码' },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('两次输入的密码不一致');
                            },
                        }),
                    ]}
                >
                    <Input type="password" placeholder="请再次输入新密码" autoComplete="off" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default SecurityModal