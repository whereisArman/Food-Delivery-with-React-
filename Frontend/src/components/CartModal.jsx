// Frontend/src/components/CartModal.jsx - UPDATED WITH +/- BUTTONS
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CartModal() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    incrementItem, 
    decrementItem, 
    removeFromCart,
    clearCart,
    loading 
  } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const totalItems = cart.items?.reduce((s, i) => s + i.quantity, 0) || 0

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false)
      navigate('/login')
      return
    }

    if (cart.items?.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setIsCartOpen(false)
    navigate('/orders')
  }

  const handleIncrement = async (item) => {
    await incrementItem(item)
  }

  const handleDecrement = async (item) => {
    await decrementItem(item)
  }

  const handleRemove = async (item) => {
    if (window.confirm('Remove this item from cart?')) {
      // Get the correct food ID - could be in item.food or item._id
      const foodId = item.food?._id || item.food || item._id
      console.log('Removing item with foodId:', foodId)
      await removeFromCart(foodId)
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Clear all items from cart?')) {
      await clearCart()
    }
  }

  return (
    <>
      {/* Cart Sidebar */}
      <div 
        className="cart-modal position-fixed top-0 end-0 h-100 bg-white shadow-lg" 
        style={{
          width: '100%', 
          maxWidth: '450px', 
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)', 
          transition: 'transform 0.4s ease',
          zIndex: 1000,
          overflowY: 'auto'
        }}
      >
        <div className="d-flex flex-column h-100">
          {/* Header */}
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
            <h3 className="mb-0">🛒 Your Cart ({totalItems})</h3>
            <button 
              className="btn-close" 
              onClick={() => setIsCartOpen(false)}
              disabled={loading}
            />
          </div>
          
          {/* Cart Items */}
          <div className="flex-grow-1 overflow-auto p-4">
            {cart.items?.length === 0 ? (
              <div className="text-center py-5">
                <div style={{fontSize: '64px'}}>🛒</div>
                <p className="text-muted mt-3">Your cart is empty</p>
              </div>
            ) : (
              <>
                {cart.items?.map(item => (
                  <div 
                    key={item._id || item.food} 
                    className="card mb-3 border-0 shadow-sm"
                  >
                    <div className="card-body p-3">
                      <div className="d-flex gap-3">
                        {/* Item Image */}
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="rounded"
                          style={{
                            width: '80px', 
                            height: '80px', 
                            objectFit: 'cover'
                          }} 
                        />
                        
                        {/* Item Details */}
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{item.name}</h6>
                            <button
                              className="btn btn-sm btn-link text-danger p-0"
                              onClick={() => handleRemove(item)}
                              disabled={loading}
                              title="Remove item"
                            >
                              🗑️
                            </button>
                          </div>
                          
                          <p className="text-primary fw-bold mb-2">
                            ${item.price.toFixed(2)}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="d-flex align-items-center gap-2">
                            <div className="btn-group btn-group-sm" role="group">
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleDecrement(item)}
                                disabled={loading}
                                style={{ width: '35px', fontWeight: 'bold' }}
                              >
                                −
                              </button>
                              <button 
                                className="btn btn-outline-secondary"
                                disabled
                                style={{ width: '45px' }}
                              >
                                {item.quantity}
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                onClick={() => handleIncrement(item)}
                                disabled={loading}
                                style={{ width: '35px', fontWeight: 'bold' }}
                              >
                                +
                              </button>
                            </div>
                            
                            <span className="text-muted small ms-2">
                              = ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {cart.items?.length > 0 && (
                  <button
                    className="btn btn-outline-danger w-100 mb-3"
                    onClick={handleClearCart}
                    disabled={loading}
                  >
                    🗑️ Clear Cart
                  </button>
                )}
              </>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          <div className="p-4 border-top bg-white">
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span className="text-primary">${cart.total?.toFixed(2) || '0.00'}</span>
            </div>
            <button 
              className="btn btn-primary w-100 rounded-pill py-3"
              onClick={handleCheckout}
              disabled={loading || cart.items?.length === 0}
            >
              {loading ? 'Updating...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop/Overlay */}
      {isCartOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" 
          style={{zIndex: 999}} 
          onClick={() => !loading && setIsCartOpen(false)}
        />
      )}
    </>
  )
}