import React, { useState, useEffect } from 'react'
import './App.css'
import produce from 'immer'
import words from './data/short-got.json'
import { random, shuffle } from 'lodash'
import randomString from 'randomstring'
import { withRouter } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import firestore from './firestore'
import PlayerList from './PlayerList'
import Government from './Government'
import EventList from './EventList'
import RoleReveal from './RoleReveal'
import ChoosePolicies from './ChoosePolicies'
import GameStatus from './GameStatus'
import { updateGame, countPolicies, identifyHitler, hitlerAsChancellorWin } from './utils'

const createPolicies = () => {
  const L = Array(5).fill('L')
  const F = Array(9).fill('F')
  const policies = L.concat(F)
  return shuffle(policies)
}

const assignRoles = (game) => {
  const { players } = game
  const numLiberals = Math.ceil(players.length / 2)
  let roles = Array(numLiberals).fill('liberal')
  roles.push('hitler')
  while (roles.length < players.length) {
    roles.push('fascist')
  }
  const randomRoles = shuffle(roles)
  const result = {}
  players.forEach((p, i) => {
    result[p] = randomRoles[i]
  })
  return result
}

const testPlayers = ['a', 'c', 'd', 'e', 'f', 'g']

const defaultGame = {
  players: testPlayers,
  roles: {},
  started: false,
  host: null,
  policies: [],
  discards: [],
  government: {
    president: null,
    chancellor: null,
  },
  governmentApproved: false,
  events: [],
  presidentHasChosen: false,
  policyChoices: [],
  enactedPolicies: [],
  gameOver: false,
}

const randomChoice = (arr) => {
  return arr[random(0, arr.length - 1)]
}

function App() {
  const [game, setGame] = useState(defaultGame)
  const [gameCode, setGameCode] = useState(localStorage.getItem('gameCode') || '')
  const [hosting, setHosting] = useState(false)
  const [name, setName] = useState('bb')
  const [submitted, setSubmitted] = useState(false)
  const [link, setLink] = useState('')
  const [gameRef, setGameRef] = useState(null)
  const [president, setPresident] = useState(null)
  const [chancellor, setChancellor] = useState(null)

  const setGovernment = () => {
    if (!president || !chancellor) {
      console.log('set pres & chan')
      return
    }
    const event = `New government approved. President: ${president}, Chancellor: ${chancellor}`
    const newGame = produce(game, (draft) => {
      draft.government = {
        president: president,
        chancellor: chancellor,
      }
      draft.policyChoices = game.policies.slice(0, 3)
      draft.policies = game.policies.slice(3)
      draft.events.push(event)
      draft.presidentHasChosen = false
      draft.governmentApproved = true
    })
    console.log(newGame)
    updateGame(gameRef, newGame)
  }

  const rejectGovernment = () => {
    const event = `Government rejected. President: ${president}, Chancellor: ${chancellor}`
    console.log(event)
    return
    const newGame = produce(game, (draft) => {
      draft.government = {
        president: president,
        chancellor: chancellor,
      }
      draft.events.push(event)
    })
    console.log(newGame)
    updateGame(gameRef, newGame)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submit prevent')
    setSubmitted(true)
    const newGame = produce(game, (draft) => {
      draft.players.push(name)
    })
    setGame(newGame)
  }

  const handleHosting = async (e) => {
    e.preventDefault()
    localStorage.setItem('gameCode', gameCode)
    console.log('hosting!', gameCode)
    setHosting(true)
    let gRef = await firestore.collection('hgames').doc(gameCode)
    setGameRef(gRef)
    gRef.onSnapshot((doc) => {
      setGame(doc.data())
    })
    gRef.update({
      host: name,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
    })
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
    console.log(newGame)
    updateGame(gameRef, newGame)
  }

  const handleCreateGame = async () => {
    console.log('create game!')
    const wordCode = randomChoice(words)
    setGameCode(wordCode)
    localStorage.setItem('gameCode', wordCode)
    const newGame = produce(game, (draft) => {
      draft.code = wordCode
      draft.host = name
    })
    setGame(newGame)
    let gRef = await firestore.collection('hgames').doc(wordCode)

    setGameRef(gRef)
    gRef.onSnapshot((doc) => {
      setGame(doc.data())
    })
    updateGame(gRef, newGame)

    console.log(game)
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

  const hitlerName = identifyHitler(game)
  console.log(hitlerName)

  return (
    <div className="container">
      <h2>Secret Hitler</h2>
      {hitlerAsChancellorWin(game) && <h2>HITLER IS CHANCELLOR</h2>}
      <GameStatus game={game} />

      <div className="row">
        <div className="col">
          {!hosting ? (
            <form onSubmit={handleHosting}>
              <input
                value={gameCode}
                onChange={(e) => {
                  setGameCode(e.target.value)
                }}
              />
              <input type="submit" />
            </form>
          ) : (
            <p>Hosting: {gameCode} </p>
          )}
        </div>
      </div>
      <div className="row my-3">
        <div className="col">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
              <input type="submit" />
            </form>
          ) : (
            <>
              <p>{name}</p>
              <button onClick={handleCreateGame}>Create Game</button>
            </>
          )}
        </div>
      </div>

      <PlayerList game={game} playerName={name} onPlayerClick={handlePlayerClick} />
      <Government game={game} />
      <div className="row mt-3">
        {!game.started && (
          <div className="col">
            <button onClick={handleStart}>Start Game</button>
          </div>
        )}
        {!game.governmentApproved && (
          <>
            <div className="col">
              <button onClick={setGovernment}>Approve Government</button>
            </div>
            <div className="col">
              <button onClick={rejectGovernment}>Reject Government</button>
            </div>
          </>
        )}
      </div>
      <ChoosePolicies game={game} playerName={name} gameRef={gameRef} />
      <hr />
      <EventList game={game} />
    </div>
  )
}

export default withRouter(App)
