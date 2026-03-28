import React from 'react'

export default function SurvivalCard({ months = 0 }) {
  return (
    <div style={card}>
      <div style={label}>YOU CAN LAST</div>
      <div style={value}>{months}</div>
      <div style={sub}>months before critical</div>
    </div>
  )
}

const card = {
  padding: 20,
  borderRadius: 20,
  background: '#0f172a',
  color: '#fff',
}

const label = {
  fontSize: 12,
  opacity: 0.6,
}

const value = {
  fontSize: 36,
  fontWeight: 'bold',
}

const sub = {
  fontSize: 12,
  opacity: 0.6,
}