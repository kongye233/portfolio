import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { capabilities, experience, profile, projects, stats } from './content'

const Grainient = lazy(() => import('./Grainient'))
const withBase = path => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const SPECULAR_SELECTOR = [
  '.header', '.logo-mark', '.header-cta', '.hero-card', '.portrait',
  '.portrait figcaption', '.about-tags > span', '.about-tags > a',
  '.experience-track em', '.project', '.project-foot a', '.strength-card',
  '.strength-card > header span:first-child', '.strength-card > a',
  '.strength-pills span', '.contact-sign > span', '.contact-card', '.contact-mark'
].join(',')

function useSpecularBorders() {
  useEffect(() => {
    const surfaces = [...document.querySelectorAll(SPECULAR_SELECTOR)]
    surfaces.forEach((surface, index) => {
      surface.classList.add('specular-border')
      surface.style.setProperty('--specular-delay', `${index * -0.23}s`)
    })

    let frame = 0
    const updateLight = event => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        surfaces.forEach(surface => {
          const rect = surface.getBoundingClientRect()
          const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right)
          const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom)
          const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / 250)
          const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100
          const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100
          surface.style.setProperty('--specular-x', `${Math.max(0, Math.min(100, x))}%`)
          surface.style.setProperty('--specular-y', `${Math.max(0, Math.min(100, y))}%`)
          surface.style.setProperty('--specular-opacity', `${0.26 + proximity * proximity * 0.74}`)
        })
      })
    }
    window.addEventListener('pointermove', updateLight, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', updateLight)
    }
  }, [])
}

function BelowHeroBackground() {
  const [active, setActive] = useState(false)
  const backgroundRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true)
        observer.disconnect()
      }
    }, { rootMargin: '320px 0px' })
    observer.observe(backgroundRef.current)
    return () => observer.disconnect()
  }, [])

  return <div className="below-hero-visual" ref={backgroundRef}><div className="below-hero-visual-sticky">
    {active ? <Suspense fallback={null}><Grainient
      color1="#481414"
      color2="#000000"
      color3="#006b6d"
      timeSpeed={0.72}
      colorBalance={0}
      warpStrength={2.4}
      warpFrequency={4.2}
      warpSpeed={2.8}
      warpAmplitude={22}
      blendAngle={0}
      blendSoftness={0.05}
      rotationAmount={500}
      noiseScale={2.6}
      grainAmount={0.16}
      grainScale={1.45}
      grainAnimated
      contrast={1.5}
      gamma={1}
      saturation={0.9}
      centerX={0}
      centerY={0}
      zoom={0.9}
    /></Suspense> : null}
  </div></div>
}

