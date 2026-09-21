import { useState, useEffect } from 'react'
import './index.css'

export default function OrderConfirmation({ order, navigate }) {
  const [timeLeft, setTimeLeft] = useState(null)
  const [chefTime, setChefTime] = useState(null)
  const [orderStatus, setOrderStatus] = useState(order?.status || 'pending')
  const [copied, setCopied] = useState(false)

  const orderId = order?._id?.slice(-6).toUpperCase()

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (!order?._id) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${order._id}`)
        if (!res.ok) return
        const updated = await res.json()
        if (updated.estimatedMinutes && !chefTime) {
          setChefTime(updated.estimatedMinutes)
          setTimeLeft(updated.estimatedMinutes * 60)
        }
        setOrderStatus(updated.status)
      } catch (err) {}
    }, 3000)
    return () => clearInterval(interval)
  }, [order, chefTime])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      // Auto mark as served when countdown reaches 0
      if (timeLeft === 0 && order?._id) {
        fetch(`http://localhost:5000/api/orders/${order._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'served' })
        })
        setOrderStatus('served')
      }
      return
    }
    const t = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  const mins = timeLeft !== null ? Math.floor(timeLeft / 60) : null
  const secs = timeLeft !== null ? timeLeft % 60 : null
  const progress = chefTime && timeLeft !== null
    ? (1 - timeLeft / (chefTime * 60)) * 283
    : 0

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirm-check">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        <h1 className="confirm-title">Order Placed!</h1>

        <div className="order-id-row">
          <p className="confirm-sub">Table {order?.tableNo} • Order #{orderId}</p>
          <button className="copy-btn" onClick={copyOrderId}>
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                Copy ID
              </>
            )}
          </button>
        </div>

        <div className="confirm-items">
          {order?.items?.map((item, i) => (
            <div key={i} className="confirm-item">
              <span>{item.name} × {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="confirm-total">
            <span>Total</span>
            <span>₹{order?.total}</span>
          </div>
        </div>
        {/* ORDER COMPLETED */}
{orderStatus === 'served' && (
  <div className="order-completed-banner">
    <div className="completed-emoji">🎊</div>
    <h2 className="completed-title">Order Completed!</h2>
    <p className="completed-desc">Thank you for dining with us</p>
    <p className="completed-sub">We hope you enjoyed your meal 😊</p>
    <button className="order-more-btn" onClick={() => navigate('menu')}>
      Order More
    </button>
  </div>
)}

{/* Hide everything else when served */}
{orderStatus !== 'served' && (
  <> </> )}
  
        {/* ORDER IS READY */}
        {orderStatus === 'ready' && (
          <div className="order-ready-banner">
            <span className="ready-emoji">🎉</span>
            <div>
              <p className="ready-title">Your order is ready!</p>
              <p className="ready-desc">Please collect from the counter</p>
            </div>
          </div>
        )}

        {/* COUNTDOWN TIMER */}
        {orderStatus !== 'ready' && timeLeft !== null && (
          <div className="timer-section">
            <p className="timer-label">Estimated Time</p>
            <div className="timer-ring-wrap">
              <svg className="timer-ring" viewBox="0 0 100 100">
                <circle className="timer-ring-bg" cx="50" cy="50" r="45"/>
                <circle
                  className="timer-ring-fill"
                  cx="50" cy="50" r="45"
                  strokeDasharray="283"
                  strokeDashoffset={283 - progress}
                />
              </svg>
              <div className="timer-text">
                <span className="timer-mins">
                  {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                </span>
                <span className="timer-unit">remaining</span>
              </div>
            </div>
          </div>
        )}

        {/* WAITING FOR CHEF */}
        {orderStatus === 'pending' && timeLeft === null && (
          <div className="waiting-section">
            <div className="waiting-dots">
              <span></span><span></span><span></span>
            </div>
            <p className="waiting-text">Waiting for chef to confirm your order...</p>
          </div>
        )}

        <button className="back-btn" onClick={() => navigate('menu')}>
          Order More
        </button>
      </div>
    </div>
  )
}