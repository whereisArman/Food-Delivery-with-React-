import { useNavigate } from 'react-router-dom'

export default function RiderHeader() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear rider tokens
    localStorage.removeItem('riderToken')
    localStorage.removeItem('riderId')
    
    console.log('👋 Rider logged out')
    
    // Redirect to rider login
    navigate('/rider-login')
  }

  return (
    <header className="shadow-sm sticky-top bg-success text-white">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          <div className="logo d-flex align-items-center gap-2 fs-4 fw-bold">
            <i className="fas fa-motorcycle"></i>
            <span>খাবারী - Rider</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="fw-medium">🏍️ Rider Dashboard</span>
            <button onClick={handleLogout} className="btn btn-light">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}