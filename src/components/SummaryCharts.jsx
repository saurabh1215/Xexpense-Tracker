import React, { useMemo } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function SummaryCharts({ expenses, categories }) {
  const dataByCat = useMemo(() => {
    const map = new Map()
    categories.forEach(c => map.set(c, 0))
    expenses.forEach(e => {
      if (map.has(e.category)) map.set(e.category, map.get(e.category) + Number(e.amount))
    })
    const labels = categories
    const values = labels.map(l => map.get(l) || 0)
    return { labels, values }
  }, [expenses, categories])

  const pieData = {
    labels: dataByCat.labels,
    datasets: [
      {
        data: dataByCat.values,
        backgroundColor: ['#7d4bf5', '#ff9800', '#f4d03f'],
        borderWidth: 0
      }
    ]
  }

  const barData = {
    labels: dataByCat.labels,
    datasets: [
      {
        label: 'Spent',
        data: dataByCat.values,
        backgroundColor: '#2e86de'
      }
    ]
  }

  return (
    <div className="charts-wrap">
      <div className="chart"><Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} /></div>
      <div className="chart"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
    </div>
  )
}
