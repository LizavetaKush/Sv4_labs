import React from 'react'
import Navigation from '../Navigation/Navigation'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
