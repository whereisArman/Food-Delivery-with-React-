import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { io } from 'socket.io-client'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fixed for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom rider icon
const riderIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function OrderTracking({ order }) {
  const [riderLocation, setRiderLocation] = useState(null)
  const [orderStatus, setOrderStatus] = useState(order.status)
  const [socket, setSocket] = useState(null)
  const [riderInfo, setRiderInfo] = useState(null)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    // Join order room for tracking
    newSocket.emit('customer:track-order', order._id)

    // Listen for rider location updates
    newSocket.on('rider:location-changed', (data) => {
      setRiderLocation({
        lat: data.latitude,
        lng: data.longitude
      })
    })

    // Listen for status updates
    newSocket.on('order:status-changed', (data) => {
      setOrderStatus(data.status)
    })

    // Listen for rider assignment
    newSocket.on('order:rider-assigned', (data) => {
      console.log('Rider assigned:', data.rider)
      setRiderInfo(data.rider)
    })

    // Set initial rider location if exists
    if (order.riderLocation?.latitude) {
      setRiderLocation({
        lat: order.riderLocation.latitude,
        lng: order.riderLocation.longitude
      })
    }

    // Set rider info from order if available
    if (order.rider) {
      setRiderInfo(order.rider)
    }

    return () => {
      newSocket.close()
    }
  }, [order._id])

  // Default location (order.deliveryLocation)
  const deliveryLocation = order.deliveryLocation?.latitude 
    ? [order.deliveryLocation.latitude, order.deliveryLocation.longitude]
    : [23.8103, 90.4125] // Dhaka default

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'warning',
      'confirmed': 'info',
      'preparing': 'info',
      'assigned': 'primary',
      'picked-up': 'primary',
      'out-for-delivery': 'success',
      'delivered': 'success',
      'cancelled': 'danger'
    }
    return colors[status] || 'secondary'
  }

  const getStatusText = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  // Show rider info if order is assigned or beyond
  const showRiderInfo = ['assigned', 'picked-up', 'out-for-delivery', 'delivered'].includes(orderStatus)

  return (
    <div className="order-tracking">
      {/* Status Timeline */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Order Status</h5>
            <span className={`badge bg-${getStatusColor(orderStatus)}`}>
              {getStatusText(orderStatus)}
            </span>
          </div>

          {/* Order Status Steps */}
          <div className="status-timeline">
            <div className={`status-step ${['confirmed', 'preparing', 'assigned', 'picked-up', 'out-for-delivery', 'delivered'].includes(orderStatus) ? 'completed' : ''}`}>
              <div className="status-icon">✓</div>
              <div className="status-text">Order Confirmed</div>
            </div>
            <div className={`status-step ${['preparing', 'assigned', 'picked-up', 'out-for-delivery', 'delivered'].includes(orderStatus) ? 'completed' : ''}`}>
              <div className="status-icon">🍳</div>
              <div className="status-text">Preparing</div>
            </div>
            <div className={`status-step ${['picked-up', 'out-for-delivery', 'delivered'].includes(orderStatus) ? 'completed' : ''}`}>
              <div className="status-icon">🏍️</div>
              <div className="status-text">Picked Up</div>
            </div>
            <div className={`status-step ${orderStatus === 'delivered' ? 'completed' : ''}`}>
              <div className="status-icon">📦</div>
              <div className="status-text">Delivered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rider Info */}
      {showRiderInfo && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Delivery Partner</h5>
            <div className="d-flex align-items-center gap-3">
              <div className="avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px', fontSize: '28px'}}>
                🏍️
              </div>
              <div>
                <h6 className="mb-1 fw-bold">
                  {riderInfo?.name || order.rider?.name || 'Arman Sakib'}
                </h6>
                <p className="text-muted mb-1">
                  📞 {riderInfo?.phone || order.rider?.phone || '+880 1998085072'}
                </p>
                <p className="text-muted mb-0">
                  🚲 {riderInfo?.vehicleType || order.rider?.vehicleType || 'Bike'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waiting for Rider Assignment */}
      {!showRiderInfo && orderStatus !== 'pending' && (
        <div className="card mb-4">
          <div className="card-body text-center">
            <div className="mb-3" style={{fontSize: '48px'}}>⏳</div>
            <h6 className="text-muted">Looking for a nearby delivery partner...</h6>
          </div>
        </div>
      )}

      {/* Live Map */}
      {riderLocation && showRiderInfo && (
        <div className="card">
          <div className="card-body p-0">
            <MapContainer 
              center={riderLocation} 
              zoom={14} 
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* Delivery Location */}
              <Marker position={deliveryLocation}>
                <Popup>📍 Your Delivery Location</Popup>
              </Marker>

              {/* Rider Location */}
              <Marker position={riderLocation} icon={riderIcon}>
                <Popup>🏍️ Rider Location</Popup>
              </Marker>

              {/* Route line */}
              <Polyline 
                positions={[riderLocation, deliveryLocation]} 
                color="blue"
                dashArray="10, 10"
              />
            </MapContainer>
          </div>
        </div>
      )}

      {/* Map placeholder when rider not yet tracking */}
      {!riderLocation && showRiderInfo && (
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="mb-3" style={{fontSize: '48px'}}>🗺️</div>
            <h6 className="text-muted">Live tracking will appear here once rider starts delivery</h6>
          </div>
        </div>
      )}

      <style>{`
        .status-timeline {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-top: 30px;
        }
        
        .status-step {
          flex: 1;
          text-align: center;
          position: relative;
        }
        
        .status-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e0e0e0;
          z-index: -1;
        }
        
        .status-step.completed:not(:last-child)::after {
          background: #28a745;
        }
        
        .status-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0e0e0;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        
        .status-step.completed .status-icon {
          background: #28a745;
          color: white;
        }
        
        .status-text {
          font-size: 12px;
          color: #666;
        }
        
        .status-step.completed .status-text {
          color: #28a745;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}