import React from 'react'
import theme from './theme'
import { getRoleName } from './utils'

function PlayerList({
  game,
  playerName,
  headline = 'Players',
  onPlayerClick = () => {},
  showRoles = false,
}) {
  if (!game) {
    return null
  }
  let { president, chancellor } = game.government

  return (
    <div className="section mt-3">
      <h2 className="text-center">{headline}</h2>
      <div className="row">
        {game.players.map((name, i) => {
          const role = getRoleName(game.roles[name])

          return (
            <div className="col-4 col-md-3 my-3 player-card" key={`player-${i}`}>
              <div className="card h-100">
                <div
                  className={`py-3 text-center ${name === president ? 'president' : ''} ${
                    name === chancellor ? 'chancellor' : ''
                  } `}
                  onClick={() => {
                    onPlayerClick(name)
                  }}
                >
                  <div>
                    <i className="fas fa-user"></i>
                  </div>
                  <p>
                    {name} {name === playerName ? '(you)' : ''}
                  </p>
                  {name === president && <p>{theme.presidentTitle}</p>}
                  {name === chancellor && <p>{theme.chancellorTitle}</p>}
                  {showRoles && (
                    <p className={`${game.roles[name] === 'blue' ? 'blue' : 'red'}`}>{role}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlayerList
