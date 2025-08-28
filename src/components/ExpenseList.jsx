import React from 'react'

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="list">
        <div className="empty">No transactions!</div>
      </div>
    )
  }

  return (
    <div className="list">
      {expenses.map(e => (
        <div key={e.id} className="list-item">
          <div className="item-main">
            <div className="title">{e.title}</div>
            <div className="meta">
              <span className="category">{e.category}</span>
              <span className="date">{e.date}</span>
            </div>
          </div>
          <div className="item-right">
            <div className="price">₹{String(Number(e.amount))}</div>
            <div className="actions">
              <button className="btn btn-small" onClick={() => onEdit(e)}>Edit</button>
              <button className="btn btn-small btn-danger" onClick={() => onDelete(e.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
