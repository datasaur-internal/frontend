import { useState, useRef, useEffect } from 'react'
import { Send, Plus } from 'lucide-react'
import axios from 'axios'
import MathRenderer from './MathRenderer'
import MermaidChart from './MermaidChart'
import CodeRenderer from './CodeRenderer'

// Graph Image Component
function GraphImage({ imageData, description }) {
  if (!imageData || !imageData.trim()) {
    return <div className="p-4 text-text-secondary text-sm">No image data available</div>
  }

  const trimmedData = imageData.trim()
  
  // Handle different image formats
  let imageSrc = ''
  if (trimmedData.startsWith('data:')) {
    imageSrc = trimmedData
  } else if (trimmedData.startsWith('iVBORw0KGgo') || trimmedData.startsWith('iVBOR')) {
    // PNG base64 signature
    imageSrc = `data:image/png;base64,${trimmedData}`
  } else if (trimmedData.startsWith('/9j/')) {
    // JPEG base64 signature
    imageSrc = `data:image/jpeg;base64,${trimmedData}`
  } else if (trimmedData.startsWith('PHN2Zy') || trimmedData.startsWith('<svg')) {
    // SVG base64 or raw SVG
    if (trimmedData.startsWith('<svg')) {
      imageSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(trimmedData)}`
    } else {
      imageSrc = `data:image/svg+xml;base64,${trimmedData}`
    }
  } else {
    // Default to PNG - assume it's base64
    imageSrc = `data:image/png;base64,${trimmedData}`
  }

  return (
    <img
      src={imageSrc}
      alt={description || "Graph visualization"}
      className="w-full h-auto max-w-full"
      style={{ 
        maxWidth: '100%', 
        height: 'auto',
        display: 'block'
      }}
      onError={(e) => {
        console.error('Failed to load graph image. Image data length:', trimmedData.length)
        console.error('First 50 chars:', trimmedData.substring(0, 50))
        e.target.alt = 'Failed to load image'
        e.target.style.display = 'none'
      }}
      onLoad={() => {
        console.log('Graph image loaded successfully')
      }}
      loading="lazy"
    />
  )
}

function Chat({ initialQuery, onResponseUpdate }) {
  const [messages, setMessages] = useState([
    { role: 'user', content: initialQuery }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [revealingSections, setRevealingSections] = useState({})
  const [isRevealing, setIsRevealing] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, revealingSections])

  useEffect(() => {
    if (initialQuery && messages.length === 1) {
      handleInitialLoad()
    }
  }, [])

  const revealSectionsProgressively = async (messageIndex, data) => {
    const sections = [
      'foundations',
      'concepts', 
      'formulas',
      'keyconcepts',
      'problems',
      'study_plan',
      'further_questions',
      'mermaid_diagram',
      'graph',
      'code'
    ]

    setIsRevealing(true)
    
    for (let i = 0; i < sections.length; i++) {
      const sectionKey = sections[i]
      // Handle nested graph object
      if (sectionKey === 'graph') {
        if (data.graph && data.graph.image && data.graph.image.trim()) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          setRevealingSections(prev => ({
            ...prev,
            [messageIndex]: [...(prev[messageIndex] || []), sectionKey]
          }))
        }
      } else if (data[sectionKey]) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setRevealingSections(prev => ({
          ...prev,
          [messageIndex]: [...(prev[messageIndex] || []), sectionKey]
        }))
      }
    }
    
    setIsRevealing(false)
    
    // Scroll to top after all sections are revealed
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 300)
  }

  const handleInitialLoad = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://127.0.0.1:8000/demo', { prompt: initialQuery })
      const responseData = response.data
      
      const assistantMessage = {
        role: 'assistant',
        data: responseData
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      const messageIndex = 1
      await revealSectionsProgressively(messageIndex, responseData)
      
      if (onResponseUpdate) {
        onResponseUpdate(responseData)
      }
    } catch (error) {
      console.error('Error fetching initial data:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error loading the content. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('http://127.0.0.1:8000/demo', { 
        prompt: currentInput
      })
      
      const responseData = response.data
      const messageIndex = messages.length + 1
      
      const assistantMessage = {
        role: 'assistant',
        data: responseData
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      await revealSectionsProgressively(messageIndex, responseData)
      
      if (onResponseUpdate) {
        onResponseUpdate(responseData)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionClick = async (question) => {
    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await axios.post('http://127.0.0.1:8000/demo', { prompt: question })
      const responseData = response.data
      const messageIndex = messages.length + 1
      
      const assistantMessage = {
        role: 'assistant',
        data: responseData
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      await revealSectionsProgressively(messageIndex, responseData)
      
      if (onResponseUpdate) {
        onResponseUpdate(responseData)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const textSections = [
    { key: 'foundations', title: 'Foundations' },
    { key: 'concepts', title: 'Core Concepts' },
    { key: 'formulas', title: 'Formulas & Equations' },
    { key: 'keyconcepts', title: 'Key Concepts' },
    { key: 'problems', title: 'Practice Problems' },
    { key: 'study_plan', title: 'Study Plan' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-8 py-6"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === 'user' ? (
                <div className="flex justify-end mb-6">
                  <div className="max-w-2xl rounded-2xl px-6 py-4 bg-button text-icon-on-button">
                    <p className="text-base leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {msg.content && (
                    <div className="flex justify-start">
                      <div className="max-w-2xl rounded-2xl px-6 py-4 bg-card-opacity backdrop-blur-sm border border-border text-text-primary">
                        <p className="text-base leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {msg.data && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Column - Text Content (2/3 width) */}
                      <div className="lg:col-span-2 space-y-4">
                        {textSections.map((section) => {
                          const revealed = revealingSections[idx] || []
                          const isRevealed = revealed.includes(section.key)
                          
                          return msg.data[section.key] && isRevealed ? (
                            <div 
                              key={section.key} 
                              className="bg-card-opacity backdrop-blur-sm rounded-2xl border border-border p-6 animate-fadeIn"
                            >
                              <h3 className="text-lg font-semibold text-text-primary mb-3">
                                {section.title}
                              </h3>
                              <div className="text-text-primary">
                                <MathRenderer content={msg.data[section.key]} />
                              </div>
                            </div>
                          ) : null
                        })}

                        {/* Further Questions */}
                        {msg.data.further_questions && 
                         msg.data.further_questions.length > 0 && 
                         (revealingSections[idx] || []).includes('further_questions') && (
                          <div className="bg-card-opacity backdrop-blur-sm rounded-2xl border border-border p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-text-primary mb-3">
                              Further Questions
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {msg.data.further_questions.map((question, qIdx) => (
                                <button
                                  key={qIdx}
                                  onClick={() => handleQuestionClick(question)}
                                  disabled={loading}
                                  className="px-4 py-2 rounded-full bg-button-opacity hover:bg-button text-text-primary text-sm transition-colors disabled:opacity-50"
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Visual Content (1/3 width) */}
                      <div className="lg:col-span-1 space-y-4">
                        {/* Mermaid Diagram */}
                        {msg.data.mermaid_diagram && 
                         (revealingSections[idx] || []).includes('mermaid_diagram') && (
                          <div className="bg-card-opacity backdrop-blur-sm rounded-2xl border border-border p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-text-primary mb-3">
                              Diagram
                            </h3>
                            <MermaidChart diagram={msg.data.mermaid_diagram} />
                          </div>
                        )}

                        {/* Graph */}
                        {msg.data.graph && 
                         msg.data.graph.image &&
                         (revealingSections[idx] || []).includes('graph') && (
                          <div className="bg-card-opacity backdrop-blur-sm rounded-2xl border border-border p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-text-primary mb-3">
                              Graph
                            </h3>
                            {msg.data.graph.description && (
                              <p className="text-text-primary text-sm mb-4 leading-relaxed">
                                {msg.data.graph.description}
                              </p>
                            )}
                            <div className="rounded-lg overflow-hidden bg-white border border-border">
                              <GraphImage imageData={msg.data.graph.image} description={msg.data.graph.description} />
                            </div>
                          </div>
                        )}

                        {/* Code */}
                        {msg.data.code && 
                         (revealingSections[idx] || []).includes('code') && (
                          <div className="bg-card-opacity backdrop-blur-sm rounded-2xl border border-border p-6 animate-fadeIn overflow-hidden">
                            <h3 className="text-lg font-semibold text-text-primary mb-3">
                              Code Example
                            </h3>
                            <div className="rounded-lg overflow-hidden bg-white border border-border">
                              <CodeRenderer content={msg.data.code} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {(loading || isRevealing) && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-6 py-4 bg-card-opacity backdrop-blur-sm border border-border">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-loading animate-pulse" style={{ animationDelay: '0ms', animationDuration: '1.5s' }} />
                    <div className="w-2 h-2 rounded-full bg-loading animate-pulse" style={{ animationDelay: '300ms', animationDuration: '1.5s' }} />
                    <div className="w-2 h-2 rounded-full bg-loading animate-pulse" style={{ animationDelay: '600ms', animationDuration: '1.5s' }} />
                  </div>
                  <span className="text-sm text-text-primary">
                    {isRevealing ? 'Generating content...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar - Fixed at bottom */}
      <div className="border-t border-border bg-sidebar-opacity backdrop-blur-sm px-8 py-6">
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <div className="bg-card-opacity backdrop-blur-sm rounded-3xl shadow-lg border border-border p-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex-shrink-0 w-10 h-10 rounded-full bg-button hover:bg-button-hover transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 text-icon-on-button" />
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 bg-transparent text-base text-text-primary placeholder-text-secondary outline-none"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-button hover:bg-button-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4 text-icon-on-button" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat