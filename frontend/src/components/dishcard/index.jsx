import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import './index.css'

export default function DishCard({ dish, index }) {
  const { addToCart, cartItems, updateQty, removeFromCart } = useCart()
  const [added, setAdded] = useState(false)

  const cartItem = cartItems.find(i => i._id === dish._id)
  const qty = cartItem?.qty || 0

  const handleAdd = () => {
    addToCart(dish)
    setAdded(true)
    setTimeout(() => setAdded(false), 600)
  }

  const foodEmojis = {
    'Main Course': '🍛',
    'Starters': '🥗',
    'Drinks': '🥤',
    'Desserts': '🍮',
    'Breads': '🫓',
    'default': '🍽'
  }
  const emoji = foodEmojis[dish.category] || foodEmojis.default

  return (
    <div className="dish-card" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="dish-image-wrap">
        {dish.image ? (
          <img src={dish.image} alt={dish.name} className="dish-image" />
        ) : (
          <div className="dish-image-placeholder">
            <span>{emoji}</span>
          </div>
        )}
        <span className="dish-category-badge">{dish.category}</span>
      </div>

      <div className="dish-body">
        <div className="dish-info">
          <h3 className="dish-name">{dish.name}</h3>
          {dish.description && (
            <p className="dish-desc">{dish.description}</p>
          )}
        </div>

        <div className="dish-footer">
          <span className="dish-price">₹{dish.price}</span>

          {qty === 0 ? (
            <button
              className={`add-btn ${added ? 'added' : ''}`}
              onClick={handleAdd}
            >
              {added ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              )}
              {added ? 'Added' : 'Add'}
            </button>
          ) : (
            <div className="qty-control">
              <button className="qty-btn" onClick={() => qty === 1 ? removeFromCart(dish._id) : updateQty(dish._id, qty - 1)}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => updateQty(dish._id, qty + 1)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
