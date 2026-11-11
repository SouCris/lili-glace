import { useEffect } from 'react'
import type { RefObject, Dispatch, SetStateAction } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type SceneAnimationRefs = {
  homeCoverRef: RefObject<HTMLDivElement | null>
  sequenciaRef: RefObject<HTMLElement | null>
  cozinhaRef: RefObject<HTMLDivElement | null>
  fritandoRef: RefObject<HTMLDivElement | null>
  coberturaRef: RefObject<HTMLElement | null>
  saboresRef: RefObject<HTMLElement | null>
  recheandoRef: RefObject<HTMLDivElement | null>
  cardsRef: RefObject<HTMLDivElement | null>
  catalogoRef: RefObject<HTMLElement | null>
  finalSceneRef: RefObject<HTMLElement | null>
  headerRef: RefObject<HTMLElement | null>
  desktopVideo: RefObject<HTMLVideoElement | null>
  mobileVideo: RefObject<HTMLVideoElement | null>
  coberturaDesktop: RefObject<HTMLVideoElement | null>
  coberturaMobile: RefObject<HTMLVideoElement | null>
  cortandoDesktop: RefObject<HTMLVideoElement | null>
  cortandoMobile: RefObject<HTMLVideoElement | null>
  recheandoDesktop: RefObject<HTMLVideoElement | null>
  recheandoMobile: RefObject<HTMLVideoElement | null>
  cozinhaDesktop: RefObject<HTMLVideoElement | null>
  cozinhaMobile: RefObject<HTMLVideoElement | null>
  voltarInicioRef: RefObject<(() => void) | null>
  scrollRef: RefObject<ScrollTrigger | null>
  selecionarCenaSaboresRef: RefObject<((index: number) => void) | null>
  cenasMenuRef: RefObject<Record<string, number>>
  etapaSaboresRef: RefObject<number>
  setEtapaSabores: Dispatch<SetStateAction<number>>
  setSaboresAbertos: Dispatch<SetStateAction<boolean>>
  setFinalVideoSource: Dispatch<SetStateAction<string>>
}

