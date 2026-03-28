import React, { useState } from 'react'
import { useScenarios } from '../../hooks/useScenarios'
import CanIAffordThis from './CanIAffordThis'
import MakeMeSafer from './MakeMeSafer'

const navy = '#131936'
const C = { border: 'rgba(17,28,68,.08)' }
const TABS = { AFFORD: 'afford', SAFER: 'safer' }

export default function DecisionMode({ profile }) {
  const [tab, setTab] = useState(TABS.AFFORD)

  const { activeScenarios } = useScenarios()

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{
        background: '#fff', border: `0.5px solid ${C.border}`,
        borderRadius: 12, padding: 4,
        display: 'inline-flex', marginBottom: 20,
      }}>
        <button
          onClick={() => setTab(TABS.AFFORD)}
          style={{
            padding: '10px 28px', borderRadius: 8,
            background: tab === TABS.AFFORD ? navy : 'transparent',
            color: tab === TABS.AFFORD ? '#fff' : 'rgba(19,25,54,.4)',
            fontSize: 13, fontWeight: tab === TABS.AFFORD ? 700 : 600,
            fontFamily: 'inherit', border: 'none', cursor: 'pointer', transition: 'all .2s',
          }}
        >Can I afford this?</button>
        <button
          onClick={() => setTab(TABS.SAFER)}
          style={{
            padding: '10px 28px', borderRadius: 8,
            background: tab === TABS.SAFER ? navy : 'transparent',
            color: tab === TABS.SAFER ? '#fff' : 'rgba(19,25,54,.4)',
            fontSize: 13, fontWeight: tab === TABS.SAFER ? 700 : 600,
            fontFamily: 'inherit', border: 'none', cursor: 'pointer', transition: 'all .2s',
          }}
        >Make me safer</button>
      </div>

      {tab === TABS.AFFORD && <CanIAffordThis profile={profile} activeScenarios={activeScenarios} />}
      {tab === TABS.SAFER  && <MakeMeSafer   profile={profile} activeScenarios={activeScenarios} />}
    </div>
  )
}
