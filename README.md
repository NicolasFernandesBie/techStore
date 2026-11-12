# TechStore

E-commerce de nicho para periféricos gamer, hardware e mesas digitalizadoras, com loja pública e dashboard administrativo. Projeto acadêmico.

O frete e o pagamento são simulados. Nenhuma cobrança real é feita e nenhum dado de cartão é coletado.

## Stack e justificativa

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend | Next.js 14 (App Router), React e TypeScript | Renderização no servidor para SEO das páginas de produto, um único projeto para loja e admin e Server Actions para intermediar a sessão. |
| Estilo | Tailwind CSS | Padronização da interface sem CSS global conflitante. |
| Carrinho | Zustand com persistência | Estado local simples, mantido no navegador para visitantes. |
| API | Fastify e TypeScript | API REST leve, validação com Zod, autenticação JWT e regras de negócio centralizadas. |
| Banco | SQLite com Prisma | Banco relacional embutido, com transações e schema declarativo. Facilita a correção do trabalho. |
| Autenticação | JWT em cookie httpOnly | O cookie não é acessível por JavaScript e o token carrega o papel do usuário. |
| Senhas | bcryptjs | As senhas são armazenadas como hash. |
| Infraestrutura | Docker e Docker Compose | Ambiente reproduzível com um comando. |

Next.js e Fastify foram separados para deixar explícitas as camadas de apresentação e de domínio. O Next cuida de interface, SEO e sessão. O Fastify concentra as regras de negócio, o acesso ao banco e a validação autoritativa. Toda decisão de preço, estoque e status de pedido acontece na API.

O SQLite foi escolhido por ser embutido e não exigir servidor de banco. Ele atende ao escopo acadêmico e suporta as transações necessárias para pedido e estoque. A troca para PostgreSQL exige mudanças pontuais no Prisma.

## Arquitetura

```
Navegador
   |
   v
Next.js (SSR, SEO, interface, Server Actions)
   |
   | HTTP/JSON (API_URL=http://api:4000)
   v
Fastify (API REST, regras de negócio, autenticação, RBAC)
   |
   | Prisma
   v
SQLite (arquivo no volume Docker: /data/techstore.db)
```

| Responsabilidade | Next.js | Fastify | SQLite |
|---|---|---|---|
| Renderizar loja e admin | Sim | Não | Não |
| SEO e metadados | Sim | Fornece dados | Não |
| Sessão no navegador | Sim | Emite e valida JWT | Não |
| Validação de entrada | Validação de usabilidade | Validação autoritativa com Zod | Não |
| Regras de negócio | Não | Sim | Não |
| Preço e estoque | Não | Sim | Não |
| Transações | Não | Sim | Sim |
| Persistência | Não | Via Prisma | Sim |
| Frete simulado | Exibe | Sim | Não |
| Pagamento simulado | Exibe | Sim | Não |

O Next não importa Prisma e não acessa o banco. O Fastify não renderiza HTML.

## Como executar

Pré-requisitos: Docker e Docker Compose.

```bash
docker compose up --build
```

- Loja: http://localhost:3000
- API: http://localhost:4000/api/v1/health
- Admin: http://localhost:3000/admin

Ao iniciar, o container da API aplica o schema com `prisma db push` e executa o seed. O seed cria apenas os registros que ainda não existem. Reiniciar o container não duplica dados, não zera o estoque e não sobrescreve alterações feitas no admin.

### Credenciais de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@techstore.com | admin123 |
| Cliente | cliente@techstore.com | cliente123 |

Cupom de desconto: BEMVINDO10 (10% sobre o subtotal).

### Comandos

```bash
docker compose up -d          # subir em segundo plano
docker compose logs -f api    # acompanhar logs da API
docker compose logs -f web    # acompanhar logs do Next
docker compose down           # parar e manter o banco
docker compose down -v        # parar e apagar o banco
docker compose up --build     # reconstruir após mudanças
```

