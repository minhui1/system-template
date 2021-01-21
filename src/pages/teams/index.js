import React, { useEffect, useState } from 'react'
// import PageHeaderWrapper from '@/components/pageHeaderWrapper'
import { 
    // Input, 
    Button, 
    Table, 
    Modal 
} from 'antd'
// import { SearchOutlined } from '@ant-design/icons'
import { API_CODE, apiReqs } from '@/api'
// 创建团队弹层
import CreateModal from './createModal'
// 团队设置弹层
import TeamSetup from './teamSetup'

import './teams.styl'

function Teams() {

    // 团队列表
    const [listData, setListData] = useState({
        totalElements: 0, // 总数
        content: []
    })

    //列表pageSize
    const listPageSize = 20
    //分页
    const [page, setPage] = useState(1)

    // loading 模块
    const [loading, setLoading] = useState(true)

    // 根据管理员名搜索
    const [teamName, setTeamName] = useState(null)

    // 根据用户名搜索
    const [username, setUsername] = useState(null)

    // 是否展示创建弹层
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)

    // 是否展示团队设置弹层
    // const [isTeamSetup, setIsTeamSetup] = useState(false)
    const [editItem, setEditItem] = useState(null)

    // 点击创建出现弹层
    const showCreateModal = () => {
        setIsCreateModalVisible(true)
    };

    // 点击设置出现 团队设置弹层
    const showTeamSetupModal = (value) => {
        // console.log('value:', value)
        setEditItem(value)
        // setIsTeamSetup(true)
    }

    useEffect(() => {
        getTeamData({
            page,
            teamName,
            username,
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // 获取列表数据
    const getTeamData = (config) => {
        setLoading(true)
        apiReqs.getTeamData({
            data: {
                size: listPageSize,
                page: config.page - 1,
                teamName: config.teamName ? config.teamName : null,
                username: config.username ? config.username : null,

            },
            success: (res) => {
                // console.log(res)
                setLoading(false)
                if (res.code === API_CODE.OK) {
                    setListData({
                        totalElements: res.data.totalElements,
                        content: res.data.content
                    })
                } else {
                    Modal.error({
                        title: res.message
                    })
                }
            },
            done: () => {
                setLoading(false)
            }
        })
    }

    // 团队名input取值
    // const onTeamNameChange = (e) => {
    //     setTeamName(e.target.value)
    // }

    // 管理员input取值
    // const onUsernameChange = (e) => {
    //     setUsername(e.target.value)
    // }

    // 搜索
    // const search = () => {
    //     setPage(1)
    //     getTeamData({
    //         page: 1,
    //         teamName: teamName,
    //         username: username
    //     })
    // }
    // 显示全部
    // const showAll = () => {
    //     setTeamName(null)
    //     setUsername(null)
    //     setPage(1)
    //     getTeamData({
    //         page: 1,
    //         teamName: null,
    //         username: null
    //     })
    // }


    const columns = [
        {
            title: '团队名称',
            dataIndex: 'teamName',
            key: 'teamName',
            width: 90,
        },
        {
            title: '管理员',
            dataIndex: 'username',
            key: 'username',
            width: 90,
        },
        {
            title: '团队人数',
            dataIndex: 'userCount',
            key: 'userCount',
            width: 100,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
        },
        {
            title: '连线总数',
            dataIndex: 'lineStatisticsVo',
            key: 'lineTotalCount',
            width: 100,
            render: (record) => (
                <>{record.lineTotalCount}</>
            )
        },
        {
            title: '连线总时长（分钟）',
            dataIndex: 'lineStatisticsVo',
            key: 'lineTotalDuration',
            width: 160,
            render: (record) => (
                <>{record.lineTotalDuration}</>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            fixed: 'right',
            render: (record) => (
                <div className="action-con">
                    <span onClick={() => { showTeamSetupModal(record) }}>查看</span><span onClick={() => { showTeamSetupModal(record) }}>修改</span>
                </div>
            )
        }
    ]

    return (
        <>
            {/* <PageHeaderWrapper title="团队管理" subTitle={'共' + listData.totalElements + '人'} /> */}
            <section className="G-main P-teams">
                <div className="G-title">
                    <h3></h3>
                    <span><Button type="primary" onClick={showCreateModal}>+境内报名</Button><Button type="primary" onClick={showCreateModal}>+境外报名</Button></span>
                </div>
                {/* <div className="G-search">
                    团队名称：<Input placeholder="请输入" value={teamName} onChange={onTeamNameChange} />
                    团队管理员：<Input placeholder="请输入" value={username} onChange={onUsernameChange} />
                    <Button type="primary" icon={<SearchOutlined />} onClick={search}>搜索</Button>
                    <Button onClick={showAll}>显示全部</Button>
                </div> */}
                <div className="G-card">
                    <Table
                        rowKey={record => record.hashId}
                        className="G-table"
                        dataSource={listData.content}
                        columns={columns}
                        loading={loading}
                        scroll={{ x: 'calc(700px + 50%)' }}
                        pagination={{
                            total: listData.totalElements,
                            pageSize: listPageSize,
                            showSizeChanger: false
                        }}
                        onChange={(next) => {
                            setPage(next.current)
                            getTeamData({
                                page: next.current,
                                teamName,
                                username
                            })
                        }}
                    />
                </div>
            </section>
            {/* 创建弹层 */}
            {
                isCreateModalVisible ?
                    <CreateModal
                        onRefresh={() => {
                            getTeamData({
                                page,
                                teamName,
                                username
                            })
                        }}
                        onClose={
                            () => {
                                setIsCreateModalVisible(false)
                            }
                        }
                    /> : null
            }
            {/* 团队设置 */}
            {
                editItem ?
                    <TeamSetup
                        onRefresh={() => {
                            getTeamData({
                                page,
                                teamName,
                            })
                        }}
                        onClose={
                            () => {
                                // setIsTeamSetup(false)
                                setEditItem(null)
                            }
                        }
                        teamNameOld={editItem.teamName}
                        commentOld={editItem.comment}
                        teamId={editItem.id}
                        statusOld={editItem.status}
                    /> : null

            }

        </>
    )
}



export default Teams