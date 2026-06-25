import { Layout } from '../components/Layout'
import { Link } from 'react-router-dom'
import { 
  FiCalendar, 
  FiSearch, 
  FiSliders, 
  FiUsers, 
  FiTv, 
  FiTerminal, 
  FiBookOpen 
} from 'react-icons/fi'
import '../styles/HomePage.css'

export function HomePage() {
  return (
    <Layout>
      {/* SECTION HERO-BANNER */}
      <section className="hero-banner-home">
        <div className="hero-banner-home__overlay">
          <div className="hero-banner-home__badge">
            Campus Numérique EKOD
          </div>
          <h1 className="hero-banner-home__title">
            Simplifiez la gestion et la réservation de vos espaces de travail
          </h1>
          <p className="hero-banner-home__description">
            Réservez instantanément votre salle de réunion, votre espace de coworking, un laboratoire informatique ou un amphithéâtre adapté à vos besoins.
          </p>
          <div className="hero-banner-home__actions">
            <Link to="/rooms" className="btn-primary">
              Voir les salles disponibles
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION CHIFFRES CLÉS (STATS) */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">10+</span>
            <span className="stat-label">Salles de cours</span>
            <span className="stat-desc">Du box individuel à l'amphithéâtre</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Accès Planifié</span>
            <span className="stat-desc">Réservation en temps réel</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">Équipées</span>
            <span className="stat-desc">Écrans, Wifi haut débit et tableaux</span>
          </div>
        </div>
      </section>

      {/* SECTION FONCTIONNALITÉS */}
      <section className="home-section">
        <div className="section-header">
          <span className="section-tag">Avantages</span>
          <h2 className="section-title">Pourquoi utiliser notre plateforme ?</h2>
          <p className="section-subtitle">
            Une interface intuitive conçue pour les étudiants et intervenants d'EKOD pour un quotidien simplifié.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiSearch />
            </div>
            <h3 className="feature-title">Filtres multicritères avancés</h3>
            <p className="feature-description">
              Recherchez des salles selon leur capacité d'accueil, leur localisation sur le campus ou la présence d'équipements spécifiques.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiCalendar />
            </div>
            <h3 className="feature-title">Réservation instantanée</h3>
            <p className="feature-description">
              Sélectionnez vos créneaux et réservez immédiatement en quelques clics. Plus besoin de paperasse administrative.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FiSliders />
            </div>
            <h3 className="feature-title">Gestion autonome</h3>
            <p className="feature-description">
              Consultez vos réservations actives, modifiez-les ou annulez-les en toute autonomie depuis votre espace personnel.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION CATÉGORIES D'ESPACES */}
      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <span className="section-tag">Espaces</span>
          <h2 className="section-title">Explorez nos types de salles</h2>
          <p className="section-subtitle">
            Trouvez le lieu idéal pour chaque type d'activité d'apprentissage ou de réunion de projet.
          </p>
        </div>

        <div className="categories-grid">
          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=400&q=80" alt="Salle de Réunion" className="category-card__img" />
            <div className="category-card__overlay">
              <FiUsers className="category-card__icon" />
              <h3 className="category-card__title">Salles de Réunion</h3>
              <p className="category-card__desc">Espaces calmes équipés de tableaux blancs et écrans partagés.</p>
            </div>
          </div>

          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80" alt="Amphithéâtre" className="category-card__img" />
            <div className="category-card__overlay">
              <FiBookOpen className="category-card__icon" />
              <h3 className="category-card__title">Amphithéâtres</h3>
              <p className="category-card__desc">Pour les cours magistraux, conférences et présentations majeures.</p>
            </div>
          </div>

          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80" alt="Salle Informatique" className="category-card__img" />
            <div className="category-card__overlay">
              <FiTerminal className="category-card__icon" />
              <h3 className="category-card__title">Labos Informatiques</h3>
              <p className="category-card__desc">Salles équipées de PC de développement et licences logicielles.</p>
            </div>
          </div>

          <div className="category-card">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80" alt="Espaces Créatifs" className="category-card__img" />
            <div className="category-card__overlay">
              <FiTv className="category-card__icon" />
              <h3 className="category-card__title">Espaces Créatifs</h3>
              <p className="category-card__desc">Pour le brainstorming de projet avec disposition flexible du mobilier.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION COMMENT ÇA MARCHE */}
      <section className="home-section process-bg">
        <div className="section-header">
          <span className="section-tag">Simplicité</span>
          <h2 className="section-title">Comment ça marche ?</h2>
          <p className="section-subtitle">
            Trois étapes simples pour planifier sereinement votre séance de travail.
          </p>
        </div>

        <div className="process-grid">
          <div className="process-step">
            <div className="process-number">1</div>
            <h3 className="process-title">Recherchez</h3>
            <p className="process-desc">
              Utilisez les filtres par type d'équipement ou capacité pour trouver la salle correspondant à votre besoin.
            </p>
          </div>

          <div className='step-arrow'>→</div>

          <div className="process-step">
            <div className="process-number">2</div>
            <h3 className="process-title">Sélectionnez</h3>
            <p className="process-desc">
              Consultez l'agenda de la salle en temps réel pour voir les créneaux déjà réservés et choisir le vôtre.
            </p>
          </div>

          <div className='step-arrow'>→</div>

          <div className="process-step">
            <div className="process-number">3</div>
            <h3 className="process-title">Réservez</h3>
            <p className="process-desc">
              Renseignez les détails, confirmez, et votre créneau est instantanément bloqué et ajouté à votre planning.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}