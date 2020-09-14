import React from 'react'
import produce from 'immer'

function ActionBar({ game, gameRef }) {
  if (!started) {
    return null
  }
  const enactTopPolicy = () => {
    const newGame = produce(game, (draft) => {
      draft.policies = game.policies.slice(1)
      draft.enactedPolicies.push(game.policies[0])
    })
    console.log(newGame)
  }

  return (
    <div className="row">
      <div className="col-2">
        <button onClick={() => {enactTopPolicy()}}>Enact Top Policy</button>
      </div>
      <div className="col-2">
        <button>GO</button>
      </div>
      <div className="col-2">
        <button>GO</button>
      </div>
    </div>
  )
}

export default ActionBar
