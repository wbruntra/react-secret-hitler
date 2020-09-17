import React, { useEffect, useState } from 'react'
import { get } from 'lodash'
import produce from 'immer'
import firestore from './firestore'
import { updateGame } from './utils'
import App from './App'

function Game(props) {
  const prod = process.env.NODE_ENV === 'production'

  const [loaded, setLoaded] = useState(false)
  const [name, setName] = useState(localStorage.getItem('playerName') || '')
  const [game, setGame] = useState(null)
  const [gameRef, setGameRef] = useState(null)
  const code = get(props, 'match.params.code', null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    localStorage.setItem('playerName', name)

    const { players } = game
    if (players.includes(name)) {
      console.log('Name already registered')
      return
    }
    if (game.started) {
      console.log('Game already started!')
      return
    }
    const newGame = produce(game, (draft) => {
      draft.players.push(name)
    })

    updateGame(gameRef, newGame)
  }

  useEffect(() => {
    const register = async () => {
      const gRef = await firestore.collection('hgames').doc(code)
      setGameRef(gRef)
      setLoaded(true)
      gRef.onSnapshot((doc) => {
        const gameData = doc.data()
        setGame(gameData)
      })
    }
    if (code !== null) {
      register()
    }
  }, [code])

  if (game === null) {
    return null
  }

  if ((prod && !submitted) || !game.players.includes(name)) {
    return (
      <div className="container">
        <h2>Confirm your name</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <input
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
            <input type="submit" className="btn btn-primary ml-3" value="Next" />
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

export default Game
