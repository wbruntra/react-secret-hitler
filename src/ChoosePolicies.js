import React, { useState } from 'react'
import produce from 'immer'
import { capitalize, get } from 'lodash'
import { updateGame, countPolicies, getThemedPolicyName } from './utils'
import LiberalCardImg from './assets/Liberal.JPG'
import FascistCardImg from './assets/Fascist.JPG'
import theme from './theme'

function ShowPolicies({ policies, onPolicyClick, chosen }) {
  return (
    <div className="row">
      {policies.map((p, i) => {
        const cardImg = p === 'LIBERAL' ? LiberalCardImg : FascistCardImg

        return (
          <div key={`policy-${i}`} className="col-2 text-center">
            <div
              className="card py-4 policy-space"
              onClick={() => {
                onPolicyClick(i)
              }}
            >
              <img className="card-img-top" src={cardImg} alt="policy choice" />
              {chosen[i] && 'YES'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

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
            event = `${capitalize(theme.presidentTitle)} has agreed to veto`
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
    return 'Waiting for government to choose a new policy...'
  }

  if (
    job === theme.presidentTitle &&
    !game.chancellorHasVetoed &&
    game.policyChoices.length === 2
  ) {
    return `Waiting for ${theme.chancellorTitle}...`
  }

  if (job === theme.presidentTitle && game.presidentRejectedVeto) {
    return `Rejected veto. Waiting for ${theme.chancellorTitle}...`
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
      <div className="row">
        <div className="col">
          <p>You are the {job}</p>
          <p>Waiting for {theme.presidentTitle} to choose</p>
        </div>
      </div>
    )
  }

  const counts = countPolicies(game)

  if (job === theme.presidentTitle && game.chancellorHasVetoed) {
    return (
      <>
        <div className="row">
          <div className="col">
            <h2>{capitalize(theme.chancellorTitle)} wants to veto these policies. Agree?</h2>
          </div>
        </div>
        <ShowPolicies policies={game.policyChoices} onPolicyClick={() => {}} chosen={chosen} />
        <div className="row mt-3">
          <div className="col-3">
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
          <div className="col-3">
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
      </>
    )
  }

  return (
    <>
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
      <div className="row">
        {policies.map((p, i) => {
          const cardImg = p === 'LIBERAL' ? LiberalCardImg : FascistCardImg

          return (
            <div key={`policy-${i}`} className="col-2 text-center">
              <div className="card py-4 policy-space" onClick={() => togglePolicy(i)}>
                <img className="card-img-top" src={cardImg} alt="policy choice" />
                <div className="mt-2">
                  {chosen[i] ? (
                    <i className="fas fa-check green"></i>
                  ) : (
                    <i className="fas fa-times red"></i>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="row">
        <div className="col">
          <button
            type="button"
            className="btn btn-primary mt-2"
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
    </>
  )
}

export default ChoosePolicies
