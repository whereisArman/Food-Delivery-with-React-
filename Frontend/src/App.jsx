import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Orders from './pages/Orders'
import About from './pages/About'
import Contact from './pages/Contact'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import { useAuth } from './context/AuthContext'
import RiderDashboard from './pages/RiderDashboard'
import RiderLogin from './pages/RiderLogin'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function RiderProtectedRoute({ children }) {
  const riderToken = localStorage.getItem('riderToken')
  return riderToken ? children : <Navigate to="/rider-login" />
}

function Layout({ children }) {
  const location = useLocation()
  const isRiderRoute = location.pathname.startsWith('/rider')
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Only show Header and Footer for customer routes */}
      {!isRiderRoute && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isRiderRoute && <Footer />}
      
      {/* ChatBot available on all customer pages */}
      {!isRiderRoute && <ChatBot />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rider-login" element={<RiderLogin />} />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          {/* Rider route - no customer header/footer */}
          <Route path="/rider" element={
            <RiderProtectedRoute>
              <RiderDashboard />
            </RiderProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App