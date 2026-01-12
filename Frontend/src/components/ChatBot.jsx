import { useState, useRef, useEffect } from 'react'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 👋 I\'m Khabari AI Assistant. How can I help you today?\n\n• Orders and delivery\n• Menu and restaurants\n• Payment methods\n• Account issues'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or contact our support team at support@khabari.com'
        }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again later or contact support@khabari.com'
      }])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    "What are your delivery hours?",
    "How do I track my order?",
    "What payment methods do you accept?",
    "How do I cancel my order?"
  ]

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="position-fixed btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            zIndex: 1000,
            animation: 'pulse 2s infinite'
          }}
          title="Chat with AI Assistant"
        >
          <i className="fas fa-comments fs-4"></i>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="position-fixed bg-white rounded shadow-lg d-flex flex-column"
          style={{
            bottom: '30px',
            right: '30px',
            width: '400px',
            height: '600px',
            zIndex: 1001,
            maxWidth: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - 40px)'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-primary text-white p-3 rounded-top d-flex align-items-center justify-content-between" style={{background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)'}}>
            <div className="d-flex align-items-center gap-2">
              <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                <i className="fas fa-robot fs-5"></i>
              </div>
              <div>
                <h6 className="mb-0 fw-bold">Khabari AI Assistant</h6>
                <small className="opacity-75">
                  <span className="badge bg-success" style={{fontSize: '10px'}}>
                    <i className="fas fa-circle me-1" style={{fontSize: '6px'}}></i>
                    Online
                  </span>
                </small>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-link text-white p-0"
              style={{fontSize: '24px', textDecoration: 'none'}}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow-1 overflow-auto p-3 bg-light" style={{overflowY: 'scroll'}}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div className="d-flex align-items-end gap-2" style={{maxWidth: '80%'}}>
                  {msg.role === 'assistant' && (
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{width: '32px', height: '32px', background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)'}}>
                      <i className="fas fa-robot text-white" style={{fontSize: '14px'}}></i>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded ${
                      msg.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white text-dark shadow-sm'
                    }`}
                    style={{
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{width: '32px', height: '32px'}}>
                      <i className="fas fa-user text-white" style={{fontSize: '14px'}}></i>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="d-flex align-items-end gap-2">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px', background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)'}}>
                    <i className="fas fa-robot text-white" style={{fontSize: '14px'}}></i>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm" style={{borderRadius: '18px 18px 18px 4px'}}>
                    <div className="d-flex gap-1">
                      <div className="bg-secondary rounded-circle" style={{width: '8px', height: '8px', animation: 'bounce 1s infinite'}}></div>
                      <div className="bg-secondary rounded-circle" style={{width: '8px', height: '8px', animation: 'bounce 1s infinite 0.1s'}}></div>
                      <div className="bg-secondary rounded-circle" style={{width: '8px', height: '8px', animation: 'bounce 1s infinite 0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-2 border-top bg-white">
              <small className="text-muted px-2">Quick questions:</small>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="btn btn-sm btn-outline-primary"
                    style={{fontSize: '11px'}}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-top bg-white rounded-bottom">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="btn btn-primary"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <small className="text-muted d-block text-center mt-2" style={{fontSize: '10px'}}>
              Powered by AI • Press Enter to send
            </small>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(13, 110, 253, 0);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </>
  )
}