import React, { useState } from 'react'
import produce from 'immer'
import { get, capitalize } from 'lodash'
import { withRouter } from 'react-router-dom'
import PlayerList from './PlayerList'
import Government from './Government'
import EventList from './EventList'
import RoleModal from './RoleModal'
import RoleReveal from './RoleReveal'
import ChoosePolicies from './ChoosePolicies'
import GameStatus from './GameStatus'
import ActionBar from './ActionBar'
import { updateGame, refreshPolicies, assignRoles, createPolicies, isGameOver } from './utils'
import SpecialRulesModal from './SpecialRulesModal'
import theme from './theme'

const { redTeamLeader } = theme

function App(props) {
  const { game, gameRef, hosting = false } = props
  const [name, setName] = useState(props.name || '')
  const [president, setPresident] = useState(null)
  const [chancellor, setChancellor] = useState(null)
  const [viewingIdentity, setViewingIdentity] = useState(false)
  const [chosenPlayer, setChosenPlayer] = useState(null)

  const handleChoosePlayer = (p) => {
    setChosenPlayer(p)
    setViewingIdentity(true)
    const newGame = produce(game, (draft) => {
      draft.events.push(`${name} investigated ${p}'s membership`)
      draft.presidentShouldInvestigate = false
    })
    updateGame(gameRef, newGame)
  }

  const handleStart = () => {
    const roles = assignRoles(game)
    const event = `Game has started`

    const newGame = produce(game, (draft) => {
      draft.roles = roles
      draft.policies = createPolicies()
      draft.started = true
      draft.events.push(event)
    })
    updateGame(gameRef, newGame)
  }

  const dismissReveal = () => {
    console.log('reveal dismissed!')
    setViewingIdentity(false)
    setChosenPlayer(false)
  }

  const setGovernment = (approved = true) => {
    if (!president || !chancellor) {
      console.log('set pres & chan')
      return
    }
    let event
    let newGame
    if (approved) {
      event = `New government approved. ${theme.presidentTitle}: ${president}, ${theme.chancellorTitle}: ${chancellor}`
      newGame = produce(game, (draft) => {
        let tempPolicies = game.policies
        if (game.policies < 3) {
          tempPolicies = refreshPolicies(game)
          draft.discards = []
        }
        draft.government = {
          president: president,
          chancellor: chancellor,
        }
        draft.policyChoices = tempPolicies.slice(0, 3)
        draft.policies = tempPolicies.slice(3)
        draft.events.push(event)
        draft.presidentHasChosen = false
        draft.presidentRejectedVeto = false
        draft.chancellorHasVetoed = false
        draft.governmentApproved = true
      })
    } else {
      event = `Government rejected. President: ${president}, Chancellor: ${chancellor}`
      setPresident(null)
      setChancellor(null)
      newGame = produce(game, (draft) => {
        draft.events.push(event)
      })
    }
    console.log(newGame)
    updateGame(gameRef, newGame)
  }

  const handlePlayerClick = (playerName) => {
    if (president !== playerName && chancellor !== playerName) {
      setPresident(playerName)
      return
    }
    if (president === playerName) {
      setPresident(null)
      setChancellor(playerName)
      return
    }
    if (chancellor === playerName) {
      setChancellor(null)
      return
    }
  }

  if (!game.started) {
    return (
      <div className="container">
        <PlayerList game={game} playerName={name} onPlayerClick={handlePlayerClick} />
        {hosting && (
          <div className="row mt-3">
            <div className="col">
              <button className="btn btn-primary" onClick={handleStart}>
                Start Game
              </button>
            </div>
          </div>
        )}
        <hr />
        <EventList game={game} />
      </div>
    )
  }

  const wasLastPresident = get(game, 'lastPresident') === name
  const gameOver = isGameOver(game)

  if (viewingIdentity) {
    return <RoleReveal game={game} playerName={chosenPlayer} handleOkay={dismissReveal} />
  }

  if (game.presidentShouldInvestigate && wasLastPresident) {
    return (
      <>
        <PlayerList
          headline={'Choose a player to investigate'}
          game={game}
          playerName={name}
          onPlayerClick={handleChoosePlayer}
        />
      </>
    )
  }

  return (
    <div className="container">
      <h2>Secret {capitalize(redTeamLeader)}</h2>
      <RoleModal game={game} playerName={name} />
      <SpecialRulesModal game={game} />
      <GameStatus game={game} />

      <div className="row mt-3">
        <div className="col">
          <p>
            Your name:
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </p>
        </div>
      </div>
      <ChoosePolicies game={game} playerName={name} gameRef={gameRef} />

      <PlayerList
        game={game}
        playerName={name}
        onPlayerClick={handlePlayerClick}
        showRoles={gameOver}
      />
      <Government
        game={game}
        president={president}
        chancellor={chancellor}
        showPotentialGovernment={hosting}
      />
      <div className="row mt-3">
        {!game.governmentApproved && hosting && (
          <>
            <div className="col-4 col-md-3">
              <button className="btn btn-secondary" onClick={setGovernment}>
                Approve Government
              </button>
            </div>
            <div className="col-4 col-md-3">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setGovernment(false)
                }}
              >
                Reject Government
              </button>
            </div>
          </>
        )}
      </div>
      {hosting && <ActionBar game={game} gameRef={gameRef} />}
      <hr />
      <EventList game={game} />
    </div>
  )
}

export default withRouter(App)
