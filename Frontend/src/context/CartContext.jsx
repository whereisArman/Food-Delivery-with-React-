// Frontend/src/context/CartContext.jsx - UPDATED
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCart()
    }
  }, [])

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await axios.get('/api/cart', {
        headers: { 'x-auth-token': token }
      })
      setCart(res.data)
    } catch (err) {
      console.error('Error fetching cart:', err)
    }
  }

  // Add item to cart (or increase quantity by 1)
  const addToCart = async (food, quantity = 1) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to add items to cart')
        return
      }

      setLoading(true)

      const res = await axios.post(
        '/api/cart/add',
        {
          foodId: food._id || food.food,
          quantity: quantity,
          name: food.name,
          price: food.price,
          image: food.image
        },
        {
          headers: { 'x-auth-token': token }
        }
      )

      setCart(res.data)
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert(err.response?.data?.message || 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  // Update item quantity (set specific quantity)
  const updateQuantity = async (foodId, newQuantity) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      setLoading(true)

      const res = await axios.put(
        `/api/cart/update/${foodId}`,
        { quantity: newQuantity },
        {
          headers: { 'x-auth-token': token }
        }
      )

      setCart(res.data)
    } catch (err) {
      console.error('Error updating quantity:', err)
      alert('Failed to update quantity')
    } finally {
      setLoading(false)
    }
  }

  // Increment item quantity
  const incrementItem = async (item) => {
    await addToCart(item, 1)
  }

  // Decrement item quantity
  const decrementItem = async (item) => {
    if (item.quantity === 1) {
      // If quantity is 1, remove the item
      await removeFromCart(item.food || item._id)
    } else {
      // Decrease quantity by 1
      await addToCart(item, -1)
    }
  }

  // Remove item from cart completely
  const removeFromCart = async (foodId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      console.log('🗑️ Attempting to remove item with ID:', foodId)
      setLoading(true)

      const res = await axios.delete(`/api/cart/remove/${foodId}`, {
        headers: { 'x-auth-token': token }
      })

      setCart(res.data)
      console.log('✅ Item removed successfully')
    } catch (err) {
      console.error('❌ Error removing from cart:', err)
      console.error('Response:', err.response?.data)
      alert(err.response?.data?.message || 'Failed to remove item')
    } finally {
      setLoading(false)
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      setLoading(true)

      const res = await axios.delete('/api/cart/clear', {
        headers: { 'x-auth-token': token }
      })

      setCart(res.data)
    } catch (err) {
      console.error('Error clearing cart:', err)
      alert('Failed to clear cart')
    } finally {
      setLoading(false)
    }
  }

  const value = {
    cart,
    isCartOpen,
    setIsCartOpen,
    loading,
    addToCart,
    updateQuantity,
    incrementItem,
    decrementItem,
    removeFromCart,
    clearCart,
    fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}