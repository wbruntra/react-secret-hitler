import React from 'react'
import { getRoleTeam } from './utils'

function RoleReveal({ game, playerName, handleOkay }) {
  const { roles } = game
  const role = roles[playerName]
  const team = getRoleTeam(role)

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-4 col-md-3">
          <div className="card shadow p-3 text-center">
            <div className="row">
              <div className="col">Player: {playerName}</div>
            </div>
            <div className="row">
              <div className="col">Role: {team}</div>
            </div>
            <div className="row">
              <div className="col">
                <button className="btn btn-primary mt-4" onClick={handleOkay}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleReveal
