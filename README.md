# Weather Forecast 🌤️

Aplicação web de previsão do tempo desenvolvida em React, TypeScript e Tailwind CSS. O projeto permite buscar uma cidade, visualizar o clima atual e consultar a previsão das próximas horas e dos próximos 5 dias usando a API da OpenWeather.

O foco do projeto é entregar uma experiência simples, responsiva e acessível, com boa organização de código, testes unitários e tratamento de erro.

Aplicação publicada:

[https://weather-forecast-sandy-two.vercel.app/](https://weather-forecast-sandy-two.vercel.app/)

https://github.com/user-attachments/assets/de6e1895-7be4-43fc-9b39-6e92f7eeebeb

## Sumário

- [Processo De Design](#processo-de-design)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Como Rodar](#como-rodar)
- [Scripts](#scripts)
- [Estrutura Do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [API](#api)
- [Testes](#testes)
- [Tratamento De Erro](#tratamento-de-erro)
- [Acessibilidade](#acessibilidade)
- [Performance](#performance)
- [Deploy Na Vercel](#deploy-na-vercel)
- [Tagueamento](#tagueamento)
- [Variáveis De Ambiente](#variaveis-de-ambiente)
- [Decisões Técnicas](#decisoes-tecnicas)
- [Status Do Projeto](#status-do-projeto)

<a id="processo-de-design"></a>

## Processo De Design

Antes da criação das telas no Figma, o projeto foi idealizado em rascunhos no caderno. Essa etapa ajudou a definir a composição inicial das telas, a organização das informações e o fluxo principal entre boas-vindas, busca de cidade e detalhes da previsão.

Depois dos rascunhos, as ideias foram refinadas no Figma para validar espaçamentos, hierarquia visual, cores, ilustrações e estados da interface.

Rascunho inicial:

<img width="542" height="223" alt="Captura de Tela 2026-07-23 às 22 26 07" src="https://github.com/user-attachments/assets/5117e48b-7602-481c-a136-a7766441c157" />


Protótipo no Figma:

<img width="825" height="678" alt="Captura de Tela 2026-07-23 às 22 28 47" src="https://github.com/user-attachments/assets/56d48cb3-ac0b-4d9a-8dfa-6574d91a2d91" />

**Link do Figma:** https://www.figma.com/design/9USg4L5nE8JbviGhUmkqTq/Entrevista-Itau--Copy-?node-id=0-1&t=PdVIJWCQGCrYFmey-1


<a id="tecnologias"></a>

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- OpenWeather API
- Vitest
- Testing Library
- ESLint
- SVGO

<a id="funcionalidades"></a>

## Funcionalidades

- Tela inicial de boas-vindas.
- Busca de cidade pela API da OpenWeather.
- Cidade padrão carregada inicialmente: São Paulo.
- Listagem do clima atual da cidade encontrada.
- Tela de detalhes com temperatura atual, mínima, máxima e condição climática.
- Previsão por horário.
- Previsão para os próximos 5 dias.
- Seleção de um dia da previsão para atualizar os detalhes exibidos.
- Estado de carregamento com skeleton.
- Estado de cidade não encontrada.
- Estado de erro de API/offline com opção de tentar novamente.
- Imagens otimizadas em WebP para reduzir o tamanho do build.

<a id="requisitos"></a>

## Requisitos

- Node.js
- npm
- Chave da OpenWeather

<a id="como-rodar"></a>

## Como Rodar

Clone o repositório:

```bash
git clone https://github.com/tamiresdib/weather-forecast.git
```

Acesse a pasta do projeto:

```bash
cd weather-forecast
```

Instale as dependências:

```bash
npm install
```

Crie uma chave gratuita na OpenWeather:

[OpenWeather API Keys](https://home.openweathermap.org/api_keys)

Depois, na raiz do projeto, crie um arquivo chamado `.env` com o mesmo formato do `.env.example`, trocando o valor pela sua própria chave:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Rode o projeto em ambiente local:

```bash
npm run dev
```

<a id="scripts"></a>

## Scripts

Rodar o projeto localmente:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Visualizar o build localmente:

```bash
npm run preview
```

Rodar lint:

```bash
npm run lint
```

Rodar testes:

```bash
npm run test -- --run
```

Rodar testes em modo watch:

```bash
npm run test
```

Rodar cobertura de testes:

```bash
npm run test:coverage
```

Abrir o relatório visual de cobertura:

```bash
open coverage/index.html
```

<a id="estrutura-do-projeto"></a>

## Estrutura Do Projeto

```txt
src/
  app/
    App.tsx
  assets/
    images/
  features/
    types/
    weather/
      components/
      data/
      hooks/
      mappers/
      services/
      utils/
    welcome/
      components/
  test/
    setup.ts
```

<a id="arquitetura"></a>

## Arquitetura

O projeto segue uma organização baseada em features. A feature principal `weather` concentra os componentes, hooks, serviços, mappers e utilitários relacionados à previsão do tempo.

Responsabilidades principais:

- `components`: camada visual e estados de UI.
- `hooks`: controle de estado, carregamento, erro, retry e regras de interação.
- `services`: orquestração das chamadas de API e conversão para os modelos da aplicação.
- `openWeatherClient`: comunicação direta com a OpenWeather.
- `mappers`: transformação dos DTOs da OpenWeather para os tipos usados pelo app.
- `utils`: formatação de datas, horários e textos.
- `types`: contratos TypeScript compartilhados pela feature.

Essa separação reduz acoplamento entre UI e API, facilita testes unitários e deixa o projeto mais simples de evoluir.

<a id="api"></a>

## API

O projeto usa a OpenWeather:

- Geocoding API para buscar a cidade.
- Current Weather API para clima atual.
- 5 Day / 3 Hour Forecast API para previsão dos próximos dias.

**Observação importante:** a previsão gratuita da OpenWeather retorna intervalos de 3 em 3 horas. Por isso, os horários exibidos dependem dos dados disponíveis no endpoint, além disso, nessa versão gratuita não é possível visualizar histórico previsões passadas, apenas futuras.

<a id="testes"></a>

## Testes

Os testes unitários cobrem:

- Helpers de data e texto.
- Mapeamento de ícones por condição climática.
- Conversão dos dados da OpenWeather para os modelos da aplicação.
- Services com mocks do client da API.
- Hooks de busca e detalhes.
- Estados de sucesso, erro, retry, debounce e desmontagem de componente.

**Evidência de cobertura de testes unitários:**

<img width="956" height="580" alt="Captura de Tela 2026-07-23 às 21 53 59" src="https://github.com/user-attachments/assets/c0f92cf7-279e-41ab-8904-225ea7a20874" />


Comando principal:

```bash
npm run test -- --run
```

Comando com cobertura:

```bash
npm run test:coverage
```

<a id="tratamento-de-erro"></a>

## Tratamento De Erro

O app possui tratamento visual para:

- Falha na API.
- Falta de conexão com a internet.
- Cidade não encontrada.
- Carregamento inicial.

Quando ocorre erro de API ou conexão, o usuário recebe uma tela de erro com botão para tentar novamente:

<img width="360" height="781" alt="Captura de Tela 2026-07-23 às 21 57 56" src="https://github.com/user-attachments/assets/e0c2eda8-bb6a-43b5-a00f-528f0ec42461" />

Quando o usuário não encontra a cidade pesquisada ele recebe uma tela informativa com botão tentar novamente:

<img width="360" height="775" alt="Captura de Tela 2026-07-23 às 21 59 34" src="https://github.com/user-attachments/assets/53e3f11f-d5dd-444d-a935-3564f66c461d" />



<a id="acessibilidade"></a>

## Acessibilidade

Cuidados aplicados:

- Labels acessíveis para campos de busca.
- `aria-label` em botões de ação.
- Imagens decorativas com `aria-hidden`.
- Estados de erro e vazio renderizados com texto visível.
- Botões reais para interações clicáveis.
- Foco visual mantido em inputs e botões.

**A aplicação foi revisada com Lighthouse e utiliza boas práticas de acessibilidade.**

Observação: A cobertura não atingiu 100% de cobertura de acessibilidade apenas pelas cores escolhidas

<img width="448" height="527" alt="Captura de Tela 2026-07-23 às 22 02 32" src="https://github.com/user-attachments/assets/90a078eb-3615-4d7c-b985-5a9e1aafec36" />


<a id="performance"></a>

## Performance

As ilustrações maiores foram convertidas de SVG para WebP para reduzir o tamanho do build.

Antes da otimização, alguns SVGs tinham mais de 1 MB a 4 MB. Depois da conversão:

- `sun-icon1.webp`: aproximadamente 100 KB no build.
- `error-api-img.webp`: aproximadamente 228 KB no build.
- `city-not-found.webp`: aproximadamente 504 KB no build.

Os ícones pequenos de clima permanecem em SVG, pois são leves e escaláveis.

<a id="deploy-na-vercel"></a>

## Deploy Na Vercel

O projeto está publicado na Vercel:

[https://weather-forecast-sandy-two.vercel.app/](https://weather-forecast-sandy-two.vercel.app/)


<a id="tagueamento"></a>

## Tagueamento

O projeto possui tagueamento via Google Analytics, centralizado em um serviço único para evitar chamadas diretas de analytics espalhadas pelos componentes.

Para habilitar o Google Analytics, adicione o Measurement ID no arquivo `.env`:

```env
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id_here
```

Caso essa variável não esteja configurada, a aplicação continua funcionando normalmente sem enviar eventos.

Eventos enviados:

- `welcome_started`
- `page_view`
- `city_search_completed`
- `city_search_cleared`
- `city_search_retried`
- `city_selected`
- `forecast_day_selected`
- `navigation_back_clicked`
- `weather_details_retried`
- `api_error`

<a id="variaveis-de-ambiente"></a>

## Variáveis De Ambiente

Nunca commite o arquivo `.env`.

Use apenas o `.env.example` como referência pública:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id_here
```

<a id="decisoes-tecnicas"></a>

## Decisões Técnicas

- React com TypeScript para maior segurança de tipos.
- Tailwind CSS para velocidade de desenvolvimento e consistência visual.
- Hooks customizados para separar regra de UI e regra de carregamento.
- Mappers para isolar a estrutura da API externa dos modelos internos do app.
- Services para centralizar a comunicação entre client da API e aplicação.
- Google Analytics centralizado em uma camada de analytics para evitar acoplamento com os componentes.
- Vitest e Testing Library para testes rápidos e próximos do ecossistema Vite.
- WebP para ilustrações grandes e SVG para ícones pequenos.

<a id="status-do-projeto"></a>

## Status Do Projeto

Implementado:

- Telas principais.
- Integração com OpenWeather.
- Loading skeleton.
- Tratamento de erro.
- Cidade não encontrada.
- Testes unitários.
- Tagueamento com Google Analytics.
- Otimização de assets.
- Build para produção.
