import React from 'react'
import LiberalCardImg from './assets/Liberal.JPG'
import FascistCardImg from './assets/Fascist.JPG'

function DisplayPolicies({ policies, onPolicyClick = () => {}, chosen }) {
  return (
    <div className="row">
      {policies.map((p, i) => {
        const cardImg = p === 'LIBERAL' ? LiberalCardImg : FascistCardImg

        return (
          <div key={`policy-${i}`} className="col-2 text-center">
            <div
              className="card py-4 policy-space"
              onClick={() => {
                onPolicyClick(i)
              }}
            >
              <img className="card-img-top" src={cardImg} alt="policy choice" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DisplayPolicies
