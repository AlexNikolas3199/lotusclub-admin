import 'antd/dist/antd.min.css'
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import locale from 'antd/es/locale/ru_RU'
import { ConfigProvider } from 'antd'
import { ApolloProvider } from '@apollo/client'
import withLayout from './components/Layout'
import GlobalStyles from './components/GlobalStyles'
import apolloClient from './utils/apollo'
import Main from './containers/main'
import Login from './containers/login'
import Password from './containers/password'
import Events from './containers/events'
import CreateOneRoute from './containers/events/create'
import UpdateRoute from './containers/events/update'
import Event from './containers/events/event'
import HistoryEvents from './containers/history'
import Lektors from './containers/lektors'
import CreateOneLektor from './containers/lektors/create'
import UpdateLektor from './containers/lektors/update'
import Users from './containers/users'
import User from './containers/users/user'

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ConfigProvider locale={locale}>
        <Router>
          <Switch>
            <Route path='/' exact component={(props) => withLayout(props, Main)} />

            <Route path='/events' exact component={(props) => withLayout(props, Events)} />
            <Route path='/events/create' exact component={(props) => withLayout(props, CreateOneRoute)} />
            <Route path='/events/update/:id' exact component={(props) => withLayout(props, UpdateRoute)} />
            <Route path='/events/:id' exact component={(props) => withLayout(props, Event)} />

            <Route path='/lektors' exact component={(props) => withLayout(props, Lektors)} />
            <Route path='/lektors/create' exact component={(props) => withLayout(props, CreateOneLektor)} />
            <Route path='/lektors/update/:id' exact component={(props) => withLayout(props, UpdateLektor)} />

            <Route path='/history' exact component={(props) => withLayout(props, HistoryEvents)} />

            <Route path='/users' exact component={(props) => withLayout(props, Users)} />
            <Route path='/users/:id' exact component={(props) => withLayout(props, User)} />

            {/* <Route path='/admins' exact component={(props) => withLayout(props, Admins)} />
            <Route path='/admins/create' exact component={(props) => withLayout(props, CreateAdmin)} />
            <Route path='/admins/update/:id' exact component={(props) => withLayout(props, UpdateAdmin)} /> */}

            <Route path='/password/update' exact component={(props) => withLayout(props, Password)} />
            <Route path='/login' exact component={Login} />
          </Switch>
        </Router>
        <GlobalStyles />
      </ConfigProvider>
    </ApolloProvider>
  )
}

export default App
