import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import produce from 'immer'
import firestore from './firestore'
import { updateGame } from './utils'
import App from './App'

function Game(props) {
  const [name, setName] = useState(localStorage.getItem('playerName') || '')
  const [game, setGame] = useState(null)
  const [gameRef, setGameRef] = useState(null)
  const code = get(props, 'match.params.code', null)
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
    if (game.started) {
      console.log('Game already started!')
      return
    }
    const newGame = produce(game, (draft) => {
      draft.players.push(name)
    })
    localStorage.setItem('playerName', name)

    updateGame(gameRef, newGame)
  }

  useEffect(() => {
    const register = async () => {
      const gRef = await firestore.collection('hgames').doc(code)
      setGameRef(gRef)
      gRef.onSnapshot((doc) => {
        const gameData = doc.data()
        setGame(gameData)
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

  if (!game.players.includes(name)) {
    return (
      <div className="container">
        <h2>Name not found!</h2>
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
          <div className="row mt-3">
            <p>You are: {name}</p>
          </div>
        )}
      </div>
    )
  }

  return <App game={game} gameRef={gameRef} name={name} />
}

export default withRouter(Game)
