import { useSceneAnimations } from './hooks/useSceneAnimations'
import { CartDialog } from './components/CartDialog'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { WHATSAPP_LOJA } from './config/contact'
import { sabores, produtos } from './data/products'
import { moeda } from './utils/currency'
import './styles/site.css'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Para uma loja real, preencher com país + DDD + número, somente dígitos.
// Vazio no portfólio: mostra a prévia, sem abrir ou enviar para outro número.

function App() {
  const homeCoverRef = useRef<HTMLDivElement>(null)
  const sequenciaRef = useRef<HTMLElement>(null)
  const cozinhaRef = useRef<HTMLDivElement>(null)
  const fritandoRef = useRef<HTMLDivElement>(null)
  const coberturaRef = useRef<HTMLElement>(null)
  const saboresRef = useRef<HTMLElement>(null)
  const recheandoRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const catalogoRef = useRef<HTMLElement>(null)
  const finalSceneRef = useRef<HTMLElement>(null)
  const [finalVideoSource, setFinalVideoSource] = useState(() =>
    window.matchMedia('(max-width: 767px)').matches
      ? '/cenas/lili-caixinha-mobile.mp4'
      : '/cenas/lili-caixinha-desktop.mp4',
  )
  const [cardAtual, setCardAtual] = useState(0)
  const moverCard = (direcao: number) => {
    const lista = cardsRef.current
    if (!lista) return
    const destino = Math.max(0, Math.min(3, cardAtual + direcao))
    const primeiro = lista.children[0] as HTMLElement
    const card = lista.children[destino] as HTMLElement
    lista.scrollTo({ left: card.offsetLeft - primeiro.offsetLeft, behavior: 'smooth' })
  }
  const atualizarCardAtual = () => {
    const lista = cardsRef.current
    if (!lista || window.innerWidth >= 768) return
    const primeiro = lista.children[0] as HTMLElement
    const segundo = lista.children[1] as HTMLElement
    const passo = segundo.offsetLeft - primeiro.offsetLeft
    if (passo > 0) setCardAtual(Math.max(0, Math.min(3, Math.round(lista.scrollLeft / passo))))
  }
  const [etapaSabores, setEtapaSabores] = useState(0)
  const [saboresAbertos, setSaboresAbertos] = useState(true)
  const etapaSaboresRef = useRef(0)
  const cardsRecolhidos = etapaSabores === 1 && !saboresAbertos
  const [caixa, setCaixa] = useState<number[]>([0, 0, 0, 0])
  const [caixaAberta, setCaixaAberta] = useState(false)
  const [previaPedido, setPreviaPedido] = useState(false)
  const caixaDialog = useRef<HTMLDialogElement>(null)
  const quantidadeTotal = caixa.reduce((total, quantidade) => total + quantidade, 0)
  const valorTotal = caixa.reduce(
    (total, quantidade, index) => total + quantidade * produtos[index].preco,
    0,
  )
  const mensagemPedido = [
    'Olá, Lili & Glacê! Gostaria de pedir esta caixinha:',
    '',
    ...produtos.flatMap((produto, index) =>
      caixa[index] > 0
        ? [`${caixa[index]} × ${produto.nome} — ${moeda(produto.preco * caixa[index])}`]
        : [],
    ),
    '',
    `Subtotal dos donuts: ${moeda(valorTotal)}`,
    'Gostaria de combinar a forma de pagamento e a entrega. Qual o valor do frete?',
  ].join('\n')
  const enviarPedido = () => {
    if (quantidadeTotal === 0) return
    const numero = WHATSAPP_LOJA.replace(/\D/g, '')
    if (!numero) {
      setPreviaPedido(true)
      return
    }
    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensagemPedido)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }
  const abrirCaixa = () => {
    setPreviaPedido(false)
    setCaixaAberta(true)
    setMenuAberto(false)
  }
  useEffect(() => {
    const dialog = caixaDialog.current
    if (!dialog) return
    if (caixaAberta) dialog.showModal()
    else dialog.close()
    const overflow = document.body.style.overflow
    if (caixaAberta) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [caixaAberta])
  const headerRef = useRef<HTMLElement>(null)

  const desktopVideo = useRef<HTMLVideoElement>(null)
  const mobileVideo = useRef<HTMLVideoElement>(null)
  const coberturaDesktop = useRef<HTMLVideoElement>(null)
  const coberturaMobile = useRef<HTMLVideoElement>(null)
  const cortandoDesktop = useRef<HTMLVideoElement>(null)
  const cortandoMobile = useRef<HTMLVideoElement>(null)
  const recheandoDesktop = useRef<HTMLVideoElement>(null)
  const recheandoMobile = useRef<HTMLVideoElement>(null)
  const cozinhaDesktop = useRef<HTMLVideoElement>(null)
  const cozinhaMobile = useRef<HTMLVideoElement>(null)
  const fritandoDesktop = useRef<HTMLVideoElement>(null)
  const fritandoMobile = useRef<HTMLVideoElement>(null)

  const voltarInicioRef = useRef<(() => void) | null>(null)
  const scrollRef = useRef<ScrollTrigger | null>(null)
  const selecionarCenaSaboresRef = useRef<((index: number) => void) | null>(null)
  const cenasMenuRef = useRef<Record<string, number>>({})

  const [menuAberto, setMenuAberto] = useState(false)

  const navegar = (id: string) => {
    setMenuAberto(false)

    // A seção está fixada: sua posição visual não representa o início da timeline.
    if (id === 'inicio') {
      if (voltarInicioRef.current) voltarInicioRef.current()
      else window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const progress = cenasMenuRef.current[id]
    if (progress !== undefined && scrollRef.current) {
      const st = scrollRef.current
      window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: 'instant' })
      st.update()
      st.getTween()?.progress(1)
      return
    }

    if (id === 'caixa' && catalogoRef.current) {
    if (window.innerWidth >= 768) {
    catalogoRef.current.dataset.entradaDireta = 'true'}

    const top = window.scrollY + catalogoRef.current.getBoundingClientRect().top
    window.scrollTo({ top, behavior: 'instant' })
    ScrollTrigger.update()
    return
}

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  useSceneAnimations({
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
  })

  return (
    <main className="overflow-x-hidden bg-[#fff0ed] text-[#5b352d]">
      <div
        ref={homeCoverRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[150] bg-[#fff0ed] opacity-0"
      />

      {/* FAIXA SUPERIOR FIXA EM TODAS AS SEÇÕES */}
      <div className="site-announcement pointer-events-none fixed inset-x-0 top-0 z-[90] flex h-7 items-center justify-center bg-[#643b32] px-4 text-center text-[9px] font-bold tracking-[0.12em] text-white md:text-[11px]">
        FEITOS COM AMOR • DONUTS ARTESANAIS • DOCES MOMENTOS
      </div>

      <Header
        headerRef={headerRef}
        navegar={navegar}
        abrirCaixa={abrirCaixa}
        quantidadeTotal={quantidadeTotal}
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
      />

      {/* SEQUÊNCIA CINEMATOGRÁFICA */}
      <section
        ref={sequenciaRef}
        id="inicio"
        className="relative isolate h-[100svh] min-h-[550px] overflow-hidden bg-[#f6aebc]"
      >
        {/* CENA 1 — LILI LANÇANDO O DONUT */}

        <video
          ref={desktopVideo}
          src="/cenas/lili-desktop.mp4"
          muted
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        />

        <video
          ref={mobileVideo}
          src="/cenas/lili-desktop.mp4"
          poster="/cenas/lili-inicio.png"
          muted
          playsInline
          preload="auto"
          className="hero-video-mobile pointer-events-none absolute bottom-0 left-0 h-[74%] w-full object-cover md:hidden"
        />

        {/* SOMBRA PARA LEGIBILIDADE */}
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#ffd7df]/75 via-[#ffd7df]/20 to-transparent md:block" />

        <div className="hero-shade-mobile pointer-events-none absolute inset-x-0 top-0 h-[43%] bg-gradient-to-b from-[#ffc0cd]/80 to-transparent md:hidden" />

        {/* TEXTOS DA HERO */}
        <div
          className="hero-copy absolute inset-x-5 top-[115px] z-20 text-center md:inset-x-auto md:left-[13%] md:top-1/2 md:w-[43%] 
        md:-translate-y-1/2 md:text-left"
        >
          <span className="mb-3 inline-block rounded-full bg-white/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] md:mb-5 md:text-xs">
            Donuts artesanais feitos com carinho
          </span>

          <h1
            className="text-[clamp(2rem,8.3vw,3.1rem)] font-black leading-[1.12] tracking-tight text-white md:text-[clamp(3.2rem,4.5vw,5rem)]"
            style={{
              WebkitTextStroke: '1.5px #60382f',
              textShadow: '3px 4px 0 #60382f',
            }}
          >
            Momentos doces.
            <br />
            Corações{' '}
            <span className="relative inline-block">
              felizes.
              <svg
                className="pointer-events-none absolute -bottom-3 left-0 h-3 w-full overflow-visible"
                viewBox="0 0 220 24"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M8 16 Q110 4 212 14"
                  fill="none"
                  stroke="#F45B87"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-[390px] text-xs font-medium leading-relaxed md:mx-0 md:mt-6 md:text-base">
            Donuts fresquinhos, coberturas irresistíveis e muito carinho em cada mordida. Descubra
            um mundo de sabores e alegria!
          </p>

          <button
            onClick={() => navegar('sabores')}
            className="hero-shine mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#643b32] px-7 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg transition-transform hover:scale-105 md:mt-7 md:px-9 md:py-4 md:text-sm"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14l-2 9H7l-2-9Z" />
              <path d="M6 12c-1-2 0-4 2-4 0-2 1.7-3 4-3s4 1 4 3c2 0 3 2 2 4" />
              <circle cx="12" cy="3" r="1" />
            </svg>
            Conheça nossas delícias
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        {/* CENA 2 — COZINHA SUBINDO SOBRE A HERO */}
        <div
          ref={cozinhaRef}
          id="preparo"
          className="absolute inset-0 z-40 overflow-hidden bg-[#fff4ec]"
        >
          <video
            ref={cozinhaDesktop}
            loop
            src="/cenas/lili-cozinha-desktop.mp4"
            muted
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-center md:block"
          />

          <video
            ref={cozinhaMobile}
            loop
            src="/cenas/lili-cozinha-mobile.mp4"
            muted
            playsInline
            preload="auto"
            className="kitchen-video-mobile pointer-events-none absolute inset-x-0 top-[7%] h-[78%] w-full object-contain md:hidden"
          />

          {/* ILUMINAÇÃO SUAVE PARA OS TEXTOS */}
          <div className="kitchen-light pointer-events-none absolute inset-y-0 left-0 z-[1] hidden w-[58%] bg-gradient-to-r from-[#F9E1D3]/85 via-[#F9E1D3]/35 to-transparent md:block" />

          {/* TEXTO DA COZINHA */}
          <div
            className="kitchen-copy absolute inset-x-5 bottom-[5%] z-10 text-center md:inset-x-auto md:bottom-auto md:top-[15%]
          md:left-[14%] md:max-w-[540px] md:text-left"
          >
            <span
              className="rounded-full bg-white/80 px-4 py-2 text-[10px] font-black uppercase 
            tracking-widest text-[#c86a86] md:text-xs"
            >
              Feito com amor desde o começo
            </span>

            <h2 className="mt-5 text-4xl font-black leading-tight text-[#643b32] md:text-6xl">
              Da massa à magia.
            </h2>

            <p className="mt-4 max-w-[320px] text-base font-medium leading-relaxed text-[#4A2921]">
              Cada ingrediente é preparado com carinho para transformar pequenos momentos em grandes
              alegrias.
            </p>
          </div>
        </div>

        {/* CENA 3 — LILI FRITANDO OS DONUTS */}
        <div
          ref={fritandoRef}
          id="fritando"
          className="absolute inset-0 z-[45] overflow-hidden bg-[#fff4ec]"
        >
          <video
            ref={fritandoDesktop}
            src="/cenas/lili-fritando-desktop.mp4"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 hidden h-full w-full object-cover md:block"
          />

          <video
            ref={fritandoMobile}
            src="/cenas/lili-fritando-mobile.mp4"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover md:hidden"
          />
          <div className="frying-copy pointer-events-none absolute left-6 top-[126px] z-10 max-w-[220px] text-left text-[#4a2921] md:left-[13%] md:top-[29%] md:max-w-[380px]">
            <h2 className="text-[27px] font-black leading-[1.1] tracking-tight md:text-[clamp(2rem,3vw,3rem)]">
              Douradinhos
              <br />
              no ponto certo.
            </h2>
            <p className="mt-3 max-w-[210px] text-[13px] font-medium leading-relaxed md:mt-5 md:max-w-[320px] md:text-base">
              Fofinhos por dentro, feitos para encantar a cada mordida.
            </p>
          </div>
        </div>

        {/* CENA 4 — UMA CHUVA DE DOÇURA */}
        <section
          ref={coberturaRef}
          id="cobertura"
          className="absolute inset-0 z-[50] overflow-hidden bg-[#fff2ec] opacity-0"
        >
          {/* IMAGEM DESKTOP — TELA INTEIRA */}
          <img
            src="/cenas/lili-cobertura-desktop.png"
            alt="Lili decorando donuts com chocolate"
            className="coverage-background absolute inset-0 h-full w-full object-cover object-center"
          />

          <video
            ref={coberturaDesktop}
            src="/cenas/lili-cobertura-desktop.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            className="coverage-background pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-center md:block"
          />
          <video
            ref={coberturaMobile}
            src="/cenas/lili-cobertura-mobile.mp4"
            poster="/cenas/lili-cobertura-mobile.png"
            muted
            loop
            playsInline
            preload="metadata"
            className="coverage-background pointer-events-none absolute inset-0 h-full w-full object-cover object-center md:hidden"
          />

          {/* DEGRADÊ SUAVE */}
          <div className="coverage-shade pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fff2ec] from-[12%] via-[#fff2ec]/90 via-[34%] to-transparent to-[68%]" />

          {/* CONTEÚDO */}
          <div className="coverage-copy relative z-10 flex flex-col items-start justify-center px-7 pb-12 pt-8 md:absolute md:inset-y-0 md:left-[13%] md:w-[36%] md:p-0">
            <span className="text-sm font-bold tracking-wide text-[#c65f80]">
              ✨ O toque mais doce
            </span>

            <h2 className="mt-5 text-4xl font-black leading-[1.1] tracking-tight text-[#643b32] md:text-[clamp(3rem,4vw,4.5rem)]">
              Uma chuva de doçura!
            </h2>

            <p className="mt-6 max-w-[350px] text-base leading-relaxed text-[#76554b] md:text-lg">
              Cada cobertura, um carinho. Cada donut, um momento especial.
            </p>

            <button
              onClick={() => navegar('sabores')}
              className="mt-8 inline-flex cursor-pointer items-center gap-3 rounded-full bg-[#643b32] px-7 py-4 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              Conheça nossos sabores
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </button>
          </div>
        </section>

        {/* CENAS 5 E 6 — FUNDO COMPARTILHADO, CARDS FIXOS */}
        <section
          ref={saboresRef}
          id="sabores"
          className="flavors-scene absolute inset-0 z-[55] overflow-hidden bg-[#f8d3d8]"
          aria-label="Escolha seus sabores"
        >
          <div className="absolute inset-0 h-full w-full">
            <video
              ref={cortandoDesktop}
              src="/cenas/lili-cortando-donut-desktop.mp4"
              poster="/cenas/lili-cortando-donut-desktop.png"
              aria-label="Lili cortando um donut"
              muted
              loop
              playsInline
              preload="metadata"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover hidden md:block"
            />
            <video
              ref={cortandoMobile}
              src="/cenas/lili-cortando-donut-mobile.mp4"
              poster="/cenas/lili-cortando-donut-mobile.png"
              aria-label="Lili cortando um donut"
              muted
              loop
              playsInline
              preload="metadata"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover block md:hidden"
            />
          </div>
          <div ref={recheandoRef} className="absolute inset-0 h-full w-full">
            <video
              ref={recheandoDesktop}
              src="/cenas/lili-recheando-desktop.mp4"
              poster="/cenas/lili-recheando-desktop.png"
              aria-label="Lili recheando um donut"
              muted
              loop
              playsInline
              preload="metadata"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover hidden md:block"
            />
            <video
              ref={recheandoMobile}
              src="/cenas/lili-recheando-mobile.mp4"
              poster="/cenas/lili-recheando-mobile.png"
              aria-label="Lili recheando um donut"
              muted
              loop
              playsInline
              preload="metadata"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover block md:hidden"
            />
          </div>
          <div className={`flavor-dock${cardsRecolhidos ? ' is-collapsed' : ''}`}>
            <div className="flavor-dots" role="group" aria-label="Escolher cena dos sabores">
              {['Lili cortando o donut', 'Lili recheando o donut'].map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  aria-pressed={etapaSabores === index}
                  className={etapaSabores === index ? 'active' : ''}
                  onClick={() => selecionarCenaSaboresRef.current?.(index)}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
            {etapaSabores === 1 && (
              <button
                className="flavor-toggle"
                aria-expanded={!cardsRecolhidos}
                aria-controls="cards-sabores"
                onClick={() => setSaboresAbertos((abertos) => !abertos)}
              >
                {cardsRecolhidos ? 'Ver sabores' : 'Ocultar sabores'}{' '}
                <span aria-hidden="true">{cardsRecolhidos ? '⌃' : '⌄'}</span>
              </button>
            )}

            <div
              id="cards-sabores"
              onScroll={atualizarCardAtual}
              inert={cardsRecolhidos}
              ref={cardsRef}
              className="flavor-cards"
              role="region"
              aria-label="Escolha seus sabores"
              tabIndex={0}
            >
              <article className="flavor-card flavor-intro">
                <span className="flavor-eyebrow">Feitos com carinho</span>
                <h2>Qual é o seu favorito?</h2>
                <p>Três delícias artesanais para montar uma caixa do seu jeitinho.</p>
                <span className="flavor-signature">Um carinho em cada mordida ♡</span>
              </article>
              {sabores.map((sabor, index) => (
                <article className="flavor-card" key={sabor.nome}>
                  <img
                    className="flavor-image"
                    src={sabor.imagem}
                    alt={sabor.nome}
                    width="1280"
                    height="1280"
                  />
                  <div className="flavor-description">
                    <h2>{sabor.nome}</h2>
                    <p>{sabor.descricao}</p>
                  </div>
                  <button
                    onClick={() =>
                      setCaixa((atual) =>
                        atual.map((quantidade, i) => (i === index ? quantidade + 1 : quantidade)),
                      )
                    }
                  >
                    Adicionar à caixa <span aria-hidden="true">＋</span>
                  </button>
                  <span className="flavor-status" aria-live="polite">
                    {caixa[index] > 0 ? `${caixa[index]} na sua caixa` : '\u00a0'}
                  </span>
                </article>
              ))}
            </div>
            <div className="flavor-controls" inert={cardsRecolhidos}>
              <button
                aria-label="Sabor anterior"
                disabled={cardAtual === 0}
                onClick={() => moverCard(-1)}
              >
                ‹
              </button>
              <span>
                Deslize para ver os sabores<strong aria-live="polite">{cardAtual + 1} de 4</strong>
              </span>
              <button
                aria-label="Próximo sabor"
                disabled={cardAtual === 3}
                onClick={() => moverCard(1)}
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </section>

      <section
        id="caixa"
        ref={catalogoRef}
        className="box-section"
        aria-label="Monte sua caixa de donuts"
      >
        <img
          className="box-background"
          src="/cenas/fundo-monte-sua-caixa-desktop.png"
          alt=""
          width="1536"
          height="1024"
          loading="lazy"
        />
        <div className="box-rise-window">
          <h2 className="box-heading">Escolha seus favoritos</h2>
          <div className="box-grid">
            {produtos.map((produto, index) => (
              <article className="box-product" key={produto.nome}>
                <img
                  className="box-donut"
                  src={produto.imagem}
                  alt={produto.nome}
                  width="1280"
                  height="1280"
                  loading="lazy"
                />
                <div className="box-details">
                  <h3>{produto.nome}</h3>
                  <p>{produto.descricao}</p>
                  <strong className="box-price">{moeda(produto.preco)}</strong>

                  <div className="box-quantity" aria-label={`Quantidade de ${produto.nome}`}>
                    <button
                      aria-label={`Remover um ${produto.nome}`}
                      disabled={caixa[index] === 0}
                      onClick={() =>
                        setCaixa((atual) =>
                          atual.map((q, i) => (i === index ? Math.max(0, q - 1) : q)),
                        )
                      }
                    >
                      −
                    </button>
                    <output aria-live="polite">{caixa[index]}</output>
                    <button
                      aria-label={`Adicionar um ${produto.nome}`}
                      onClick={() =>
                        setCaixa((atual) => atual.map((q, i) => (i === index ? q + 1 : q)))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="sua-caixa"
        ref={finalSceneRef}
        aria-labelledby="final-heading"
        className="final-scene relative isolate min-h-[640px] h-[100svh] overflow-hidden bg-[#fac4c6]"
      >
        <div className="final-panel absolute inset-0">
          <video
            key={finalVideoSource}
            src={finalVideoSource}
            onLoadedData={(event) => {
              // Mesma cor do próprio vídeo nas bordas, sem uma faixa rosa diferente.
              try {
                const canvas = document.createElement('canvas')
                canvas.width = canvas.height = 1
                const context = canvas.getContext('2d')
                if (!context) return
                context.drawImage(event.currentTarget, 0, 0, 1, 1, 0, 0, 1, 1)
                const [r, g, b] = context.getImageData(0, 0, 1, 1).data
                if (finalSceneRef.current)
                  finalSceneRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`
              } catch {
                /* O fundo rosa permanece caso o navegador bloqueie a leitura. */
              }
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className="final-video absolute w-full"
          />
          <svg
            className="final-watermarks"
            viewBox="0 0 800 800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <g transform="translate(115 160) rotate(-15)">
              <circle r="43" />
              <circle r="14" />
              <path d="M-32-12l10 4M9-30l4 10M24 15l-10 5M-15 26l-6-7" />
            </g>
            <path d="M440 125c-22-35-62-7-37 20l37 33 37-33c25-27-15-55-37-20Z" />
            <g transform="translate(660 260) rotate(20)">
              <circle r="33" />
              <circle r="11" />
              <path d="M-20-12l7 3M10-21l2 8M15 17l-8 3" />
            </g>
            <path d="M105 620c-16-25-45-5-27 15l27 24 27-24c18-20-11-40-27-15Z" />
            <g transform="translate(565 675)">
              <circle r="45" />
              <circle r="15" />
              <path d="M-31-15l10 3M12-31l3 10M28 16l-10 4" />
            </g>
            <path d="M280 90l7 12m-13-6h19M700 460l7 12m-13-6h19M300 730l7 12m-13-6h19" />
          </svg>
          <div className="final-copy relative z-10 mx-auto flex h-full items-start px-6 pt-[126px] md:items-center">
            <div className="w-full max-w-[330px] md:w-[39%] md:max-w-[510px]">
              <h2
                id="final-heading"
                className="text-[clamp(2rem,8.5vw,2.65rem)] leading-[1.05] font-black tracking-tight text-[#643b32] md:text-[clamp(2.8rem,4.6vw,4.8rem)]"
              >
                Sua caixa
                <br />
                está pronta!
              </h2>
              <p className="mt-3 max-w-[290px] text-sm leading-relaxed text-[#643b32] md:mt-6 md:max-w-[360px] md:text-lg">
                Escolha seus sabores favoritos e leve um pouquinho de felicidade.
              </p>
              <div className="mt-5 flex items-center gap-3 md:mt-8">
                <a
                  href="#caixa"
                  className="final-cta inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#643b32] px-6 py-3 text-sm font-bold text-[#fff8ee] transition-colors hover:bg-[#814d40] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#643b32] md:px-8 md:py-4 md:text-base"
                >
                  Monte sua caixa
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CartDialog
        quantidadeTotal={quantidadeTotal}
        caixaAberta={caixaAberta}
        abrirCaixa={abrirCaixa}
        valorTotal={valorTotal}
        caixaDialog={caixaDialog}
        setCaixaAberta={setCaixaAberta}
        previaPedido={previaPedido}
        mensagemPedido={mensagemPedido}
        setPreviaPedido={setPreviaPedido}
        navegar={navegar}
        caixa={caixa}
        setCaixa={setCaixa}
        enviarPedido={enviarPedido}
      />
      <Footer navegar={navegar} abrirCaixa={abrirCaixa} />
    </main>
  )
}

export default App
