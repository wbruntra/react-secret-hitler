import React, { useState } from 'react'
import { capitalize } from 'lodash'
import { identifyHitler, getFascists, getRoleName } from './utils'
import LiberalCardImg from './assets/Liberal.JPG'
import FascistCardImg from './assets/Fascist.JPG'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import theme from './theme'

function RoleModal({ game, playerName, autoReveal = false, onHide = () => {} }) {
  const [show, setShow] = useState(autoReveal === true)

  const handleClose = () => {
    onHide()
    setShow(false)
  }
  const handleShow = () => setShow(true)
  const { roles } = game
  const hitlerPlayer = identifyHitler(game)
  const role = roles[playerName]
  const { redTeam, redTeamLeader } = theme
  const roleName = getRoleName(role, theme)

  return (
    <>
      <button className="btn btn-primary ml-3" onClick={handleShow}>
        Reveal Secret Role
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your Secret Role: {roleName} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center role-reveal">
            <div className="col-3">
              {role === 'blue' ? (
                <img alt="blue card" src={LiberalCardImg} />
              ) : (
                <img alt="red card" src={FascistCardImg} />
              )}
            </div>
          </div>
          {(role === 'red' || (role === redTeamLeader && game.players.length < 7)) && (
            <>
              <div className="row">
                <div className="col">
                  <p>
                    {capitalize(redTeamLeader)} is: {hitlerPlayer}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p>
                    All {redTeam}s: {getFascists(game).join(', ')}
                  </p>
                </div>
              </div>
            </>
          )}
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

export default RoleModal
