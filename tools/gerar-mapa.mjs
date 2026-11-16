import fs from 'fs';
import { geoMercator, geoPath, geoGraticule10 } from 'd3-geo';
import { feature } from 'topojson-client';

const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const all = feature(topo, topo.objects.countries).features;

// id ISO numérico -> [alpha2, nome PT, região, ccav?, projeto?]
const C = {
  484:['MX','México','mexico',0,1],
  320:['GT','Guatemala','centro',0,0], 84:['BZ','Belize','centro',0,0], 340:['HN','Honduras','centro',0,0],
  222:['SV','El Salvador','centro',0,0], 558:['NI','Nicarágua','centro',0,0], 188:['CR','Costa Rica','centro',1,1],
  591:['PA','Panamá','centro',0,0],
  192:['CU','Cuba','caribe',1,0], 332:['HT','Haiti','caribe',1,0], 214:['DO','República Dominicana','caribe',1,0],
  388:['JM','Jamaica','caribe',1,0], 44:['BS','Bahamas','caribe',1,0], 780:['TT','Trinidad e Tobago','caribe',1,0],
  630:['PR','Porto Rico','caribe',1,0], 52:['BB','Barbados','caribe',1,0], 662:['LC','Santa Lúcia','caribe',1,0],
  670:['VC','São Vicente e Granadinas','caribe',1,0], 308:['GD','Granada','caribe',1,0],
  28:['AG','Antígua e Barbuda','caribe',1,0], 212:['DM','Dominica','caribe',1,0], 659:['KN','São Cristóvão e Névis','caribe',1,0],
  170:['CO','Colômbia','sul',0,0], 862:['VE','Venezuela','sul',1,1], 328:['GY','Guiana','sul',0,0],
  740:['SR','Suriname','sul',0,0], 218:['EC','Equador','sul',0,1], 604:['PE','Peru','sul',0,0],
  76:['BR','Brasil','sul',0,1], 68:['BO','Bolívia','sul',0,1], 600:['PY','Paraguai','sul',0,1],
  152:['CL','Chile','sul',0,1], 32:['AR','Argentina','sul',0,1], 858:['UY','Uruguai','sul',0,1]
};
// capitais [alpha2, cidade, lat, lon]
const CAPS = [
 ['MX','Cidade do México',19.43,-99.13],['GT','Cidade da Guatemala',14.63,-90.51],['BZ','Belmopan',17.25,-88.77],
 ['HN','Tegucigalpa',14.07,-87.19],['SV','San Salvador',13.69,-89.19],['NI','Manágua',12.13,-86.25],
 ['CR','San José',9.93,-84.08],['PA','Cidade do Panamá',8.98,-79.52],['CU','Havana',23.11,-82.37],
 ['HT','Porto Príncipe',18.54,-72.34],['DO','Santo Domingo',18.49,-69.93],['JM','Kingston',17.97,-76.79],
 ['BS','Nassau',25.05,-77.35],['TT','Port of Spain',10.66,-61.51],['PR','San Juan',18.47,-66.11],
 ['CO','Bogotá',4.71,-74.07],['VE','Caracas',10.48,-66.90],['GY','Georgetown',6.80,-58.16],
 ['SR','Paramaribo',5.85,-55.20],['EC','Quito',-0.18,-78.47],['PE','Lima',-12.05,-77.04],
 ['BR','Brasília',-15.79,-47.88],['BO','La Paz',-16.50,-68.15],['PY','Assunção',-25.26,-57.58],
 ['CL','Santiago',-33.45,-70.67],['AR','Buenos Aires',-34.60,-58.38],['UY','Montevidéu',-34.90,-56.16]
];

const feats = all.filter(f => C[+f.id]);
const W = 1000, PAD = 30;
const bounds = { type: 'MultiPoint', coordinates: [[-118, 33.5], [-27, -56.5]] };
const proj = geoMercator().fitWidth(W - 2 * PAD, bounds);
// recalcula com padding
const [[x0, y0], [x1, y1]] = geoPath(proj).bounds(bounds);
const H = Math.ceil(y1 - y0 + 2 * PAD);
proj.translate([proj.translate()[0] + PAD, proj.translate()[1] - y0 + PAD]);
const path = geoPath(proj).digits(1);