### Execução sem Docker

```bash
# API
cd apps/api
npm install
DATABASE_URL="file:./dev.db" npx prisma db push
DATABASE_URL="file:./dev.db" npm run seed
DATABASE_URL="file:./dev.db" JWT_SECRET=dev npm run dev

# Web, em outro terminal
cd apps/web
npm install
API_URL=http://localhost:4000 npm run dev
```

## Estrutura do projeto

```
techStore/
├─ docker-compose.yml
├─ imagens para web/              # imagens originais fornecidas
├─ apps/
│  ├─ api/                        # Fastify, Prisma e SQLite
│  │  ├─ prisma/schema.prisma
│  │  └─ src/
│  │     ├─ modules/
│  │     │  ├─ auth/              # login, registro e /me
│  │     │  ├─ products/          # catálogo público
│  │     │  ├─ orders/            # criação de pedido e regras
│  │     │  ├─ shipping/          # provedor de frete simulado
│  │     │  ├─ payments/          # gateway de pagamento simulado
│  │     │  └─ admin/             # CRUD, pedidos e indicadores
│  │     ├─ data/products.ts      # produtos usados no seed
│  │     └─ seed.ts
│  └─ web/                        # Next.js, loja e admin
│     ├─ public/products/         # imagens normalizadas por slug
│     └─ src/
│        ├─ app/                   # rotas
│        ├─ components/            # componentes de interface
│        ├─ lib/
│        │  ├─ actions/            # Server Actions
│        │  ├─ api.ts              # chamadas do servidor para a API
│        │  ├─ session.ts          # cookie e usuário atual
│        │  └─ cart-store.ts       # carrinho com Zustand
│        └─ middleware.ts          # proteção de /admin e /conta
```

As imagens da pasta `imagens para web` foram copiadas para `apps/web/public/products` com nomes normalizados e são referenciadas pelo campo `imageUrl` de cada produto.

## Fluxos

### Catálogo

1. O navegador solicita `/produtos`.
2. O Server Component chama `GET /api/v1/products` no Fastify.
3. O Fastify consulta o SQLite via Prisma e devolve JSON.
4. O Next renderiza o HTML no servidor com os dados.

### Autenticação

1. O formulário de login chama uma Server Action.
2. A Server Action envia as credenciais para `POST /api/v1/auth/login`.
3. O Fastify valida a senha com bcrypt e emite um JWT.
4. O Next grava o JWT em um cookie httpOnly e redireciona o usuário.
5. O `middleware.ts` bloqueia `/admin` e `/conta` sem sessão. O layout do admin confere o papel `ADMIN`.

### Checkout

1. O cliente informa o CEP. O Next chama `POST /api/v1/shipping/quote`.
2. O provedor simulado retorna PAC, SEDEX e retirada. O PAC é grátis acima de R$ 500.
3. Ao finalizar, o Next envia os itens para `POST /api/v1/orders`.
4. O Fastify recalcula os preços, valida o estoque e o cupom.
5. O gateway simulado aprova o pagamento e devolve um identificador de transação.
6. Em uma transação, o Fastify baixa o estoque com a condição `stock >= quantidade` e cria o pedido com seus itens. Se algum item não tiver estoque, a operação é revertida.
7. O Next limpa o carrinho e redireciona para `/pedido/{code}`.

### Admin

- Indicadores de faturamento, pedidos pagos, ticket médio e total de produtos.
- Alerta de estoque baixo para produtos com 5 unidades ou menos.
- Ranking dos produtos mais vendidos.
- Cadastro, edição e remoção de produtos.
- Alteração de status de pedidos. Ao cancelar, o estoque é devolvido.

