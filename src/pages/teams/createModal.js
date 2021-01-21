import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Form, } from 'antd'
import { API_CODE, apiReqs } from '@/api'
import './createModal.styl'


function CreateModal(props) {
    // 通过props接收值
    const { onClose, onRefresh } = props

    // 文本框
    // const { TextArea } = Input

    // input值
    const [teamName, setTeamName] = useState('')

    // textarea值
    const [comment, setComment] = useState('')

    const [loading, setLoading] = useState(false)

    // 取消关闭
    const handleCancel = () => {
        onClose && onClose()
    };

    useEffect(() => {
        setTeamName('')
        setComment('')

    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    const openCreateModal = (values) => {
        setLoading(true)
        let data = {}
        data.teamName = values.teamName
        data.comment = values.comment

        apiReqs.createTeam({
            data,
            success: (res) => {
                onClose()
                if (res.code === API_CODE.OK) {
                    Modal.success({
                        onOk() {
                            onRefresh()
                        },
                        title: '添加成功！'
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
                openCreateModal(values)
            })
            .catch((info) => {
                console.log('验证失败')
                setLoading(false)
            })
    };

    const [form] = Form.useForm()

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const onFinish = values => {
        console.log(values);
    };


    return (

        <Modal className="M-create-modal" title="创建团队" visible={true}
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
            <Form form={form} {...layout} name="nest-messages" onFinish={onFinish} initialValues={{ teamName, comment }}>
                <Form.Item name="teamName" label="团队名称：" rules={[{ required: true, message: "请输入团队名称" }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="comment" label="团队备注：" rules={[{ required: false, message: "请输入备注" }]}>
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>


    )

}

export default CreateModal