import React from 'react'
import { countPolicies } from './utils'

function GameStatus({ game }) {

  const counts = countPolicies(game)

  return (
    <div className="row mt-3">
      <ul>
        <li>Liberal Policies: {counts.liberal} </li>
        <li>Fascist Policies: {counts.fascist} </li>
      </ul>
    </div>
  )
}

export default GameStatus
