import React, { useState } from 'react'
import produce from 'immer'
import { updateGame, refreshPolicies, getThemedPolicyName } from './utils'
import DisplayPolicies from './DisplayPolicies'

function ActionBar({ game, gameRef, playerName = '', hosting = false }) {
  const [confirmationNeeded, setConfirmationNeeded] = useState(false)
  const [viewing, setViewing] = useState(false)
  const [doneViewing, setDoneViewing] = useState(true)
  const [preparedState, setPreparedState] = useState(null)

  if (!game.started) {
    return null
  }

  const confirmAction = (bool) => {
    if (bool) {
      updateGame(gameRef, preparedState)
      if (viewing) {
        setDoneViewing(false)
      }
    }
    setPreparedState(null)
    setViewing(false)
    setConfirmationNeeded(false)
  }

  const enactTopPolicy = () => {
    const newGame = produce(game, (draft) => {
      let tempPolicies = game.policies
      if (game.policies.length === 0) {
        tempPolicies = refreshPolicies(game)
        draft.discards = []
      }
      const newPolicy = tempPolicies[0]
      const themedPolicyName = getThemedPolicyName(newPolicy)
      const event = `Government in chaos! New policy enacted: ${themedPolicyName}`
      draft.policies = tempPolicies.slice(1)
      draft.enactedPolicies.push(newPolicy)
      draft.events.push(event)
    })
    setConfirmationNeeded(true)
    setPreparedState(newGame)
  }

  const viewTopPolicies = () => {
    const newGame = produce(game, (draft) => {
      let tempPolicies = game.policies
      if (game.policies.length < 3) {
        tempPolicies = refreshPolicies(game)
        draft.discards = []
      }
      draft.presidentShouldViewPolicies = true
      draft.policies = tempPolicies
    })
    setConfirmationNeeded(true)
    setViewing(true)
    setPreparedState(newGame)
  }

  const allowInvestigation = () => {
    const newGame = produce(game, (draft) => {
      draft.presidentShouldInvestigate = true
    })
    setConfirmationNeeded(true)
    setPreparedState(newGame)
  }

  const endGame = () => {
    const newGame = produce(game, (draft) => {
      draft.gameOver = true
    })
    setConfirmationNeeded(true)
    setPreparedState(newGame)
  }

  // if (playerName !== game.lastPresident && !doneViewing) {
  //   return (
  //     <DisplayPolicies
  //       onPolicyClick={() => {
  //         setDoneViewing(true)
  //       }}
  //       policies={game.policies.slice(0, 3)}
  //     />
  //   )
  // }

  return (
    <>
      {!confirmationNeeded ? (
        <div className="row mt-3">
          <div className="col-6 col-md-3">
            <button
              className="btn btn-warning"
              onClick={() => {
                enactTopPolicy()
              }}
            >
              Enact Top Policy
            </button>
          </div>
          <div className="col-6 col-md-3">
            <button className="btn btn-warning" onClick={viewTopPolicies}>
              View Top Policies
            </button>
          </div>
          <div className="col-6 col-md-3">
            <button className="btn btn-warning" onClick={allowInvestigation}>
              Allow Investigation
            </button>
          </div>
          <div className="col-6 col-md-3">
            <button className="btn btn-warning" onClick={endGame}>
              End Game
            </button>
          </div>
        </div>
      ) : (
        <div className="row mt-3">
          <div className="col-4 col-md-3">
            <button
              className="btn btn-danger mr-3"
              onClick={() => {
                confirmAction(true)
              }}
            >
              Confirm
            </button>
            <button
              className="btn btn-info"
              onClick={() => {
                confirmAction(false)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ActionBar
