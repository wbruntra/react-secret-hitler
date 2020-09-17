let testPlayers
if (process.env.NODE_ENV === 'production') {
  testPlayers = []
} else {
  testPlayers = [
    'adam',
    'cindy',
    'david',
    'edgar',
    'fred',
    // 'gary', 'helen', 'igor'
  ]
}

const defaultGame = {
  players: testPlayers,
  roles: {},
  started: false,
  host: null,
  policies: [],
  discards: [],
  government: {
    president: null,
    chancellor: null,
  },
  governmentApproved: false,
  events: [],
  presidentHasChosen: false,
  policyChoices: [],
  enactedPolicies: [],
  gameOver: false,
  presidentShouldInvestigate: false,
  presidentShouldKill: false,
  presidentShouldViewPolicies: false,
  vetoAvailable: false,
  chancellorHasVetoed: false,
  presidentRejectedVeto: false,
  lastPresident: null,
  lastChancellor: null,
}

export default defaultGame
