import React, { useState } from 'react'
import { capitalize } from 'lodash'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import theme from './theme'

function SpecialRulesModal({ game }) {
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }
  const handleShow = () => setShow(true)

  const numPlayers = game.players.length

  const { blueTeam, redTeam, redTeamLeader } = theme

  return (
    <>
      <button className="btn btn-primary ml-3" onClick={handleShow}>
        Show Rules
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rules for {numPlayers} players </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {numPlayers <= 6 && (
              <>
                <li>Two players are {redTeam}s</li>
                <li>
                  {capitalize(redTeamLeader)} knows who the {redTeam} is
                </li>
                <li>
                  After the 3rd {redTeam} policy is enacted, the {theme.presidentTitle} will view
                  the top three policy cards, then put them back without changing the order
                </li>
              </>
            )}
            {numPlayers >= 7 && (
              <>
                {numPlayers < 9 ? (
                  <li>Three players are {redTeam}s</li>
                ) : (
                  <li>Four players are {redTeam}s</li>
                )}
                <li>
                  {capitalize(redTeamLeader)} doesn't know who the {redTeam}s are
                </li>
                {numPlayers >= 9 && (
                  <li>
                    After the 1st {redTeam} policy is enacted, the {theme.presidentTitle}{' '}
                    investigates a player's team membership
                  </li>
                )}
                <li>
                  After the 2nd {redTeam} policy is enacted, the {theme.presidentTitle}{' '}
                  investigates a player's team membership
                </li>
                <li>
                  After the 3nd {redTeam} policy is enacted, the {theme.presidentTitle} chooses the
                  next {theme.presidentTitle} (this is a special session, the order of succession
                  reverts back to normal afterwards)
                </li>
              </>
            )}
            <li>
              After the 4th {redTeam} policy is enacted, the {theme.presidentTitle} must eliminate
              a player
            </li>
            <li>
              After the 5th {redTeam} policy is enacted, the {theme.presidentTitle} must eliminate
              a player, and the veto power is unlocked
            </li>
            <li>
              The policy deck contains 11 {redTeam} and 6 {blueTeam} policies
            </li>
            <li>
              After three failed attempts to form a government, the top policy card from the deck
              is automatically enacted. No special events are triggered by this policy.
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SpecialRulesModal
