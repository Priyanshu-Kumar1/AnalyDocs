'use client'

import './index.css'

import Image from 'next/image'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'react-feather'

export default function Home() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const isDarkMode = savedTheme === 'dark'
    setIsDark(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.body.classList.toggle('dark', newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  return (
    <>
      <header>
        <a href="#" className="logo">
          <Image
            src={isDark ? '/assets/logo-dark.svg' : '/assets/logo-light.svg'}
            id="logo"
            alt="AnalyDocs Logo"
            width={150}
            height={50}
          />
        </a>
        <nav>
          <a href="#features">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Sign in</a>
          <a href="auth" className="cta">Get started</a>
          <button className="dark-toggle" onClick={toggleTheme} title="Toggle Theme">
            {isDark ? <Sun /> : <Moon />}
          </button>
        </nav>
      </header>

      <section className="hero">
        <section className="hero-content">
          <h1>Create intelligent documents with AI</h1>
          <p>
            Generate, visualize, and edit documents effortlessly using simple, powerful AI and
            an easy-to-use designer.
          </p>
          <div className="buttons">
            <a href="auth" className="primary">
              Get started
            </a>
            <a href="#" className="secondary">
              Watch demo
            </a>
          </div>
        </section>
      </section>

      <section className="features" id="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>🧠 AI-powered generation</h3>
            <p>Create entire documents from natural language prompts in seconds.</p>
          </div>
          <div className="feature">
            <h3>📊 Visual editor</h3>
            <p>Construct documents visually — with charts, tables, images, and more.</p>
          </div>
          <div className="feature">
            <h3>🧩 Drag and drop</h3>
            <p>Rearrange content effortlessly using drag-and-drop actions.</p>
          </div>
        </div>
      </section>

      <section className="call-to-action">
        <h3>Start building your first document today</h3>
        <p>Sign up now and create your first document in minutes.</p>
        <a href="auth">Get started</a>
      </section>

      <footer>&copy; 2025 AnalyDocs Inc. All rights reserved.</footer>
    </>
  )
}
