import { useEffect, useState } from 'react'
import './App.css'

const IS_PRODUCTION = import.meta.env.PROD
const API_URL = IS_PRODUCTION ? '/api/cv' : 'http://localhost:5000/api/cv'

function App() {
  const [cv, setCv] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    async function fetchCv() {
      try {
        const response = await fetch(API_URL)
        const result = await response.json()
        if (!result.success) throw new Error(result.message)
        setCv(result.data)
      } catch {
        setError('Backend lu ngadat ato belom lu nyalain? Cek http://localhost:5000')
      } finally {
        setLoading(false)
      }
    }
    fetchCv()
  }, [])

  // Observers buat handle animasi pas bento box masuk viewport
  useEffect(() => {
    if (loading) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active')
        })
      },
      { threshold: 0.05 }
    )
    document.querySelectorAll('.bento-card').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [loading])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Sabar dikit napa, lagi narik data...</p></div>
  if (error) return <div className="error-screen"><h1>Hancur Cuy!</h1><p>{error}</p></div>

  const { profile, socials, stats, skills, experiences, education, projects } = cv

  return (
    <div className="dashboard-container">
      {/* Glow Orbs buat ambient background aesthetic */}
      <div className="glow-orb orb-alpha"></div>
      <div className="glow-orb orb-beta"></div>

      {/* Header Panel Bento */}
      <header className="dash-header bento-card">
        <div className="logo">CV<span>Studio_v2</span></div>
        <div className="header-actions">
          <button className="theme-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '⚡ Light Mode' : '🌙 Dark Mode'}
          </button>
          <a href={`mailto:${profile.email}`} className="cta-mail">Hubungi Gw</a>
        </div>
      </header>

      {/* Grid Utama Bento */}
      <main className="bento-grid">
        
        {/* Box 1: Profil Utama / Hero */}
        <section className="bento-card cell-hero">
          <span className="badge">Open for Opportunities</span>
          <h1>{profile.name}</h1>
          <p className="role-tag">{profile.role}</p>
          <p className="summary-text">"{profile.summary}"</p>
          <div className="info-pill-container">
            <span>📍 {profile.location}</span>
            <span>📧 {profile.email}</span>
            <span>📱 {profile.phone}</span>
          </div>
        </section>

        {/* Box 2: Avatar & Sosmed Grid */}
        <section className="bento-card cell-avatar">
          <div className="glitch-avatar-wrap">
            <div className="text-avatar">{profile.photoText}</div>
            {profile.photo && (
              <img 
                src={profile.photo} 
                alt={profile.name} 
                className="parallax-img"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>
          <div className="social-links-grid">
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="social-pill">
                {s.label}
              </a>
            ))}
          </div>
        </section>

        {/* Box 3: Quick Stats */}
        <section className="bento-card cell-stats">
          <div className="stats-inner">
            {stats.map((st) => (
              <div key={st.label} className="stat-box">
                <span className="stat-val">{st.value}</span>
                <span className="stat-lbl">{st.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Box 4: Core Tech Stack */}
        <section className="bento-card cell-skills">
          <h3>Technical Skills</h3>
          <div className="skills-vertical-list">
            {skills.map((sk) => (
              <div key={sk.name} className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">{sk.name}</span>
                  <span className="skill-pct">{sk.level}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${sk.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Box 5: Project Showcase dengan Scroll Inner */}
        <section className="bento-card cell-projects">
          <h3>Projects Showcase</h3>
          <div className="project-scroll-container">
            {projects.map((p) => (
              <div key={p.title} className="mini-project-card">
                <div className="p-header">
                  <div className="p-icon">{p.title.charAt(0)}</div>
                  <h4>{p.title}</h4>
                </div>
                <p>{p.description}</p>
                <div className="p-tags">
                  {p.tech.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Box 6: Pengalaman Kerja */}
        <section className="bento-card cell-experience">
          <h3>Work Experience</h3>
          <div className="compact-timeline">
            {experiences.map((exp) => (
              <div key={exp.company} className="timeline-node">
                <span className="time-dur">{exp.period}</span>
                <h5>{exp.position} <span className="comp-name">@ {exp.company}</span></h5>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Box 7: Riwayat Pendidikan */}
        <section className="bento-card cell-education">
          <h3>Education</h3>
          <div className="compact-timeline">
            {education.map((edu) => (
              <div key={edu.school} className="timeline-node">
                <span className="time-dur">{edu.period}</span>
                <h5>{edu.degree}</h5>
                <p className="school-text">{edu.school}</p>
                <p>{edu.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="dash-footer bento-card">
        <p>CVStudio v2 // Rombak Total Edition © 2026</p>
      </footer>
    </div>
  )
}

export default App