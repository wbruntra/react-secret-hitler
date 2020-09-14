import React from 'react'

function EventList({ game }) {
  const { started, events } = game
  if (!started) {
    return null
  }
  return (
    <>
      <h3>Events</h3>
      <ul>
        {events.map((e, i) => {
          return <li key={`event-${i}`}>{e}</li>
        })}
      </ul>
    </>
  )
}

export default EventList
