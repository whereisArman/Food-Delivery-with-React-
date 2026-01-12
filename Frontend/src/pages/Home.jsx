import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import CartModal from '../components/CartModal'

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [foods, setFoods] = useState([])
  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get('/api/restaurants').then(res => setRestaurants(res.data))
    axios.get('/api/foods').then(res => setFoods(res.data))
  }, [])

  const categories = ['All', ...new Set(foods.map(f => f.category))]

  const filteredFoods = category === 'All' ? foods : foods.filter(f => f.category === category)

  // Search filter
  const searchedFoods = filteredFoods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const searchedRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {/* Hero */}
      <section className="hero position-relative overflow-hidden">
        <div className="container position-relative z-1 py-5">
          {/* Stylish Search Bar - Centered */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-6 col-md-8">
              <div className="search-container position-relative animate-slide-up">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill ps-5 pe-4 shadow-lg border-0"
                  placeholder="Search for food or restaurants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '1rem',
                    padding: '0.75rem 1.5rem 0.75rem 3.5rem'
                  }}
                />
                <svg 
                  className="position-absolute text-muted"
                  style={{left: '1.25rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px'}}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    className="btn btn-link position-absolute text-muted p-0"
                    style={{right: '1rem', top: '50%', transform: 'translateY(-50%)'}}
                    onClick={() => setSearchQuery('')}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="row justify-content-center text-center text-white">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4 animate-slide-up">Order from the best restaurants in Dhaka</h1>
              <p className="fs-5 mb-4 animate-slide-up" style={{animationDelay: '0.2s'}}>Order from your favorite restaurants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="container my-5">
        <h2 className="section-title text-center fw-bold mb-5">Popular Restaurants</h2>
        <div className="row g-4">
          {searchedRestaurants.map((r, i) => (
            <div key={r._id} className="col-md-6 col-lg-3">
              <div className="restaurant-card h-100 shadow-sm rounded overflow-hidden bg-white animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="position-relative">
                  <img src={r.image} alt={r.name} className="w-100" style={{height: '200px', objectFit: 'cover'}} />
                  {r.featured && <div className="position-absolute top-0 start-0 bg-accent text-dark px-3 py-1 m-2 rounded-pill fw-bold">Featured</div>}
                  <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2 text-center fw-bold">{r.discount}</div>
                </div>
                <div className="p-3">
                  <h5 className="fw-bold">{r.name}</h5>
                  <p className="text-muted small">{r.cuisine}</p>
                  <div className="d-flex justify-content-between text-muted small">
                    <span>Delivery Time {r.deliveryTime}</span>
                    <span className="text-warning">Rating {r.rating} ★</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {searchQuery && searchedRestaurants.length === 0 && (
          <div className="text-center text-muted py-5">
            <p>No restaurants found for "{searchQuery}"</p>
          </div>
        )}
      </section>

      {/* Menu */}
      <section className="container my-5">
        <h2 className="section-title text-center fw-bold mb-5">Today's Specials</h2>
        
        <div className="d-flex gap-3 overflow-auto pb-3 mb-4">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`btn ${category === cat ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-4`}
              onClick={() => setCategory(cat)}
              style={{animationDelay: `${i * 0.1}s`}}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {searchedFoods.map((food, i) => (
            <div key={food._id} className="col-md-6 col-lg-4">
              <div className="menu-item bg-white rounded shadow-sm overflow-hidden animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="d-flex">
                  <img src={food.image} alt={food.name} style={{width: '140px', height: '140px', objectFit: 'cover'}} />
                  <div className="p-3 flex-grow-1">
                    <h5 className="fw-bold">{food.name}</h5>
                    <p className="text-muted small">{food.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                     <span className="text-primary fw-bold fs-5">৳{food.price}</span>
                      <button
                        className="btn btn-primary btn-sm rounded-pill px-4 add-to-cart"
                        onClick={() => addToCart(food)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {searchQuery && searchedFoods.length === 0 && (
          <div className="text-center text-muted py-5">
            <p>No food items found for "{searchQuery}"</p>
          </div>
        )}
      </section>

      <CartModal />
    </>
  )
}