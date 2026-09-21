import './index.css'

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="category-filter">
      <div className="filter-scroll">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${active === cat ? 'active' : ''}`}
            onClick={() => onChange(cat)}
          >
            {cat}
            {active === cat && <span className="filter-dot"></span>}
          </button>
        ))}
      </div>
    </div>
  )
}
