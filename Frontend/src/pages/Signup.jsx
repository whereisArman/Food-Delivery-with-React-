import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [isRobot, setIsRobot] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      alert('Please fill all fields')
      return
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (form.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    if (!isRobot) {
      alert('Please verify that you are not a robot')
      return
    }

    // Phone validation (Bangladesh format)
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/
    if (!phoneRegex.test(form.phone)) {
      alert('Please enter a valid Bangladesh phone number (e.g., 01712345678)')
      return
    }

    setLoading(true)
    try {
      await signup(form.name, form.email, form.password, form.phone)
      alert('Account created successfully! Please login to continue.')
      navigate('/login') // Redirect to login page
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Animated Background Shapes */}
      <div className="position-absolute w-100 h-100 top-0 start-0" style={{opacity: 0.1}}>
        <div className="position-absolute rounded-circle bg-white" 
          style={{
            width: '400px', 
            height: '400px', 
            top: '-150px', 
            right: '-100px',
            animation: 'float 8s ease-in-out infinite'
          }} 
        />
        <div className="position-absolute rounded-circle bg-white" 
          style={{
            width: '300px', 
            height: '300px', 
            bottom: '-100px', 
            left: '-80px',
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '2s'
          }} 
        />
        <div className="position-absolute rounded-circle bg-white" 
          style={{
            width: '200px', 
            height: '200px', 
            top: '40%', 
            left: '10%',
            animation: 'float 12s ease-in-out infinite',
            animationDelay: '4s'
          }} 
        />
      </div>

      {/* Signup Card */}
      <div 
        className="signup-container bg-white rounded-4 shadow-lg position-relative"
        style={{
          maxWidth: '480px', 
          width: '100%',
          margin: '20px',
          animation: 'slideUp 0.6s ease-out',
          zIndex: 10
        }}
      >
        <div className="p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
              }}
            >
              <span style={{fontSize: '40px'}}>🍕</span>
            </div>
            <h2 className="fw-bold mb-2">Create Account</h2>
            <p className="text-muted">Join us and start ordering delicious food!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <div className="position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  👤
                </span>
                <input
                  type="text"
                  className="form-control ps-5 py-2 rounded-pill"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  required
                  style={{border: '2px solid #e0e0e0'}}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <div className="position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  📧
                </span>
                <input
                  type="email"
                  className="form-control ps-5 py-2 rounded-pill"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                  style={{border: '2px solid #e0e0e0'}}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number</label>
              <div className="position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  📱
                </span>
                <input
                  type="tel"
                  className="form-control ps-5 py-2 rounded-pill"
                  placeholder="01712345678"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  required
                  style={{border: '2px solid #e0e0e0'}}
                />
              </div>
              <small className="text-muted">Format: 017XXXXXXXX or +8801XXXXXXXXX</small>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <div className="position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control ps-5 pe-5 py-2 rounded-pill"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  minLength="6"
                  required
                  style={{border: '2px solid #e0e0e0'}}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 translate-middle-y end-0 me-2 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{textDecoration: 'none'}}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm Password</label>
              <div className="position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
                  🔐
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control ps-5 pe-5 py-2 rounded-pill"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                  minLength="6"
                  required
                  style={{border: '2px solid #e0e0e0'}}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 translate-middle-y end-0 me-2 text-muted"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{textDecoration: 'none'}}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* I'm not a robot */}
            <div className="mb-4">
              <div 
                className="border rounded-3 p-3 d-flex align-items-center gap-3"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setIsRobot(!isRobot)}
              >
                <div 
                  className="d-flex align-items-center justify-content-center rounded"
                  style={{
                    width: '28px',
                    height: '28px',
                    border: '2px solid #667eea',
                    backgroundColor: isRobot ? '#667eea' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isRobot && (
                    <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-grow-1">
                  <span className="fw-semibold">I'm not a robot</span>
                </div>
                <div style={{fontSize: '30px'}}>🤖</div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-lg w-100 py-3 rounded-pill fw-bold text-white shadow"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="me-2"></span> Create Account
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center mt-4">
            <p className="text-muted mb-2">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="fw-bold text-decoration-none"
                style={{color: '#667eea'}}
              >
                Login here
              </Link>
            </p>
            <Link 
              to="/" 
              className="text-muted text-decoration-none small"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg); 
          }
          50% { 
            transform: translateY(-30px) rotate(10deg); 
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-control:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }

        .signup-container:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        }
      `}</style>
    </div>
  )
}