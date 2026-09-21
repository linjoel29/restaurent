import { useState, useEffect, useRef } from 'react'
import OrderCard from '../ordercard'
import './index.css'

export default function ChefDashboard({ navigate, onLogout }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const prevOrderCount = useRef(0)

  const playDing = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.value = 880
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 1)
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders')
      if (!res.ok) return
      const data = await res.json()
      const newPending = data.filter(o => o.status === 'pending').length
      if (prevOrderCount.current !== 0 && newPending > prevOrderCount.current) {
        playDing()
      }
      prevOrderCount.current = newPending
      setOrders(data)
    } catch (err) {}
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const pending = orders.filter(o => o.status === 'pending')
  const preparing = orders.filter(o => o.status === 'preparing')
  const ready = orders.filter(o => o.status === 'ready')
  const served = orders.filter(o => o.status === 'served')
  const cancelled = orders.filter(o => o.status === 'cancelled')

  return (
    <div className="chef-page">
      <div className="chef-header">
        <div>
          <p className="chef-label">Kitchen View</p>
          <h1 className="chef-title">Orders Dashboard</h1>
        </div>
        <div className="chef-header-actions">
          <div className="live-indicator">
            <span className="live-dot"></span>
            Live
          </div>
        </div>
      </div>

      <div className="chef-columns">
        <div className="chef-col">
          <div className="col-header pending-header">
            <span>New Orders</span>
            <span className="col-count">{pending.length}</span>
          </div>
          {loading ? <div className="col-loading">Loading...</div> :
            pending.length === 0 ? <p className="col-empty">No new orders</p> :
            pending.map(o => <OrderCard key={o._id} order={o} onUpdate={fetchOrders} />)
          }
        </div>

        <div className="chef-col">
          <div className="col-header preparing-header">
            <span>Preparing</span>
            <span className="col-count">{preparing.length}</span>
          </div>
          {preparing.length === 0 ? <p className="col-empty">Nothing cooking yet</p> :
            preparing.map(o => <OrderCard key={o._id} order={o} onUpdate={fetchOrders} />)
          }
        </div>

        <div className="chef-col">
          <div className="col-header ready-header">
            <span>Ready</span>
            <span className="col-count">{ready.length}</span>
          </div>
          {ready.length === 0 ? <p className="col-empty">Nothing ready yet</p> :
            ready.map(o => <OrderCard key={o._id} order={o} onUpdate={fetchOrders} />)
          }
        </div>

        <div className="chef-col">
          <div className="col-header served-header">
            <span>Served</span>
            <span className="col-count">{served.length}</span>
          </div>
          {served.length === 0 ? <p className="col-empty">Nothing served yet</p> :
            served.map(o => <OrderCard key={o._id} order={o} onUpdate={fetchOrders} />)
          }
        </div>

        <div className="chef-col">
          <div className="col-header cancelled-header">
            <span>Cancelled</span>
            <span className="col-count">{cancelled.length}</span>
          </div>
          {cancelled.length === 0 ? <p className="col-empty">No cancellations</p> :
            cancelled.map(o => <OrderCard key={o._id} order={o} onUpdate={fetchOrders} />)
          }
        </div>
      </div>
    </div>
  )
}