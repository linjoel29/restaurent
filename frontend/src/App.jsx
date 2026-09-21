import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/navbar'
import MenuPage from './components/menupage'
import Cart from './components/cart'
import OrderConfirmation from './components/orderconfirmation'
import ChefDashboard from './components/chefdashboard'
import AdminLogin from './components/adminlogin'
import AdminDashboard from './components/admindashboard'
import OrderHistory from './components/OrderHistory'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('menu')
  const [currentOrder, setCurrentOrder] = useState(null)
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false)
  const [staffView, setStaffView] = useState('orders') // 'orders' | 'history' | 'menu'

  const navigate = (page) => setCurrentPage(page)

  const handleOrderPlaced = (order) => {
    setCurrentOrder(order)
    setCurrentPage('confirmation')
  }

  const handleLogout = () => {
    setIsStaffLoggedIn(false)
    setStaffView('orders')
    setCurrentPage('menu')
  }

  return (
    <CartProvider>
      <div className="app">
        {currentPage === 'menu' && (
          <>
            <Navbar navigate={navigate} />
            <MenuPage />
            <Cart onOrderPlaced={handleOrderPlaced} />
          </>
        )}

        {currentPage === 'confirmation' && (
          <OrderConfirmation order={currentOrder} navigate={navigate} />
        )}

        {currentPage === 'staff' && !isStaffLoggedIn && (
          <AdminLogin
            onLogin={() => setIsStaffLoggedIn(true)}
            navigate={navigate}
          />
        )}

        {currentPage === 'staff' && isStaffLoggedIn && (
          <>
            {/* Tab bar for staff */}
            <div className="staff-tabs">
              <div className="staff-tabs-inner">
                <div className="staff-brand">👨‍🍳 Staff Panel</div>
                <div className="staff-tab-btns">
                  <button
                    className={`staff-tab ${staffView === 'orders' ? 'active' : ''}`}
                    onClick={() => setStaffView('orders')}
                  >
                    Orders
                  </button>
                  <button
                    className={`staff-tab ${staffView === 'history' ? 'active' : ''}`}
                    onClick={() => setStaffView('history')}
                  >
                    History
                  </button>
                  <button
                    className={`staff-tab ${staffView === 'menu' ? 'active' : ''}`}
                    onClick={() => setStaffView('menu')}
                  >
                    Edit Menu
                  </button>
                </div>
                <button className="staff-logout" onClick={handleLogout}>Logout</button>
              </div>
            </div>

            {staffView === 'orders' && (
              <ChefDashboard navigate={navigate} onLogout={handleLogout} />
            )}
            {staffView === 'history' && (
              <OrderHistory />
            )}
            {staffView === 'menu' && (
              <AdminDashboard navigate={navigate} onBack={() => setStaffView('orders')} onLogout={handleLogout} />
            )}
          </>
        )}
      </div>
    </CartProvider>
  )
}