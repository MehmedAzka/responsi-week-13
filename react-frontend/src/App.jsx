import { useEffect, useState } from 'react'
const IS_PRODUCTION = import.meta.env.PROD

const API_URL = IS_PRODUCTION
  ? '/api/cv'
  : 'http://localhost:5000/api/cv'

const BACKEND_URL = IS_PRODUCTION
  ? ''
  : 'http://localhost:5000'
  
function App() {
  const [cv, setCv] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    async function fetchCv() {
      try {
        const response = await fetch(API_URL)
        const result = await response.json()
        if (!result.success) {
          throw new Error(result.message)
        }
        setCv(result.data)
      } catch (err) {
        setError('Gagal mengambil data CV. Pastikan backend berjalan di http://localhost:5000')
      } finally {
        setLoading(false)
      }
    }
    fetchCv()
  }, [])
  if (loading) {
    return (
      <div className="state-screen">
        <div className="loader"></div>
        <p>Memuat CV profesional...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="state-screen">
        <h1>Terjadi Kesalahan</h1>
        <p>{error}</p>
      </div>
    )
  }
  const { profile, socials, stats, skills, experiences, education, projects } = cv
  return (
    <main className="page-shell">
      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>
      <div className="orb orb-three"></div>
      <section className="hero-section">
        <nav className="navbar">
          <div className="brand">CV<span>Studio</span></div>
          <div className="nav-links">
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Professional Digital CV</div>
            <h1>{profile.name}</h1>
            <h2>{profile.role}</h2>
            <p className="tagline">{profile.tagline}</p>
            <div className="hero-actions">
              <a href="#projects" className="primary-button">Lihat Project</a>
              <a href={`mailto:${profile.email}`} className="secondary-button">Hubungi Saya</a>
            </div>
            <div className="quick-info">
              <span>{profile.location}</span>
              <span>{profile.email}</span>
              <span>{profile.phone}</span>
            </div>
          </div>
          <div className="profile-card">
            <div className="avatar-ring">
              <div className="avatar">
                <span>{profile.photoText}</span>
                {profile.photo && (
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>
            </div>
            <h3>{profile.name}</h3>
            <p>{profile.role}</p>
            <div className="social-list">
              {socials.map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="stats-section">
        {stats.map((item) => (
          <div className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>
      <section className="content-section">
        <div className="section-heading">
          <span>About</span>
          <h2>Profil Singkat</h2>
        </div>
        <div className="about-card">
          <p>{profile.summary}</p>
        </div>
      </section>
      <section className="content-section" id="skills">
        <div className="section-heading">
          <span>Skills</span>
          <h2>Kemampuan Teknis</h2>
        </div>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-card" key={skill.name}>
              <div className="skill-top">
                <strong>{skill.name}</strong>
                <span>{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div style={{ width: `${skill.level}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="content-section two-column" id="experience">
        <div>
          <div className="section-heading">
            <span>Experience</span>
            <h2>Pengalaman</h2>
          </div>
          <div className="timeline">
            {experiences.map((item) => (
              <article className="timeline-item" key={`${item.position}-${item.company}`}>
                <span>{item.period}</span>
                <h3>{item.position}</h3>
                <h4>{item.company}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <div className="section-heading">
            <span>Education</span>
            <h2>Pendidikan</h2>
          </div>
          <div className="timeline">
            {education.map((item) => (
              <article className="timeline-item" key={`${item.degree}-${item.school}`}>
                <span>{item.period}</span>
                <h3>{item.degree}</h3>
                <h4>{item.school}</h4>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="content-section" id="projects">
        <div className="section-heading">
          <span>Portfolio</span>
          <h2>Project Pilihan</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-icon">{project.title.charAt(0)}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-list">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="contact-section" id="contact">
        <div>
          <span>Contact</span>
          <h2>Siap Berkolaborasi?</h2>
          <p>Hubungi saya untuk diskusi project, internship, freelance, atau kolaborasi teknologi.</p>
        </div>
        <a href={`mailto:${profile.email}`} className="primary-button">Kirim Email</a>
      </section>
    </main>
  )
}
export default App