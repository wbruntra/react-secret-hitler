import React from 'react'

function EventList({ game, show = 0 }) {
  const { events } = game
  if (events.length === 0) {
    return null
  }

  const shownEvents = show > 0 ? events.slice(-1 * show) : [...events]

  return (
    <>
      <h3>Events</h3>
      <ul className="list-group event-list">
        {shownEvents.map((e, i) => {
          return (
            <li className="list-group-item" key={`event-${i}`}>
              {e}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default EventList
