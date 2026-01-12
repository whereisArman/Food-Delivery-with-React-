// Frontend/pages/About.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="bg-gradient" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0'
      }}>
        <div className="container text-center text-white">
          <h1 className="display-3 fw-bold mb-3">
             <span style={{color: '#3b82f6'}}>About খাবারী</span>
          </h1>
          <p className="lead fs-4">Your trusted food delivery partner</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            
            {/* About Paragraphs */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-5">
                <h2 className="mb-4 text-primary">Who We Are</h2>
                <p className="lead text-dark mb-4" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
                  <span className="fw-bold text-primary">খাবারী</span> is Bangladesh's premier food delivery platform, connecting hungry customers 
                  with their favorite restaurants. Founded with a vision to revolutionize the food 
                  delivery experience, we bring delicious meals from local restaurants right to your 
                  doorstep. Our mission is to make quality food accessible to everyone, anywhere, anytime.
                </p>

                <h2 className="mb-4 text-primary mt-5">Our Service</h2>
                <p className="lead text-dark mb-4" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
                  We partner with the best restaurants in your area to offer a diverse menu of cuisines. 
                  From traditional Bangladeshi dishes to international favorites, <span className="fw-bold text-primary">খাবারী</span> ensures you get 
                  hot, fresh food delivered quickly and safely. Our dedicated team of riders works tirelessly 
                  to ensure your order reaches you in perfect condition, with real-time tracking so you always 
                  know where your food is.
                </p>

                <h2 className="mb-4 text-primary mt-5">Why Choose Us</h2>
                <p className="lead text-dark mb-4" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
                  What sets <span className="fw-bold text-primary">খাবারী</span> apart is our commitment to customer satisfaction and innovation. 
                  We offer competitive delivery charges, reliable service, and a user-friendly platform 
                  that makes ordering food effortless. Our live tracking feature keeps you informed every 
                  step of the way, and our customer support team is always ready to help. With <span className="fw-bold text-primary">খাবারী</span>, 
                  you're not just ordering food – you're choosing convenience, quality, and peace of mind.
                </p>
              </div>
            </div>

            {/* Update Info Section */}
            <div className="card shadow-sm border-0 mb-4" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <div className="card-body p-5">
                <div className="d-flex align-items-center mb-4">
                  <span className="fs-1 me-3">🚀</span>
                  <h2 className="mb-0 fw-bold">Exciting Updates Coming Soon!</h2>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded p-4 mb-3">
                  <h4 className="mb-3 fw-bold">📱 Mobile Apps Launching Soon</h4>
                  <p className="mb-2 fs-5">
                    Soon <span className="fw-bold" style={{color: '#fbbf24'}}>খাবারী</span> will be available on <strong>Google Play Store</strong> for Android 
                    and <strong>App Store</strong> for iOS devices!
                  </p>
                  <p className="mb-0 opacity-75">
                    Get ready to order your favorite food with just a tap, anywhere, anytime.
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded p-4">
                  <h4 className="mb-3 fw-bold">🤖 AI Assistant Feature</h4>
                  <p className="mb-2 fs-5">
                    We're introducing an intelligent <strong>AI Assistant</strong> to help you discover 
                    new dishes, get personalized recommendations, and make ordering even easier!
                  </p>
                  <p className="mb-0 opacity-75">
                    Your personal food advisor, powered by cutting-edge AI technology.
                  </p>
                </div>

                <div className="text-center mt-4">
                  <p className="fs-5 mb-0 opacity-75">Stay tuned for these amazing features! 🎉</p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-4">
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow"
              >
                ← Back to Home
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">© 2025 খাবারী - All rights reserved</p>
          <p className="mb-0 small text-muted mt-2">Delivering happiness, one meal at a time </p>
        </div>
      </div>
    </div>
  )
}

export default About