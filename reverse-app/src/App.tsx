import { useState, useCallback } from 'react'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  // Reverse string handling multi-byte characters correctly
  // Using Array.from to handle surrogate pairs correctly
  const reversedText = Array.from(inputText).reverse().join('')

  const handleCopy = useCallback(async () => {
    if (!reversedText) return
    try {
      await navigator.clipboard.writeText(reversedText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }, [reversedText])

  return (
    <div className="container">
      <div className="card">
        <header className="header">
          <h1>String Reverser</h1>
          <p>Instantly reverse any text</p>
        </header>

        <main className="content">
          <div className="input-group">
            <label htmlFor="input-text">Enter your text:</label>
            <textarea
              id="input-text"
              placeholder="e.g. 我爱你"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
            {inputText && (
              <button className="clear-btn" onClick={() => setInputText('')}>
                Clear
              </button>
            )}
          </div>

          <div className="output-group">
            <label>Reversed output:</label>
            <div className="output-box">
              {reversedText || <span className="placeholder">Result will appear here...</span>}
            </div>
            <button 
              className={`copy-btn ${isCopied ? 'copied' : ''}`} 
              onClick={handleCopy}
              disabled={!reversedText}
            >
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </main>

        <footer className="footer">
          <p>Powered by React & TypeScript</p>
        </footer>
      </div>
    </div>
  )
}

export default App
