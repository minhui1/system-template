import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import store from './store'
import Entry from './pages/entry'
import Login from './pages/login'

// 路由守卫
function PrivateRoute({ Children, ...params }) {
    // return <Route {...params} />
    return window.localStorage.getItem('loginInfo') ? (
        <Route {...params} />
    ) : (
        <Redirect to={'/login'} />
    )
}

function App() {
    return (
        <>
            <HashRouter>
                <Switch>
                    <Route exact path="/login" component={Login}></Route>
                    <PrivateRoute path="/" component={Entry}/>
                </Switch>
            </HashRouter>
        </>
    )
}

export default App
