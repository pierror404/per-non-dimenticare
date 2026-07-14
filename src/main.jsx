import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import logoImage from '../resources/logo.png'
import './styles.css'

const chapters = [
  {
    number: '01',
    title: 'La memoria',
    eyebrow: 'Perché ricordare',
    description: 'Ricordare non è soltanto guardare indietro: è imparare a riconoscere l’ingiustizia nel presente.',
    texture: 'memory',
  },
  {
    number: '02',
    title: 'I luoghi',
    eyebrow: 'Cracovia · Auschwitz · Mauthausen',
    description: 'Luoghi reali, attraversati dalla storia. Oggi restano una traccia concreta di ciò che è accaduto.',
    texture: 'places',
  },
  {
    number: '03',
    title: 'Una famiglia',
    eyebrow: 'Pietro Barnobi',
    description: 'La storia di Pietro, Orsola e Pierina: una vicenda familiare dentro le fratture del Novecento.',
    texture: 'family',
  },
  {
    number: '04',
    title: 'Le domande',
    eyebrow: 'Riflessioni finali',
    description: 'Cosa avremmo fatto noi? La memoria diventa utile quando riesce ancora a interrogarci.',
    texture: 'questions',
  },
]

function Arrow({ direction = 'right' }) {
  return <span className={`arrow arrow-${direction}`} aria-hidden="true">→</span>
}

function App() {
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = selectedChapter || menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedChapter, menuOpen])

  const scrollToChapters = () => document.querySelector('#percorsi')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#inizio" aria-label="Torna all'inizio">
          <span>PER NON</span>
          <strong>DIMENTICARE</strong>
        </a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navigazione principale">
          <a href="#progetto" onClick={() => setMenuOpen(false)}>Il progetto</a>
          <a href="#percorsi" onClick={() => setMenuOpen(false)}>Percorsi</a>
          <a href="#memoria" onClick={() => setMenuOpen(false)}>La memoria</a>
        </nav>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Apri menu" aria-expanded={menuOpen}>
          <span /><span />
        </button>
      </header>

      <section className="hero" id="inizio">
        <div className="hero-noise" />
        <div className="hero-copy">
          <p className="kicker"><span /> Un progetto personale di memoria</p>
          <h1>Per non<br /><em>dimenticare.</em></h1>
          <p className="hero-intro">Una storia di famiglia attraversata dalla deportazione, dalla separazione e dal bisogno di custodire la verità.</p>
          <button className="text-link" type="button" onClick={scrollToChapters}>Esplora il percorso <Arrow /></button>
        </div>
        <div className="hero-art" aria-label="Logo del progetto Per non dimenticare">
          <div className="art-frame">
            <img src={logoImage} alt="Logo Per non dimenticare: Pietro e Pierina Barnobi ai lati di una mappa segnata dal filo spinato" />
          </div>
          <p className="art-caption"><span>01</span> Una storia che merita di essere ascoltata</p>
        </div>
        <button className="scroll-cue" type="button" onClick={scrollToChapters} aria-label="Scorri ai contenuti"><span /></button>
      </section>

      <section className="manifesto" id="progetto">
        <p className="section-label">IL PROGETTO <span>—</span> 2026</p>
        <div className="manifesto-content">
          <h2>La storia non è<br /><em>solo passato.</em></h2>
          <div>
            <p>Questo non è un progetto scolastico. È un gesto personale: raccogliere una storia, fare ordine tra documenti e ricordi, lasciare una traccia per chi verrà dopo.</p>
            <a className="outlined-link" href="#memoria">Scopri l'intenzione <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="chapters" id="percorsi">
        <div className="chapters-heading">
          <div><p className="section-label">PERCORSI</p><h2>Quattro porte<br />per <em>entrare.</em></h2></div>
          <p>Ogni immagine apre un capitolo. Un modo semplice per avvicinarsi, con rispetto, a una storia più grande di noi.</p>
        </div>
        <div className="chapter-grid">
          {chapters.map((chapter) => (
            <button className={`chapter-card ${chapter.texture}`} onClick={() => setSelectedChapter(chapter)} key={chapter.number} type="button">
              <span className="chapter-number">{chapter.number}</span>
              <span className="chapter-overlay" />
              <span className="chapter-content"><small>{chapter.eyebrow}</small><strong>{chapter.title}</strong><Arrow /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="memory-section" id="memoria">
        <div className="quote-mark">“</div>
        <blockquote>Ricordare serve non solo a onorare chi non c’è più, ma anche a capire chi siamo oggi.</blockquote>
        <p>La memoria è fragile: va custodita, discussa, tramandata.</p>
        <div className="memory-line"><span>1939</span><i /><span>1944</span><i /><span>Oggi</span></div>
      </section>

      <footer><p>PER NON DIMENTICARE</p><p>Un archivio personale, aperto alla memoria.</p><a href="#inizio">Torna su ↑</a></footer>

      {selectedChapter && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => setSelectedChapter(null)}>
          <article className="chapter-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="close-button" type="button" onClick={() => setSelectedChapter(null)} aria-label="Chiudi">×</button>
            <p className="section-label">{selectedChapter.number} — {selectedChapter.eyebrow}</p>
            <h2 id="dialog-title">{selectedChapter.title}</h2>
            <p>{selectedChapter.description}</p>
            <span className="dialog-note">Questo spazio è pronto per il testo completo e le immagini del capitolo.</span>
          </article>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
