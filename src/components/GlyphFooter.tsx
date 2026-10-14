import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import './GlyphFooter.css'

/**
 * Footer de clôture : colonnes en capitales mono en haut, et le nom de la
 * marque dessiné en SVG sur toute la largeur. Une lettre est remplacée par un
 * « obturateur » à trois pales dont le pivot suit le pointeur (clic : quart
 * de tour). Survol d'une lettre : elle se fend à la taille ; clic : elle se
 * retourne. Les liens se brouillent en glyphes mono avant de se poser.
 */

// #region glyphes

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v

const CAP = 100 // hauteur de capitale, en unités SVG
const S = 19 // fût
const B = 17 // barre

const f = (n: number) => String(Math.round(n * 100) / 100)

const rect = (x: number, y: number, w: number, h: number) =>
  'M' + f(x) + ' ' + f(y) + 'H' + f(x + w) + 'V' + f(y + h) + 'H' + f(x) + 'Z'

/** Trait oblique de largeur horizontale `t`, de (x1, y1) en haut à (x2, y2) en bas. */
const slant = (x1: number, y1: number, x2: number, y2: number, t: number) =>
  'M' +
  f(x1) +
  ' ' +
  f(y1) +
  'H' +
  f(x1 + t) +
  'L' +
  f(x2 + t) +
  ' ' +
  f(y2) +
  'H' +
  f(x2) +
  'Z'

const at = (cx: number, cy: number, rx: number, ry: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return f(cx + rx * Math.cos(a)) + ' ' + f(cy + ry * Math.sin(a))
}

/** Bande entre deux ellipses, de l'angle a0 à a1 (sens horaire, 0 = droite). */
const band = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  tx: number,
  ty: number,
  a0: number,
  a1: number,
) => {
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  const cw = a1 > a0 ? 1 : 0
  const irx = rx - tx
  const iry = ry - ty
  return (
    'M' +
    at(cx, cy, rx, ry, a0) +
    'A' +
    f(rx) +
    ' ' +
    f(ry) +
    ' 0 ' +
    large +
    ' ' +
    cw +
    ' ' +
    at(cx, cy, rx, ry, a1) +
    'L' +
    at(cx, cy, irx, iry, a1) +
    'A' +
    f(irx) +
    ' ' +
    f(iry) +
    ' 0 ' +
    large +
    ' ' +
    (1 - cw) +
    ' ' +
    at(cx, cy, irx, iry, a0) +
    'Z'
  )
}

/** Anneau elliptique complet (fill-rule evenodd). */
const ring = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  tx: number,
  ty: number,
) => {
  const e = (r1: number, r2: number) =>
    'M' +
    f(cx - r1) +
    ' ' +
    f(cy) +
    'A' +
    f(r1) +
    ' ' +
    f(r2) +
    ' 0 1 1 ' +
    f(cx + r1) +
    ' ' +
    f(cy) +
    'A' +
    f(r1) +
    ' ' +
    f(r2) +
    ' 0 1 1 ' +
    f(cx - r1) +
    ' ' +
    f(cy) +
    'Z'
  return e(rx, ry) + e(rx - tx, ry - ty)
}

/** Panse en D : plate à gauche, demi-ellipse à droite (evenodd). */
const bowl = (
  x: number,
  y: number,
  w: number,
  h: number,
  t: number,
  tb: number,
) => {
  const ry = h / 2
  const rx = Math.min(w - t, ry * 0.95)
  const sx = x + w - rx
  return (
    'M' +
    f(x) +
    ' ' +
    f(y) +
    'H' +
    f(sx) +
    'A' +
    f(rx) +
    ' ' +
    f(ry) +
    ' 0 0 1 ' +
    f(sx) +
    ' ' +
    f(y + h) +
    'H' +
    f(x) +
    'Z' +
    'M' +
    f(x + t) +
    ' ' +
    f(y + tb) +
    'H' +
    f(sx) +
    'A' +
    f(rx - t) +
    ' ' +
    f(ry - tb) +
    ' 0 0 1 ' +
    f(sx) +
    ' ' +
    f(y + h - tb) +
    'H' +
    f(x + t) +
    'Z'
  )
}

type Glyph = { w: number; d: string[] }

const SPACE: Glyph = { w: 42, d: [] }

