import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import logoImage from '../resources/logo.png'
import europeMapImage from '../resources/luoghi/cartina-europa.jpeg'
import storyText from '../resources/storia/storia.txt?raw'
import memoryText from '../resources/la-memoria/la-memoria.txt?raw'
import familyText from '../resources/famiglia/famiglia.txt?raw'
import finalReflectionsText from '../resources/riflessioni-finali/riflessioni-finali.txt?raw'
import documentText from '../resources/documenti/documenti.txt?raw'
import './styles.css'

const storyImages = Object.entries(import.meta.glob('../resources/storia/*', { eager: true, query: '?url', import: 'default' }))
  .filter(([path]) => /\.(jpe?g|png|webp|gif)$/i.test(path))
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, undefined, { numeric: true }))
  .map(([path, source]) => ({ source, alt: `Documento storico ${path.split('/').pop()}` }))

const documentImages = Object.entries(import.meta.glob('../resources/documenti/*', { eager: true, query: '?url', import: 'default' }))
  .filter(([path]) => /\.(jpe?g|png|webp|gif)$/i.test(path))
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, undefined, { numeric: true }))
  .map(([path, source]) => ({ source, alt: `Documento storico ${path.split('/').pop()}` }))

const placeTextFiles = import.meta.glob('../resources/luoghi/**/*.txt', { eager: true, query: '?raw', import: 'default' })
const placeImageFiles = import.meta.glob('../resources/luoghi/**/*', { eager: true, query: '?url', import: 'default' })

const placeDefinitions = [
  { id: 'mauthausen', title: 'Mauthausen', folder: 'mauthausen', eyebrow: 'Austria · 48.26° N, 14.50° E', x: 55.2, y: 70.5, description: 'Il campo di concentramento di Mauthausen, luogo della deportazione e della morte di Peter Barnobi.' },
  { id: 'auschwitz', title: 'Auschwitz', folder: 'auschwitz-birkenau', eyebrow: 'Polonia · 50.03° N, 19.18° E', x: 80.5, y: 53.5, description: 'Auschwitz-Birkenau, il più noto complesso concentrazionario e campo di sterminio nazista.' },
  { id: 'plaszow', title: 'Płaszów', folder: 'plaszow', eyebrow: 'Cracovia · 50.03° N, 19.97° E', x: 85.2, y: 52.5, description: 'Il campo di lavoro forzato di Płaszów, alla periferia di Cracovia.' },
  { id: 'podgorze', title: 'Podgórze', folder: 'podgorze', eyebrow: 'Cracovia · 50.04° N, 19.95° E', x: 85.2, y: 52.5, description: 'Il quartiere di Podgórze, dove venne istituito il ghetto ebraico di Cracovia.' },
  { id: 'praga', title: 'Ghetto di Praga', folder: 'ghetto-di-praga', eyebrow: 'Praga · 50.08° N, 14.44° E', x: 52.8, y: 52.0, description: 'Il quartiere ebraico di Praga, una presenza storica attraversata da secoli di memoria.' },
  { id: 'terezin', title: 'Terezín', folder: 'terezin', eyebrow: 'Boemia · 50.51° N, 14.15° E', x: 52.8, y: 48.5, description: 'Terezín, città-fortezza trasformata in ghetto e campo di transito durante la persecuzione nazista.' },
  { id: 'schindler', title: 'La fabbrica di Schindler', folder: 'la-fabbrica-di-schindler', eyebrow: 'Cracovia · 50.05° N, 19.96° E', x: 85.2, y: 52.5, description: 'La fabbrica di Oskar Schindler a Cracovia, oggi luogo di memoria e testimonianza.' },
  { id: 'foibe', title: 'Le foibe', folder: 'le-foibe', eyebrow: 'Istria · 45.64° N, 13.85° E', x: 50.2, y: 98.0, description: 'Le foibe del confine orientale, una memoria dolorosa legata alla violenza e agli esodi del Novecento.' },
]

