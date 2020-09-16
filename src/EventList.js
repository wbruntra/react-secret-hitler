import React from 'react'

function EventList({ game }) {
  const { events } = game
  if (events.length === 0) {
    return null
  }

  return (
    <>
      <h3>Events</h3>
      <ul className="list-group event-list">
        {events.map((e, i) => {
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
