import React, { useEffect, useMemo, useState } from 'react'
import IncomeModal from './components/IncomeModal.jsx'
import ExpenseModal from './components/ExpenseModal.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import SummaryCharts from './components/SummaryCharts.jsx'

const CATEGORIES = ['Food', 'Entertainment', 'Travel']

export default function App() {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('balance')
    return saved !== null ? Number(saved) : 5000
  })

  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('expenses')) || []
    } catch {
      return []
    }
  })

  const [isIncomeOpen, setIncomeOpen] = useState(false)
  const [isExpenseOpen, setExpenseOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    localStorage.setItem('balance', String(balance))
  }, [balance])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + Number(e.amount || 0), 0), [expenses])
  const available = balance - totalSpent

  const handleAddIncome = (amount) => {
    const val = Number(amount)
    if (!Number.isFinite(val) || val <= 0) {
      alert('Please enter a valid positive amount.')
      return false
    }
    setBalance(prev => prev + val)
    return true
  }

  const handleSaveExpense = (data) => {
    const amount = Number(data.amount)
    if (!data.title || !data.category || !data.date || !Number.isFinite(amount) || amount <= 0) {
      alert('Please fill all fields with valid values.')
      return false
    }

    if (editing) {
      const allowed = available + Number(editing.amount)
      if (amount > allowed) {
        alert('Not enough balance.')
        return false
      }
      setExpenses(prev => prev.map(e => e.id === editing.id ? { ...e, ...data, amount } : e))
    } else {
      if (amount > available) {
        alert('Not enough balance.')
        return false
      }
      const newExpense = { id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), ...data, amount }
      setExpenses(prev => [newExpense, ...prev])
    }
    return true
  }

  const startEdit = (expense) => {
    setEditing(expense)
    setExpenseOpen(true)
  }

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <div className="cards">
        <div className="card">
          <div className="card-title">Wallet Balance</div>
          <div className="amount">₹{String(available)}</div>
          <button className="btn btn-income" onClick={() => setIncomeOpen(true)}>+ Add Income</button>
        </div>

        <div className="card">
          <div className="card-title">Expenses</div>
          <div className="amount">₹{String(totalSpent)}</div>
          <button className="btn btn-expense" onClick={() => { setEditing(null); setExpenseOpen(true); }}>+ Add Expense</button>
        </div>
      </div>

      <div className="content">
        <section className="transactions">
          <h2>Transactions</h2>
          <ExpenseList expenses={expenses} onEdit={startEdit} onDelete={deleteExpense} />
        </section>

        <section className="charts">
          <h2>Top Expenses</h2>
          <SummaryCharts expenses={expenses} categories={CATEGORIES} />
        </section>
      </div>

      <IncomeModal
        isOpen={isIncomeOpen}
        onRequestClose={() => setIncomeOpen(false)}
        onSubmit={(amount) => {
          const ok = handleAddIncome(amount)
          if (ok) setIncomeOpen(false)
        }}
      />

      <ExpenseModal
        isOpen={isExpenseOpen}
        onRequestClose={() => { setExpenseOpen(false); setEditing(null); }}
        categories={CATEGORIES}
        initialData={editing || null}
        onSubmit={(form) => {
          const ok = handleSaveExpense(form)
          if (ok) { setExpenseOpen(false); setEditing(null) }
        }}
        available={editing ? available + Number(editing.amount) : available}
      />
    </div>
  )
}
