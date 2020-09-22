import React, { useState } from 'react'
import produce from 'immer'
import words from './data/short-got.json'
import { random, capitalize } from 'lodash'
import { useHistory } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import firestore from './firestore'
import { updateGame } from './utils'
import theme from './theme'
import App from './App'
import defaultGame from './defaultGame'

const { redTeamLeader } = theme

const randomChoice = (arr) => {
  return arr[random(0, arr.length - 1)]
}

function Main(props) {
  const prod = process.env.NODE_ENV === 'production'
  const savedName = prod ? localStorage.getItem('playerName') || '' : 'testhost'

  const [game, setGame] = useState(props.game || defaultGame)
  const [nameConfirmed, setNameConfirmed] = useState(false)
  const [gameCode, setGameCode] = useState(localStorage.getItem('gameCode') || '')
  const [gameRef, setGameRef] = useState(props.gameRef || null)
  const [name, setName] = useState(savedName)
  const [hosting, setHosting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showLastPolicy, setShowLastPolicy] = useState(false)

  const history = useHistory()

  const handleNameConfirm = () => {
    setNameConfirmed(true)
  }

  const handleHosting = async (e) => {
    e.preventDefault()
    localStorage.setItem('gameCode', gameCode)
    console.log('hosting!', gameCode)
    setHosting(true)
    let gRef = await firestore.collection('hgames').doc(gameCode.toLowerCase())
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
    const wordCode = randomChoice(words)
    setGameCode(wordCode)
    const event = `Game created. Code: ${wordCode}`
    localStorage.setItem('gameCode', wordCode)
    const newGame = produce(game, (draft) => {
      draft.players.push(name)
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
    history.push(`/g/${gameCode}`)
  }

  if (!nameConfirmed) {
    return (
      <div className="container">
        <h2 className="headline text-center">Secret {capitalize(redTeamLeader)}</h2>
        <div className="row mt-3">
          <div className="col-12 col-md-3">Enter your name:</div>
          <div className="col">
            <form onSubmit={handleNameConfirm}>
              <input
                autoFocus
                value={name}
                onChange={(e) => {
                  localStorage.setItem('playerName', e.target.value)
                  setName(e.target.value)
                }}
              />
              <input className="btn btn-primary ml-3" type="submit" value="Next" />
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (!game.started && !game.code) {
    return (
      <div className="container">
        <h2 className="headline text-center">Secret {capitalize(redTeamLeader)}</h2>
        <div className="row mt-3">
          <>
            <p>Your name: {name}</p>
          </>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-md-6 pb-3 pb-md-1">
            <label className="pr-3">Game Code:</label>
            <input autoFocus value={gameCode} onChange={(e) => setGameCode(e.target.value)} />
          </div>
          <div className="col">
            <button className="btn btn-primary ml-3" onClick={handleHosting}>
              Host Game
            </button>
          </div>
          <div className="col">
            <button className="btn btn-primary ml-3" onClick={handleJoin}>
              Join Game
            </button>
          </div>
        </div>
        <hr />
        <div className="row mt-3">
          <div className="col">
            <button className="btn btn-primary ml-3" onClick={handleCreateGame}>
              Create New Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <App game={game} gameRef={gameRef} name={name} hosting={hosting} />
}

export default Main
