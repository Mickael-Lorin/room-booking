import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginService } from '../services/AuthService'
import { Layout } from '../components/Layout'
import '../styles/Login.css'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/rooms'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const data = await loginService({ email, password })
      login(data.accessToken)
      navigate(redirectTo)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <Layout>
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-card__header">
            <h2 className="auth-card__title">Connexion</h2>
            <p className="auth-card__subtitle">Accédez à votre espace membre EKOD</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-form__error">{error}</div>}

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="email">Email professionnel</label>
              <input
                id="email"
                type="email"
                className="auth-form__input"
                placeholder="nom@ekod.school"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                className="auth-form__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-form__submit">
              Se connecter
            </button>
          </form>

          <div className="auth-card__footer">
            Nouveau sur la plateforme ?{' '}
            <Link to="/register" className="auth-card__footer-link">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}