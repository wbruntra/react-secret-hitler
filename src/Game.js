import React, { useEffect, useState } from 'react'
import './App.css'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import produce from 'immer'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import firestore from './firestore'

import PlayerList from './PlayerList'
import EventList from './EventList'
import RoleReveal from './RoleReveal'
import Government from './Government'
import ChoosePolicies from './ChoosePolicies'
import GameStatus from './GameStatus'
import { updateGame } from './utils'

function Game(props) {
  const [gameRef, setGameRef] = useState(null)
  const code = get(props, 'match.params.code', null)
  const [game, setGame] = useState(null)
  const [name, setName] = useState('aa')
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submit prevent')
    setSubmitted(true)
    const { players } = game
    if (players.includes(name)) {
      console.log('name already registered')
      return
    }
    const newGame = produce(game, (draft) => {
      draft.players.push(name)
    })
    localStorage.setItem('playerName', name)

    updateGame(gameRef, newGame)
  }

  const confirmChoice = (chosen) => {
    console.log(chosen)
  }

  useEffect(() => {
    const register = async () => {
      const gRef = await firestore.collection('hgames').doc(code)
      setGameRef(gRef)
      console.log(gRef)
      // setGame(gRef.data())
      gRef.onSnapshot((doc) => {
        setGame(doc.data())
      })
    }
    if (code !== null) {
      register()
    }
    const playerName = localStorage.getItem('playerName')
    if (playerName !== null) {
      setName(playerName)
    }
  }, [code])

  if (game === null) {
    return null
  }

  return (
    <div className="container">
      <h2>Secret Hitler</h2>
      <GameStatus game={game} />

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
        <div>
          <p>You are: {name}</p>
        </div>
      )}
      {game.started && <RoleReveal game={game} playerName={name} />}
      <PlayerList game={game} playerName={name} />
      <Government game={game} />
      <ChoosePolicies
        game={game}
        playerName={name}
        gameRef={gameRef}
        confirmChoice={confirmChoice}
      />
    </div>
  )
}

export default withRouter(Game)