const GLYPHS: Record<string, Glyph> = {
  A: {
    w: 96,
    d: [
      slant(37, 0, 0, 100, 23),
      slant(37, 0, 73, 100, 23),
      rect(18, 60, 60, 16),
    ],
  },
  B: {
    w: 84,
    d: [
      rect(0, 0, S, 100),
      bowl(0, 0, 78, 52, S, B),
      bowl(0, 52 - B, 84, 100 - 52 + B, S, B),
    ],
  },
  C: { w: 90, d: [band(45, 50, 45, 50, S + 2, B, -40, -320)] },
  D: { w: 90, d: [rect(0, 0, S + 1, 100), bowl(0, 0, 90, 100, S + 2, B)] },
  E: {
    w: 72,
    d: [
      rect(0, 0, S, 100),
      rect(0, 0, 72, B),
      rect(0, 41.5, 64, B),
      rect(0, 100 - B, 72, B),
    ],
  },
  F: { w: 70, d: [rect(0, 0, S, 100), rect(0, 0, 70, B), rect(0, 43, 62, B)] },
  G: {
    w: 94,
    d: [band(47, 50, 47, 50, S + 2, B, -38, -360), rect(48, 46, 46, B)],
  },
  H: {
    w: 86,
    d: [rect(0, 0, S, 100), rect(86 - S, 0, S, 100), rect(0, 42, 86, B)],
  },
  I: { w: S + 2, d: [rect(0, 0, S + 2, 100)] },
  J: { w: 72, d: [rect(72 - S, 0, S, 64), band(36, 62, 36, 38, S, B, 0, 180)] },
  K: {
    w: 86,
    d: [
      rect(0, 0, S, 100),
      slant(62, 0, 10, 62, 24),
      slant(30, 42, 62, 100, 24),
    ],
  },
  L: { w: 68, d: [rect(0, 0, S, 100), rect(0, 100 - B, 68, B)] },
  M: {
    w: 112,
    d: [
      rect(0, 0, S + 3, 100),
      slant(0, 0, 46, 100, 9),
      slant(68, 0, 40, 100, 22),
      rect(112 - S - 3, 0, S + 3, 100),
    ],
  },
  N: {
    w: 88,
    d: [rect(0, 0, S, 100), rect(88 - S, 0, S, 100), slant(0, 0, 63, 100, 25)],
  },
  O: { w: 100, d: [ring(50, 50, 50, 50, S + 2, B)] },
  P: { w: 80, d: [rect(0, 0, S, 100), bowl(0, 0, 80, 60, S, B)] },
  Q: {
    w: 100,
    d: [ring(50, 50, 50, 50, S + 2, B), slant(50, 62, 78, 100, 22)],
  },
  R: {
    w: 84,
    d: [
      rect(0, 0, S, 100),
      bowl(0, 0, 82, 58, S, B),
      slant(34, 50, 62, 100, 22),
    ],
  },
  S: {
    w: 80,
    d: [
      band(40, 29.25, 40, 29.25, S, B, -22, -273),
      band(40, 70.75, 40, 29.25, S, B, -93, 158),
    ],
  },
  T: { w: 82, d: [rect(0, 0, 82, B), rect(41 - S / 2 - 1, 0, S + 2, 100)] },
  U: {
    w: 86,
    d: [
      rect(0, 0, S, 60),
      rect(86 - S, 0, S, 60),
      band(43, 58, 43, 42, S, B, 0, 180),
    ],
  },
  V: { w: 94, d: [slant(0, 0, 36, 100, 22), slant(72, 0, 36, 100, 22)] },
  W: {
    w: 132,
    d: [
      slant(0, 0, 26, 100, 20),
      slant(56, 0, 26, 100, 20),
      slant(56, 0, 86, 100, 20),
      slant(112, 0, 86, 100, 20),
    ],
  },
  X: { w: 92, d: [slant(0, 0, 68, 100, 24), slant(68, 0, 0, 100, 24)] },
  Y: {
    w: 92,
    d: [
      slant(0, 0, 35, 56, 22),
      slant(70, 0, 35, 56, 22),
      rect(35, 50, 22, 50),
    ],
  },
  Z: {
    w: 80,
    d: [
      rect(0, 0, 80, B),
      rect(0, 100 - B, 80, B),
      slant(56, B - 1, 0, 100 - B + 1, 24),
    ],
  },
}

const glyphOf = (ch: string) => GLYPHS[ch.toUpperCase()] ?? SPACE

const SHUTTER = 100 // l'obturateur est un carré d'une capitale
const K = 21 // largeur des pales sur les bords
const REST = 77 // position de repos du pivot

/** Tourne (x, y) de `turns` quarts de tour autour du centre de l'obturateur. */
const turn = (x: number, y: number, turns: number): [number, number] => {
  const n = ((turns % 4) + 4) % 4
  let a = x
  let b = y
  for (let i = 0; i < n; i++) {
    const t = a
    a = SHUTTER - b
    b = t
  }
  return [a, b]
}

