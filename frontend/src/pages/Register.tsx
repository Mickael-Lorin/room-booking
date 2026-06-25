import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerService } from '../services/AuthService'
import { Layout } from '../components/Layout'
import '../styles/Register.css'

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER' // Valeur par défaut
  })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await registerService(formData)
      navigate('/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <Layout>
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-card__header">
            <h2 className="auth-card__title">Inscription</h2>
            <p className="auth-card__subtitle">Rejoignez la plateforme de réservation EKOD</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-form__error">{error}</div>}

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="auth-form__input"
                placeholder="Jean"
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="auth-form__input"
                placeholder="Dupont"
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="email">Email professionnel</label>
              <input
                id="email"
                name="email"
                type="email"
                className="auth-form__input"
                placeholder="jean.dupont@ekod.school"
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-form__field">
              <label className="auth-form__label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                className="auth-form__input"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-form__submit">
              S'inscrire
            </button>
          </form>

          <div className="auth-card__footer">
            Déjà inscrit ?{' '}
            <Link to="/login" className="auth-card__footer-link">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default Register