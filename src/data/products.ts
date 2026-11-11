export const sabores = [
  {
    nome: 'Clássico Glaceado',
    imagem: '/cenas/donut-classico-glaceado.png',
    descricao: 'Massa fofinha com uma delicada cobertura de açúcar.',
  },
  {
    nome: 'Chocolate Crocante',
    imagem: '/cenas/donut-chocolate-crocante.png',
    descricao: 'Chocolate cremoso e uma finalização crocante.',
  },
  {
    nome: 'Caramelo Surpresa',
    imagem: '/cenas/donut-caramelo-surpresa.png',
    descricao: 'Caramelo aveludado para adoçar cada mordida.',
  },
]
export const produtos = [
  { ...sabores[0], preco: 12.9 },
  { ...sabores[1], preco: 15.9 },
  { ...sabores[2], preco: 16.9 },
  {
    nome: 'Morango Encantado',
    imagem: '/cenas/donut-morango-encantado.png',
    descricao: 'Cobertura de morango e confeitos para alegrar o dia.',
    preco: 14.9,
  },
]
