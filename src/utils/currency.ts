const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const moeda = (valor: number) => formatter.format(valor)
