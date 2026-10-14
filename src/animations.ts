import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const ease = 'power3.out'

/**
 * Animations du site, pilotées par des attributs data-* :
 * - data-hero / data-hero-line / data-hero-item : intro du hero
 * - data-reveal : apparition en fondu au scroll
 * - data-stagger : les enfants directs apparaissent en cascade
 * - data-parallax="<px>" : image qui glisse doucement au scroll
 * - data-zoom : image qui se dé-zoome en entrant dans l'écran
 */
export function useSiteAnimations(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Smooth scroll, synchronisé avec ScrollTrigger via le ticker GSAP
      const lenis = new Lenis({
        lerp: 0.09,
        anchors: { offset: -24 },
      })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      const ctx = gsap.context(() => {
        // Intro du hero
        const intro = gsap.timeline({ defaults: { ease, duration: 1.1 } })
        intro
          .from('[data-header]', { y: -20, autoAlpha: 0, duration: 0.8 })
          .from(
            '[data-hero-img]',
            { scale: 1.2, duration: 1.8, ease: 'power2.out' },
            0,
          )
          .from('[data-hero-line]', { yPercent: 110, stagger: 0.12 }, 0.2)
          .from('[data-hero-item]', { y: 24, autoAlpha: 0, stagger: 0.1 }, 0.6)

        // Parallax de l'image du hero
        gsap.to('[data-hero-img]', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-hero]',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        // Apparitions simples
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            ease,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        // Apparitions en cascade
        gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((el) => {
          gsap.from(el.children, {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            ease,
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })

        // Images qui se dé-zooment à l'entrée
        gsap.utils.toArray<HTMLElement>('[data-zoom]').forEach((el) => {
          gsap.from(el, {
            scale: 1.15,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        // Parallax
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const distance = Number(el.dataset.parallax) || 40
          gsap.fromTo(
            el,
            { y: -distance },
            {
              y: distance,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
      }, root)

      // Recalcule les positions une fois les images chargées
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)

      return () => {
        window.removeEventListener('load', refresh)
        ctx.revert()
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    })

    return () => mm.revert()
  }, [root])
}