## API

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | /api/v1/health | Público | Verificação de saúde |
| GET | /api/v1/categories | Público | Categorias com contagem de produtos |
| GET | /api/v1/products | Público | Busca, filtro, ordenação e paginação |
| GET | /api/v1/products/:slug | Público | Detalhe do produto |
| POST | /api/v1/auth/register | Público | Criação de cliente |
| POST | /api/v1/auth/login | Público | Login e emissão de JWT |
| GET | /api/v1/auth/me | JWT | Usuário atual |
| POST | /api/v1/shipping/quote | Público | Cotação de frete simulada |
| POST | /api/v1/orders | Público ou JWT | Criação de pedido |
| GET | /api/v1/orders/code/:code | Público | Consulta por código |
| GET | /api/v1/orders/mine | JWT | Pedidos do usuário |
| GET | /api/v1/orders/:id | JWT | Pedido do usuário ou admin |
| GET | /api/v1/admin/stats | Admin | Indicadores do dashboard |
| GET, POST | /api/v1/admin/products | Admin | Listagem e criação |
| GET, PATCH, DELETE | /api/v1/admin/products/:id | Admin | Detalhe, edição e remoção |
| GET | /api/v1/admin/orders | Admin | Listagem de pedidos |
| PATCH | /api/v1/admin/orders/:id/status | Admin | Alteração de status |

## Decisões de projeto

- Valores monetários são inteiros em centavos, evitando erro de ponto flutuante.
- A baixa de estoque ocorre em transação com condição `stock >= quantidade`. Se a atualização não afetar nenhuma linha, a transação é revertida.
- A API valida todas as entradas com Zod. O front valida apenas para melhorar a usabilidade.
- Rotas administrativas exigem papel `ADMIN` no servidor. A proteção no front é complementar.
- O JWT fica em cookie httpOnly com sameSite lax.
- As Server Actions evitam expor o token ao navegador e eliminam a necessidade de CORS no cliente.
- O frete e o pagamento ficam atrás das interfaces `ShippingProvider` e `PaymentGateway`. A implementação simulada pode ser substituída por um serviço real sem alterar o restante do código.
- O seed é idempotente e não destrutivo.
- O banco fica em um volume Docker e exige apenas uma instância da API, pois o SQLite tem um único escritor.

## Escopo simulado

| Item | Situação |
|---|---|
| Frete | Simulado por regra de subtotal e CEP |
| Pagamento | Simulado, com aprovação imediata e sem dados de cartão |
| Entrega e rastreio | Apenas status do pedido |
| E-mail transacional | Não implementado |
| Webhooks de pagamento | Não implementados, pois o pagamento é síncrono e simulado |

## Limitações e próximos passos

- Migrar para PostgreSQL em produção, por causa da concorrência de escrita e de múltiplas instâncias.
- Integrar um gateway real com webhook assinado e idempotência por evento.
- Adicionar fila ou worker para e-mail, nota fiscal e processos assíncronos.
- Criar testes automatizados do fluxo de compra com Vitest e Playwright.
- Implementar upload real de imagens em um serviço de armazenamento.
- Exigir autenticação na consulta de pedido por código. Hoje a proteção é apenas a imprevisibilidade do código.
- Adicionar observabilidade e rotina de backup.

## Pontos para a apresentação

- Escolha do Next.js: SEO e compartilhamento das páginas de produto foram os fatores principais. Para um painel interno fechado, uma SPA com Vite seria suficiente.
- Separação entre Next e Fastify: deixa as camadas explícitas com custo baixo de infraestrutura. Em um MVP individual, um Next full-stack também seria válido.
- Controle de estoque: a baixa é condicional e ocorre dentro de uma transação, por isso o estoque não fica negativo.
- Confirmação de pagamento: é síncrona no gateway simulado. Em produção, viria por webhook assinado.
- Local das regras de negócio: ficam em `apps/api/src/modules`. O Next apenas orquestra as chamadas e renderiza a interface.

## Tecnologias

Next.js 14.2.35, React 18, TypeScript, Tailwind CSS, Zustand, Fastify 4, Prisma 5, SQLite, Zod, bcryptjs e Docker Compose.
