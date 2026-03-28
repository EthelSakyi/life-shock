import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function SavingsChart({ data }) {
  return (
    <div style={container}>
      <div style={title}>SAVINGS OVER TIME</div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const container = {
  background: '#0f172a',
  padding: 20,
  borderRadius: 20,
  color: '#fff',
}

const title = {
  fontSize: 12,
  opacity: 0.6,
  marginBottom: 10,
}