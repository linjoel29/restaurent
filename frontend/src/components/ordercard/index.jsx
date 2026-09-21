import { useState } from 'react'
import './index.css'

export default function OrderCard({ order, onUpdate }) {
  const [minutes, setMinutes] = useState(order.estimatedMinutes || '')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const orderId = order._id?.slice(-6).toUpperCase()

  const copyId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateOrder = async (status, estimatedMinutes) => {
    setSaving(true)
    try {
      await fetch(`http://localhost:5000/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, estimatedMinutes: Number(estimatedMinutes) })
      })
      onUpdate()
    } catch (err) {}
    setSaving(false)
  }

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000)
    if (diff < 1) return 'just now'
    return `${diff}m ago`
  }

  return (
    <div className={`order-card order-${order.status}`}>
      <div className="order-card-header">
        <div>
          <p className="order-table">Table {order.tableNo}</p>
          <p className="order-time">{timeAgo(order.createdAt)}</p>
        </div>
        <div className="order-header-right">
          <span className={`order-status-badge status-${order.status}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Order ID row with copy button */}
      <div className="order-id-row">
        <span className="order-id-label">#{orderId}</span>
        <button className="chef-copy-btn" onClick={copyId}>
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <div className="order-items-list">
        {order.items?.map((item, i) => (
          <div key={i} className="order-item-row">
            <span>{item.qty}× {item.name}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="order-card-footer">
        <p className="order-total">₹{order.total}</p>

        {order.status === 'pending' && (
          <div className="chef-actions">
            <div className="min-input-wrap">
              <input
                type="number"
                placeholder="mins"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                className="min-input"
                min="1"
                max="120"
              />
              <span className="min-label">min</span>
            </div>
            <button
              className="start-btn"
              onClick={() => updateOrder('preparing', minutes)}
              disabled={saving || !minutes}
            >
              {saving ? '...' : 'Start'}
            </button>
            <button
              className="cancel-order-btn"
              onClick={() => updateOrder('cancelled', 0)}
              disabled={saving}
            >
              ✕
            </button>
          </div>
        )}

        {order.status === 'preparing' && (
          <div className="chef-actions">
            <p className="est-time">~{order.estimatedMinutes} min</p>
            <button
              className="ready-btn"
              onClick={() => updateOrder('ready', order.estimatedMinutes)}
              disabled={saving}
            >
              {saving ? '...' : '✓ Ready'}
            </button>
          </div>
        )}

        {order.status === 'ready' && (
          <div className="chef-actions">
            <p className="ready-text">🎉 Ready!</p>
            <button
              className="served-btn"
              onClick={() => updateOrder('served', order.estimatedMinutes)}
              disabled={saving}
            >
              {saving ? '...' : '✓ Served'}
            </button>
          </div>
        )}

        {order.status === 'served' && (
          <p className="served-text">✅ Completed</p>
        )}

        {order.status === 'cancelled' && (
          <p className="cancelled-text">❌ Cancelled</p>
        )}
      </div>
    </div>
  )
}