import React, { useState, useEffect } from 'react'
import produce from 'immer'
import { random } from 'lodash'
import randomString from 'randomstring'

function NameForm({ handleSubmit }) {
  const [name, setName] = useState('bb')

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
      />
      <input type="submit" />
    </form>
  )
}

export default NameForm
