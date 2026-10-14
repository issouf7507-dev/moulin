import { useRef, useState, type ReactNode } from 'react'
import { useSiteAnimations } from './animations'
import GlyphFooter from './components/GlyphFooter'
import heroImg from './assets/hero-moulin.jpg'
import roueImg from './assets/card-roue.jpg'
import moulinImg from './assets/card-moulin.jpg'
import prodBleImg from './assets/prod-ble.jpg'
import prodCompleteImg from './assets/prod-complete.jpg'
import prodSemouleImg from './assets/prod-semoule.jpg'
import prodMaisImg from './assets/prod-mais.jpg'
import expSoleilImg from './assets/exp-soleil.jpg'
import expRiviereImg from './assets/exp-riviere.jpg'
import expVillageImg from './assets/exp-village.jpg'
import videoImg from './assets/video.jpg'

type IconProps = { className?: string }

function Icon({
  className = 'size-4',
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const WheatIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22V8" />
    <path d="M12 12c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4Zm0 0c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4Z" />
    <path d="M12 17c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4Zm0 0c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4Z" />
    <path d="M12 8c-1.5-1-2-2.5-1-5 1.5 1 2 2.5 1 5Z" />
  </Icon>
)

const MillIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 22l1.5-10h3L15 22" />
    <path d="M12 10 5 3M12 10l7-7M12 10l-7 7M12 10l7 7" />
    <circle cx="12" cy="10" r="1" />
  </Icon>
)

const BreadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 11a4 4 0 0 1 1-8h12a4 4 0 0 1 1 8v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
    <path d="M10 7v2M14 7v2" />
  </Icon>
)

const PinIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
)

const StoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
  </Icon>
)

const TruckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Icon>
)

const SlidersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Icon>
)

const ArrowIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
)

const LogoIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 20 9 9l4 6 3-4 5 9Z" />
  </Icon>
)

const PlayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 5v14l11-7Z" fill="currentColor" />
  </Icon>
)

const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </Icon>
)

const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </Icon>
)

const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Icon>
)

const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
)

const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-stone-100 px-4 py-1.5 text-xs text-stone-700">
      {children}
    </span>
  )
}

function CtaButton({
  href = '#',
  children,
}: {
  href?: string
  children: string
}) {
  return (
    <div className="group flex shrink-0 items-center gap-2">
      <a
        href={href}
        className="rounded-full bg-stone-900 px-6 py-3 text-sm text-white transition duration-300 ease-out group-hover:bg-stone-700"
      >
        {children}
      </a>
      <a
        href={href}
        aria-label={children}
        className="grid size-11 place-items-center rounded-full bg-stone-900 text-white transition duration-300 ease-out group-hover:translate-x-1 group-hover:bg-stone-700"
      >
        <ArrowIcon className="size-4 transition-transform duration-300 ease-out group-hover:rotate-45" />
      </a>
    </div>
  )
}

const products = [
  { name: 'Farine de blé', price: '1 500 F', img: prodBleImg },
  { name: 'Farine complète', price: '1 800 F', img: prodCompleteImg },
  { name: 'Semoule', price: '1 200 F', img: prodSemouleImg },
  { name: 'Farine de maïs', price: '1 000 F', img: prodMaisImg },
]

const gallery = [
  {
    img: expSoleilImg,
    alt: 'Coucher de soleil sur les collines autour du moulin',
  },
  { img: expRiviereImg, alt: 'Rivière et champ de blé au pied du moulin' },
  { img: expVillageImg, alt: 'Village et champs vus depuis le moulin' },
]

const navLinks = [
  { label: 'Le moulin', href: '#moulin' },
  { label: 'Produits', href: '#produits' },
  { label: 'Savoir-faire', href: '#savoir-faire' },
  { label: 'Contact', href: '#contact' },
]

// Coordonnées à remplacer par les vraies informations du moulin.
const contact = {
  phone: '00 00 00 00 00',
  email: 'contact@exemple.com',
  address: 'Adresse du moulin',
  hours: 'Lun – Sam · 7h – 18h',
}

// Pas encore de backend : l'inscription ouvre un e-mail pré-rempli vers le
// moulin. À remplacer par un appel API (Brevo, Mailchimp…) le moment venu.
function subscribe(email: string) {
  const subject = encodeURIComponent('Inscription aux arrivages')
  const body = encodeURIComponent(`Merci de m'inscrire : ${email}`)
  window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
}