const places = placeDefinitions.map((place) => {
  const textEntry = Object.entries(placeTextFiles).find(([path]) => path.includes(`/${place.folder}/`))
  const images = Object.entries(placeImageFiles)
    .filter(([path, source]) => path.includes(`/${place.folder}/`) && /\.(jpe?g|png|webp|gif)$/i.test(path) && typeof source === 'string')
    .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, undefined, { numeric: true }))
    .map(([path, source]) => ({ source, alt: `${place.title} · ${path.split('/').pop()}` }))
  return { ...place, description: textEntry?.[1] || place.description, gallery: images }
})

const chapters = [
  {
    number: '01',
    title: 'La memoria',
    eyebrow: 'Perché ricordare',
    description: memoryText,
    texture: 'memory',
  },
  {
    title: 'La storia',
    eyebrow: 'Il contesto e la famiglia',
    description: storyText,
    texture: 'memory',
    gallery: storyImages,
    number: '02',
  },
  {
    number: '03',
    title: 'I luoghi',
    eyebrow: 'Cracovia · Auschwitz · Mauthausen',
    description: 'Luoghi reali, attraversati dalla storia. Oggi restano una traccia concreta di ciò che è accaduto.',
    texture: 'places',
    places: true,
  },
  {
    number: '04',
    title: 'I documenti',
    eyebrow: 'Fotografie, lettere e tracce',
    description: documentText,
    texture: 'questions',
    gallery: documentImages,
  },
  {
    number: '05',
    title: 'Una famiglia',
    eyebrow: 'Pietro Barnobi',
    description: familyText,
    texture: 'family',
  },
  {
    number: '06',
    title: 'Riflessioni finali',
    eyebrow: 'Le domande',
    description: finalReflectionsText,
    texture: 'questions',
  },
]

function Arrow({ direction = 'right' }) {
  return <span className={`arrow arrow-${direction}`} aria-hidden="true">{direction === 'left' ? '←' : '→'}</span>
}

function EuropeMap({ selectedPlace, onSelect }) {
  return (
    <div className="europe-map" aria-label="Cartina dell'Europa con i luoghi della memoria">
      <img className="europe-map-image" src={europeMapImage} alt="Cartina dell'Europa" />
      <div className="map-label map-label-europe">EUROPA</div>
      {places.map((place) => (
        <button
          className={`${selectedPlace.id === place.id ? 'map-marker is-active' : 'map-marker'}${place.id === 'schindler' ? ' schindler-marker' : ''}${place.id === 'podgorze' ? ' podgorze-marker' : ''}${place.id === 'auschwitz' ? ' auschwitz-marker' : ''}${place.id === 'praga' ? ' praga-marker' : ''}`}
          style={{ left: `${place.x}%`, top: `${place.y}%` }}
          type="button"
          onClick={() => onSelect(place)}
          key={place.id}
          aria-label={`Apri ${place.title}`}
        >
          <span />
          <strong>{place.title}</strong>
        </button>
      ))}
    </div>
  )
}

