import { useState } from 'react'
import { MessageCircle, MapPin, Heart } from 'lucide-react'
import { INSTAGRAM_CRIADORA } from '../config/contact'

type FooterProps = { navegar: (id: string) => void; abrirCaixa: () => void }

export function Footer({ navegar, abrirCaixa }: FooterProps) {
  const [year] = useState(() => new Date().getFullYear())
  return (
    <footer id="contato" className="relative z-10 bg-[#643b32] text-[#fff4e9]">
      <svg
        className="pointer-events-none absolute bottom-[calc(100%-1px)] left-0 h-16 w-full md:h-24"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 52C170-20 300 10 470 59S760 108 950 53 1250-3 1440 35V110H0Z" fill="#ee9daf" />
        <path d="M0 78C190 0 320 43 500 75S790 20 1000 57 1250 12 1440 24V110H0Z" fill="#f8c6c7" />
        <path d="M0 94C190 23 300 48 490 84S780 34 980 70 1250 30 1440 40V110H0Z" fill="#643b32" />
      </svg>
      <div className="mx-auto max-w-6xl px-6 pb-6 pt-10 md:px-10 md:pt-14">
        <div className="grid gap-9 pb-10 md:grid-cols-[1.2fr_1fr_1fr] md:gap-8 md:pb-10 lg:grid-cols-[1.1fr_.95fr_1.4fr]">
          <div>
            <a
              href="#inicio"
              onClick={(event) => {
                event.preventDefault()
                navegar('inicio')
              }}
              aria-label="Lili & Glacê — voltar ao início"
              className="inline-block text-3xl font-black tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f8c6c7]"
            >
              LILI &amp; GLACÊ
            </a>
            <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-[#f3d8ce]">
              Feitos com carinho.
              <br />
              Compartilhados com amor.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#f4b6c5]">
              <Heart size={14} strokeWidth={1.5} aria-hidden="true" /> Pequenas delícias, grandes
              sorrisos.
            </span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#f4b6c5]">
              Um cantinho de doçura
            </h3>
            <address className="mt-5 flex gap-3 text-sm not-italic leading-7 text-[#fff4e9]">
              <MapPin className="mt-1 shrink-0" size={19} strokeWidth={1.5} aria-hidden="true" />
              <span>
                Rua dos Suspiros, 123
                <br />
                Jardim Doce · Rio Verde – GO
              </span>
            </address>
            <p className="mt-3 text-xs text-[#e4bfb2]">Endereço fictício · projeto de portfólio</p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[.18em] text-[#f4b6c5]">
              Vamos conversar?
            </h3>
            <div className="mt-5 flex flex-wrap items-center gap-3 lg:flex-nowrap">
              <button
                type="button"
                onClick={abrirCaixa}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#fff4e9] px-4 py-3 text-sm font-bold text-[#643b32] transition-colors hover:bg-[#f8c6c7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp
              </button>
              <a
                href={INSTAGRAM_CRIADORA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d9aaa0] px-4 py-3 text-sm font-semibold transition-colors hover:bg-[#ffffff12] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
                </svg>{' '}
                Instagram
              </a>
              <button
                type="button"
                onClick={() => navegar('inicio')}
                aria-label="Voltar ao início"
                className="group flex shrink-0 cursor-pointer flex-col items-center gap-1 rounded-2xl px-1 py-1 text-[10px] font-semibold text-[#fff4e9] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f8c6c7]"
              >
                <span className="relative block h-11 w-11 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1">
                  <img
                    src="/cenas/donut-morango-encantado.png"
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-contain drop-shadow-md"
                  />
                  <span
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#fff4e9] text-[#643b32] shadow-sm"
                    aria-hidden="true"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 19V5m-6 6 6-6 6 6" />
                    </svg>
                  </span>
                </span>
                Voltar ao início
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-[#ffffff24] pt-6 text-xs text-[#ebc9bd] md:flex-row md:items-center md:justify-between">
          <p>© {year} Lili &amp; Glacê. Feito para adoçar seu dia.</p>
          <a
            href={INSTAGRAM_CRIADORA}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Desenvolvido por{' '}
            <strong className="font-semibold text-[#fff4e9]">Cris Lopes Art</strong>{' '}
            <span aria-hidden="true">♡</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
