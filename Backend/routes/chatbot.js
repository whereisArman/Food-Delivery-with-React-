const express = require('express');
const router = express.Router();

// Chatbot endpoint using Groq API
router.post('/message', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // System prompt for the food delivery chatbot
    const systemPrompt = `You are a helpful AI assistant for Khabari, a food delivery service in Dhaka, Bangladesh. 

Your role is to:
- Answer questions about ordering food, delivery times, and restaurant options
- Help with account issues and order tracking
- Provide information about payment methods (Cash on Delivery, bKash, Nagad, Rocket, Credit/Debit cards)
- Assist with general inquiries about the service

Key Information:
- Delivery hours: 9:00 AM to 11:00 PM daily
- Delivery area: Dhaka city
- Average delivery time: 30-45 minutes
- Minimum order varies by restaurant
- Customer support: support@khabari.com, +880 1314-764700
- Payment methods: Cash on Delivery, bKash, Nagad, Rocket, Credit/Debit Cards

Be friendly, concise, and helpful. If you don't know something specific, offer to connect them with customer support. Keep responses under 3-4 sentences when possible.`;

    // Build conversation history for context
    const messages = [];
    
    // Add system message
    messages.push({
      role: 'system',
      content: systemPrompt
    });
    
    // Add previous messages (limit to last 10 for context)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-10);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }
    
    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Check if Groq API key is available
    if (!process.env.GROQ_API_KEY) {
      console.log('⚠️ No Groq API key found, using fallback responses');
      
      // Fallback responses if API key not configured
      const fallbackResponses = {
        'delivery': 'We deliver from 9:00 AM to 11:00 PM daily across Dhaka. Average delivery time is 30-45 minutes. 🚚',
        'payment': 'We accept Cash on Delivery, bKash, Nagad, Rocket, and Credit/Debit cards. 💳',
        'track': 'You can track your order in real-time from the Orders page in your account. 📍',
        'cancel': 'To cancel an order, please contact us immediately at support@khabari.com or +880 1314-764700. 📞',
        'hours': 'We deliver from 9:00 AM to 11:00 PM every day, including weekends and holidays. ⏰',
        'minimum': 'Minimum order amount varies by restaurant. You\'ll see it when browsing the menu. 🍽️',
        'default': 'Thanks for your question! For detailed assistance, please contact our support team at support@khabari.com or call +880 1314-764700. We\'re here to help! 😊'
      };

      // Try to match keywords for fallback
      let fallbackResponse = fallbackResponses.default;
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('delivery') || lowerMessage.includes('time') || lowerMessage.includes('how long')) {
        fallbackResponse = fallbackResponses.delivery;
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        fallbackResponse = fallbackResponses.payment;
      } else if (lowerMessage.includes('track') || lowerMessage.includes('where')) {
        fallbackResponse = fallbackResponses.track;
      } else if (lowerMessage.includes('cancel')) {
        fallbackResponse = fallbackResponses.cancel;
      } else if (lowerMessage.includes('hour') || lowerMessage.includes('open')) {
        fallbackResponse = fallbackResponses.hours;
      } else if (lowerMessage.includes('minimum') || lowerMessage.includes('min order')) {
        fallbackResponse = fallbackResponses.minimum;
      }

      return res.json({
        success: true,
        response: fallbackResponse
      });
    }

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and smart model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        stream: false
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      throw new Error('Groq API request failed');
    }

    const data = await groqResponse.json();
    const aiResponse = data.choices[0].message.content;

    console.log('✅ Groq AI response received');

    res.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Fallback responses if API fails
    const fallbackResponses = {
      'delivery': 'We deliver from 9:00 AM to 11:00 PM daily across Dhaka. Average delivery time is 30-45 minutes. 🚚',
      'payment': 'We accept Cash on Delivery, bKash, Nagad, Rocket, and Credit/Debit cards. 💳',
      'track': 'You can track your order in real-time from the Orders page in your account. 📍',
      'cancel': 'To cancel an order, please contact us immediately at support@khabari.com or +880 1314-764700. 📞',
      'default': 'I apologize, but I\'m having trouble processing your request. Please contact our support team at support@khabari.com or call +880 1314-764700 for immediate assistance. 😊'
    };

    // Try to match keywords for fallback
    let fallbackResponse = fallbackResponses.default;
    const lowerMessage = req.body.message.toLowerCase();
    
    if (lowerMessage.includes('delivery') || lowerMessage.includes('time')) {
      fallbackResponse = fallbackResponses.delivery;
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      fallbackResponse = fallbackResponses.payment;
    } else if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
      fallbackResponse = fallbackResponses.track;
    } else if (lowerMessage.includes('cancel')) {
      fallbackResponse = fallbackResponses.cancel;
    }

    res.json({
      success: true,
      response: fallbackResponse
    });
  }
});

module.exports = router;