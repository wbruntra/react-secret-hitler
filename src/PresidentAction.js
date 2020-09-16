import React, { useState } from 'react'
import PlayerList from './PlayerList'
import produce from 'immer'
import { updateGame, identifyHitler } from './utils'
import RoleReveal from './RoleReveal'

function PresidentKills({ gameRef, game, playerName, onPlayerClick = () => {} }) {
  const [choice, setChoice] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const action = game.presidentShouldKill ? 'kill' : 'investigate'

  const handlePlayerClick = (p) => {
    console.log(p)
    setChoice(p)
  }

  const handleConfirm = () => {
    if (action === 'investigate' && !isConfirmed) {
      setConfirmed(true)
      return
    }
    const newGame = produce(game, (draft) => {
      draft.events.push(`President decided to kill ${choice}`)
      draft.presidentShouldKill = false
      draft.presidentShouldInvestigate = false
      const hitlerDead = choice === identifyHitler(game)
      if (hitlerDead) {
        draft.events.push(`${choice} was Hitler! Liberals win!`)
      }
    })
    console.log(newGame)
    // updateGame(gameRef, newGame)
  }

  if (!game.presidentShouldKill && !game.presidentShouldInvestigate) {
    return null
  }

  if (!game.government.president === playerName) {
    return null
  }

  if (choice && confirmed) {
    return (
      <RoleReveal
        game={game}
        playerName={choice}
        handleOkay={() => {
          handleConfirm()
        }}
      />
    )
  }

  return (
    <div className="section">
      <h3>You are the President. Please choose a player to {action}</h3>
      <PlayerList game={game} playerName={playerName} onPlayerClick={handlePlayerClick} />
      {choice && (
        <>
          <div classname="row">
            <div className="col">
              <p>
                You are choosing to {action} {choice}
              </p>
            </div>
          </div>
          <div classname="row">
            <div className="col-2">
              <button className="btn btn-danger">Confirm</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setChoice(null)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PlayerList
