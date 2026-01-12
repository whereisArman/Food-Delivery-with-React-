import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>
              <i className="fas fa-utensils text-primary"></i> খাবারী
            </h5>
            <p className="mb-0">Your favorite food delivered hot & fresh!</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0">© 2025 Khabari. All rights reserved.</p>
            <small className="text-muted">facebook.com/খাবারী </small>
          </div>
        </div>
      </div>
    </footer>
  )
}