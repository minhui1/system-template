import React, { useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import Header from '@/components/header'
// import Home from '@/pages/home'
import Admins from '@/pages/admins'
// 用户管理
import Users from '@/pages/users'
// 团队管理
import Teams from '@/pages/teams'

const { Content } = Layout

function Entry(props) {
    const [collapsed, setCollapsed] = useState(false)

    const toggle = () => {
        setCollapsed(!collapsed)
    }

    return (
        <section className="G-fullpage">
            <Layout>
                <Header
                    history={props.history}
                    collapsed={collapsed}
                    toggle={toggle}
                />
                <Content style={{ paddingTop: 64 }}>
                    <Switch>
                        {/* <Route exact path="/home" component={Home} /> */}
                        <Route exact path="/admins" component={Admins} />
                        <Route exact path="/users" component={Users} />
                        <Route exact path="/teams" component={Teams} />
                        <Redirect to={'/teams'} />
                    </Switch>
                </Content>
            </Layout>
        </section>
    )
}

export default Entry
