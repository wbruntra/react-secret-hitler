import React from 'react'
import theme from './theme'

function Government({ game, showPotentialGovernment = false, president = '', chancellor = '' }) {
  if (!showPotentialGovernment) {
    return null
  }
  return (
    <div className="row mt-3">
      <div className="col-12">
        <div className="row">
          <div className="col-auto">Proposed {theme.presidentTitle}:</div>
          <div className="col">{president}</div>
        </div>
        <div className="row">
          <div className="col-auto">Proposed {theme.chancellorTitle}:</div>
          <div className="col">{chancellor}</div>
        </div>
      </div>
    </div>
  )
}

export default Government
