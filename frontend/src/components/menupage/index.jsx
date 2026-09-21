import { useState, useEffect } from 'react'
import CategoryFilter from '../categoryfilter'
import DishCard from '../dishcard'
import './index.css'

export default function MenuPage() {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch menu')
        return r.json()
      })
      .then(data => { setDishes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(dishes.map(d => d.category))]
  const filtered = activeCategory === 'All' ? dishes : dishes.filter(d => d.category === activeCategory)
  const available = filtered.filter(d => d.available)

  return (
    <main className="menu-page">
      <div className="menu-hero">
        <div className="hero-content">
          <p className="hero-sub">Welcome to Savoria</p>
          <h1 className="hero-title">Crafted with <em>Passion</em></h1>
          <p className="hero-desc">Scan, order, and savor — without the wait.</p>
        </div>
        <div className="hero-decoration">
          <div className="deco-ring deco-ring-1"></div>
          <div className="deco-ring deco-ring-2"></div>
          <div className="deco-ring deco-ring-3"></div>
        </div>
      </div>

      <div className="menu-content">
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {loading ? (
          <div className="menu-loading">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-body">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        ) : available.length === 0 ? (
          <div className="menu-empty">
            <span className="empty-icon">🍽</span>
            <p>No dishes available in this category</p>
          </div>
        ) : (
          <div className="dishes-grid">
          {available.map((dish, i) => (
            <DishCard
              key={dish._id}
              dish={dish}
              index={i}
            />
          ))}
        </div>
        )}
      </div>
    </main>
  )
}
