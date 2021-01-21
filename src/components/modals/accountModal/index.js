import React, { useState } from 'react'
import { Form, Input, Modal } from 'antd'
import { API_CODE, apiReqs } from '@/api'
import './accountModal.styl'

const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}

const AccountModal = ({ onClose }) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const initNickname = JSON.parse(window.localStorage.getItem('loginInfo')).nickname
    const handleSubmit = values => {
        setLoading(true)
        let data = {
            nickname: values.nickname
        }
        apiReqs.modifySelfInfo({
            this: this,
            data,
            success: (res) => {
                if (res.code === API_CODE.OK) {
                    let loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
                    loginInfo.nickname = values.nickname
                    window.localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
                    Modal.success({
                        title: res.message,
                        onOk: () => {
                            window.location.reload()
                        }
                    })
                } else {
                    Modal.error({
                        title: res.message
                    })
                }
            },
            done: () => {
                setLoading(false)
                onClose && onClose()
            }
        })
    }

    return (
        <Modal
            className="M-accountModal"
            visible={true}
            title="账号信息"
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
                    name="nickname"
                    label="昵称"
                    rules={[{ required: true, message: '请输入昵称' }]}
                >
                    <Input placeholder="请输入昵称" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AccountModal