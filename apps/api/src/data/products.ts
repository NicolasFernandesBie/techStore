export type SeedCategory = { slug: string; name: string }

export type SeedProduct = {
  slug: string
  name: string
  description: string
  brand: string
  imageUrl: string
  priceCents: number
  compareAtCents: number | null
  stock: number
  featured: boolean
  specs: string[]
  categorySlug: string
}

export const categories: SeedCategory[] = [
  { slug: 'perifericos', name: 'Periféricos' },
  { slug: 'hardware', name: 'Hardware' },
  { slug: 'mesas-digitalizadoras', name: 'Mesas Digitalizadoras' },
]

export const products: SeedProduct[] = [
  {
    slug: 'fone-havit-h2230u',
    name: 'Fone de Ouvido Gamer Havit H2230u 7.1 P3 50mm',
    description:
      'Headset gamer com áudio surround 7.1 virtual, drivers de 50mm e microfone com cancelamento de ruído. Ideal para PC e consoles.',
    brand: 'Havit',
    imageUrl: '/products/fone-havit-h2230u.webp',
    priceCents: 19990,
    compareAtCents: 24990,
    stock: 35,
    featured: true,
    specs: ['Áudio 7.1 virtual', 'Drivers de 50mm', 'Conexão P3', 'Compatível com PS3, PS4, Xbox e PC'],
    categorySlug: 'perifericos',
  },
  {
    slug: 'headset-mizar-3d-surround',
    name: 'Headset Gamer Mizar 3D Surround 7.1 RGB',
    description:
      'Headset USB com som 3D surround 7.1, iluminação RGB, microfone omnidirecional e cabo em nylon reforçado.',
    brand: 'Mizar',
    imageUrl: '/products/headset-mizar-3d-surround.webp',
    priceCents: 17990,
    compareAtCents: 21990,
    stock: 22,
    featured: true,
    specs: ['Som 3D surround 7.1', 'Conexão USB', 'Microfone omnidirecional', 'Iluminação RGB', 'Cabo em nylon'],
    categorySlug: 'perifericos',
  },
  {
    slug: 'headset-razer-kraken-gengar',
    name: 'Headset Gamer Razer Kraken Gengar Edição Limitada Chroma RGB',
    description:
      'Edição limitada inspirada no Gengar, com drivers de 40mm, som surround 7.1 e iluminação Chroma RGB.',
    brand: 'Razer',
    imageUrl: '/products/headset-razer-kraken-gengar.webp',
    priceCents: 64990,
    compareAtCents: 74990,
    stock: 8,
    featured: true,
    specs: ['Edição limitada Gengar', 'Drivers de 40mm', 'Surround 7.1', 'Chroma RGB', 'Microfone retrátil'],
    categorySlug: 'perifericos',
  },
  {
    slug: 'mesa-digitalizadora-huion-kamvas-13',
    name: 'Mesa Digitalizadora Huion Kamvas 13 com Suporte Ajustável USB-C Cosmo Black',
    description:
      'Mesa digitalizadora com tela de 13 polegadas, caneta sem bateria e suporte ajustável. Excelente para ilustração e design.',
    brand: 'Huion',
    imageUrl: '/products/mesa-digitalizadora-huion-kamvas-13.webp',
    priceCents: 219990,
    compareAtCents: 249990,
    stock: 12,
    featured: false,
    specs: ['Tela de 13 polegadas', 'Conexão USB-C', 'Caneta sem bateria', 'Suporte ajustável incluso', '8192 níveis de pressão'],
    categorySlug: 'mesas-digitalizadoras',
  },
  {
    slug: 'mesa-digitalizadora-huion-kamvas-3-fullhd',
    name: 'Mesa Digitalizadora Huion Kamvas 3 Geração 13 Full HD com Suporte Ajustável',
    description:
      'Terceira geração da linha Kamvas com tela Full HD de 13 polegadas, 16384 níveis de pressão e suporte ajustável.',
    brand: 'Huion',
    imageUrl: '/products/mesa-digitalizadora-huion-kamvas-3-fullhd.webp',
    priceCents: 259990,
    compareAtCents: 289990,
    stock: 9,
    featured: true,
    specs: ['Tela Full HD 13 polegadas', '16384 níveis de pressão', 'Caneta PW517', 'Suporte ajustável', 'Conexão USB-C'],
    categorySlug: 'mesas-digitalizadoras',
  },
  {
    slug: 'mesa-digitalizadora-huion-kamvas-3',
    name: 'Mesa Digitalizadora Huion Kamvas 3 Geração 13 Tela Full HD 16384 Níveis de Pressão',
    description:
      'Mesa digitalizadora com tela Full HD, resposta precisa de pressão e cores vivas para trabalhos criativos.',
    brand: 'Huion',
    imageUrl: '/products/mesa-digitalizadora-huion-kamvas-3.webp',
    priceCents: 249990,
    compareAtCents: 279990,
    stock: 10,
    featured: false,
    specs: ['Tela Full HD 13 polegadas', '16384 níveis de pressão', 'Cobertura de 120% sRGB', 'Caneta sem bateria', 'Conexão USB-C'],
    categorySlug: 'mesas-digitalizadoras',
  },
  {
    slug: 'mouse-attack-shark-g3-white',
    name: 'Mouse Gamer Sem Fio Attack Shark G3 White',
    description:
      'Mouse sem fio ultraleve com sensor de alta precisão, switches silenciosos e design ergonômico na cor branca.',
    brand: 'Attack Shark',
    imageUrl: '/products/mouse-attack-shark-g3-white.webp',
    priceCents: 24990,
    compareAtCents: 29990,
    stock: 40,
    featured: true,
    specs: ['Conexão 2.4GHz e Bluetooth', 'Sensor até 26000 DPI', 'Switches silenciosos', 'Bateria recarregável', 'Design ultraleve'],
    categorySlug: 'perifericos',
  },
  {
    slug: 'mouse-attack-shark-x6-black',
    name: 'Mouse Gamer Sem Fio Attack Shark X6 Black',
    description:
      'Mouse gamer sem fio com iluminação RGB, sensor ajustável e formato ergonômico para longas sessões.',
    brand: 'Attack Shark',
    imageUrl: '/products/mouse-attack-shark-x6-black.webp',
    priceCents: 21990,
    compareAtCents: 26990,
    stock: 33,
    featured: false,
    specs: ['Conexão 2.4GHz', 'Sensor até 16000 DPI', 'Iluminação RGB', 'Bateria recarregável', '6 botões programáveis'],
    categorySlug: 'perifericos',
  },
  {
    slug: 'mouse-attack-shark-x8-se-berry-red',
    name: 'Mouse Gamer Sem Fio Attack Shark X8 SE Berry Red',
    description:
      'Edição Berry Red do X8 SE, com sensor preciso, construção leve e conexão sem fio de baixa latência.',
    brand: 'Attack Shark',
    imageUrl: '/products/mouse-attack-shark-x8-se-berry-red.webp',
    priceCents: 27990,
    compareAtCents: 32990,
    stock: 18,
    featured: true,
    specs: ['Conexão 2.4GHz e Bluetooth', 'Sensor até 26000 DPI', 'Baixa latência', 'Bateria de longa duração', 'Acabamento Berry Red'],
    categorySlug: 'perifericos',
  },
  {
    slug: 'placa-de-video-asrock-rx-7600',
    name: 'Placa de Vídeo ASRock AMD Radeon RX 7600 Challenger Pro OC 8GB GDDR6',
    description:
      'Placa de vídeo com arquitetura RDNA 3, 8GB GDDR6 e triple fan. Excelente custo-benefício para jogos em 1080p.',
    brand: 'ASRock',
    imageUrl: '/products/placa-de-video-asrock-rx-7600.webp',
    priceCents: 189990,
    compareAtCents: 209990,
    stock: 7,
    featured: true,
    specs: ['AMD Radeon RX 7600', '8GB GDDR6', 'Arquitetura RDNA 3', 'Triple fan', 'PCIe 4.0'],
    categorySlug: 'hardware',
  },
  {
    slug: 'placa-de-video-biostar-rx-580',
    name: 'Placa de Vídeo Biostar AMD Radeon RX 580 8GB GDDR5 256-bit',
    description:
      'Placa de vídeo com 8GB GDDR5 e barramento de 256 bits, indicada para jogos e upgrades de custo acessível.',
    brand: 'Biostar',
    imageUrl: '/products/placa-de-video-biostar-rx-580.webp',
    priceCents: 89990,
    compareAtCents: 109990,
    stock: 14,
    featured: false,
    specs: ['AMD Radeon RX 580', '8GB GDDR5', 'Barramento 256-bit', 'Saídas HDMI e DisplayPort', 'PCIe 3.0'],
    categorySlug: 'hardware',
  },
  {
    slug: 'placa-de-video-asus-rtx-3050',
    name: 'Placa de Vídeo ASUS RTX 3050 Dual O6G NVIDIA GeForce DLSS Ray Tracing',
    description:
      'Placa de vídeo NVIDIA RTX 3050 com 6GB GDDR6, DLSS, ray tracing e refrigeração dual fan da ASUS.',
    brand: 'ASUS',
    imageUrl: '/products/placa-de-video-asus-rtx-3050.webp',
    priceCents: 169990,
    compareAtCents: 189990,
    stock: 6,
    featured: true,
    specs: ['NVIDIA GeForce RTX 3050', '6GB GDDR6', 'DLSS e Ray Tracing', 'Dual fan', 'G-Sync'],
    categorySlug: 'hardware',
  },
  {
    slug: 'processador-amd-ryzen-7-5800x3d',
    name: 'Processador AMD Ryzen 7 5800X3D 3.4GHz 8-Core Cache 100MB AM4',
    description:
      'Processador com 8 núcleos, 16 threads e 100MB de cache 3D V-Cache. Referência em desempenho para jogos na plataforma AM4.',
    brand: 'AMD',
    imageUrl: '/products/processador-amd-ryzen-7-5800x3d.webp',
    priceCents: 159990,
    compareAtCents: 179990,
    stock: 11,
    featured: true,
    specs: ['8 núcleos / 16 threads', '3.4GHz base / 4.5GHz boost', 'Cache 100MB 3D V-Cache', 'Socket AM4', 'TDP 105W'],
    categorySlug: 'hardware',
  },
  {
    slug: 'processador-intel-core-i7-14700kf',
    name: 'Processador Intel Core i7-14700KF',
    description:
      'Processador de 20 núcleos e 28 threads com arquitetura híbrida, ideal para jogos e produtividade pesada.',
    brand: 'Intel',
    imageUrl: '/products/processador-intel-core-i7-14700kf.webp',
    priceCents: 279990,
    compareAtCents: 309990,
    stock: 5,
    featured: false,
    specs: ['20 núcleos / 28 threads', 'Até 5.6GHz', 'Socket LGA1700', 'Cache 33MB', 'Sem vídeo integrado (KF)'],
    categorySlug: 'hardware',
  },
  {
    slug: 'processador-intel-core-i9-14900k',
    name: 'Processador Intel Core i9-14900K',
    description:
      'Topo de linha da Intel com 24 núcleos, 32 threads e até 6.0GHz para máxima performance em jogos e criação.',
    brand: 'Intel',
    imageUrl: '/products/processador-intel-core-i9-14900k.webp',
    priceCents: 389990,
    compareAtCents: 429990,
    stock: 4,
    featured: true,
    specs: ['24 núcleos / 32 threads', 'Até 6.0GHz', 'Socket LGA1700', 'Cache 36MB', 'Vídeo integrado UHD 770'],
    categorySlug: 'hardware',
  },
  {
    slug: 'teclado-razer-huntsman-v3-pro',
    name: 'Teclado Gamer Razer Huntsman V3 Pro Chroma RGB Switches Ópticos',
    description:
      'Teclado para eSports com switches ópticos, Rapid Trigger, Snap Tap e apoio de pulso magnético.',
    brand: 'Razer',
    imageUrl: '/products/teclado-razer-huntsman-v3-pro.webp',
    priceCents: 129990,
    compareAtCents: 149990,
    stock: 13,
    featured: true,
    specs: ['Switches ópticos analógicos', 'Rapid Trigger e Snap Tap', 'Chroma RGB', 'Apoio de pulso magnético', 'Layout US'],
    categorySlug: 'perifericos',
  },
  {
    slug: 'teclado-machenike-k500b-b87',
    name: 'Teclado Mecânico Gamer Machenike K500B-B87 Switch Brown ABNT2 Azul',
    description:
      'Teclado mecânico compacto de 87 teclas, switch Brown e layout ABNT2, com iluminação e estrutura reforçada.',
    brand: 'Machenike',
    imageUrl: '/products/teclado-machenike-k500b-b87.webp',
    priceCents: 25990,
    compareAtCents: 29990,
    stock: 26,
    featured: false,
    specs: ['Switch Brown', 'Layout ABNT2', '87 teclas (TKL)', 'Iluminação LED', 'Cabo USB removível'],
    categorySlug: 'perifericos',
  },
  {
    slug: 'teclado-razer-blackwidow-v3-tenkeyless',
    name: 'Teclado Mecânico Gamer Razer BlackWidow V3 Tenkeyless Chroma RGB',
    description:
      'Teclado mecânico TKL com switches Razer Yellow, iluminação Chroma RGB e construção robusta.',
    brand: 'Razer',
    imageUrl: '/products/teclado-razer-blackwidow-v3-tenkeyless.webp',
    priceCents: 74990,
    compareAtCents: 84990,
    stock: 16,
    featured: false,
    specs: ['Switches Razer Yellow', 'Formato Tenkeyless', 'Chroma RGB', 'Layout US', 'Cabo USB trançado'],
    categorySlug: 'perifericos',
  },
]
