import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

export default function ExpenseModal({ isOpen, onRequestClose, onSubmit, categories, initialData, available }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        amount: String(initialData.amount),
        category: initialData.category,
        date: initialData.date
      })
    } else {
      setForm({ title: '', amount: '', category: '', date: '' })
    }
  }, [initialData, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date
    }
    const ok = onSubmit(data)
    if (ok) {
      setForm({ title: '', amount: '', category: '', date: '' })
    }
  }

  const mode = initialData ? 'Edit' : 'Add'

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="modal-overlay"
      className="modal-content"
      contentLabel={`${mode} Expense`}
    >
      <h3>{mode} Expenses</h3>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.amount}
          onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <div className="modal-actions">
          <button type="submit" className="btn btn-primary">{mode === 'Add' ? 'Add Expense' : 'Save Changes'}</button>
          <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Cancel</button>
        </div>
        <div className="available-hint">Available: ₹{Math.max(available, 0).toLocaleString()}</div>
      </form>
    </Modal>
  )
}