const Arrow = ({ down = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={down ? 'arrow down' : 'arrow'}>
    <path d={down ? 'M12 3v17m0 0-6-6m6 6 6-6' : 'M5 19 19 5m0 0H8m11 0v11'} />
  </svg>
)

function Header({ open, setOpen }) {
  return <header className="header">
    <a className="logo" href="#top" aria-label="回到首页"><span className="logo-mark">ZJ</span><span className="logo-name">ZHANG JIE</span></a>
    <nav className={open ? 'nav is-open' : 'nav'} aria-label="主导航">
      {[['首页','top'], ['关于','about'], ['项目','works'], ['能力','capabilities']].map(([label,id]) =>
        <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
      )}
    </nav>
    <a className="outline-button header-cta" href="#contact">联系我 <Arrow /></a>
    <button className="menu" aria-label="切换导航" onClick={() => setOpen(!open)}><span/><span/></button>
  </header>
}

function Hero() {
  const mediaRef = useRef(null)
  useEffect(() => {
    const move = (e) => {
      if (!mediaRef.current) return
      const x = (e.clientX / innerWidth - .5) * 10
      const y = (e.clientY / innerHeight - .5) * 8
      mediaRef.current.style.setProperty('--px', `${x}px`)
      mediaRef.current.style.setProperty('--py', `${y}px`)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return <section className="hero" id="top">
    <div ref={mediaRef} className="hero-media" role="img" aria-label="抽象玻璃与黑色织物动态背景"><div className="prism" /></div>
    <div className="hero-vignette" />
    <div className="shell hero-inner">
      <div className="hero-copy reveal">
        <h1><span>ZHANG JIE</span><br /><em>PORTFOLIO</em><i>✦</i></h1>
        <p className="hero-statement">用视觉系统与 AI 工作流<br />让品牌内容更清晰、更有辨识度</p>
        <p className="hero-roles">{profile.roles}</p>
      </div>
      <div className="hero-rail" aria-label="精选项目预览">
        {projects.map((project, index) => <a href="#works" className="hero-card" key={project.title}>
          <img src={withBase(project.image)} alt="" />
          <span>0{index + 1}</span><strong>{project.title}</strong>
        </a>)}
        <a className="hero-card hero-card-more" href="#works"><span>VIEW</span><strong>ALL WORKS</strong><Arrow /></a>
      </div>
    </div>
  </section>
}

function About() {
  return <section className="section shell about" id="about">
    <header className="about-heading reveal"><div><h2>WORK EXPERIENCE <Arrow /></h2><span>个人经历</span></div><span>01 / ABOUT ME</span></header>
    <div className="about-main">
      <figure className="portrait portrait-signature reveal"><img src={withBase('/assets/portrait-signature.jpg')} alt="张杰个人签名字图"/><figcaption>VISUAL / AI / BRAND DESIGNER</figcaption></figure>
      <div className="about-copy reveal">
        <span className="about-kicker">ABOUT ME</span>
        <h3>Hi, I am Zhang Jie!</h3><p className="intro">{profile.intro}</p>
        <dl className="details">
          <div><dt>职业 / ROLE</dt><dd>Visual / AI / Brand Designer</dd></div>
          <div><dt>所在地 / LOCATION</dt><dd>{profile.location}</dd></div>
          <div><dt>电话 / PHONE</dt><dd><a href={`tel:${profile.phone.replaceAll(' ','')}`}>{profile.phone}</a></dd></div>
          <div><dt>邮箱 / EMAIL</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>
        </dl>
        <div className="about-stats">{stats.map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        <div className="about-tags">{capabilities.map(([title]) => <span key={title}>{title}</span>)}<a href={withBase('/张杰个人作品集.pdf')} target="_blank" rel="noreferrer">作品集 PDF <Arrow /></a></div>
      </div>
    </div>
    <div className="experience reveal">
      <div className="experience-head"><span>DESIGN PRACTICE</span><span>设计实践路径</span></div>
      <div className="experience-track">{experience.map(([period,title,tag,desc]) => <article key={title}>
        <span className="experience-node"/><time>{period}</time><h4>{title}</h4><em>{tag}</em><p>{desc}</p>
      </article>)}</div>
    </div>
  </section>
}

function Works() {
  return <section className="section works" id="works">
    <div className="shell"><header className="works-heading reveal"><div><h2>SELECTED WORKS <Arrow /></h2><span>精选作品</span></div><span>02 / PROJECT ARCHIVE</span></header>
      <div className="projects">
        {projects.map((p, index) => <article className={`project project-${index + 1} reveal`} key={p.title}>
          <div className="project-image"><img src={withBase(p.image)} alt={`${p.title} 项目视觉`} /></div>
          <div className="project-meta"><span className="project-no">0{index + 1}</span><div><h3>{p.title}</h3><p>{p.desc}</p></div><div className="project-foot"><span>{p.tags}</span><span>{p.year}</span><a href="#contact" aria-label={`了解 ${p.title}`}><Arrow /></a></div></div>
        </article>)}
      </div>
    </div>
  </section>
}

function StrengthGlyph({ index }) {
  const gradientId = `strength-gradient-${index}`
  return <svg className="strength-glyph" viewBox="0 0 190 120" aria-hidden="true">
    <defs><linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c9ff2f"/><stop offset="1" stopColor="#7258ff"/></linearGradient></defs>
    {index === 0 && <><rect x="58" y="30" width="92" height="54" rx="26" transform="rotate(-18 104 57)" fill={`url(#${gradientId})`} opacity=".72"/><path d="m104 28 10 21 21 10-21 10-10 21-10-21-21-10 21-10 10-21Z"/></>}
    {index === 1 && <><ellipse cx="96" cy="60" rx="58" ry="32"/><ellipse cx="96" cy="60" rx="40" ry="20"/><path d="M38 60h116M96 28v64"/></>}
    {index === 2 && <><path d="m42 76 58-48 48 50-55 18-51-20Z" fill={`url(#${gradientId})`} opacity=".7"/><circle cx="147" cy="34" r="16"/><path d="m45 78 49-14 53 14"/></>}
    {index === 3 && <><path d="m95 22 61 29-61 29-61-29 61-29Z" fill={`url(#${gradientId})`} opacity=".65"/><path d="m34 67 61 29 61-29"/><circle cx="153" cy="30" r="12" fill="#7258ff" stroke="none"/></>}
  </svg>
}

function Capabilities() {
  return <section className="section shell capabilities" id="capabilities">
    <header className="strength-heading reveal"><div><h2>CORE STRENGTHS <Arrow /></h2><span>个人优势</span></div><span>03 / CAPABILITIES</span></header>
    <div className="strength-grid">{capabilities.map(([title,desc],i) => <article key={title} className={`strength-card strength-card-${i+1} reveal`}>
      <header><span>0{i+1}</span><span>{i < 2 ? 'CORE' : 'SYSTEM'}</span></header>
      <h3>{title}<i/></h3><p>{desc}</p>
      {i === 1 ? <div className="strength-pills"><span>品牌识别系统梳理</span><span>视觉规范与延展体系</span><span>统一多渠道传播质感</span></div> : null}
      <StrengthGlyph index={i}/>
      <a href="#contact" aria-label={`了解 ${title}`}><Arrow /></a>
    </article>)}</div>
  </section>
}

function Contact() {
  return <section className="contact" id="contact"><div className="shell contact-inner">
    <div className="contact-topline"><span>04 / CONTACT</span><span>AVAILABLE FOR SELECTED PROJECTS · 2026</span></div>
    <div className="contact-layout">
      <div className="contact-lead reveal">
        <span>联系方式</span>
        <h2>LET&apos;S CREATE<br/>THE NEXT<br/><em>GREAT WORK</em> <Arrow /></h2>
        <p>如果你正在寻找一位兼具视觉表达、品牌思考与 AI 工作流能力的设计师，欢迎和我聊聊。</p>
        <a className="contact-sign" href={`mailto:${profile.email}`}><span>ZJ</span> START A CONVERSATION</a>
      </div>
      <aside className="contact-card reveal">
        <header><span>CONTACT</span><span>ZHANG JIE / DESIGNER</span></header>
        <dl>
          <div><dt>电话 / PHONE</dt><dd><a href={`tel:${profile.phone.replaceAll(' ','')}`}>{profile.phone}</a></dd></div>
          <div><dt>邮箱 / EMAIL</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>
          <div><dt>所在地 / LOCATION</dt><dd>{profile.location}</dd></div>
          <div><dt>作品集 / PORTFOLIO</dt><dd><a href={withBase('/张杰个人作品集.pdf')} target="_blank" rel="noreferrer">DOWNLOAD PDF <Arrow /></a></dd></div>
        </dl>
        <div className="contact-card-bottom">
          <div className="contact-mark" aria-hidden="true"><span>ZJ</span><small>VISUAL<br/>AI<br/>BRAND</small></div>
          <div><small>HAVE A PROJECT IN MIND?</small><strong>一起创造下一件<br/>值得被看见的作品。</strong><a href={`mailto:${profile.email}`}>开始聊聊 <Arrow /></a></div>
        </div>
      </aside>
    </div>
    <footer className="contact-footer"><span>✣　© 2026 {profile.name}. All rights reserved.</span><div><a href="#works">作品</a><a href="#about">关于我</a><a href="#capabilities">能力</a><a href="#top">返回顶部</a></div></footer>
  </div></section>
}

export default function App() {
  const [open, setOpen] = useState(false)
  useSpecularBorders()
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold: .12 })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return <><Header open={open} setOpen={setOpen}/><main><Hero/><div className="below-hero">
    <BelowHeroBackground />
    <div className="below-hero-content"><About/><Works/><Capabilities/></div>
  </div><Contact/></main></>
}
