import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './pages/home'
import Analytics from './pages/analytics'
import NotFound from './pages/not-found'
import './styles/globals.scss'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route key="home" exact path="/" component={Home} />
      <Route key="analytics" exact path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

ReactDOM.render(<App />, document.getElementById('app'))
