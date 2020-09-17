import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Main from './Main'
import Game from './Game'

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/g/:code" component={Game} />
      </Switch>
    </Router>
  )
}

export default Routes
