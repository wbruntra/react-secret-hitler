import React from 'react'
import theme from './theme'

function Government({ game, showPotentialGovernment = false, president = '', chancellor = '' }) {
  if (!showPotentialGovernment) {
    return null
  }
  return (
    <div className="row mt-3">
      <div className="col-8">
        <div className="row">
          <div className="col-4">Proposed {theme.presidentTitle}:</div>
          <div className="col-6">{president}</div>
        </div>
        <div className="row">
          <div className="col-4">Proposed {theme.chancellorTitle}:</div>
          <div className="col-6">{chancellor}</div>
        </div>
      </div>
    </div>
  )
}

export default Government
