import React from 'react'

function Government({ game, showPotentialGovernment = false, president = '', chancellor = '' }) {
  if (!showPotentialGovernment) {
    return null
  }
  return (
    <div className="row mt-3">
      <div className="col-8">
        <div className="row">
          <div className="col-3">President:</div>
          <div className="col-3">{president}</div>
        </div>
        <div className="row">
          <div className="col-3">Chancellor:</div>
          <div className="col-3">{chancellor}</div>
        </div>
      </div>
    </div>
  )
}

export default Government
