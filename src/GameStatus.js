import React from 'react'
import { countPolicies, hitlerIsChancellor, isGameOver } from './utils'
import LiberalSpaceImage from './assets/liberal-card-space.JPG'
import LiberalEnactedImage from './assets/liberal-card-enact.JPG'
import LiberalCardWin from './assets/liberal-card-win.JPG'
import FascistSpaceImage from './assets/fascist-card-space.JPG'
import FascistEnactedImage from './assets/fascist-card-enact.JPG'
import FascistCardWin from './assets/fascist-card-win.JPG'
import { capitalize } from 'lodash'
import theme from './theme'

function PolicySpace({ img }) {
  return (
    <div className="col-2 col-md-1">
      <div className="card py-2 policy-space">
        <img alt="policy card" src={img} />
      </div>
    </div>
  )
}

function GameStatus({ game }) {
  const counts = countPolicies(game)
  const { blueTeam, redTeam, redTeamLeader } = theme
  const gameOver = isGameOver(game)

  let endDeclaration
  if (counts.fascist === 6) {
    endDeclaration = <h1>{capitalize(redTeam)}s Win with 6 Policies!</h1>
  }

  if (counts.liberal === 5) {
    endDeclaration = <h1>{capitalize(blueTeam)}s Win with 5 Policies!</h1>
  }

  if (counts.fascist >= 3 && game.governmentApproved && hitlerIsChancellor(game)) {
    endDeclaration = (
      <h1>
        {capitalize(redTeam)}s win Because {capitalize(redTeamLeader)} is Chancellor!
      </h1>
    )
  }

  if (gameOver) {
    return <>{endDeclaration}</>
  }

  return (
    <>
      <div className="row mt-3">
        {/* <ul>
          <li>Liberal Policies: {counts.liberal} </li>
          <li>Fascist Policies: {counts.fascist} </li>
        </ul> */}
        <ul>
          <li>Policies Left in Deck: {game.policies.length}</li>
          <li>Discarded: {game.discards.length} </li>
        </ul>
      </div>
      <div className="row">
        {Array(counts.liberal)
          .fill(true)
          .map((_, i) => {
            return <PolicySpace key={`libs-en-${i}`} img={LiberalEnactedImage} />
          })}
        {Array(4 - counts.liberal)
          .fill(true)
          .map((_, i) => {
            return <PolicySpace key={`libs-en-${i}`} img={LiberalSpaceImage} />
          })}
        <PolicySpace img={LiberalCardWin} />
      </div>
      <div className="row mt-4">
        {Array(counts.fascist)
          .fill(true)
          .map((_, i) => {
            return <PolicySpace key={`fasc-en-${i}`} img={FascistEnactedImage} />
          })}
        {Array(5 - counts.fascist)
          .fill(true)
          .map((_, i) => {
            return <PolicySpace key={`fasc-${i}`} img={FascistSpaceImage} />
          })}

        <PolicySpace img={FascistCardWin} />
      </div>
    </>
  )
}

export default GameStatus