const COL={oceano:'#0d1624',grade:'#1b2a43',sombra:'#070d17',borda:'#0d1624',mexico:'#2f8f86',centro:'#3a7ca5',caribe:'#c98f2b',sul:'#4a6fa5',projeto:'#3bb3a8',centroMudo:'#2a5273',caribeMudo:'#74582a',sulMudo:'#2c4268',ccav:'#e6aa3c',destaque:'#ffffff',capital:'#ffffff',texto:'#e8eef8'};
const fillOf=(reg,ccav,p)=> p ? (ccav?COL.ccav:(reg==='mexico'?COL.mexico:COL.projeto)) : COL[reg+'Mudo'];
const byRegion = r => feats.filter(f => C[+f.id][2] === r);
const regionName = { mexico: 'México', centro: 'América Central', caribe: 'Caribe', sul: 'América do Sul' };
const countryPath = f => {
  const [a2, nome, reg, ccav, proj_] = C[+f.id];
  const cls = ['pais', reg, ccav ? 'ccav' : '', proj_ ? 'projeto' : ''].filter(Boolean).join(' ');
  const op = 1;
  return `      <path id="${a2}" class="${cls}" fill="${fillOf(reg, ccav, proj_)}" fill-opacity="${op}" stroke="${COL.borda}" stroke-width="1" stroke-linejoin="round" data-nome="${nome}" data-regiao="${regionName[reg]}" d="${path(f)}"/>`;
};
const shadow = path({ type: 'FeatureCollection', features: feats });
const grat = path(geoGraticule10());
const capsSvg = CAPS.map(([a2, cid, lat, lon]) => {
  const [x, y] = proj([lon, lat]);
  return `      <g id="cap-${a2}" class="capital ${C[Object.keys(C).find(k => C[k][0] === a2)][3] ? 'ccav' : ''}" data-cidade="${cid}" data-pais="${a2}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle class="halo" r="9" fill="none" stroke="${COL.capital}" stroke-opacity="0.45"/><circle class="dot" r="4.5" fill="${C[Object.keys(C).find(k => C[k][0] === a2)][3] ? COL.ccav : COL.capital}" stroke="${COL.oceano}" stroke-width="1.8"/><text class="rotulo" x="9" y="${a2 === 'UY' ? 16 : -8}" fill="${COL.texto}" font-family="Segoe UI, Arial, sans-serif" font-size="11" font-weight="600"${C[Object.keys(C).find(k => C[k][0] === a2)][4] ? "" : ' display="none"'}>${cid}</text></g>`;
}).join('\n');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Mapa vetorial estilizado – América Latina, América Central, Caribe e México
  Autor:    Silverio Leite Jr
  Cargo:    Senior Solution Architect – OG1 TI
  E-mail:   silverio.leitejr@og1.com.br
  Telefone: (11) 96020-6334
  Fonte geométrica: Natural Earth via world-atlas 50m (domínio público). Projeção: Mercator.
  Estrutura: <g id="paises"> (um <path> por país, id = ISO alpha-2), <g id="capitais">, <g id="rotulos-paises">.
  Customização: cada elemento traz fill/stroke como atributos (Figma, Illustrator, Inkscape) e classes CSS (web); edite os atributos ou as regras em <style>.
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
  <title id="t">Mapa da América Latina, América Central e México</title>
  <desc id="d">Mapa vetorial estilizado com países, capitais e grupos regionais (México, América Central, Caribe, América do Sul).</desc>
  <style>
    .oceano { fill: ${COL.oceano}; }
    .grade { fill: none; stroke: ${COL.grade}; stroke-width: .6; }
    .sombra { fill: ${COL.sombra}; }
    .pais { stroke: ${COL.borda}; stroke-width: 1; stroke-linejoin: round; }
    .pais.mexico { fill: ${COL.mexico}; }
    .pais.centro { fill: ${COL.centroMudo}; }
    .pais.caribe { fill: ${COL.caribeMudo}; }
    .pais.sul { fill: ${COL.sulMudo}; }
    .pais.projeto:not(.ccav):not(.mexico) { fill: ${COL.projeto}; }
    .pais.ccav.projeto { fill: ${COL.ccav}; }
    .pais:hover { stroke: ${COL.destaque}; stroke-width: 1.6; }
    .capital .dot  { fill: ${COL.capital}; stroke: ${COL.oceano}; stroke-width: 1.8; }
    .capital .halo { fill: none; stroke: ${COL.capital}; stroke-width: 1; opacity: .45; }
    .capital.ccav .dot { fill: ${COL.ccav}; }
      .rotulo { font: 600 11px "Segoe UI", system-ui, Arial, sans-serif; fill: ${COL.texto}; }
    #rotulos-paises { display: none; }
  </style>
  <rect class="oceano" fill="${COL.oceano}" width="${W}" height="${H}"/>
  <path class="grade" fill="none" stroke="${COL.grade}" stroke-width="0.6" d="${grat}"/>
  <g id="sombra" transform="translate(4 6)"><path class="sombra" fill="${COL.sombra}" d="${shadow}"/></g>
  <g id="paises">
${['mexico', 'centro', 'caribe', 'sul'].map(r => `    <g id="${r}" data-regiao="${regionName[r]}">\n${byRegion(r).map(countryPath).join('\n')}\n    </g>`).join('\n')}
  </g>
  <g id="capitais">
${capsSvg}
  </g>
</svg>
`;
fs.writeFileSync('../assets/mapa-latam.svg', svg);
console.log('H=', H, 'size KB=', (svg.length / 1024).toFixed(0), 'paises=', feats.length);
