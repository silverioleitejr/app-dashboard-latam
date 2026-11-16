# PRD – Dashboard Engenharia de Dados LATAM (MVP)

**Autor:** Silverio Leite Jr  
**Cargo:** Senior Solution Architect – OG1 TI  
**E-mail:** silverio.leitejr@og1.com.br  
**Telefone:** (11) 96020-6334  
**Versão:** 0.1 (MVP) · **Data:** 15/11/2026 · **Status:** Rascunho

## 1. Visão geral

Dashboard web para a área de Engenharia de Dados que oferece uma visão geográfica consolidada dos projetos na América Latina e México. A primeira tela apresenta um mapa com as cidades sede de cada país e, ligada a cada uma por uma linha, uma caixa de KPIs.

## 2. Problema e objetivo

**Problema:** a informação sobre projetos, tabelas core e volume de dados por país está dispersa, o que dificulta a visão executiva e o acompanhamento do portfólio regional.

**Objetivo do MVP:** entregar em uma única página a visão regional por país/sede, com três KPIs por sede, de forma clara, responsiva e fácil de atualizar.

## 3. Escopo

**Dentro do MVP**

- Página única com mapa de LATAM + México.
- Marcador da cidade sede (inicialmente a capital) de cada país/grupo.
- Caixa de KPI por sede, conectada ao marcador por uma linha.
- KPIs: Qtd. Projetos, Qtd. Tabelas Core e Volume Total de Dados.
- Totais regionais no cabeçalho.
- Dados em arquivo/objeto de configuração (sem backend).

**Fora do MVP (próximas versões)**

- Integração automática com fontes (Redshift, dbt, catálogo de dados).
- Drill-down por país, filtros, histórico e tendência.
- Autenticação e perfis de acesso.

## 4. Usuários

| Perfil | Necessidade |
|---|---|
| Gestão de Engenharia de Dados | Visão consolidada do portfólio regional |
| Líderes de projeto por país | Conferir os números da sua sede |
| Arquitetura / Governança | Entender distribuição de tabelas core e volume |

## 5. Cobertura geográfica e premissas

| Grupo | País | Cidade sede (premissa) |
|---|---|---|
| Brasil | Brasil | Brasília |
| Argentina | Argentina | Buenos Aires |
| Equador | Equador | Quito |
| Bolívia | Bolívia | La Paz (sede de governo; Sucre é a capital constitucional) |
| Paraguai | Paraguai | Assunção |
| Uruguai | Uruguai | Montevidéu |
| Chile | Chile | Santiago |
| México | México | Cidade do México |
| CCAV | Venezuela | Caracas |
| CCAV | Costa Rica | San José |
| CCAV | Caribe | Santo Domingo (a confirmar) |

A lista oficial de cidades sede será enviada; até lá, valem as capitais acima. O grupo CCAV é exibido com três sedes, destacadas com cor própria.

## 6. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Exibir mapa de LATAM + México com países atendidos destacados | Must |
| RF-02 | Exibir marcador em cada cidade sede | Must |
| RF-03 | Exibir caixa de KPI por sede com Qtd. Projetos, Qtd. Tabelas Core e Volume Total | Must |
| RF-04 | Ligar cada caixa ao marcador por uma linha | Must |
| RF-05 | Destacar país, linha e caixa ao passar o mouse | Should |
| RF-06 | Exibir totais consolidados da região | Should |
| RF-07 | Alimentar dados por um único objeto/arquivo editável | Must |
| RF-08 | Distinguir visualmente o grupo CCAV | Could |

## 7. Definição dos KPIs

| KPI | Definição | Unidade |
|---|---|---|
| Qtd. Projetos | Projetos de engenharia de dados ativos na sede/país | inteiro |
| Qtd. Tabelas Core | Tabelas classificadas como core nos projetos da sede | inteiro |
| Volume Total de Dados | Soma do volume armazenado das tabelas da sede | TB |

Os valores do MVP são fictícios, e as definições finais (ativo, core, fonte do volume) devem ser validadas com a governança de dados.

## 8. Modelo de dados

```json
{
  "id": "BR",
  "pais": "Brasil",
  "grupo": "Brasil",
  "cidade": "Brasília",
  "lat": -15.79,
  "lon": -47.88,
  "kpis": { "projetos": 0, "tabelasCore": 0, "volumeTB": 0 }
}
```

## 9. UX / layout

- Mapa central; caixas de KPI em colunas laterais (oeste à esquerda, leste à direita), cada uma ligada ao marcador da cidade.
- Layout em SVG com escala proporcional (responsivo).
- Hover destaca país, linha e caixa.
- Padrão visual: ver `DESIGN-SYSTEM.md` (cores OG1, tipografia sans-serif, raio 6px).

## 10. Arquitetura técnica (MVP)

- Front-end estático: HTML + CSS + JavaScript puro, sem dependências externas.
- Mapa vetorial `assets/mapa-latam.svg` (Natural Earth 50m, Mercator), embutido no HTML.
- Sem backend; dados em constante `SITES` no código.
- Evolução: API/endpoint lendo Redshift/dbt, deploy em hospedagem estática.

## 11. Requisitos não funcionais

- Carregamento inicial inferior a 3 s em conexão corporativa.
- Compatível com Chrome, Edge e Firefox atuais; legível em telas a partir de 1024 px.
- Funciona offline (mapa embutido).

## 12. Critérios de aceite

1. A página mostra os 10 países/grupos com marcador na cidade sede.
2. Cada sede possui caixa com os 3 KPIs e linha até o marcador.
3. Alterar valores em `SITES` reflete na tela sem outras mudanças.
4. Os totais do cabeçalho equivalem à soma das caixas.

## 13. Roadmap

| Fase | Entrega |
|---|---|
| MVP | Mapa + KPIs estáticos (este documento) |
| v0.2 | Lista oficial de sedes e KPIs reais via arquivo JSON |
| v0.3 | Drill-down por país e filtros |
| v1.0 | Integração com fontes de dados e autenticação |

## 14. Riscos e questões em aberto

- Lista oficial de cidades sede (substitui as capitais assumidas).
- Definição de “Caribe” (países e cidade sede) dentro do CCAV.
- Fonte e periodicidade de atualização dos KPIs.
- Capital da Bolívia: La Paz ou Sucre.
