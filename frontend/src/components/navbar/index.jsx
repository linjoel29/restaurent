import { useCart } from '../../context/CartContext'
import './index.css'

export default function Navbar({ navigate }) {
  const { itemCount, setIsCartOpen } = useCart()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => navigate('menu')}>
          <div className="brand-icon">🍽</div>
          <div className="brand-text">
            <span className="brand-name">Savoria</span>
            <span className="brand-tagline">Fine Dining</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button className="nav-btn" onClick={() => navigate('staff')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            Staff
          </button>

          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}