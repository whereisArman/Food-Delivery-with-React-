import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('loading')

    try {
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    }

    setTimeout(() => setSubmitStatus(null), 3000)
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark mb-3">Contact Us</h1>
          <p className="lead text-muted">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="row g-4">
          {/* Contact Information */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h2 className="h3 fw-bold text-dark mb-4">Get in Touch</h2>
              
              <div className="d-flex flex-column gap-4">
                {/* Address */}
                <div className="d-flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="bg-primary bg-opacity-10 rounded p-3">
                      <i className="fas fa-map-marker-alt text-primary fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="h5 fw-semibold text-dark mb-2">Address</h3>
                    <p className="text-muted mb-0">
                      Dhaka, Bangladesh<br />
                      Uttara, Dhaka 1230
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="d-flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="bg-success bg-opacity-10 rounded p-3">
                      <i className="fas fa-phone text-success fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="h5 fw-semibold text-dark mb-2">Phone</h3>
                    <p className="text-muted mb-0">
                      +880 1314-764700<br />
                      Sat-Thu: 9:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="d-flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="bg-info bg-opacity-10 rounded p-3">
                      <i className="fas fa-envelope text-info fs-4"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="h5 fw-semibold text-dark mb-2">Email</h3>
                    <p className="text-muted mb-0">
                      support@khabari.com<br />
                      info@khabari.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-5">
              <h3 className="h5 fw-semibold text-dark mb-3">Follow Us</h3>
              <div className="d-flex gap-3">
                <a href="#" className="btn btn-primary rounded-circle" style={{width: '45px', height: '45px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="btn btn-danger rounded-circle" style={{width: '45px', height: '45px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="btn btn-info rounded-circle" style={{width: '45px', height: '45px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h2 className="h3 fw-bold text-dark mb-4">Send us a Message</h2>
                
                {submitStatus === 'success' && (
                  <div className="alert alert-success mb-4" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    Thank you! Your message has been sent successfully.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-danger mb-4" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Sorry, there was an error. Please try again.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-medium">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label fw-medium">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label fw-medium">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3"
                    disabled={submitStatus === 'loading'}
                  >
                    {submitStatus === 'loading' ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-5 pt-5">
          <h2 className="h2 fw-bold text-dark text-center mb-5">
            Frequently Asked Questions
          </h2>
          
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-4">
                  <h3 className="h5 fw-semibold text-dark mb-3">
                    <i className="fas fa-clock text-primary me-2"></i>
                    What are your delivery hours?
                  </h3>
                  <p className="text-muted mb-0">
                    We deliver from 9:00 AM to 11:00 PM every day, including weekends and holidays.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-4">
                  <h3 className="h5 fw-semibold text-dark mb-3">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    How can I track my order?
                  </h3>
                  <p className="text-muted mb-0">
                    Once your order is placed, you can track it in real-time from the Orders page in your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-4">
                  <h3 className="h5 fw-semibold text-dark mb-3">
                    <i className="fas fa-credit-card text-info me-2"></i>
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted mb-0">
                    We accept cash on delivery, credit/debit cards, and mobile banking (bKash, Nagad, Rocket).
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-4">
                  <h3 className="h5 fw-semibold text-dark mb-3">
                    <i className="fas fa-shopping-bag text-warning me-2"></i>
                    Is there a minimum order amount?
                  </h3>
                  <p className="text-muted mb-0">
                    Minimum order amount varies by restaurant. You'll see the requirement when browsing the menu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}