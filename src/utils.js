import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { get, shuffle, map, filter } from 'lodash'
import defaultTheme from './theme'

export const updateGame = (gameRef, newGame) => {
  gameRef.set({
    ...newGame,
    lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
  })
}

export const countPolicies = (game) => {
  const liberalPolicies = game.enactedPolicies.filter((p) => p === 'BLUE')
  return {
    liberal: liberalPolicies.length,
    fascist: game.enactedPolicies.length - liberalPolicies.length,
  }
}

export const identifyHitler = (game) => {
  const roles = game.roles
  const players = game.players
  let role
  for (let i = 0; i < players.length; i++) {
    role = roles[players[i]]
    if (role === 'redLeader') {
      return players[i]
    }
  }
}

export const hitlerIsChancellor = (game) => {
  const hitlerPlayer = identifyHitler(game)
  const currentChancellor = get(game, 'government.chancellor')
  return currentChancellor === hitlerPlayer
}

export const hitlerAsChancellorWin = (game) => {
  const counts = countPolicies(game)
  const hitlerPlayer = identifyHitler(game)
  const currentChancellor = get(game, 'government.chancellor')
  if (counts.fascist < 3 || !game.governmentApproved || currentChancellor !== hitlerPlayer) {
    return false
  }
  return true
}

export const refreshPolicies = (game) => {
  return shuffle([...game.discards, ...game.policies])
}

export const getRoleName = (role, theme = defaultTheme) => {
  const { blueTeam, redTeam, redTeamLeader } = theme
  if (role === 'blue') {
    return blueTeam
  }
  if (role === 'red') {
    return redTeam
  }
  if (role === 'redLeader') {
    return redTeamLeader
  }
}

export const getRoleTeam = (role, theme = defaultTheme) => {
  const { blueTeam, redTeam } = theme
  if (role === 'blue') {
    return blueTeam
  }
  return redTeam
}

export const getFascists = (game) => {
  const { roles } = game
  const fascists = filter(
    map(roles, (r, name) => {
      // console.log(r, name)
      const result = r !== 'blue' ? name : null
      return result
    }),
  )
  return fascists
}

export const createPolicies = () => {
  const L = Array(6).fill('BLUE')
  const F = Array(11).fill('RED')
  const policies = [...L, ...F]
  return shuffle(policies)
}

export const assignRoles = (game) => {
  const { players } = game
  const numLiberals = Math.ceil(0.5 + players.length / 2)
  let roles = Array(numLiberals).fill('blue')
  roles.push('redLeader')
  while (roles.length < players.length) {
    roles.push('red')
  }
  const randomRoles = shuffle(roles)
  const result = {}
  players.forEach((p, i) => {
    result[p] = randomRoles[i]
  })
  return result
}

export const isGameOver = (game) => {
  if (game.gameOver) {
    return true
  }

  const counts = countPolicies(game)

  if (counts.fascist === 6) {
    return true
  }

  if (counts.liberal === 5) {
    return true
  }

  if (counts.fascist >= 3 && game.governmentApproved && hitlerIsChancellor(game)) {
    return true
  }
  return false
}

export const getThemedPolicyName = (policy, theme = defaultTheme) => {
  return theme[policy]
}
