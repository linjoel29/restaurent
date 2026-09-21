import { useState, useEffect } from 'react'
import './index.css'

const EMPTY_FORM = { name: '', price: '', category: '', description: '', image: '', available: true }

export default function AdminDashboard({ navigate, onBack, onLogout }) {
  const [dishes, setDishes] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchDishes = async () => {
    const res = await fetch('http://localhost:5000/api/menu')
    if (!res.ok) return
    const data = await res.json()
    setDishes(data)
  }

  useEffect(() => { fetchDishes() }, [])

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return
    setSaving(true)
    const url = editing ? `http://localhost:5000/api/menu/${editing}` : 'http://localhost:5000/api/menu'
    const method = editing ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) })
    })
    await fetchDishes()
    setForm(EMPTY_FORM)
    setEditing(null)
    setShowForm(false)
    setSaving(false)
  }

  const handleEdit = (dish) => {
    setForm({ name: dish.name, price: dish.price, category: dish.category, description: dish.description || '', image: dish.image || '', available: dish.available })
    setEditing(dish._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    await fetch(`http://localhost:5000/api/menu/${id}`, { method: 'DELETE' })
    await fetchDishes()
    setDeleting(null)
  }

  const toggleAvailable = async (dish) => {
    await fetch(`http://localhost:5000/api/menu/${dish._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !dish.available })
    })
    fetchDishes()
  }

  const cancelForm = () => {
    setForm(EMPTY_FORM)
    setEditing(null)
    setShowForm(false)
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-label">Restaurant Manager</p>
          <h1 className="admin-title">Edit Menu</h1>
        </div>
        <div className="admin-header-actions">
          <button className="add-dish-btn" onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY_FORM) }}>
            + Add Dish
          </button>
          <button className="admin-back-btn" onClick={onBack}>
            ← Orders
          </button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {showForm && (
        <div className="dish-form-card">
          <h2 className="form-title">{editing ? 'Edit Dish' : 'Add New Dish'}</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Dish Name *</label>
              <input type="text" placeholder="e.g. Chicken Biryani" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input type="number" placeholder="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input type="text" placeholder="e.g. Main Course" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea placeholder="Short description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="form-group">
              <label>Availability</label>
              <div className="toggle-wrap" onClick={() => setForm({ ...form, available: !form.available })}>
                <div className={`toggle ${form.available ? 'on' : ''}`}>
                  <div className="toggle-knob"></div>
                </div>
                <span>{form.available ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Dish' : 'Add Dish'}
            </button>
            <button className="cancel-btn" onClick={cancelForm}>Cancel</button>
          </div>
        </div>
      )}

      <div className="dishes-table">
        <div className="table-header">
          <span>Dish</span>
          <span>Category</span>
          <span>Price</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {dishes.length === 0 ? (
          <div className="table-empty">No dishes yet. Add your first dish!</div>
        ) : dishes.map(dish => (
          <div key={dish._id} className={`table-row ${!dish.available ? 'unavailable' : ''}`}>
            <div className="dish-cell">
              {dish.image && <img src={dish.image} alt={dish.name} className="dish-thumb" />}
              <div>
                <p className="dish-cell-name">{dish.name}</p>
                <p className="dish-cell-desc">{dish.description}</p>
              </div>
            </div>
            <span className="category-tag">{dish.category}</span>
            <span className="price-cell">₹{dish.price}</span>
            <button className={`avail-toggle ${dish.available ? 'avail-on' : 'avail-off'}`} onClick={() => toggleAvailable(dish)}>
              {dish.available ? 'Available' : 'Off'}
            </button>
            <div className="row-actions">
              <button className="edit-btn" onClick={() => handleEdit(dish)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(dish._id)} disabled={deleting === dish._id}>
                {deleting === dish._id ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}