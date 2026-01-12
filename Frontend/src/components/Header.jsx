import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth()
  const { cart, setIsCartOpen } = useCart()
  const itemCount = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0

  return (
    <header className="shadow-sm sticky-top bg-white">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          <Link to="/" className="logo d-flex align-items-center gap-2 text-primary fs-4 fw-bold text-decoration-none">
            <i className="fas fa-utensils"></i>
            <span>খাবারী</span>
          </Link>

          <nav className="d-none d-md-block">
            <ul className="d-flex list-unstyled gap-4 mb-0">
              <li><Link to="/" className="nav-link text-decoration-none text-dark fw-medium">Home</Link></li>
              <li><Link to="/orders" className="nav-link text-decoration-none text-dark fw-medium">Orders</Link></li>
              <li><Link to="/about" className="nav-link text-decoration-none text-dark fw-medium">About Us</Link></li>
              <li><Link to="/contact" className="nav-link text-decoration-none text-dark fw-medium">Contact</Link></li>
            </ul>
          </nav>

          <div className="d-flex align-items-center gap-3">
            <div 
              className="position-relative" 
              style={{ cursor: 'pointer' }}
              onClick={() => setIsCartOpen(true)}
            >
              <i className="fas fa-shopping-cart fs-5"></i>
              {itemCount > 0 && (
                <span className="cart-count position-absolute top-0 start-100 translate-middle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '20px', height: '20px', fontSize: '12px'}}>
                  {itemCount}
                </span>
              )}
            </div>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-dark fw-medium">
                  👋 Hi, {user.name}
                </span>
                <button onClick={logout} className="btn btn-outline-danger">
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}