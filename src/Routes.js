import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Main from './Main'
import Game from './Game'

function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/g/:code">
            <Game />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default Routes
