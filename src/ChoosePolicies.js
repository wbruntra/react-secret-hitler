import React, { useEffect, useState } from 'react'
import produce from 'immer'
import { get } from 'lodash'
import { updateGame } from './utils'

function ChoosePolicies({ game, playerName, gameRef }) {
  const policies = game.policyChoices
  const [chosen, setChosen] = useState(policies.map((p) => false))
  const getJob = () => {
    const pres = get(game, 'government.president')
    if (pres === playerName) {
      return 'president'
    }
    const chan = get(game, 'government.chancellor')
    if (chan === playerName) {
      return 'chancellor'
    }
    return null
  }

  const confirmChoice = () => {
    console.log(chosen)
    const newPolicyChoices = getPolicies()
    const unchosen = policies.filter((p, i) => {
      return !chosen[i]
    })[0]
    const newGame = produce(game, (draft) => {
      draft.discards.push(unchosen)
      if (newPolicyChoices.length === 1) {
        const newPolicy = newPolicyChoices[0]
        const event = `A new policy has been chosen: ${newPolicy}`
        draft.enactedPolicies.push(newPolicy)
        draft.policyChoices = []
        draft.events.push(event)
        draft.governmentApproved = false
      } else {
        draft.presidentHasChosen = true
        draft.policyChoices = newPolicyChoices
      }
    })
    console.log(newGame)

    updateGame(gameRef, newGame)
  }

  const togglePolicy = (idx) => {
    const newChosen = produce(chosen, (draft) => {
      draft[idx] = !draft[idx]
    })
    setChosen(newChosen)
  }

  const getPolicies = () => {
    return policies.filter((p, i) => {
      return chosen[i]
    })
  }

  if (!game.governmentApproved) {
    return null
  }

  const job = getJob()

  if (!job) {
    return null
  }

  if (job === 'president' && game.presidentHasChosen) {
    return null
  }

  if (job === 'chancellor' && !game.presidentHasChosen) {
    return (
      <div className="row">
        <div className="col">
          <p>You are the {job}</p>
          <p>Waiting for president to choose</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <p>You are the {job}</p>
        </div>
      </div>
      <div className="row">
        {policies.map((p, i) => {
          return (
            <div key={`policy-${i}`} className="col-3">
              <div className="card py-4" onClick={() => togglePolicy(i)}>
                {p} {chosen[i] && 'yes'}
              </div>
            </div>
          )
        })}
      </div>
      <div className="row">
        <div className="col">
          <button
            onClick={() => {
              const confirmed = getPolicies()
              if (confirmed.length === policies.length - 1) {
                confirmChoice(chosen)
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  )
}

export default ChoosePolicies
