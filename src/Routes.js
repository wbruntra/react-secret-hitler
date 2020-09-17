import React from 'react'
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Main from './Main'
import Game from './Game'
import { Route, Switch } from 'wouter'

function Routes() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/g/:code" component={Game} />
      </Switch>
    </div>
  )
}

export default Routes
