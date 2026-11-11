import type { RefObject, Dispatch, SetStateAction } from 'react'
import { Heart } from 'lucide-react'
import { produtos } from '../data/products'
import { moeda } from '../utils/currency'

type CartDialogProps = {
  quantidadeTotal: number
  caixaAberta: boolean
  abrirCaixa: () => void
  valorTotal: number
  caixaDialog: RefObject<HTMLDialogElement | null>
  setCaixaAberta: Dispatch<SetStateAction<boolean>>
  previaPedido: boolean
  mensagemPedido: string
  setPreviaPedido: Dispatch<SetStateAction<boolean>>
  navegar: (id: string) => void
  caixa: number[]
  setCaixa: Dispatch<SetStateAction<number[]>>
  enviarPedido: () => void
}

export function CartDialog({
  quantidadeTotal,
  caixaAberta,
  abrirCaixa,
  valorTotal,
  caixaDialog,
  setCaixaAberta,
  previaPedido,
  mensagemPedido,
  setPreviaPedido,
  navegar,
  caixa,
  setCaixa,
  enviarPedido,
}: CartDialogProps) {
  return (
    <>
      {quantidadeTotal > 0 && !caixaAberta && (
        <button
          onClick={abrirCaixa}
          className="fixed bottom-[max(10px,env(safe-area-inset-bottom))] right-3 z-[90] flex min-h-11 items-center gap-2 rounded-full border border-[#fff4e9] bg-[#643b32] px-3 py-2 text-xs font-bold text-white shadow-lg md:bottom-4 md:right-4 md:min-h-12 md:gap-3 md:px-5 md:py-3 md:text-sm"
          aria-label={`Revisar minha caixa: ${quantidadeTotal} donuts, ${moeda(valorTotal)}`}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M5 8h14l1 13H4L5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span>
            <span className="hidden md:inline">Minha </span>Caixa · {quantidadeTotal}
          </span>
          <span className="hidden md:inline">{moeda(valorTotal)}</span>
        </button>
      )}
      <dialog
        ref={caixaDialog}
        className="cart-dialog"
        aria-labelledby="cart-title"
        onCancel={() => setCaixaAberta(false)}
        onClose={() => setCaixaAberta(false)}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="cart-title" className="text-2xl font-black">
            {previaPedido ? 'Pedido pelo WhatsApp' : 'Minha caixinha'}
          </h2>
          <button
            autoFocus
            onClick={() => setCaixaAberta(false)}
            aria-label="Fechar resumo da caixa"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5ddd4] text-xl"
          >
            ×
          </button>
        </div>
        {previaPedido ? (
          <div className="py-6 text-center">
            <Heart className="mx-auto mb-4 text-[#c65f80]" size={38} aria-hidden="true" />
            <p className="text-lg font-bold">Sua caixinha está pronta para enviar.</p>
            <p className="mt-3 text-sm leading-relaxed">
              Na loja, o WhatsApp abre com este resumo. Pagamento, frete e entrega são combinados
              com o atendimento.
            </p>
            <p className="mt-5 whitespace-pre-wrap rounded-2xl bg-[#f4e6dc] p-4 text-left text-sm leading-relaxed">
              {mensagemPedido}
            </p>
            <p className="mt-4 text-xs leading-relaxed">
              Esta é uma prévia de portfólio. Não há número cadastrado e nenhum pedido foi enviado.
            </p>
            <button
              onClick={() => setPreviaPedido(false)}
              className="mt-6 rounded-full bg-[#643b32] px-6 py-3 font-bold text-white"
            >
              Voltar à minha caixa
            </button>
          </div>
        ) : quantidadeTotal === 0 ? (
          <div className="py-8 text-center">
            <p>Sua caixa está esperando seus sabores favoritos.</p>
            <button
              onClick={() => {
                setCaixaAberta(false)
                navegar('caixa')
              }}
              className="mt-5 rounded-full bg-[#643b32] px-6 py-3 font-bold text-white"
            >
              Escolher donuts
            </button>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-[#e8d3ca]">
              {produtos.map(
                (produto, index) =>
                  caixa[index] > 0 && (
                    <li key={produto.nome} className="flex gap-3 py-4">
                      <img
                        src={produto.imagem}
                        alt=""
                        className="h-16 w-16 shrink-0 object-contain"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold">{produto.nome}</h3>
                        <p className="mt-1 text-sm">{moeda(produto.preco * caixa[index])}</p>
                        <div className="mt-2 inline-flex items-center rounded-full border border-[#e8d3ca]">
                          <button
                            className="h-11 w-11"
                            aria-label={`Remover um ${produto.nome}`}
                            onClick={() =>
                              setCaixa((atual) =>
                                atual.map((q, i) => (i === index ? Math.max(0, q - 1) : q)),
                              )
                            }
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center" aria-live="polite">
                            {caixa[index]}
                          </span>
                          <button
                            className="h-11 w-11"
                            aria-label={`Adicionar um ${produto.nome}`}
                            onClick={() =>
                              setCaixa((atual) => atual.map((q, i) => (i === index ? q + 1 : q)))
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </li>
                  ),
              )}
            </ul>
            <div className="mt-5 flex justify-between border-t border-[#e8d3ca] pt-5 text-lg font-black">
              <span>Total</span>
              <span>{moeda(valorTotal)}</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed">
              Combine o pagamento e a entrega pelo WhatsApp da loja. Frete e disponibilidade serão
              confirmados no atendimento.
            </p>
            <button
              onClick={enviarPedido}
              className="mt-5 min-h-12 w-full rounded-full bg-[#643b32] px-5 py-3 font-bold text-white"
            >
              Enviar pedido pelo WhatsApp
            </button>
          </>
        )}
      </dialog>
    </>
  )
}
