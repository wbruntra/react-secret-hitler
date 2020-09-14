import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { get } from 'lodash'

export const updateGame = (gameRef, newGame) => {
  gameRef.set({
    ...newGame,
    lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
  })
}

export const countPolicies = (game) => {
  const liberalPolicies = game.enactedPolicies.filter((p) => p === 'liberal')
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
    if (role === 'hitler') {
      return players[i]
    }
  }
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
