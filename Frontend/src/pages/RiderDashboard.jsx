import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import RiderHeader from '../components/RiderHeader'

export default function RiderDashboard() {
  const [socket, setSocket] = useState(null)
  const [location, setLocation] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [watchId, setWatchId] = useState(null)

  const riderId = 'mock-rider-123'

  useEffect(() => {
    console.log('🔌 Connecting to socket...')
    const newSocket = io('http://localhost:5000')
    
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id)
      newSocket.emit('rider:join', 'mock-rider-id')
      console.log('🏍️ Joined room: rider:mock-rider-id')
      
      // Fetch existing orders on connect
      fetchExistingOrders()
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })

    // Listen for new order assignments
    newSocket.on('order:assigned-to-rider', (data) => {
      console.log('🎉 New order assigned via socket:', data)
      setCurrentOrder(data.order)
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Order Assigned!', {
          body: `Order #${data.order._id.slice(-6)} - $${data.order.total.toFixed(2)}`
        })
      }
      
      // Show alert
      alert(`New order assigned! Order #${data.order._id.slice(-6)}
      
Delivery to: ${data.order.address}
Total: $${data.order.total.toFixed(2)}`)
    })

    setSocket(newSocket)

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      console.log('🔌 Disconnecting socket...')
      newSocket.close()
    }
  }, [])

  // Fetch existing orders assigned to this rider
  const fetchExistingOrders = async () => {
    try {
      console.log('📋 Fetching existing orders for rider:', riderId)
      const response = await axios.get(`/api/riders/${riderId}/orders`)
      
      if (response.data && response.data.length > 0) {
        console.log(`✅ Found ${response.data.length} existing order(s)`)
        const latestOrder = response.data[0]
        console.log('📦 Latest order:', latestOrder)
        setCurrentOrder(latestOrder)
        
        alert(`You have an active order! Order #${latestOrder._id.slice(-6)}
        
Delivery to: ${latestOrder.address}
Total: $${latestOrder.total.toFixed(2)}`)
      } else {
        console.log('📭 No existing orders found')
      }
    } catch (err) {
      console.error('❌ Error fetching existing orders:', err)
    }
  }

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported')
      return
    }

    console.log('📍 Starting location tracking...')

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })

        console.log('📍 Location updated:', latitude.toFixed(6), longitude.toFixed(6))

        // Update backend
        axios.put('/api/riders/location', {
          latitude,
          longitude,
          riderId
        }).catch(err => {
          console.error('Location update error:', err)
        })

        // Emit to socket for ALL tracking customers
        if (socket && currentOrder) {
          socket.emit('rider:location-update', {
            riderId,
            orderId: currentOrder._id,
            latitude,
            longitude
          })
          console.log('📡 Location broadcasted to order:', currentOrder._id.slice(-6))
        }
      },
      (error) => {
        console.error('❌ Location error:', error)
        alert('Unable to get location. Please enable location services.')
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    setWatchId(id)
    setIsActive(true)
    console.log('✅ Tracking started, watch ID:', id)
  }

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
      console.log('🛑 Tracking stopped')
    }
    setIsActive(false)
  }

  const updateOrderStatus = async (status) => {
    if (!currentOrder) return

    console.log(`📦 Updating order ${currentOrder._id.slice(-6)} to: ${status}`)

    try {
      await axios.put(`/api/riders/order/${currentOrder._id}/status`, {
        status
      })

      if (status === 'delivered') {
        alert('Order delivered! ✅')
        setCurrentOrder(null)
        // Check for new orders
        fetchExistingOrders()
      } else {
        setCurrentOrder({ ...currentOrder, status })
        alert(`Order status updated to: ${status}`)
      }
    } catch (err) {
      console.error('Status update error:', err)
      alert('Failed to update status')
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <RiderHeader />

      <div className="container py-5">
        <div className="text-center mb-4">
          <h1>🏍️ Rider Dashboard</h1>
          <p className="text-muted">Manage your deliveries</p>
        </div>

        {/* Debug Info */}
        <div className="alert alert-info mb-4">
          <strong>Debug Info:</strong><br />
          Socket Connected: {socket?.connected ? '✅' : '❌'}<br />
          Socket ID: {socket?.id || 'N/A'}<br />
          Rider ID: {riderId}<br />
          Room: rider:mock-rider-id<br />
          Status: {isActive ? '🟢 Online' : '🔴 Offline'}<br />
          Current Order: {currentOrder ? `#${currentOrder._id.slice(-6)}` : 'None'}
        </div>

        {/* Status Toggle */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>Status</h5>
                <p className="mb-0 fs-5">
                  {isActive ? '🟢 Online - Ready for deliveries' : '🔴 Offline'}
                </p>
              </div>
              <button 
                className={`btn btn-lg ${isActive ? 'btn-danger' : 'btn-success'}`}
                onClick={isActive ? stopTracking : startTracking}
              >
                {isActive ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>
        </div>

        {/* Current Location */}
        {location && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>📍 Current Location</h5>
              <p className="mb-1">
                <strong>Latitude:</strong> {location.latitude.toFixed(6)}
              </p>
              <p className="mb-0">
                <strong>Longitude:</strong> {location.longitude.toFixed(6)}
              </p>
              <p className="text-success small mb-0 mt-2">
                ✓ Location is being tracked and broadcasted
              </p>
            </div>
          </div>
        )}

        {/* Current Order */}
        {currentOrder ? (
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">🚚 Active Delivery</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Order ID:</strong> #{currentOrder._id.slice(-6)}
              </div>

              <div className="mb-3">
                <strong>Items:</strong>
                <ul className="mb-0 mt-2">
                  {currentOrder.items?.map((item, idx) => (
                    <li key={idx}>{item.name} x{item.quantity}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-3">
                <strong>Delivery Address:</strong><br />
                📍 {currentOrder.address}
              </div>

              <div className="mb-3">
                <strong>Customer Phone:</strong><br />
                📞 {currentOrder.phone}
              </div>

              <div className="mb-3">
                <strong>Total Amount:</strong><br />
                💰 ${currentOrder.total.toFixed(2)}
              </div>

              <div className="mb-4">
                <strong>Current Status:</strong>{' '}
                <span className="badge bg-primary fs-6">
                  {currentOrder.status.split('-').map(w => 
                    w.charAt(0).toUpperCase() + w.slice(1)
                  ).join(' ')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-2">
                {currentOrder.status === 'assigned' && (
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => updateOrderStatus('picked-up')}
                  >
                    ✓ Mark as Picked Up
                  </button>
                )}
                
                {currentOrder.status === 'picked-up' && (
                  <button 
                    className="btn btn-info btn-lg"
                    onClick={() => updateOrderStatus('out-for-delivery')}
                  >
                    🚚 Start Delivery
                  </button>
                )}
                
                {currentOrder.status === 'out-for-delivery' && (
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={() => updateOrderStatus('delivered')}
                  >
                    ✅ Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body text-center py-5">
              {isActive ? (
                <>
                  <div className="mb-3" style={{fontSize: '64px'}}>⏳</div>
                  <h5>Waiting for orders...</h5>
                  <p className="text-muted">You'll be notified when an order is assigned</p>
                  <p className="small text-muted mt-3">
                    💡 Tip: Place an order from another tab/window to test
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-3" style={{fontSize: '64px'}}>🏍️</div>
                  <h5>You're Offline</h5>
                  <p className="text-muted">Click "Go Online" to start receiving orders</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}