const steps = [
  {
    title: 'Sélection du grain',
    text: 'Nous choisissons des céréales de qualité auprès de producteurs de confiance.',
  },
  {
    title: 'Nettoyage',
    text: 'Chaque lot est trié et nettoyé avec soin avant de passer au moulin.',
  },
  {
    title: 'Mouture sur pierre',
    text: 'La meule tourne lentement pour préserver le goût et les nutriments du grain.',
  },
  {
    title: 'Ensachage',
    text: 'La farine est tamisée puis ensachée, prête à rejoindre votre cuisine.',
  },
]

const features = [
  { label: 'Moulu sur pierre', icon: StoneIcon },
  { label: 'Livraison locale', icon: TruckIcon },
  { label: 'Commande sur mesure', icon: SlidersIcon },
]

const badges = [WheatIcon, MillIcon, BreadIcon, PinIcon]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  useSiteAnimations(rootRef)

  return (
    <div id="top" ref={rootRef} className="min-h-svh bg-stone-100 p-2 sm:p-4">
      <div className="mx-auto max-w-[1600px] rounded-[28px] bg-white px-3 pb-10 sm:px-5 sm:pb-16">
        {/* Navigation */}
        <header
          data-header
          className="relative flex items-center justify-between gap-4 py-4 text-sm text-stone-900 sm:py-5"
        >
          <a href="#top" className="flex items-center gap-2 font-medium">
            <LogoIcon className="size-4" />
            Moulin Sako
          </a>
          <p className="hidden text-stone-500 md:block">
            Depuis : <span className="text-stone-900">1923</span>
          </p>
          <nav className="hidden gap-7 sm:flex">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="transition hover:text-stone-500"
              >
                {label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-white sm:hidden"
          >
            {menuOpen ? (
              <CloseIcon className="size-4" />
            ) : (
              <MenuIcon className="size-4" />
            )}
            Menu
          </button>

          <nav
            id="menu-mobile"
            inert={!menuOpen}
            className={`absolute top-full right-0 left-0 z-10 flex origin-top flex-col rounded-[22px] bg-white p-2 shadow-xl ring-1 ring-stone-200 transition duration-300 ease-out sm:hidden ${
              menuOpen
                ? 'translate-y-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
            }`}
          >
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-base transition hover:bg-stone-100"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        {/* Hero */}
        <section
          data-hero
          className="relative isolate flex min-h-[640px] flex-col justify-end overflow-hidden rounded-[22px] p-5 text-white sm:h-[calc(100svh-7rem)] sm:max-h-[860px] sm:p-8 lg:p-10"
        >
          <img
            src={heroImg}
            alt="Moulin en pierre au coucher du soleil, entouré de champs de blé et d'une rivière"
            data-hero-img
            className="absolute inset-0 -z-20 size-full object-cover object-[42%_center]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

          <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[auto_1fr]">
            <h1 className="text-5xl leading-[0.98] font-light tracking-[-0.04em] sm:text-7xl lg:whitespace-nowrap xl:text-[92px]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-line className="block">
                  Le goût du grain,
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-line className="block">
                  moulu avec soin
                </span>
              </span>
            </h1>

            <p
              data-hero-item
              className="max-w-sm text-sm leading-relaxed text-white/90 sm:text-base lg:self-end lg:justify-self-end"
            >
              Nous sélectionnons les meilleurs grains et les moulons lentement,
              à la meule de pierre, pour des farines saines, savoureuses et
              pleines de caractère.
            </p>

            <div data-hero-item className="flex flex-wrap items-center gap-5">
              <p className="text-sm leading-tight">
                Farines &amp; céréales
                <br />
                100 % artisanales
              </p>
              <div className="flex gap-1.5 rounded-full bg-white/15 p-1.5 backdrop-blur-md">
                {badges.map((BadgeIcon, i) => (
                  <span
                    key={i}
                    className="grid size-9 place-items-center rounded-full bg-white/15"
                  >
                    <BadgeIcon className="size-4" />
                  </span>
                ))}
              </div>
            </div>

            <ul
              data-hero-item
              className="flex flex-wrap gap-2 lg:justify-end lg:self-center"
            >
              {features.map(({ label, icon: FeatureIcon }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs backdrop-blur-md sm:text-sm"
                >
                  <FeatureIcon className="size-4" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Intro */}
        <section
          id="moulin"
          className="mt-12 grid gap-8 px-1 sm:mt-16 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-10"
        >
          <div data-reveal>
            <Tag>Découvrir</Tag>
            <h2 className="mt-6 max-w-md text-3xl leading-tight font-normal tracking-tight text-stone-900 sm:text-4xl">
              Des farines d'exception{' '}
              <span className="text-stone-400">
                nées au cœur de notre moulin.
              </span>
            </h2>
            <div className="mt-8">
              <CtaButton href="#produits">Voir nos produits</CtaButton>
            </div>
          </div>

          <div data-stagger className="grid gap-4 sm:grid-cols-2">
            <article className="relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-[22px] p-5 text-white">
              <img
                src={roueImg}
                alt="Roue à aubes du moulin au bord de la rivière"
                data-zoom
                className="absolute inset-0 -z-20 size-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="flex items-end justify-between gap-4">
                <p className="text-lg leading-snug">
                  Visitez le moulin
                  <br />
                  et son savoir-faire.
                </p>
                <a
                  href="#video"
                  aria-label="Voir le moulin en vidéo"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-stone-900 transition duration-300 ease-out hover:scale-110 hover:rotate-45"
                >
                  <ArrowIcon />
                </a>
              </div>
            </article>

            <article className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-[22px]">
                <img
                  src={moulinImg}
                  alt="Sacs de farine devant le moulin en pierre"
                  data-zoom
                  className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-56"
                  loading="lazy"
                />
                <span className="absolute top-3 right-3 rounded-full border border-white/60 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md">
                  Moulu sur pierre
                </span>
              </div>
              <p className="px-2 text-center text-sm leading-relaxed text-stone-600">
                Chaque sac raconte une histoire : celle d'un grain choisi avec
                soin et d'un geste transmis de génération en génération.
              </p>
            </article>
          </div>
        </section>

        {/* Produits */}
        <section id="produits" className="mt-24 sm:mt-32">
          <div data-reveal className="px-1">
            <Tag>Nos produits</Tag>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-xl text-4xl leading-[1.05] font-normal tracking-tight text-stone-900 sm:text-6xl">
                Trouvez la farine
                <br />
                qu'il vous faut
              </h2>
              <CtaButton href="#contact">Passer commande</CtaButton>
            </div>
          </div>

          <div
            data-stagger
            className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            {products.map(({ name, price, img }) => (
              <a
                key={name}
                href="#contact"
                className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[22px] p-4 text-white sm:p-5"
              >
                <img
                  src={img}
                  alt={name}
                  className="absolute inset-0 -z-20 size-full object-cover transition duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-white text-stone-900 transition duration-300 ease-out group-hover:rotate-45 sm:top-5 sm:right-5">
                  <ArrowIcon />
                </span>
                <h3 className="text-base font-medium sm:text-lg">{name}</h3>
                <p className="mt-1 text-xs text-white/80 sm:text-sm">
                  <span className="font-medium text-white">{price}</span> / kg
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Savoir-faire */}
        <section
          id="savoir-faire"
          className="mt-24 grid gap-8 px-1 sm:mt-32 lg:grid-cols-[180px_1fr] lg:gap-10"
        >
          <div data-reveal>
            <Tag>Savoir-faire</Tag>
          </div>
          <div>
            <p
              data-reveal
              className="max-w-4xl text-2xl leading-snug tracking-tight text-stone-400 sm:text-4xl"
            >
              <span className="text-stone-900">
                Avec l'amour du grain et du travail bien fait,
              </span>{' '}
              nous produisons des farines qui nourrissent, rassemblent et se
              transmettent.
            </p>

            <div data-stagger className="mt-10 grid gap-3 sm:grid-cols-3">
              {gallery.map(({ img, alt }) => (
                <img
                  key={alt}
                  src={img}
                  alt={alt}
                  className="aspect-[3/2] w-full rounded-[22px] object-cover"
                  loading="lazy"
                />
              ))}
            </div>

            <div
              data-reveal
              className="mt-8 flex flex-wrap items-center justify-between gap-6"
            >
              <p className="max-w-xs text-sm text-stone-600">
                Besoin d'une commande en gros ou d'un mélange sur mesure pour
                votre boulangerie ?
              </p>
              <CtaButton href="#contact">Nous contacter</CtaButton>
            </div>
          </div>
        </section>

        {/* Processus */}
        <section className="mt-24 px-1 sm:mt-32">
          <div data-reveal>
            <Tag>Notre processus</Tag>
            <h2 className="mt-6 max-w-xl text-4xl leading-[1.05] font-normal tracking-tight text-stone-900 sm:text-6xl">
              Du grain
              <br />à la farine
            </h2>
          </div>

          <ol
            data-stagger
            className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map(({ title, text }, i) => (
              <li
                key={title}
                className="flex min-h-56 flex-col justify-between rounded-[22px] bg-stone-100 p-6 transition-colors duration-300 hover:bg-stone-200/70"
              >
                <span className="text-sm text-stone-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-xl tracking-tight text-stone-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Vidéo */}
        <section id="video" className="mt-24 sm:mt-32">
          <div data-reveal className="px-1">
            <Tag>Vidéo</Tag>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-xl text-4xl leading-[1.05] font-normal tracking-tight text-stone-900 sm:text-6xl">
                Le moulin
                <br />
                en mouvement
              </h2>
              <p className="max-w-60 text-sm text-stone-600 sm:text-right">
                Un aperçu de notre savoir-faire, du grain jusqu'à la farine.
              </p>
            </div>
          </div>

          <div
            data-reveal
            className="relative mt-10 overflow-hidden rounded-[22px]"
          >
            <img
              src={videoImg}
              alt="Vue d'ensemble du moulin au coucher du soleil"
              data-zoom
              className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]"
              loading="lazy"
            />
            <button
              type="button"
              aria-label="Lire la vidéo"
              className="absolute inset-0 m-auto grid size-20 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/30 duration-300 ease-out"
            >
              <PlayIcon className="size-7 translate-x-0.5" />
            </button>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="relative isolate mt-24 overflow-hidden rounded-[22px] p-6 text-white sm:mt-32 sm:p-10 lg:p-14"
        >
          <img
            src={heroImg}
            alt=""
            data-parallax="48"
            className="absolute inset-x-0 -inset-y-16 -z-20 h-[calc(100%+8rem)] w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 -z-10 bg-black/55" />

          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div data-reveal>
              <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs backdrop-blur-md">
                Contact
              </span>
              <h2 className="mt-6 text-4xl leading-[1.05] font-light tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                Une commande ?
                <br />
                Parlons-en.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                Particuliers, boulangeries ou restaurants : contactez-nous pour
                une commande, un tarif en gros ou un mélange sur mesure.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-stone-900 transition hover:bg-stone-200"
                >
                  <PhoneIcon className="size-4" />
                  Appeler
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm backdrop-blur-md transition hover:bg-white/20"
                >
                  <MailIcon className="size-4" />
                  Écrire un e-mail
                </a>
              </div>
            </div>

            <ul
              data-reveal
              className="grid gap-2 rounded-[22px] border border-white/20 bg-white/10 p-2 backdrop-blur-md"
            >
              {[
                { icon: PhoneIcon, label: 'Téléphone', value: contact.phone },
                { icon: MailIcon, label: 'E-mail', value: contact.email },
                { icon: PinIcon, label: 'Adresse', value: contact.address },
                { icon: ClockIcon, label: 'Horaires', value: contact.hours },
              ].map(({ icon: InfoIcon, label, value }) => (
                <li
                  key={label}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15">
                    <InfoIcon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-white/60">{label}</p>
                    <p className="truncate">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pied de page */}
        <div className="mt-16">
          <GlyphFooter
            wordmark="Sako"
            label="Moulin Sako"
            shutterAt={3}
            company="Moulin Sako"
            since={1923}
            signupLabel="Recevez nos arrivages et tarifs de saison"
            placeholder="Votre e-mail"
            doneLabel="E-mail prêt à envoyer"
            onSubscribe={subscribe}
            primaryLinks={navLinks}
            secondaryLinks={[
              {
                label: 'Appeler',
                href: `tel:${contact.phone.replace(/\s/g, '')}`,
              },
              { label: 'E-mail', href: `mailto:${contact.email}` },
              { label: 'Haut de page', href: '#top' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default App
