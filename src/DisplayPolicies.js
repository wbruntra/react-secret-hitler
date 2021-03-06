import React from 'react'
import LiberalCardImg from './assets/Liberal.JPG'
import FascistCardImg from './assets/Fascist.JPG'

function DisplayPolicies({ policies, onPolicyClick = () => {}, chosen = [], withChecks = true }) {
  return (
    <div className="row justify-content-center">
      {policies.map((policy, i) => {
        const cardImg = policy === 'BLUE' ? LiberalCardImg : FascistCardImg

        return (
          <div key={`policy-${i}`} className="col-2 text-center">
            <div className="card py-3 policy-space" onClick={() => onPolicyClick(i)}>
              <img className="card-img-top" src={cardImg} alt="policy choice" />
              {withChecks && (
                <div className="mt-2">
                  {chosen[i] ? (
                    <i className="fas fa-check green"></i>
                  ) : (
                    <i className="fas fa-times red"></i>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DisplayPolicies
