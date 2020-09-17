import React, { useState } from 'react'
import produce from 'immer'
import { capitalize, get } from 'lodash'
import { updateGame, countPolicies, getThemedPolicyName } from './utils'
import theme from './theme'
import DisplayPolicies from './DisplayPolicies'
import SimpleOverlay from './SimpleOverlay'

function ChoosePolicies({ game, playerName, gameRef }) {
  const resetChosen = () => {
    return Array(3).fill(false)
  }

  const policies = game.policyChoices
  const [chosen, setChosen] = useState(resetChosen())
  const getJob = () => {
    const pres = get(game, 'government.president')
    if (pres === playerName) {
      return theme.presidentTitle
    }
    const chan = get(game, 'government.chancellor')
    if (chan === playerName) {
      return theme.chancellorTitle
    }
    return null
  }

  const gameReducer = (action) =>
    produce(game, (draft) => {
      let event
      switch (action.type) {
        case 'veto':
          draft.presidentHasChosen = false
          if (game.chancellorHasVetoed) {
            draft.discards.push(...game.policyChoices)
            draft.policyChoices = []
            event = `${capitalize(theme.presidentTitle)} has agreed to veto. Government fails!`
            draft.governmentApproved = false
            draft.government = {
              president: '',
              chancellor: '',
            }
          } else {
            event = `${theme.chancellorTitle} has proposed a veto`
            draft.chancellorHasVetoed = true
          }
          draft.events.push(event)
          return
        case 'confirm':
          const newPolicyChoices = getPolicies()
          const unchosen = policies.filter((p, i) => {
            return !chosen[i]
          })[0]
          draft.discards.push(unchosen)
          if (newPolicyChoices.length === 1) {
            const newPolicy = newPolicyChoices[0]
            event = `A new policy has been chosen: ${newPolicy}`
            draft.enactedPolicies.push(newPolicy)
            draft.policyChoices = []
            draft.presidentHasChosen = false
            draft.governmentApproved = false
            draft.government = {
              president: '',
              chancellor: '',
            }
          } else {
            draft.presidentHasChosen = true
            draft.policyChoices = newPolicyChoices
          }
          draft.events.push(event)
          return
      }
    })

  const vetoChoice = (accept = true) => {
    const newGame = produce(game, (draft) => {
      let event
      draft.presidentHasChosen = false
      if (!accept) {
        draft.presidentRejectedVeto = true
        event = `${theme.presidentTitle} has rejected the veto`
      } else {
        if (game.chancellorHasVetoed) {
          draft.discards.push(...game.policyChoices)
          draft.policyChoices = []
          event = `${theme.presidentTitle} has agreed to veto`
          draft.governmentApproved = false
          draft.chancellorHasVetoed = false
          draft.presidentHasChosen = false
          draft.government = {
            president: '',
            chancellor: '',
          }
        } else {
          event = `${theme.chancellorTitle} has proposed a veto`
          draft.chancellorHasVetoed = true
        }
      }
      draft.events.push(event)
    })
    console.log(newGame)

    updateGame(gameRef, newGame)
  }

  const confirmChoice = () => {
    const newPolicyChoices = getPolicies()
    const unchosen = policies.filter((p, i) => {
      return !chosen[i]
    })[0]
    const newGame = produce(game, (draft) => {
      draft.discards.push(unchosen)
      if (newPolicyChoices.length === 1) {
        const newPolicy = newPolicyChoices[0]
        const themedPolicyName = getThemedPolicyName(newPolicy)
        const event = `A new policy has been chosen: ${themedPolicyName}`
        draft.enactedPolicies.push(newPolicy)
        draft.policyChoices = []
        draft.events.push(event)
        draft.presidentHasChosen = false
        draft.governmentApproved = false
        draft.chancellorHasVetoed = false
        draft.presidentRejectedVeto = false
        draft.government = {
          president: '',
          chancellor: '',
        }
        draft.lastPresident = game.government.president
        draft.lastChancellor = game.government.chancellor
      } else {
        draft.presidentHasChosen = true
        draft.policyChoices = newPolicyChoices
      }
    })

    updateGame(gameRef, newGame)
    setChosen(resetChosen())
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
    if (process.env.NODE_ENV !== 'production') {
      return 'Waiting for government to choose a new policy...'
    }
    return (
      <SimpleOverlay title="Government in Session">
        <p>Waiting for government to choose a new policy...</p>
      </SimpleOverlay>
    )
  }

  if (
    job === theme.presidentTitle &&
    !game.chancellorHasVetoed &&
    game.policyChoices.length === 2
  ) {
    return (
      <SimpleOverlay title="Government in Session">
        <p>Waiting for {theme.chancellorTitle}</p>
      </SimpleOverlay>
    )
  }

  if (job === theme.presidentTitle && game.presidentRejectedVeto) {
    return (
      <SimpleOverlay title="Government in Session">
        <p>Rejected veto. Waiting for {theme.chancellorTitle}</p>
      </SimpleOverlay>
    )
  }

  if (job === theme.chancellorTitle && game.chancellorHasVetoed && !game.presidentRejectedVeto) {
    return `Veto proposed. Waiting for ${theme.presidentTitle} to decide.`
  }

  if (
    job === theme.chancellorTitle &&
    !game.chancellorHasVetoed &&
    game.policyChoices.length === 3
  ) {
    return (
      <SimpleOverlay title="Government in Session">
        <div className="row">
          <div className="col">
            <p>You are the {job}</p>
            <p>Waiting for {theme.presidentTitle} to choose</p>
          </div>
        </div>
      </SimpleOverlay>
    )
  }

  const counts = countPolicies(game)

  if (job === theme.presidentTitle && game.chancellorHasVetoed) {
    return (
      <>
        <SimpleOverlay title="Veto Proposed">
          <div className="row">
            <div className="col">
              <p>{capitalize(theme.chancellorTitle)} wants to veto these policies. Agree?</p>
            </div>
          </div>
          <DisplayPolicies
            policies={game.policyChoices}
            onPolicyClick={() => {}}
            chosen={chosen}
          />
          <div className="row mt-3">
            <div className="col-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  vetoChoice()
                }}
              >
                Agree to Veto
              </button>
            </div>
            <div className="col-4">
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => {
                  vetoChoice(false)
                }}
              >
                Reject Veto
              </button>
            </div>
          </div>
        </SimpleOverlay>
      </>
    )
  }

  return (
    <>
      <SimpleOverlay title="Government in Session">
        <div className="row">
          <div className="col">
            <p>
              You are the {job}.{' '}
              {job === theme.presidentTitle
                ? 'Choose 2 policies to keep'
                : 'Choose a policy to adopt'}
            </p>
            {game.presidentRejectedVeto && (
              <p>The {theme.presidentTitle} rejected your veto. Choose a policy to enact</p>
            )}
          </div>
        </div>
        <DisplayPolicies
          policies={game.policyChoices}
          onPolicyClick={(i) => togglePolicy(i)}
          chosen={chosen}
        />
        <div className="row">
          <div className="col">
            <button
              type="button"
              className="btn btn-primary mt-3"
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
          {counts.fascist === 5 && job === theme.chancellorTitle && !game.presidentRejectedVeto && (
            <div className="col">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  vetoChoice()
                }}
              >
                Veto
              </button>
            </div>
          )}
        </div>
      </SimpleOverlay>
    </>
  )
}

export default ChoosePolicies
