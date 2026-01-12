import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RiderLogin() {
  const [email, setEmail] = useState('rider1@test.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRiderLogin = (e) => {
    e.preventDefault()
    setLoading(true)

    // Set rider token
    localStorage.setItem('riderToken', 'mock-rider-token')
    localStorage.setItem('riderId', 'mock-rider-id')
    
    console.log('Rider logged in, navigating to /rider')
    
    // Small delay then navigate
    setTimeout(() => {
      setLoading(false)
      navigate('/rider', { replace: true })
    }, 300)
  }

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="mb-3" style={{fontSize: '48px'}}>🏍️</div>
                  <h2 className="fw-bold">Rider Login</h2>
                  <p className="text-muted">Login to start delivering orders</p>
                </div>

                <form onSubmit={handleRiderLogin}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rider@example.com"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 py-3 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login as Rider'}
                  </button>
                </form>

                {/* <div className="mt-4 p-3 bg-light rounded">
                  <p className="text-muted small mb-2 fw-semibold">Test Credentials:</p>
                  <p className="mb-1 small">📧 Email: rider1@test.com</p>
                  <p className="mb-0 small">🔒 Password: 123456</p>
                </div> */}

                <div className="text-center mt-4">
                  <Link to="/login" className="text-decoration-none">
                    ← Back to Customer Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}