# Dashboard Engenharia de Dados LATAM – MVP

**Autor:** Silverio Leite Jr  
**Cargo:** Senior Solution Architect – OG1 TI  
**E-mail:** silverio.leitejr@og1.com.br  
**Telefone:** (11) 96020-6334

Dashboard com mapa de LATAM + México, cidades sede e caixas de KPI (Qtd. Projetos, Tabelas Core, Volume Total).

## Conteúdo

| Arquivo | Descrição |
|---|---|
| `dashboard-latam.html` | Página do dashboard (HTML/CSS/JS, mapa embutido, sem dependências externas). Abra direto no navegador. |
| `assets/mapa-latam.svg` | Mapa vetorial estilizado (países com id ISO alpha-2, capitais, grupos regionais). |
| `docs/PRD.md` | Documento de requisitos do produto. |
| `docs/DESIGN-SYSTEM.md` | Padrão de cores e fontes (OG1 / Agile Deck) aplicado ao dashboard. |
| `tools/gerar-mapa.mjs` | Script que gera o `mapa-latam.svg` (Natural Earth 50m via world-atlas). |

## Como usar

- **Visualizar:** abrir `dashboard-latam.html`.
- **Atualizar KPIs/sedes:** editar o array `SITES` no `<script>` do HTML.
- **Regerar o mapa:** `cd tools && npm install && npm run gerar` (grava em `assets/mapa-latam.svg`).
- **Trocar o mapa no dashboard:** colar o conteúdo do novo SVG dentro de `<g id="mapa-base">` e ajustar `MAP` no script se mudar escala/posição.

## Premissas

Cidades sede = capitais (Bolívia: La Paz; Caribe: Santo Domingo, a confirmar). Valores dos KPIs são fictícios.
