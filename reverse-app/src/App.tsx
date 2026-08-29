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
          <h1>文本倒序转换器</h1>
          <p>String Reverser · 一键颠倒反转任意文字与字符串</p>
        </header>

        <main className="content">
          <div className="input-group">
            <label htmlFor="input-text">输入原始文本 (Input Text):</label>
            <textarea
              id="input-text"
              placeholder="例如：输入“我爱你”，将倒序输出为“你爱我”"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
            {inputText && (
              <button className="clear-btn" onClick={() => setInputText('')}>
                清空 (Clear)
              </button>
            )}
          </div>

          <div className="output-group">
            <label>倒序输出结果 (Reversed Output):</label>
            <div className="output-box">
              {reversedText || <span className="placeholder">反转后的结果将实时显示在这里...</span>}
            </div>
            <button 
              className={`copy-btn ${isCopied ? 'copied' : ''}`} 
              onClick={handleCopy}
              disabled={!reversedText}
            >
              {isCopied ? '已复制到剪贴板！(Copied!)' : '复制结果 (Copy to Clipboard)'}
            </button>
          </div>
        </main>

        <footer className="footer">
          <p>实用文本小工具 · Powered by React & TypeScript</p>
        </footer>
      </div>
    </div>
  )
}

export default App