const restPivot = (turns: number) => turn(REST, REST, turns)

/** Les trois pales pour un pivot en (px, py). */
const blades = (px: number, py: number, turns: number) => {
  const [qx, qy] = turn(clamp(px, 8, 92), clamp(py, 8, 92), -turns)
  const shapes = [
    [0, 0, K, 0, qx, qy, 0, K],
    [qx, 0, SHUTTER, 0, SHUTTER, K, qx, qy],
    [0, qy, qx, qy, K, SHUTTER, 0, SHUTTER],
  ]
  return shapes.map((s) => {
    const out: number[] = []
    for (let i = 0; i < s.length; i += 2)
      out.push(...turn(s[i], s[i + 1], turns))
    return out
  })
}

type Placed = { ch: string; x: number; w: number; shutter: boolean }

const layout = (word: string, shutterAt: number, gap = 12) => {
  const items: Placed[] = []
  let x = 0
  Array.from(word).forEach((ch, i) => {
    const shutter = i === shutterAt && ch.trim() !== ''
    const w = shutter ? SHUTTER : glyphOf(ch).w
    items.push({ ch, x, w, shutter })
    x += w + gap
  })
  return { items, width: Math.max(1, x - (items.length ? gap : 0)) }
}

/** Approche d'une cible indépendante du framerate. */
const approach = (from: number, to: number, k: number, dt: number) =>
  to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60)

const NOISE = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>'