function App() {
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(places[0])
  const [menuOpen, setMenuOpen] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(3)
  const [chapterPage, setChapterPage] = useState(0)
  const [galleryImageIndex, setGalleryImageIndex] = useState(0)

  useEffect(() => {
    document.body.style.overflow = selectedChapter || menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedChapter, menuOpen])

  useEffect(() => {
    const updateCardsPerView = () => setCardsPerView(window.innerWidth <= 760 ? 1 : 3)
    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  useEffect(() => {
    const activeGallery = selectedChapter?.places ? selectedPlace.gallery : selectedChapter?.gallery
    if (!activeGallery || activeGallery.length < 2) return undefined
    const timer = window.setInterval(() => {
      setGalleryImageIndex((currentIndex) => (currentIndex + 1) % activeGallery.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [selectedChapter, selectedPlace])

  const scrollToChapters = () => document.querySelector('#percorsi')?.scrollIntoView({ behavior: 'smooth' })
  const chapterSlides = Array.from({ length: Math.ceil(chapters.length / cardsPerView) }, (_, index) => chapters.slice(index * cardsPerView, (index + 1) * cardsPerView))
  const activeChapterPage = Math.min(chapterPage, chapterSlides.length - 1)

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
          <div><p className="section-label">PERCORSI</p><h2>Sei porte<br />per <em>entrare.</em></h2></div>
          <p>Ogni immagine apre un capitolo. Un modo semplice per avvicinarsi, con rispetto, a una storia più grande di noi.</p>
        </div>
        <div className="chapter-gallery">
          <button className="gallery-arrow" type="button" onClick={() => setChapterPage(activeChapterPage - 1)} disabled={activeChapterPage === 0} aria-label="Percorsi precedenti"><Arrow direction="left" /></button>
          <div className="chapter-viewport">
            <div className="chapter-track" style={{ transform: `translateX(-${activeChapterPage * 100}%)` }}>
              {chapterSlides.map((slide, slideIndex) => (
                <div className="chapter-slide" key={slideIndex}>
                  {slide.map((chapter) => (
                    <button className={`chapter-card ${chapter.texture}`} onClick={() => { setSelectedChapter(chapter); setSelectedPlace(places[0]); setGalleryImageIndex(0) }} key={chapter.number} type="button">
                      <span className="chapter-number">{chapter.number}</span>
                      <span className="chapter-overlay" />
                      <span className="chapter-content"><small>{chapter.eyebrow}</small><strong>{chapter.title}</strong><Arrow /></span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button className="gallery-arrow" type="button" onClick={() => setChapterPage(activeChapterPage + 1)} disabled={activeChapterPage === chapterSlides.length - 1} aria-label="Percorsi successivi"><Arrow /></button>
        </div>
        <div className="gallery-status" aria-live="polite">{String(activeChapterPage + 1).padStart(2, '0')} / {String(chapterSlides.length).padStart(2, '0')}</div>
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
          <article className={selectedChapter.places ? 'chapter-dialog places-dialog' : selectedChapter.gallery ? 'chapter-dialog story-dialog' : 'chapter-dialog text-dialog'} role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="close-button" type="button" onClick={() => setSelectedChapter(null)} aria-label="Chiudi">×</button>
            {selectedChapter.places ? (
              <div className="places-dialog-grid">
                <EuropeMap selectedPlace={selectedPlace} onSelect={(place) => { setSelectedPlace(place); setGalleryImageIndex(0) }} />
                <div className="place-copy">
                  <p className="section-label">{selectedPlace.eyebrow}</p>
                  <h2 id="dialog-title">{selectedPlace.title}</h2>
                  <p className="dialog-description">{selectedPlace.description}</p>
                  {selectedPlace.gallery.length > 0 && (
                    <div className="place-gallery">
                      {selectedPlace.gallery.map((image, index) => <img className={index === galleryImageIndex ? 'is-active' : ''} src={image.source} alt={image.alt} key={image.source} />)}
                      <span className="story-gallery-count">{String(galleryImageIndex + 1).padStart(2, '0')} / {String(selectedPlace.gallery.length).padStart(2, '0')}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedChapter.gallery ? (
              <div className="story-dialog-grid">
                <div className="story-copy">
                  <p className="section-label">{selectedChapter.number} — {selectedChapter.eyebrow}</p>
                  <h2 id="dialog-title">{selectedChapter.title}</h2>
                  <p className="dialog-description">{selectedChapter.description}</p>
                </div>
                <div className="story-gallery" aria-label="Immagini della storia">
                  {selectedChapter.gallery.map((image, index) => <img className={index === galleryImageIndex ? 'is-active' : ''} src={image.source} alt={image.alt} key={image.source} />)}
                  <span className="story-gallery-count">{String(galleryImageIndex + 1).padStart(2, '0')} / {String(selectedChapter.gallery.length).padStart(2, '0')}</span>
                </div>
              </div>
            ) : (
              <>
                <p className="section-label">{selectedChapter.number} — {selectedChapter.eyebrow}</p>
                <h2 id="dialog-title">{selectedChapter.title}</h2>
                <p className="dialog-description">{selectedChapter.description}</p>
              </>
            )}
          </article>
        </div>
      )}
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