export function useSceneAnimations({
  homeCoverRef,
  sequenciaRef,
  cozinhaRef,
  fritandoRef,
  coberturaRef,
  saboresRef,
  recheandoRef,
  cardsRef,
  catalogoRef,
  finalSceneRef,
  headerRef,
  desktopVideo,
  mobileVideo,
  coberturaDesktop,
  coberturaMobile,
  cortandoDesktop,
  cortandoMobile,
  recheandoDesktop,
  recheandoMobile,
  cozinhaDesktop,
  cozinhaMobile,
  voltarInicioRef,
  scrollRef,
  selecionarCenaSaboresRef,
  cenasMenuRef,
  etapaSaboresRef,
  setEtapaSabores,
  setSaboresAbertos,
  setFinalVideoSource,
}: SceneAnimationRefs) {
  useEffect(() => {
    const homeCover = homeCoverRef.current
    const header = headerRef.current
    const raiz = sequenciaRef.current
    const cozinha = cozinhaRef.current
    const fritando = fritandoRef.current
    const cobertura = coberturaRef.current
    const saboresScene = saboresRef.current
    const recheando = recheandoRef.current
    const cards = cardsRef.current

    if (!raiz || !cozinha || !fritando || !cobertura || !saboresScene || !recheando || !cards)
      return

    const updateHeaderContrast = () => {
      const headerBottom = header?.getBoundingClientRect().bottom ?? 110
      const visible = [cozinha, fritando, cobertura, saboresScene].some((scene) => {
        const bounds = scene.getBoundingClientRect()
        return (
          Number(gsap.getProperty(scene, 'opacity')) > 0.15 &&
          bounds.bottom > headerBottom &&
          bounds.top < headerBottom
        )
      })
      header?.classList.toggle('over-kitchen', visible)
    }
    window.addEventListener('scroll', updateHeaderContrast, { passive: true })
    window.addEventListener('resize', updateHeaderContrast)

    const pendingSeek = new Map<HTMLVideoElement, number>()
    const flushSeek = (video: HTMLVideoElement) => {
      const target = pendingSeek.get(video)
      if (
        target === undefined ||
        video.readyState < 2 ||
        video.seeking ||
        !Number.isFinite(video.duration)
      )
        return
      if (Math.abs(video.currentTime - target) > 0.04) video.currentTime = target
    }
    const allVideos = [desktopVideo.current, mobileVideo.current].filter(
      (video): video is HTMLVideoElement => video !== null,
    )
    const mobileVideos = [mobileVideo.current].filter(
      (video): video is HTMLVideoElement => video !== null,
    )
    const autonomousVideos = [
      cozinhaDesktop.current,
      cozinhaMobile.current,
      coberturaDesktop.current,
      coberturaMobile.current,
      cortandoDesktop.current,
      cortandoMobile.current,
      recheandoDesktop.current,
      recheandoMobile.current,
    ].filter((video): video is HTMLVideoElement => video !== null)
    const playbackVideos = [...allVideos, ...autonomousVideos]
    const seekListeners = allVideos.map((video) => {
      const listener = () => flushSeek(video)
      video.addEventListener('seeked', listener)
      return { video, listener }
    })
    let readySync = () => {}
    playbackVideos.forEach((video) => {
      video.addEventListener('loadedmetadata', onReady)
      video.addEventListener('loadeddata', onReady)
      video.addEventListener('canplay', onReady)
    })
    function onReady() {
      readySync()
      allVideos.forEach(flushSeek)
    }

    // Alguns navegadores móveis precisam de uma interação antes de decodificar o vídeo.
    let disposed = false
    const unlocking = new Set<HTMLVideoElement>()
    const unlocked = new Set<HTMLVideoElement>()
    const unlockMobileVideo = () => {
      if (window.innerWidth >= 768) return
      mobileVideos.forEach((video) => {
        if (unlocked.has(video) || unlocking.has(video)) return
        unlocking.add(video)
        video.muted = true
        void video
          .play()
          .then(() => {
            video.pause()
            unlocking.delete(video)
            if (disposed) return
            unlocked.add(video)
            onReady()
          })
          .catch(() => unlocking.delete(video))
      })
    }
    window.addEventListener('touchstart', unlockMobileVideo, { passive: true })
    window.addEventListener('pointerdown', unlockMobileVideo, { passive: true })
    window.addEventListener('wheel', unlockMobileVideo, { passive: true })

    let removeWheelNavigation = () => {}
    let resettingHome = false
    let homeResetFrame = 0
    let cardsTween: gsap.core.Tween | null = null
    let pendingCoating: gsap.core.Tween | null = null
    const transitionTweens = new Map<Element, gsap.core.Tween>()
    const ctx = gsap.context(() => {
      gsap.set(fritando, { yPercent: 100, scale: 1, autoAlpha: 1 })
      gsap.set(cobertura, { yPercent: 100, scale: 1, autoAlpha: 1 })
      gsap.set(saboresScene, { yPercent: 100, autoAlpha: 1 })
      gsap.set(recheando, { autoAlpha: 0 })
      gsap.set(cards.children, { y: 170, autoAlpha: 0 })
      let flavorsVisible = false
      let kitchenVisible = false
      let fryingVisible = false
      let coatingVisible = false
      let fryingEntering = false
      let coatingRequested = false
      let sceneDuration = 1
      let lastSceneTime = 0
      const transitionScene = (scene: Element, visible: boolean) => {
        transitionTweens.get(scene)?.kill()
        if (scene === saboresScene) {
          cardsTween?.kill()
          gsap.set(cards.children, { y: 170, autoAlpha: 0 })
          transitionTweens.get(cobertura)?.kill()
          transitionTweens.set(
            cobertura,
            gsap.to(cobertura, {
              yPercent: visible ? -100 : coatingVisible ? 0 : 100,
              duration: sceneDuration,
              ease: 'power2.inOut',
              overwrite: 'auto',
              onUpdate: updateHeaderContrast,
            }),
          )
          transitionTweens.set(
            scene,
            gsap.to(scene, {
              onComplete: () => {
                if (!visible) return
                cardsTween = gsap.to(cards.children, {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.8,
                  stagger: 0.08,
                  ease: 'power3.out',
                  overwrite: 'auto',
                })
              },
              yPercent: visible ? 0 : 100,
              duration: sceneDuration,
              ease: 'power2.inOut',
              overwrite: 'auto',
              onUpdate: updateHeaderContrast,
            }),
          )
          return
        }
        if (scene === cozinha) {
          if (visible)
            [cozinhaDesktop.current, cozinhaMobile.current].forEach((video) => {
              if (video) video.currentTime = 0
            })
          transitionTweens.set(
            scene,
            gsap.to(scene, {
              yPercent: visible ? 0 : 100,
              duration: sceneDuration,
              ease: 'power2.inOut',
              overwrite: 'auto',
              onUpdate: updateHeaderContrast,
              onComplete: () => {
                syncVideos()
              },
            }),
          )
          return
        }
        // Cena 3: subida completa com duração própria, independente da rodinha.
        if (scene === fritando) {
          pendingCoating?.kill()
          pendingCoating = null
          fryingEntering = visible
          transitionTweens.get(cozinha)?.kill()
          transitionTweens.set(
            cozinha,
            gsap.to(cozinha, {
              yPercent: visible ? -100 : kitchenVisible ? 0 : 100,
              duration: sceneDuration,
              ease: 'power2.inOut',
              overwrite: 'auto',
              onUpdate: updateHeaderContrast,
            }),
          )
          transitionTweens.set(
            scene,
            gsap.to(scene, {
              yPercent: visible ? 0 : 100,
              onComplete: () => {
                if (!visible) return
                // Só liberar a próxima cena depois da subida e de uma breve pausa.
                pendingCoating = gsap.delayedCall(0.35, () => {
                  pendingCoating = null
                  fryingEntering = false
                  if (coatingRequested !== coatingVisible) {
                    coatingVisible = coatingRequested
                    transitionScene(cobertura, coatingRequested)
                  }
                })
              },
              duration: sceneDuration,
              ease: 'power2.inOut',
              overwrite: 'auto',
              onUpdate: updateHeaderContrast,
            }),
          )
          return
        }
        // Cena 4: a fritura sai por cima enquanto a cobertura sobe.
        // Em um retorno direto à cozinha, preservar a saída da cena 3.
        if (fryingVisible) {
          transitionTweens.get(fritando)?.kill()
          transitionTweens.set(
            fritando,
            gsap.to(fritando, {
              yPercent: visible ? -100 : 0,
              duration: sceneDuration,
              ease: 'power2.inOut',
              overwrite: 'auto',
              onUpdate: updateHeaderContrast,
            }),
          )
        }
        transitionTweens.set(
          scene,
          gsap.to(scene, {
            yPercent: visible ? 0 : 100,
            duration: sceneDuration,
            ease: 'power2.inOut',
            overwrite: 'auto',
            onUpdate: updateHeaderContrast,
          }),
        )
      }
      const syncTransitions = () => {
        if (resettingHome) return
        const time = timeline.time()
        sceneDuration = window.innerWidth >= 768 && time < lastSceneTime ? 0.25 : 1
        lastSceneTime = time
        const fryingStart = timeline.labels['frying-start']
        const coatingStart = timeline.labels['coating-start']
        const nextKitchen = time > timeline.labels['hero-end']
        if (nextKitchen !== kitchenVisible) {
          kitchenVisible = nextKitchen
          transitionScene(cozinha, nextKitchen)
        }
        const nextFrying = fryingStart !== undefined && time > fryingStart
        const nextCoating = coatingStart !== undefined && time > coatingStart
        if (nextFrying !== fryingVisible) {
          fryingVisible = nextFrying
          transitionScene(fritando, nextFrying)
        }
        coatingRequested = nextCoating
        if (!fryingEntering && nextCoating !== coatingVisible) {
          coatingVisible = nextCoating
          transitionScene(cobertura, nextCoating)
        }
        const nextFlavorStage =
          time >= (timeline.labels['filling-start'] + timeline.labels['filling-end']) / 2 ? 1 : 0
        if (etapaSaboresRef.current !== nextFlavorStage) {
          etapaSaboresRef.current = nextFlavorStage
          setEtapaSabores(nextFlavorStage)
          setSaboresAbertos(nextFlavorStage === 0)
        }
        const nextFlavors = time > timeline.labels['flavors-start']
        if (nextFlavors !== flavorsVisible) {
          flavorsVisible = nextFlavors
          transitionScene(saboresScene, nextFlavors)
        }
      }

      gsap.set(cozinha, {
        yPercent: 100,
        autoAlpha: 1,
        clipPath: 'none',
        maskImage: 'none',
        WebkitMaskImage: 'none',
      })

      const sincronizarVideo = (video: HTMLVideoElement | null, progresso: number) => {
        if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
          return
        }

        const duracao = Math.max(0, video.duration - 0.08)
        const tempo = Math.max(0, Math.min(duracao, progresso * duracao))

        pendingSeek.set(video, tempo)
        flushSeek(video)
      }

      // Intervalos em tempo da timeline: novas cenas não deslocam o movimento das anteriores.
      const syncVideos = () => {
        const mobile = window.innerWidth < 768
        const time = timeline.time()
        const progressBetween = (start: string, end: string) => {
          const from = timeline.labels[start]
          const to = timeline.labels[end]
          if (from === undefined || to === undefined || to <= from) return 0
          return gsap.utils.clamp(0, 1, (time - from) / (to - from))
        }
        sincronizarVideo(
          mobile ? mobileVideo.current : desktopVideo.current,
          progressBetween('hero-start', 'hero-end'),
        )
        const kitchenActive =
          time > timeline.labels['hero-end'] && time <= timeline.labels['frying-start']
        const coatingActive =
          time > timeline.labels['coating-start'] && time <= timeline.labels['flavors-start']
        const cuttingActive =
          time > timeline.labels['flavors-start'] && time < timeline.labels['filling-end']
        // O fim do trecho fixado não significa que a cena já saiu da tela.
        const sceneBounds = raiz.getBoundingClientRect()
        const sequenceVisible = sceneBounds.bottom > 0 && sceneBounds.top < window.innerHeight
        const fillingActive = time >= timeline.labels['filling-start'] && sequenceVisible
        const playing = [
          kitchenActive ? (mobile ? cozinhaMobile.current : cozinhaDesktop.current) : null,
          coatingActive ? (mobile ? coberturaMobile.current : coberturaDesktop.current) : null,
          cuttingActive ? (mobile ? cortandoMobile.current : cortandoDesktop.current) : null,
          fillingActive ? (mobile ? recheandoMobile.current : recheandoDesktop.current) : null,
        ]
        autonomousVideos.forEach((video) => {
          if (playing.includes(video)) {
            if (video.paused) void video.play().catch(() => {})
          } else if (!video.paused) video.pause()
        })
      }
      const timeline = gsap.timeline({
        onUpdate: () => {
          updateHeaderContrast()
          syncVideos()
          syncTransitions()
        },
        scrollTrigger: {
          trigger: raiz,
          start: 'top top',
          end: () =>
            `+=${window.innerHeight * (window.innerWidth < 768 ? 3.8 : 1.75) * (4.08 / 2.15)}`,
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline.addLabel('hero-start')
      // Etapa 1: a Hero permanece fixa
      timeline.to(
        { valor: 0 },
        {
          valor: 1,
          duration: 0.65,
          ease: 'none',
        },
      )

      timeline.addLabel('hero-end')

      // Etapa 2: a cozinha sobe e substitui a Hero

      timeline.to(
        { entrada: 0 },
        {
          entrada: 1,
          duration: 0.28,
          ease: 'none',
        },
      )

      timeline.addLabel('kitchen-start')

      // Etapa 3: a cozinha permanece fixa
      timeline.to(
        { valor: 0 },
        {
          valor: 1,
          duration: 0.32,
          ease: 'none',
        },
      )

      timeline.addLabel('kitchen-end')

      // A rolagem dispara uma subida com duração independente.
      timeline.addLabel('frying-start')
      timeline.to({ hold: 0 }, { hold: 1, duration: 0.35, ease: 'none' })
      timeline.addLabel('coating-start')
      timeline.to({ hold: 0 }, { hold: 1, duration: 0.55, ease: 'none' })
      timeline.addLabel('flavors-start')
      // A imagem entra sozinha; os cards surgem depois com a rolagem.
      timeline.to({ hold: 0 }, { hold: 1, duration: 0.3, ease: 'none' })
      timeline.addLabel('cards-start')
      timeline.to({ hold: 0 }, { hold: 1, duration: 0.65, ease: 'none' })
      timeline.addLabel('cards-end')
      timeline.to({ hold: 0 }, { hold: 1, duration: 0.18, ease: 'none' })
      timeline.addLabel('filling-start')
      // Só o fundo muda. O contêiner dos cards permanece no mesmo lugar.
      timeline.to(recheando, { autoAlpha: 1, duration: 0.45, ease: 'none' })
      timeline.addLabel('filling-end')
      timeline.to({ hold: 0 }, { hold: 1, duration: 0.35, ease: 'none' })

      scrollRef.current = timeline.scrollTrigger ?? null
      cenasMenuRef.current = {
        preparo:
          (timeline.labels['kitchen-start'] + timeline.labels['kitchen-end']) /
          (2 * timeline.duration()),
        fritando:
          (timeline.labels['frying-start'] + timeline.labels['coating-start']) /
          (2 * timeline.duration()),
        cobertura:
          (timeline.labels['coating-start'] + timeline.labels['flavors-start']) /
          (2 * timeline.duration()),
        sabores: timeline.labels['cards-end'] / timeline.duration(),
      }

      selecionarCenaSaboresRef.current = (index: number) => {
        const st = timeline.scrollTrigger
        if (!st || (index !== 0 && index !== 1)) return
        const targetTime =
          index === 0 ? timeline.labels['cards-end'] : timeline.labels['filling-end'] + 0.01
        st.getTween()?.pause()
        window.scrollTo({
          top: st.start + (targetTime / timeline.duration()) * (st.end - st.start),
          behavior: 'instant',
        })
        st.update()
        st.getTween()?.progress(1)
        etapaSaboresRef.current = index
        setEtapaSabores(index)
        setSaboresAbertos(index === 0)
      }

      // Um gesto de rodinha por troca. Eventos de inércia do mesmo gesto não pulam duas cenas.
      voltarInicioRef.current = () => {
        resettingHome = true
        if (homeResetFrame) cancelAnimationFrame(homeResetFrame)
        if (homeCoverRef.current) gsap.set(homeCoverRef.current, { autoAlpha: 1 })
        // Não percorrer todas as cenas ao clicar na logo ou em Início.
        pendingCoating?.kill()
        pendingCoating = null
        cardsTween?.kill()
        transitionTweens.forEach((tween) => tween.kill())
        transitionTweens.clear()
        kitchenVisible = false
        fryingVisible = false
        fryingEntering = false
        coatingVisible = false
        coatingRequested = false
        flavorsVisible = false
        const st = timeline.scrollTrigger
        st?.getTween()?.pause()
        timeline.time(0, true)
        gsap.set([cozinha, fritando, cobertura, saboresScene], { yPercent: 100, autoAlpha: 1 })
        gsap.set(recheando, { autoAlpha: 0 })
        gsap.set(cards.children, { y: 170, autoAlpha: 0 })
        etapaSaboresRef.current = 0
        setEtapaSabores(0)
        setSaboresAbertos(true)
        window.scrollTo({ top: 0, behavior: 'instant' })
        st?.update()
        st?.getTween()?.progress(1)
        timeline.time(0, true)
        lastSceneTime = 0
        syncVideos()
        updateHeaderContrast()
        forwardConsumed = false
        lockUntil = performance.now() + 200
        homeResetFrame = requestAnimationFrame(() => {
          timeline.time(0, true)
          resettingHome = false
          if (homeCoverRef.current)
            gsap.to(homeCoverRef.current, { autoAlpha: 0, duration: 0.18, overwrite: true })
        })
      }
      const sceneIsMoving = () =>
        !!cardsTween?.isActive() ||
        Array.from(transitionTweens.values()).some((tween) => tween.isActive())
      let lockUntil = 0
      const previousSceneTime = (time: number): number | null => {
        const labels = timeline.labels
        if (time >= labels['filling-start']) return labels['flavors-start'] + 0.04
        if (time > labels['flavors-start'])
          return (labels['coating-start'] + labels['flavors-start']) / 2
        if (time > labels['coating-start'])
          return (labels['frying-start'] + labels['coating-start']) / 2
        if (time > labels['frying-start'])
          return (labels['kitchen-start'] + labels['kitchen-end']) / 2
        if (time > labels['hero-end']) return 0
        return null
      }
      const nextSceneTime = (time: number, step: number): number | null => {
        const l = timeline.labels
        const increment = Math.min(Math.abs(step), 80) / 800
        if (time <= l['hero-end']) {
  if (window.innerWidth < 768) {
    return time < l['hero-end'] - 0.02
      ? l['hero-end'] - 0.01
      : l['kitchen-start']
  }

  return time + increment >= l['hero-end']
    ? l['kitchen-start']
    : time + increment
}

        if (time <= l['frying-start']) return (l['frying-start'] + l['coating-start']) / 2
        if (time < l['coating-start']) return (l['coating-start'] + l['flavors-start']) / 2
        if (time <= l['flavors-start']) return l['flavors-start'] + 0.04
        if (time < l['filling-end']) return l['filling-end'] + 0.01
        if (time < timeline.duration() - 0.001) return timeline.duration()
        return null
      }
      const sceneNumber = (time: number) => {
        const l = timeline.labels
        return time > l['filling-start']
          ? 5
          : time > l['flavors-start']
            ? 4
            : time > l['coating-start']
              ? 3
              : time > l['frying-start']
                ? 2
                : time > l['hero-end']
                  ? 1
                  : 0
      }
      let reverseReadyAt = 0
      let lastForwardInput = -Infinity
      let forwardConsumed = false
      const onSceneWheel = (event: WheelEvent) => {
        const st = timeline.scrollTrigger
        if (!st || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
        if ((event.target as Element | null)?.closest('.site-mobile-menu, dialog')) return
        if (resettingHome) {
          event.preventDefault()
          return
        }
        const now = performance.now()
        if (event.deltaY > 0) {
          if (now - lastForwardInput > 300) forwardConsumed = false
          lastForwardInput = now
          if (forwardConsumed) {
            event.preventDefault()
            return
          }
        } else forwardConsumed = false
        if (window.scrollY < st.start || window.scrollY > st.end) {
          // Uma rolagem muito grande também não atravessa várias seções finais.
          if (event.deltaY > 0) {
            const step =
              event.deltaMode === 1
                ? event.deltaY * 16
                : event.deltaMode === 2
                  ? event.deltaY * window.innerHeight
                  : event.deltaY
            const sections = [
              catalogoRef.current,
              finalSceneRef.current,
              document.getElementById('contato'),
            ]
            const next = sections
              .filter((el): el is HTMLElement => !!el)
              .map((el) => window.scrollY + el.getBoundingClientRect().top)
              .find((top) => top > window.scrollY + 10)
            if (next !== undefined && window.scrollY + step >= next) {
              event.preventDefault()
              forwardConsumed = true
              window.scrollTo({ top: next, behavior: 'instant' })
            }
          }
          return
        }
        const duration = timeline.duration()
        const time = gsap.utils.clamp(
          0,
          duration,
          ((window.scrollY - st.start) / (st.end - st.start)) * duration,
        )
        if (event.deltaY < 0 && window.innerWidth >= 768) {
          event.preventDefault()
          if (now < reverseReadyAt) return
          reverseReadyAt = now + 280
          pendingCoating?.kill()
          pendingCoating = null
          cardsTween?.kill()
          // Finalizar a transição anterior antes de mostrar a cena precedente.
          transitionTweens.forEach((tween) => tween.progress(1))
          const target = previousSceneTime(time) ?? 0
          lockUntil = 0
          window.scrollTo({
            top: st.start + (target / duration) * (st.end - st.start),
            behavior: 'instant',
          })
          st.update()
          st.getTween()?.progress(1)
          return
        }
        const step =
          event.deltaMode === 1
            ? event.deltaY * 16
            : event.deltaMode === 2
              ? event.deltaY * window.innerHeight
              : event.deltaY
        const target = step > 0 ? nextSceneTime(time, step) : previousSceneTime(time)
        // A última cena libera a página imediatamente.
        if (target === null) return
        event.preventDefault()
        if (now < lockUntil || sceneIsMoving()) return
        const changedScene = sceneNumber(time) !== sceneNumber(target)
        if (step > 0 && changedScene) forwardConsumed = true
        lockUntil = changedScene ? now + 650 : now
        window.scrollTo({
          top: st.start + (target / duration) * (st.end - st.start),
          behavior: 'instant',
        })
        st.update()
        st.getTween()?.progress(1)
      }
      window.addEventListener('wheel', onSceneWheel, { passive: false })
      let touchX = 0
      let touchY = 0
      let touchConsumed = false
      const onFlavorTouchStart = (event: TouchEvent) => {
        touchX = event.touches[0]?.clientX ?? 0
        touchY = event.touches[0]?.clientY ?? 0
        touchConsumed = false
      }
      const onFlavorTouchMove = (event: TouchEvent) => {
        if (window.innerWidth >= 768 || event.touches.length !== 1) return
        if ((event.target as Element | null)?.closest('.site-mobile-menu, dialog')) return
        const dx = touchX - event.touches[0].clientX
        const dy = touchY - event.touches[0].clientY
        if (Math.abs(dx) > Math.abs(dy)) return
        const st = timeline.scrollTrigger
        if (!st || window.scrollY < st.start || window.scrollY > st.end) return
        if (touchConsumed || performance.now() < lockUntil) {
          event.preventDefault()
          return
        }
        const time = ((window.scrollY - st.start) / (st.end - st.start)) * timeline.duration()
        const target =
          dy > 0 ? nextSceneTime(time, Math.min(dy, 80)) : dy < 0 ? previousSceneTime(time) : null
        if (target === null && !touchConsumed) return
        event.preventDefault()
        if (
          touchConsumed ||
          Math.abs(dy) < 30 ||
          performance.now() < lockUntil ||
          sceneIsMoving() ||
          target === null
        )
          return
        touchConsumed = true
        if (
  time < timeline.labels['hero-end'] - 0.02 &&
  target < timeline.labels['hero-end']
) {
  lockUntil = performance.now() + 2000

  const movimento = { y: window.scrollY }

  gsap.to(movimento, {
    y: st.start + (target / timeline.duration()) * (st.end - st.start),
    duration: 1.8,
    ease: 'none',
    onUpdate: () => {
      window.scrollTo(0, movimento.y)
      st.update()
      st.getTween()?.progress(1)
    },
  })

  return
}
        lockUntil = performance.now() + (sceneNumber(time) !== sceneNumber(target) ? 2100 : 180)
        window.scrollTo({
          top: st.start + (target / timeline.duration()) * (st.end - st.start),
          behavior: 'instant',
        })
        st.update()
        st.getTween()?.progress(1)
      }
      window.addEventListener('touchstart', onFlavorTouchStart, { passive: true })
      window.addEventListener('touchmove', onFlavorTouchMove, { passive: false })
      window.addEventListener('scroll', syncVideos, { passive: true })
      window.addEventListener('resize', syncVideos)
      window.addEventListener('pointerdown', syncVideos, { passive: true })
      removeWheelNavigation = () => {
        window.removeEventListener('scroll', syncVideos)
        window.removeEventListener('resize', syncVideos)
        window.removeEventListener('pointerdown', syncVideos)
        window.removeEventListener('wheel', onSceneWheel)
        window.removeEventListener('touchstart', onFlavorTouchStart)
        window.removeEventListener('touchmove', onFlavorTouchMove)
      }
      readySync = syncVideos
      readySync()
      unlockMobileVideo()
      syncTransitions()
      if (window.innerWidth < 768) {
        mobileVideos.forEach((video) => {
          if (video.readyState === 0) video.load()
        })
      }
    }, raiz)

    return () => {
      disposed = true
      removeWheelNavigation()
      cancelAnimationFrame(homeResetFrame)
      if (homeCover) gsap.killTweensOf(homeCover)
      window.removeEventListener('scroll', updateHeaderContrast)
      window.removeEventListener('resize', updateHeaderContrast)
      header?.classList.remove('over-kitchen')
      voltarInicioRef.current = null
      scrollRef.current = null
      cenasMenuRef.current = {}
      selecionarCenaSaboresRef.current = null
      pendingCoating?.kill()
      cardsTween?.kill()
      transitionTweens.forEach((tween) => tween.kill())
      transitionTweens.clear()
      ctx.revert()
      readySync = () => {}
      seekListeners.forEach(({ video, listener }) => video.removeEventListener('seeked', listener))
      playbackVideos.forEach((video) => {
        video.removeEventListener('loadedmetadata', onReady)
        video.removeEventListener('loadeddata', onReady)
        video.removeEventListener('canplay', onReady)
      })
      window.removeEventListener('touchstart', unlockMobileVideo)
      window.removeEventListener('pointerdown', unlockMobileVideo)
      window.removeEventListener('wheel', unlockMobileVideo)
      autonomousVideos.forEach((video) => video.pause())
      pendingSeek.clear()
    }
  }, [
    homeCoverRef,
    sequenciaRef,
    cozinhaRef,
    fritandoRef,
    coberturaRef,
    saboresRef,
    recheandoRef,
    cardsRef,
    catalogoRef,
    finalSceneRef,
    headerRef,
    desktopVideo,
    mobileVideo,
    coberturaDesktop,
    coberturaMobile,
    cortandoDesktop,
    cortandoMobile,
    recheandoDesktop,
    recheandoMobile,
    cozinhaDesktop,
    cozinhaMobile,
    voltarInicioRef,
    scrollRef,
    selecionarCenaSaboresRef,
    cenasMenuRef,
    etapaSaboresRef,
    setEtapaSabores,
    setSaboresAbertos,
    setFinalVideoSource,
  ])

  useEffect(() => {
    const section = catalogoRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      const products = gsap.utils.toArray<HTMLElement>('.box-product', section)
      const openingY = () => {
        const width = section.clientWidth
        const height = section.clientHeight
        const imageHeight =
          window.innerWidth < 768
            ? (width * 1.5 * 1024) / 1536
            : Math.max(width / 1536, height / 1024) * 1024
        return height - imageHeight * 0.23
      }
      const measureOpening = () => {
        section.style.setProperty('--box-opening', `${openingY()}px`)
      }
      measureOpening()
      // A janela recorta os produtos na altura da abertura da caixa.
      // Assim eles são revelados de baixo para cima, em vez de só aparecerem.
      const rise = gsap.timeline({ paused: true })
      rise.fromTo(
        products,
        {
          y: (_index: number, element: HTMLElement) => openingY() - element.offsetTop + 12,
          // A leve inclinação pertence ao conjunto: imagem e card sobem juntos.
          rotation: (index: number) => [-5, 3, -3, 5][index],
          transformOrigin: '50% 100%',
        },
        {
          y: (index: number) => (window.innerWidth < 768 ? 0 : [24, -12, 8, 32][index]),
          rotation: 0,
          duration: 1.8,
          stagger: 0.22,
          ease: 'power3.out',
        },
      )
      // Abra o recorte ao concluir a subida para preservar os controles dos cards.
      rise.fromTo(
        section.querySelector('.box-rise-window'),
        {
          clipPath: () => `polygon(0 0, 100% 0, 100% ${openingY()}px, 0 ${openingY()}px)`,
        },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.55,
          ease: 'power2.out',
        },
        1.5,
      )
      rise.to({}, { duration: 0.3 })
      // Disparo na chegada: independente da rodinha e sem espaço extra de pin.
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        end: 'bottom top',
        onRefreshInit: measureOpening,
        onEnter: () => {
  rise.restart()

  if (window.innerWidth < 768) {
    const topo = window.scrollY + section.getBoundingClientRect().top

    window.scrollTo({
      top: topo,
      behavior: 'smooth',
    })
  }
},
        onLeaveBack: () => {
          rise.pause(0)
        },
      })
    }, section)
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refreshFrame)
      ctx.revert()
    }
  }, [catalogoRef])

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 767px)')
    const updateSource = () =>
      setFinalVideoSource(
        breakpoint.matches ? '/cenas/lili-caixinha-mobile.mp4' : '/cenas/lili-caixinha-desktop.mp4',
      )
    breakpoint.addEventListener('change', updateSource)
    const section = finalSceneRef.current
    const ctx = gsap.context(() => {
      if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      // Somente o painel entra com a rolagem. O vídeo toca por conta própria.
      gsap.fromTo(
  '.final-copy',
  { autoAlpha: 0, y: 30 },
  {
    autoAlpha: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  },
)
    }, section ?? undefined)
    return () => {
      breakpoint.removeEventListener('change', updateSource)
      ctx.revert()
    }
  }, [finalSceneRef, setFinalVideoSource])
}