/** Une frame de brouillage : les lettres avant `progress` sont posées. */
const scramble = (text: string, progress: number, seed: number) => {
  const chars = Array.from(text)
  const settled = Math.floor(clamp(progress, 0, 1) * chars.length)
  return chars
    .map((ch, i) => {
      if (i < settled || !/[a-z0-9]/i.test(ch)) return ch
      const r =
        Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1
      return NOISE[Math.floor(r * NOISE.length)]
    })
    .join('')
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

const parseHex = (hex: string): [number, number, number] | null => {
  const m = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const mixHex = (a: string, b: string, t: number) => {
  const x = parseHex(a)
  const y = parseHex(b)
  if (!x || !y) return a
  return (
    '#' +
    x
      .map((v, i) =>
        Math.round(v + (y[i] - v) * t)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

// #endregion

const reducedQuery = '(prefers-reduced-motion: reduce)'
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(reducedQuery)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getReduced = () => window.matchMedia(reducedQuery).matches

export type FooterLink = { label: string; href: string }

type FormState = 'idle' | 'error' | 'sending' | 'done' | 'failed'

type GlyphFooterProps = {
  /** Mot dessiné en grand (A–Z, le reste fait un espace). */
  wordmark: string
  /** Nom lu par les lecteurs d'écran. */
  label: string
  /** Index de la lettre remplacée par l'obturateur, -1 pour aucune. */
  shutterAt?: number
  company: string
  since?: number
  signupLabel: string
  placeholder: string
  /** Texte affiché une fois l'inscription réussie. */
  doneLabel?: string
  /** Reçoit une adresse valide. Renvoyer `false` ou lever une erreur affiche l'échec. */
  onSubscribe: (email: string) => void | boolean | Promise<void | boolean>
  primaryLinks: FooterLink[]
  secondaryLinks: FooterLink[]
  background?: string
  ink?: string
}

const Arrow = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="M1 6h9.2M6.4 2.2 10.2 6l-3.8 3.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="square"
    />
  </svg>
)

const Check = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="M1.5 6.4 4.6 9.4 10.6 2.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
)

function ScrambleLink({
  link,
  still,
  style,
}: {
  link: FooterLink
  still: boolean
  style?: CSSProperties
}) {
  const textRef = useRef<HTMLSpanElement>(null)
  const raf = useRef(0)
  const text = link.label

  const run = () => {
    const el = textRef.current
    if (still || !el) return
    cancelAnimationFrame(raf.current)
    const t0 = performance.now()
    const seed = Math.random() * 100
    let n = 0
    const step = (now: number) => {
      const p = (now - t0) / 420
      if (p >= 1) {
        el.textContent = text
        return
      }
      // Un nouveau glyphe une frame sur deux : ça se lit comme de la frappe.
      if (n++ % 2 === 0)
        el.textContent = scramble(text, p, seed + Math.floor(n / 2))
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <li className="gf-fade" style={style}>
      <a
        className="gf-link"
        href={link.href}
        aria-label={text}
        onPointerEnter={run}
        onFocus={run}
      >
        <span ref={textRef} aria-hidden="true">
          {text}
        </span>
        <Arrow />
      </a>
    </li>
  )
}

export default function GlyphFooter({
  wordmark,
  label,
  shutterAt = -1,
  company,
  since,
  signupLabel,
  placeholder,
  doneLabel = 'Vous êtes inscrit',
  onSubscribe,
  primaryLinks,
  secondaryLinks,
  background = '#dda13a',
  ink = '#1c1917',
}: GlyphFooterProps) {
  const word = wordmark.toUpperCase()
  const { items, width } = useMemo(
    () => layout(word, shutterAt),
    [word, shutterAt],
  )
  const shutter = items.find((it) => it.shutter)

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const upId = 'gf-up-' + uid
  const dnId = 'gf-dn-' + uid

  const rootRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const bladeRefs = useRef<(SVGPolygonElement | null)[]>([])
  const ptr = useRef({ x: 0, y: 0, inside: false })
  const pivot = useRef<[number, number]>(restPivot(0))
  const [turns, setTurns] = useState(0)

  const still = useSyncExternalStore(subscribeReduced, getReduced, () => false)

  // Apparition une seule fois ; l'obturateur ne suit le pointeur que s'il est visible.
  const [seen, setSeen] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting)
        if (e.isIntersecting) setSeen(true)
      },
      { threshold: 0.1 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  // Le pivot glisse vers le pointeur ; on écrit directement dans les polygones
  // pour ne jamais re-rendre React à chaque frame.
  useEffect(() => {
    if (!shutter) return
    const paint = (x: number, y: number) => {
      blades(x, y, turns).forEach((pts, i) => {
        bladeRefs.current[i]?.setAttribute('points', pts.map(f).join(' '))
      })
    }
    const rest = restPivot(turns)
    if (still || !visible) {
      pivot.current = rest
      paint(rest[0], rest[1])
      return
    }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const p = ptr.current
      const tx = p.inside ? clamp(p.x, 8, 92) : rest[0]
      const ty = p.inside ? clamp(p.y, 8, 92) : rest[1]
      const [x, y] = pivot.current
      pivot.current = [approach(x, tx, 0.12, dt), approach(y, ty, 0.12, dt)]
      paint(pivot.current[0], pivot.current[1])
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [shutter, still, visible, turns])

  const onPointer = (e: PointerEvent<HTMLElement>) => {
    const svg = svgRef.current
    const p = ptr.current
    p.inside = e.type !== 'pointerleave'
    if (!svg || !shutter) return
    const r = svg.getBoundingClientRect()
    const scale = r.width / width || 1
    p.x = (e.clientX - r.left) / scale - shutter.x
    p.y = (e.clientY - r.top) / scale
  }

  const flip = (e: MouseEvent<SVGGElement>) => {
    if (still) return
    const el = e.currentTarget
    el.classList.remove('is-flip')
    void el.getBoundingClientRect()
    el.classList.add('is-flip')
  }

  // ---- inscription ----
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [shake, setShake] = useState(0)
  const [spin, setSpin] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  useEffect(() => {
    if (state !== 'sending' || still) return
    const id = window.setInterval(() => setSpin((s) => s + 1), 90)
    return () => window.clearInterval(id)
  }, [state, still])

  // La secousse remonte le champ (nouvelle clé) : on y remet le curseur.
  const shakeField = () => {
    setShake((n) => n + 1)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (state === 'sending') return
    if (!isEmail(email)) {
      setState('error')
      shakeField()
      return
    }
    setState('sending')
    let ok: boolean
    try {
      ok = (await onSubscribe(email.trim())) !== false
    } catch {
      ok = false
    }
    if (!alive.current) return
    setState(ok ? 'done' : 'failed')
    if (!ok) shakeField()
  }

  const reset = () => {
    setEmail('')
    setState('idle')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const message =
    state === 'error'
      ? 'Adresse e-mail invalide'
      : state === 'failed'
        ? 'Échec de l’inscription, réessayez'
        : state === 'sending'
          ? 'Envoi…'
          : ''

  const vars = {
    '--gf-bg': background,
    '--gf-top': mixHex(background, '#ffffff', 0.13),
    '--gf-ink': ink,
  } as CSSProperties

  // Cascade d'apparition : 60 ms entre chaque élément de la rangée du haut
  const delay = (step: number) =>
    ({ '--gf-d': step * 60 + 'ms' }) as CSSProperties
  const copyStep = primaryLinks.length + 2
  const year = new Date().getFullYear()
  const years = since && since < year ? since + '—' + year : String(year)

  return (
    <footer
      ref={rootRef}
      className="gf"
      style={vars}
      data-in={seen || still ? 'true' : 'false'}
      onPointerMove={onPointer}
      onPointerEnter={onPointer}
      onPointerLeave={onPointer}
    >
      <div className="gf-top">
        <form
          className="gf-form gf-fade"
          style={delay(1)}
          onSubmit={submit}
          noValidate
        >
          <label htmlFor={'gf-email-' + uid} className="gf-lede">
            {signupLabel}
          </label>
          <div className="gf-field" data-state={state} key={shake}>
            {state === 'done' ? (
              <div className="gf-done" role="status">
                <Check />
                <span>{doneLabel}</span>
                <button type="button" onClick={reset}>
                  Annuler
                </button>
              </div>
            ) : (
              <>
                <input
                  ref={inputRef}
                  id={'gf-email-' + uid}
                  className="gf-input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder={placeholder}
                  value={email}
                  aria-invalid={state === 'error' || undefined}
                  aria-describedby={'gf-msg-' + uid}
                  disabled={state === 'sending'}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (state === 'error' || state === 'failed')
                      setState('idle')
                  }}
                />
                <button
                  className="gf-go"
                  type="submit"
                  aria-label="S’inscrire"
                  disabled={state === 'sending'}
                >
                  {state === 'sending' ? (
                    <span className="gf-spin" aria-hidden="true">
                      {still ? '…' : '|/-\\'[spin % 4]}
                    </span>
                  ) : (
                    <Arrow />
                  )}
                </button>
              </>
            )}
          </div>
          <p id={'gf-msg-' + uid} className="gf-msg" aria-live="polite">
            {message}
          </p>
        </form>

        <nav aria-label="Pied de page">
          <ul className="gf-list">
            {primaryLinks.map((l, i) => (
              <ScrambleLink
                key={l.label}
                link={l}
                still={still}
                style={delay(2 + i)}
              />
            ))}
          </ul>
        </nav>

        <p className="gf-copy gf-fade" style={delay(copyStep)}>
          {'© ' + years + '\n' + company}
        </p>

        <nav aria-label="Contact">
          <ul className="gf-list">
            {secondaryLinks.map((l, i) => (
              <ScrambleLink
                key={l.label}
                link={l}
                still={still}
                style={delay(copyStep + 1 + i)}
              />
            ))}
          </ul>
        </nav>
      </div>

      <div className="gf-mark">
        <p className="sr-only">{label}</p>
        <svg
          ref={svgRef}
          className="gf-svg"
          viewBox={'0 0 ' + f(width) + ' ' + CAP}
          style={{ aspectRatio: width + ' / ' + CAP }}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* Chaque lettre est dessinée deux fois, coupée à la taille. */}
            <clipPath id={upId} clipPathUnits="userSpaceOnUse">
              <rect x={-40} y={-200} width={400} height={252.6} />
            </clipPath>
            <clipPath id={dnId} clipPathUnits="userSpaceOnUse">
              <rect x={-40} y={51.4} width={400} height={250} />
            </clipPath>
          </defs>
          {items.map((it, i) => {
            if (it.ch.trim() === '') return null
            const rise = { '--gf-d': 200 + i * 90 + 'ms' } as CSSProperties
            if (it.shutter) {
              const rest = restPivot(turns)
              return (
                <g key={i} transform={'translate(' + f(it.x) + ' 0)'}>
                  <g className="gf-rise" style={rise}>
                    <g className="gf-g" onClick={() => setTurns((t) => t + 1)}>
                      <rect width={SHUTTER} height={CAP} fill="transparent" />
                      {blades(rest[0], rest[1], turns).map((pts, b) => (
                        <polygon
                          key={b}
                          ref={(el) => {
                            bladeRefs.current[b] = el
                          }}
                          points={pts.map(f).join(' ')}
                        />
                      ))}
                    </g>
                  </g>
                </g>
              )
            }
            const g = glyphOf(it.ch)
            const paths = g.d.map((p, k) => (
              <path key={k} d={p} fillRule="evenodd" />
            ))
            return (
              <g key={i} transform={'translate(' + f(it.x) + ' 0)'}>
                <g className="gf-rise" style={rise}>
                  <g
                    className="gf-g gf-flip"
                    onClick={flip}
                    onAnimationEnd={(e) =>
                      e.currentTarget.classList.remove('is-flip')
                    }
                  >
                    <rect width={g.w} height={CAP} fill="transparent" />
                    <g clipPath={'url(#' + upId + ')'}>
                      <g className="gf-half gf-up">{paths}</g>
                    </g>
                    <g clipPath={'url(#' + dnId + ')'}>
                      <g className="gf-half gf-dn">{paths}</g>
                    </g>
                  </g>
                </g>
              </g>
            )
          })}
        </svg>
      </div>
    </footer>
  )
}
