import React from 'react'

function PlayerList({ game, playerName, onPlayerClick = () => {} }) {
  if (!game) {
    return null
  }
  return (
    <div className="row mt-3">
      {game.players.map((p, i) => {
        return (
          <div className="col-3" key={`player-${i}`}>
            <div className="card h-100">
              <div
                className="card-body"
                onClick={() => {
                  onPlayerClick(p)
                }}
              >
                {p} {p === playerName ? '(you)' : ''}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PlayerList
