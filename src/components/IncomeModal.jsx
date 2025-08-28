import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

export default function IncomeModal({ isOpen, onRequestClose, onSubmit }) {
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (!isOpen) setAmount('')
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = onSubmit(amount)
    if (ok) setAmount('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Balance"
      overlayClassName="modal-overlay"
      className="modal-content"
    >
      <h3>Add Balance</h3>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="number"
          placeholder="Income Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="modal-actions">
          <button type="submit" className="btn btn-primary">Add Balance</button>
          <button type="button" className="btn btn-secondary" onClick={onRequestClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  )
}
