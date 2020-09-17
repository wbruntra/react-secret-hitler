import React from 'react'
import { getRoleTeam } from './utils'

function RoleReveal({ game, playerName }) {
  const { roles } = game
  const role = roles[playerName]
  const team = getRoleTeam(role)

  return (
    <div className="row justify-content-center p-4">
      <div className="col-8">
        <div className="row">
          <div className="col">Player: {playerName}</div>
        </div>
        <div className="row">
          <div className="col">Affiliation: {team}</div>
        </div>
      </div>
    </div>
  )
}

export default RoleReveal
