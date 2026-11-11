import type { RefObject, Dispatch, SetStateAction } from 'react'

type HeaderProps = {
  headerRef: RefObject<HTMLElement | null>
  navegar: (id: string) => void
  abrirCaixa: () => void
  quantidadeTotal: number
  menuAberto: boolean
  setMenuAberto: Dispatch<SetStateAction<boolean>>
}

export function Header({
  headerRef,
  navegar,
  abrirCaixa,
  quantidadeTotal,
  menuAberto,
  setMenuAberto,
}: HeaderProps) {
  return (
    <>
      {/* MENU PRINCIPAL */}
      <header
        ref={headerRef}
        className="site-header fixed inset-x-0 top-7 z-[70] flex items-center justify-between gap-4 px-5 py-5 lg:pr-[5%]"
      >
        <button
          onClick={() => navegar('inicio')}
          className="cursor-pointer text-left text-xl font-black leading-none tracking-tight md:text-2xl"
        >
          LILI & GLACÊ
        </button>

        <nav className="hidden items-center gap-5 whitespace-nowrap text-sm font-bold lg:flex xl:gap-7">
          <button onClick={() => navegar('inicio')} className="cursor-pointer hover:text-[#c45476]">
            Início
          </button>

          <button
            onClick={() => navegar('preparo')}
            className="cursor-pointer hover:text-[#c45476]"
          >
            Nossa cozinha
          </button>

          <button
            onClick={() => navegar('sabores')}
            className="cursor-pointer hover:text-[#c45476]"
          >
            Sabores
          </button>

          <button
            onClick={() => navegar('caixa')}
            className="cursor-pointer rounded-full border border-[#643b32] px-5 py-2 hover:bg-white/50"
          >
            Monte sua caixa
          </button>

          <button
            onClick={() => navegar('contato')}
            className="cursor-pointer hover:text-[#c45476]"
          >
            Contato
          </button>

          <button
            onClick={abrirCaixa}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#643b32] px-5 py-2 text-white transition-transform hover:scale-105"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            Minha caixa ({quantidadeTotal})
          </button>
        </nav>

        {/* MENU MOBILE */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="mobile-navigation"
          className="cursor-pointer rounded-full bg-white/85 px-4 py-2 text-sm font-bold lg:hidden"
        >
          {menuAberto ? 'Fechar ✕' : 'Menu ☰'}
        </button>
      </header>

      {menuAberto && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação principal"
          className="site-mobile-menu fixed inset-x-4 top-24 z-[80] flex flex-col gap-4 rounded-2xl bg-[#fff0ed] p-6 font-bold shadow-xl lg:hidden"
        >
          <button onClick={() => navegar('inicio')}>Início</button>
          <button onClick={() => navegar('preparo')}>Nossa cozinha</button>
          <button onClick={() => navegar('sabores')}>Sabores</button>
          <button onClick={() => navegar('caixa')}>Monte sua caixa</button>
          <button onClick={() => navegar('contato')}>Contato</button>
          <button onClick={abrirCaixa}>Ver minha caixa ({quantidadeTotal})</button>
        </nav>
      )}
    </>
  )
}
