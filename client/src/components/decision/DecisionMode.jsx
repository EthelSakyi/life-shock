import React from 'react'
import CanIAffordThis from './CanIAffordThis'

export default function DecisionMode({ profile }) {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <CanIAffordThis profile={profile} />
    </div>
  )
}
