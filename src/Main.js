import React, { useState } from 'react'
import produce from 'immer'
import words from './data/short-got.json'
import { random, capitalize } from 'lodash'
import { useLocation } from 'wouter'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import firestore from './firestore'
import { updateGame } from './utils'
import theme from './theme'
import App from './App'

const { redTeamLeader } = theme

let testPlayers
if (process.env.NODE_ENV === 'production') {
  testPlayers = []
} else {
  testPlayers = [
    'adam',
    'cindy',
    'david',
    'edgar',
    'fred',
    // 'gary', 'helen', 'igor'
  ]
}

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
  presidentShouldInvestigate: false,
  presidentShouldKill: false,
  vetoAvailable: false,
  chancellorHasVetoed: false,
  presidentRejectedVeto: false,
  lastPresident: null,
  lastChancellor: null,
}

const randomChoice = (arr) => {
  return arr[random(0, arr.length - 1)]
}

function Main(props) {
  const savedName =
    process.env.NODE_ENV === 'production' ? localStorage.getItem('playerName') || '' : 'testhost'

  const [game, setGame] = useState(props.game || defaultGame)
  const [gameCode, setGameCode] = useState(localStorage.getItem('gameCode') || '')
  const [gameRef, setGameRef] = useState(props.gameRef || null)
  const [name, setName] = useState(savedName)
  const [hosting, setHosting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [location, setLocation] = useLocation()

  const handleSubmit = (e) => {
    e.preventDefault()
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
      const gameData = doc.data()
      setGame(gameData)
    })
    gRef.update({
      host: name,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
    })
  }

  const handleCreateGame = async () => {
    console.log('create game!')
    const wordCode = randomChoice(words)
    setGameCode(wordCode)
    const event = `Game created. Code: ${wordCode}`
    localStorage.setItem('gameCode', wordCode)
    const newGame = produce(game, (draft) => {
      draft.code = wordCode
      draft.host = name
      draft.events.push(event)
    })
    let gRef = await firestore.collection('hgames').doc(wordCode)

    setGameRef(gRef)
    gRef.onSnapshot((doc) => {
      setGame(doc.data())
    })
    updateGame(gRef, newGame)
    setHosting(true)
  }

  const handleJoin = (e) => {
    e.preventDefault()
    setLocation(`/g/${gameCode}`)
  }

  if (!game.started && !game.code) {
    return (
      <div className="container">
        <h2 className="headline text-center">Secret {capitalize(redTeamLeader)}</h2>
        <div className="row mt-3">
          <div className="col-3">Take Over: </div>
          <div className="col">
            <form onSubmit={handleHosting}>
              <input
                value={gameCode}
                onChange={(e) => {
                  setGameCode(e.target.value)
                }}
              />
              <input className="btn btn-primary ml-3" type="submit" value="GO" />
            </form>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-3">Join: </div>
          <div className="col">
            <form onSubmit={handleJoin}>
              <input
                value={gameCode}
                onChange={(e) => {
                  setGameCode(e.target.value)
                }}
              />
              <input className="btn btn-primary ml-3" type="submit" value="GO" />
            </form>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-3">Create:</div>
          <div className="col">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />
                <input className="btn btn-primary ml-3" type="submit" value="GO" />
              </form>
            ) : (
              <>
                <p>Your name: {name}</p>
                <button onClick={handleCreateGame}>Create Game</button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return <App game={game} gameRef={gameRef} name={name} hosting={hosting} />
}

export default Main
