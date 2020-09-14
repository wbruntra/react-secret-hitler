import React from 'react'

function Government({ game }) {
  if (!game.governmentApproved) {
    return null
  }
  return (
    <div className="row mt-3">
        <ul>
          <li>President: { game.government.president } </li>
          <li>Chancellor: { game.government.chancellor } </li>
        </ul>
    </div>
  )
}

export default Government
