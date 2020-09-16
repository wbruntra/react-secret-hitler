import React, { useState, useEffect } from 'react'
import produce from 'immer'
import { random } from 'lodash'
import randomString from 'randomstring'

function NameForm({ handleSubmit }) {
  const [name, setName] = useState('bb')
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submit prevent')
    setSubmitted(true)
    const newGame = produce(game, (draft) => {
      draft.players.push(name)
    })
    setGame(newGame)
  }

  return (
    <div className="App">
      Secret Hitler
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
          <p>{name}</p>
        </div>
      )}
    </div>
  )
}

export default NameForm
