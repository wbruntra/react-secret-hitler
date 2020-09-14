import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Game from './Game'
import App from './App'

function Routes() {
  return (
    <Router>
      <div>

        <Switch>
          <Route exact path="/">
            <App />
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
