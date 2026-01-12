// Frontend/pages/Orders.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import OrderTracking from '../components/OrderTracking'

const Orders = () => {
  const { cart, fetchCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showTracking, setShowTracking] = useState(false)

  useEffect(() => {
    fetchOrders()
    if (cart.items?.length > 0) {
      setShowCheckout(true)
    }
  }, [])

  const fetchOrders = async () => {
    if (!user) return
    try {
      const res = await axios.get('/api/orders', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!address || !phone) {
      alert('Please fill in all fields')
      return
    }

    if (cart.items?.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/orders', {
        items: cart.items,
        total: cart.total,
        address,
        phone,
        deliveryLocation: {
          latitude: 23.8103,
          longitude: 90.4125
        }
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      
      console.log('✅ Order placed:', res.data._id)
      alert('Order placed successfully! A rider will be assigned shortly.')
      
      setShowCheckout(false)
      setAddress('')
      setPhone('')
      await fetchCart()
      
      // Wait 3 seconds then refresh orders to show the assigned rider
      setTimeout(async () => {
        await fetchOrders()
        console.log('📋 Orders refreshed')
      }, 3000)
      
    } catch (err) {
      console.error('Order error:', err)
      alert(err.response?.data?.message || 'Failed to place order')
    }
    setLoading(false)
  }

  const handleTrackOrder = (order) => {
    setSelectedOrder(order)
    setShowTracking(true)
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      'pending': 'bg-warning',
      'confirmed': 'bg-info',
      'preparing': 'bg-info',
      'assigned': 'bg-primary',
      'picked-up': 'bg-primary',
      'out-for-delivery': 'bg-success',
      'delivered': 'bg-success',
      'cancelled': 'bg-danger'
    }
    return classes[status] || 'bg-secondary'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">Please login to view orders</p>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary px-6 py-2"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show tracking view
  if (showTracking && selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => setShowTracking(false)}
            className="btn btn-outline-primary mb-4"
          >
            ← Back to Orders
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Track Order #{selectedOrder._id.slice(-6)}
          </h1>

          <OrderTracking order={selectedOrder} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {showCheckout ? 'Checkout' : 'My Orders'}
        </h1>

        {/* Checkout Section */}
        {showCheckout && cart.items?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Complete Your Order</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              {cart.items.map(item => (
                <div key={item._id} className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px'}} 
                    />
                    <div>
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="text-muted mb-0">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="fw-bold text-primary mb-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="d-flex justify-content-between align-items-center mt-4 pt-4 border-top">
                <h4 className="mb-0">Total</h4>
                <h4 className="text-primary mb-0">${cart.total?.toFixed(2) || '0.00'}</h4>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Delivery Address</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete delivery address"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-semibold">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="d-flex gap-3">
                <button 
                  type="submit" 
                  className="btn btn-primary flex-grow-1 py-3 rounded-pill"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="btn btn-outline-secondary px-4 rounded-pill"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Orders History */}
        {!showCheckout && (
          <>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-xl text-gray-600">No orders yet. Start ordering delicious food!</p>
                <button 
                  onClick={() => navigate('/')}
                  className="btn btn-primary mt-4 px-6 py-2"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                        <p className="text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between mb-2">
                          <span>{item.name} x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mb-3">
                      <strong>Total</strong>
                      <strong className="text-primary">${order.total.toFixed(2)}</strong>
                    </div>

                    {/* Show rider info if assigned */}
                    {order.rider && (
                      <div className="alert alert-info mb-3">
                        <strong>🏍️ Rider Assigned:</strong><br />
                        {order.rider.name} • {order.rider.phone}
                      </div>
                    )}

                    {/* Track Order Button */}
                    {['assigned', 'picked-up', 'out-for-delivery'].includes(order.status) && (
                      <button 
                        className="btn btn-success w-100"
                        onClick={() => handleTrackOrder(order)}
                      >
                        🗺️ Track Order Live
                      </button>
                    )}

                    {order.status === 'pending' && (
                      <div className="alert alert-warning mb-0">
                        ⏳ Finding a rider for your order...
                      </div>
                    )}

                    {order.status === 'delivered' && (
                      <div className="alert alert-success mb-0">
                        ✅ Delivered on {new Date(order.actualDeliveryTime || order.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Orders