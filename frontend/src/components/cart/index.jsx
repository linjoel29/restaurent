import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import './index.css'

export default function Cart({ onOrderPlaced }) {
  const { cartItems, removeFromCart, updateQty, total, itemCount, isCartOpen, setIsCartOpen, clearCart } = useCart()
  const [tableNo, setTableNo] = useState('')
  const [placing, setPlacing] = useState(false)
  const [tableError, setTableError] = useState(false)

  const handleOrder = async () => {
    if (!tableNo.trim()) { setTableError(true); return }
    setTableError(false)
    setPlacing(true)
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          total,
          tableNo: tableNo.trim(),
          status: 'pending'
        })
      })
      if (!res.ok) throw new Error('Failed to place order')
      const order = await res.json()
      clearCart()
      setIsCartOpen(false)
      setTableNo('')
      onOrderPlaced(order)
    } catch (err) {
      console.error(err)
    }
    setPlacing(false)
  }

  return (
    <>
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div>
            <h2 className="cart-title">Your Order</h2>
            <p className="cart-sub">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p>Your cart is empty</p>
              <span>Add dishes to get started</span>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">₹{item.price} × {item.qty} = <strong>₹{item.price * item.qty}</strong></p>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-qty">
                    <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                  </div>
                  <button className="cart-remove" onClick={() => removeFromCart(item._id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="table-input-wrap">
              <label className="table-label">Table Number</label>
              <input
                type="text"
                placeholder="Enter your table number"
                value={tableNo}
                onChange={e => { setTableNo(e.target.value); setTableError(false) }}
                className={`table-input ${tableError ? 'error' : ''}`}
              />
              {tableError && <p className="table-error">Please enter your table number</p>}
            </div>

            <div className="cart-total">
              <span>Total</span>
              <span className="total-amount">₹{total}</span>
            </div>

            <button className="place-order-btn" onClick={handleOrder} disabled={placing}>
              {placing ? (
                <span className="btn-spinner"></span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Place Order
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
