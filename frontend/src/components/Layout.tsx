import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import Ekod from '../assets/ekod.svg'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="infos-bar">
          <div className="links">
            <a href="https://www.ekod.school/portes-ouvertes/">Porte ouverte</a>
            <a href="https://www.ekod.school/journees-d-immersion/">Journées d’immersion</a>
          </div>

          <div className="links">
            <p>02 43 21 00 24</p>
          </div>
        </div>

        <div className="header-nav">
          <Link to="/rooms" className="brand">
            <img src={Ekod} alt="Ekod" />
          </Link>
          <nav>
            <Link to="/">Accueil</Link>
            <Link to="/rooms">Salles</Link>
            {isAuthenticated ? (
              <>
                <Link to="/me/reservations">Mes réservations</Link>
                <button type="button" className="nav-logout" onClick={logout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <Link className="auth" to="/login">S&apos;authentifier</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        {children}
      </main>
    </div>
  )
}
