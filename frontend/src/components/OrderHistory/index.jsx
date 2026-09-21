import { useState, useEffect } from 'react'
import './index.css'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch orders')
        return r.json()
      })
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const readyCount = orders.filter(o => o.status === 'ready').length

  // Find most ordered dish
  const dishCount = {}
  orders.forEach(o => {
    o.items?.forEach(item => {
      dishCount[item.name] = (dishCount[item.name] || 0) + item.qty
    })
  })
  const topDish = Object.entries(dishCount).sort((a, b) => b[1] - a[1])[0]

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="history-page">
      <div className="history-header">
        <p className="history-label">Analytics</p>
        <h1 className="history-title">Order History</h1>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value accent">₹{totalRevenue}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{totalOrders}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending</p>
          <p className="stat-value warning">{pendingCount}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Completed</p>
          <p className="stat-value success">{readyCount}</p>
        </div>
        {topDish && (
          <div className="stat-card wide">
            <p className="stat-label">Most Ordered Dish</p>
            <p className="stat-value accent">🏆 {topDish[0]}</p>
            <p className="stat-sub">{topDish[1]} times ordered</p>
          </div>
        )}
      </div>

      {/* Filter buttons */}
      <div className="history-filters">
        {['all', 'pending', 'preparing', 'ready'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <p className="history-loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="history-empty">No orders found</p>
      ) : (
        <div className="history-list">
          {filtered.map(order => (
            <div key={order._id} className="history-card">
              <div className="history-card-header">
                <div>
                  <p className="history-order-id">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="history-table">Table {order.tableNo}</p>
                  <p className="history-date">
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="history-card-right">
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                  <p className="history-total">₹{order.total}</p>
                </div>
              </div>

              <div className="history-items">
                {order.items?.map((item, i) => (
                  <span key={i} className="history-item-tag">
                    {item.qty}× {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}