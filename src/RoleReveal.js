import React from 'react'
import { filter, map } from 'lodash'

const getFascists = (roles) => {
  console.log(roles)
  const fascists = filter(
    map(roles, (r, name) => {
      // console.log(r, name)
      const result = r !== 'liberal' ? name : null
      return result
    }),
  )
  return fascists
}

function RoleReveal({ game, playerName }) {
  const { roles } = game
  // console.log(roles)
  const role = roles[playerName]
  // console.log(role)
  // if (role === 'fascist' || role === 'hitler') {
  // }

  return (
    <div className="App">
      <p>Your role: {role}</p>
      {role !== 'liberal' && <p>Other fascists: {getFascists(roles).join(', ')}</p>}
    </div>
  )
}

export default RoleReveal
