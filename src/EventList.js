import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
function EventList({ game, show = 0 }) {
  const location = useLocation()
  const { events } = game
  const [linkCopied, setLinkCopied] = useState(false)
  if (events.length === 0) {
    return null
  }

  const copyToClipboard = (str) => {
    const el = document.createElement('textarea')
    el.value = str
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    setLinkCopied(true)
    window.setTimeout(() => {
      setLinkCopied(false)
    }, 3500)
  }

  const displayEvent = (e) => {
    if (e.startsWith('Game created')) {
      const linkURL = `${window.location.href}g/${game.code}`
      return (
        <>
          {e}
          <span className="ml-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                copyToClipboard(linkURL)
              }}
            >
              {linkCopied ? 'COPIED!' : 'Copy Link to Clipboard'}
            </button>
          </span>
        </>
      )
    }
    return e
  }

  const shownEvents = show > 0 ? events.slice(-1 * show) : [...events]

  return (
    <>
      <h3 className="headline text-center">Events</h3>
      <ul className="list-group event-list">
        {shownEvents.map((e, i) => {
          return (
            <li className="list-group-item" key={`event-${i}`}>
              {displayEvent(e)}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default EventList
