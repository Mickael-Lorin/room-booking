import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/rooms" className="brand">
          Room Booking
        </Link>
        <nav>
          <Link to="/rooms">Salles</Link>
        </nav>
      </header>

      <main className="app-main">
        {children}
      </main>
    </div>
  )
}