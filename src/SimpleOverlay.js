import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'

function SimpleOverlay({
  children,
  title = 'Info',
  forceShow = false,
  autoReveal = true,
  onHide = () => {},
}) {
  const [show, setShow] = useState(autoReveal === true)

  const handleClose = () => {
    onHide()
    if (process.env.NODE_ENV !== 'production') {
      setShow(false)
    }
  }

  return (
    <>
      <Modal show={forceShow || show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </>
  )
}

export default SimpleOverlay
