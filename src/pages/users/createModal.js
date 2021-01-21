import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Form, Select } from 'antd'
import { API_CODE, apiReqs } from '@/api'
import './createModal.styl'


function CreateModal(props) {
    // 通过props接收值
    const { onClose, onRefresh, usernameOld, phoneNumberOld, teamIdOld } = props

    const { Option } = Select;

    // input值
    const [username, setUsername] = useState(usernameOld)
    const [phoneNumber, setPhoneNumber] = useState(phoneNumberOld)
    const [teamId, setTeamId] = useState(teamIdOld)

    // loading
    const [loading, setLoading] = useState(false)

    const [teamList, setTeamList] = useState([])

    // 取消关闭
    const handleCancel = () => {
        onClose && onClose()
    };

    useEffect(() => {
        setUsername('')
        setPhoneNumber('')
        setTeamId('')
        queryTeamIdSelect()

    }, [])// eslint-disable-line react-hooks/exhaustive-deps


    const openCreateModal = (values) => {
        setLoading(true)
        let data = {}
        data.username = values.username
        data.phoneNumber = values.phoneNumber
        data.teamId = values.teamId
        

        apiReqs.createUser({
            data,
            success: (res) => {
                onClose()
                if (res.code === API_CODE.OK) {
                    Modal.success({
                        title: '添加成功！',
                        onOk() {
                            onRefresh()
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
                setLoading(false)
            }
        })
    }

    const queryTeamIdSelect = () => {
        setLoading(true)
        apiReqs.queryTeamId({
            success: (res) => {
                if (res.code === API_CODE.OK) {
                    setTeamList(res.data)
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

    // input取值
    // const onInputValueChange = (e) => {
    //     setTeamName(e.target.value)
    // }
    // // textarea取值
    // const onTextareaValueChange = (e) => {
    //     setComment(e.target.value)
    // }

    // 确定关闭
    const handleOk = () => {
        setLoading(true)
        form.validateFields()
            .then((values) => {
                // form.resetFields()
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

        <Modal className="M-create-user" title="创建用户" visible={true}
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
            <Form form={form} {...layout} name="nest-messages" onFinish={onFinish} initialValues={{ username, phoneNumber, teamId }}>
                <Form.Item name="username" label="姓名：" rules={[{ required: true, message: "请输入姓名" }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item name="phoneNumber" label="手机号：" rules={[{ required: true, message: "请输入手机号" }]}>
                    <Input placeholder="请输入"/>
                </Form.Item>
                <Form.Item className="" name="teamId" label="团队：" rules={[{ required: true, message: "请选择团队" }]}>
                    <Select style={{ width: 120 }} placeholder="请选择团队" >
                        {
                            teamList.map((item, indexItem) => {
                              return  <Option value={item.id} key={indexItem}>{item.teamName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        </Modal>


    )

}

export default CreateModal