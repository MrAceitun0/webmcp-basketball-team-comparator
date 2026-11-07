"use strict";

const NOMBRES_EQUIPOS = {
  ALB: "Buenos Arenas Albacete Basket",
  AQU: "Zamora Enamora",
  CAJA: "Caja 87",
  CCC: "Coto Córdoba CB",
  EST: "Movistar Estudiantes",
  GBC: "Gipuzkoa Basket",
  GCN: "Dreamland Gran Canaria",
  GRA: "CB Granada",
  ICE: "Grupo Alega Cantabria Estela",
  LUC: "HLA Alicante",
  MEN: "Bàsquet Menorca",
  MON: "Baloncesto Fuenlabrada",
  OCB: "Alimerka Oviedo Baloncesto",
  OUR: "Club Ourense Baloncesto",
  PAE: "FIBWI Palma",
  PAL: "Palencia Baloncesto",
  PBM: "Palma Bàsquet Mallorca",
  TIZ: "Grupo Ureta Tizona Burgos"
};

const POSICIONES = [
  { codigo: "PG", nombre: "Base",      alias: ["base", "bases", "pg", "point guard", "1"] },
  { codigo: "SG", nombre: "Escolta",   alias: ["escolta", "escoltas", "sg", "shooting guard", "2"] },
  { codigo: "SF", nombre: "Alero",     alias: ["alero", "aleros", "sf", "small forward", "3"] },
  { codigo: "PF", nombre: "Ala-pívot", alias: ["ala-pivot", "ala pivot", "alapivot", "ala-pivots", "pf", "power forward", "4"] },
  { codigo: "C",  nombre: "Pívot",     alias: ["pivot", "pivots", "c", "center", "centro", "5", "interior", "interiores"] },
  { codigo: "N/D", nombre: "Sin posición", alias: ["n/d", "nd", "sin posicion", "desconocida"] }
];

const METRICAS = [
  { clave: "pts",    dato: "puntos",      etiqueta: "Puntos",        corta: "PTS",  decimales: 1, alias: ["puntos", "pts", "ppg", "anotacion"] },
  { clave: "reb",    dato: "rebotes",     etiqueta: "Rebotes",       corta: "REB",  decimales: 1, alias: ["rebotes", "reb", "rpg"] },
  { clave: "ast",    dato: "asistencias", etiqueta: "Asistencias",   corta: "AST",  decimales: 1, alias: ["asistencias", "ast", "apg"] },
  { clave: "t3pct",  dato: "triplesPct",  etiqueta: "% Triples",     corta: "3P%",  decimales: 1, porcentaje: true, alias: ["porcentaje de triples", "porcentaje triples", "triples", "3p%", "3p", "% triples", "triples%"] },
  { clave: "t3m",    dato: "triples",     etiqueta: "Triples anotados", corta: "3PM", decimales: 1, alias: ["triples anotados", "3pm"] },
  { clave: "tcpct",  dato: "tirosCampoPct", etiqueta: "% Tiros de campo", corta: "TC%", decimales: 1, porcentaje: true, alias: ["tiros de campo", "fg%", "tc%", "porcentaje de tiro"] },
  { clave: "rob",    dato: "robos",       etiqueta: "Robos",         corta: "ROB",  decimales: 1, alias: ["robos", "stl", "spg"] },
  { clave: "tap",    dato: "tapones",     etiqueta: "Tapones",       corta: "TAP",  decimales: 1, alias: ["tapones", "blk", "bpg"] },
  { clave: "tov",    dato: "perdidas",    etiqueta: "Pérdidas",      corta: "PÉRD", decimales: 1, menosEsMejor: true, alias: ["perdidas", "tov", "to"] },
  { clave: "min",    dato: "minutos",     etiqueta: "Minutos",       corta: "MIN",  decimales: 1, alias: ["minutos", "min", "mpg"] },
  { clave: "pj",     dato: "partidos",    etiqueta: "Partidos jugados", corta: "PJ", decimales: 0, alias: ["partidos", "partidos jugados", "pj", "gp"] },
  { clave: "per",    dato: "per",         etiqueta: "PER",           corta: "PER",  decimales: 1, alias: ["per", "eficiencia", "valoracion"] },
  { clave: "maxPts", dato: "maxPuntos",   etiqueta: "Máx. anotación", corta: "MÁX", decimales: 0, alias: ["maxima anotacion", "max", "maximo", "high game", "maxima"] }
];

const COLUMNAS_TABLA = ["pj", "min", "pts", "reb", "ast", "t3pct", "t3m", "rob", "tap", "tov", "per", "maxPts"];

const METRICAS_COMPARATIVA = ["pts", "reb", "ast", "t3m", "t3pct", "tcpct", "rob", "tap", "tov", "per"];

const num = (v) => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

function procesarRegistro(r) {
  return {
    id: String(r["id_jugador"] || ""),
    nombre: String(r["Jugador"] || "").trim(),
    equipo: String(r["Equipo"] || "").trim(),
    posicion: String(r["Posición"] || "N/D").trim() || "N/D",
    pj: num(r["Partidos jugados"]),
    min: num(r["Media MPG"]),
    pts: num(r["Media PPG"]),
    tcm: num(r["Media FGM"]),
    tca: num(r["Media FGA"]),
    tcpct: num(r["Media FG%"]) * 100,
    t3m: num(r["Media 3PM"]),
    t3a: num(r["Media 3PA"]),
    t3pct: num(r["Media 3P%"]) * 100,
    tlpct: num(r["Media FT%"]) * 100,
    reb: num(r["Media RPG"]),
    ast: num(r["Media APG"]),
    rob: num(r["Media SPG"]),
    tap: num(r["Media BPG"]),
    tov: num(r["Media TOV"]),
    per: num(r["PER"]),
    maxPts: num(r["Máxima anotación en un partido"])
  };
}

let JUGADORES = [];
const PARTIDOS_EQUIPO = {};

async function cargarJugadores() {
  const resp = await fetch("realgm_primera_feb_2026_27.json");
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const crudo = await resp.json();
  JUGADORES = crudo.map(procesarRegistro).filter((j) => j.nombre && j.equipo);
  for (const j of JUGADORES) {
    PARTIDOS_EQUIPO[j.equipo] = Math.max(PARTIDOS_EQUIPO[j.equipo] || 0, j.pj);
  }
}

const ESTADO = {
  equipoA: null,
  equipoB: null,
  posicion: "todas",
  vista: "ambos",
  orden: null,
  direccion: "desc",
  resaltado: null
};

const $ = (sel) => document.querySelector(sel);
const panel = $("#panel");
const cuerpoTabla = $("#cuerpo-tabla");
let filasOriginales = [];

const normalizar = (s) =>
  String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const nombreEquipo = (codigo) => NOMBRES_EQUIPOS[codigo] || codigo;
const nombrePosicion = (codigo) => (POSICIONES.find((p) => p.codigo === codigo) || {}).nombre || codigo;
const metrica = (clave) => METRICAS.find((m) => m.clave === clave);

function formatear(valor, m) {
  if (!m) return String(valor);
  const texto = valor.toFixed(m.decimales).replace(".", ",");
  return m.porcentaje ? texto + " %" : texto;
}

function escaparHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function resolverPosicion(valor) {
  const v = normalizar(valor);
  if (["", "todas", "todos", "all", "cualquiera"].includes(v)) return "todas";
  for (const p of POSICIONES) {
    if (normalizar(p.codigo) === v || normalizar(p.nombre) === v || p.alias.includes(v)) return p.codigo;
  }
  return null;
}

function resolverMetrica(valor) {
  const v = normalizar(valor);
  const m = METRICAS.find((m) => m.clave.toLowerCase() === v || normalizar(m.etiqueta) === v || m.alias.includes(v));
  return m ? m.clave : null;
}

function resolverEquipo(valor) {
  const v = normalizar(valor);
  if (!v) return null;
  const codigos = Object.keys(PARTIDOS_EQUIPO);
  return (
    codigos.find((c) => normalizar(c) === v) ||
    codigos.find((c) => normalizar(nombreEquipo(c)) === v) ||
    codigos.find((c) => normalizar(nombreEquipo(c)).includes(v)) ||
    null
  );
}

const equiposSeleccionados = () => Boolean(ESTADO.equipoA && ESTADO.equipoB);
const faltanEquipos = () => ({ ok: false, mensaje: "Primero selecciona dos equipos con seleccionarEquipos(equipoA, equipoB)." });

function jugadoresDe(equipo, posicion = "todas") {
  return JUGADORES.filter((j) => j.equipo === equipo && (posicion === "todas" || j.posicion === posicion));
}

function sincronizarEstado() {
  const visibles = [...cuerpoTabla.rows].filter((tr) => !tr.hidden);
  panel.dataset.equipoA = ESTADO.equipoA || "";
  panel.dataset.equipoB = ESTADO.equipoB || "";
  panel.dataset.filtroPosicion = ESTADO.posicion;
  panel.dataset.vistaEquipo = ESTADO.vista;
  panel.dataset.orden = ESTADO.orden || "";
  panel.dataset.direccion = ESTADO.direccion;
  panel.dataset.resaltado = ESTADO.resaltado || "";
  panel.dataset.jugadoresVisibles = String(visibles.length);

  document.querySelectorAll("#botones-posicion button").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.valor === ESTADO.posicion)));
  document.querySelectorAll("#botones-vista button").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.valor === ESTADO.vista)));
  $("#sel-orden").value = ESTADO.orden || "";
  $("#sel-direccion").value = ESTADO.direccion;

  document.querySelectorAll("#fila-cabecera th[data-metrica]").forEach((th) => {
    if (th.dataset.metrica === ESTADO.orden) th.setAttribute("aria-sort", ESTADO.direccion === "asc" ? "ascending" : "descending");
    else th.removeAttribute("aria-sort");
  });

  const partes = [`Mostrando ${visibles.length} de ${cuerpoTabla.rows.length} jugadores`];
  if (ESTADO.posicion !== "todas") partes.push(nombrePosicion(ESTADO.posicion));
  if (ESTADO.vista !== "ambos") partes.push(nombreEquipo(ESTADO.vista === "A" ? ESTADO.equipoA : ESTADO.equipoB));
  if (ESTADO.orden) partes.push(`ordenado por ${metrica(ESTADO.orden).etiqueta} (${ESTADO.direccion === "asc" ? "menor a mayor" : "mayor a menor"})`);
  if (ESTADO.resaltado) partes.push(`resaltado: ${ESTADO.resaltado}`);
  $("#estado").textContent = partes.join(" · ");
}

function nombresVisibles() {
  return [...cuerpoTabla.rows].filter((tr) => !tr.hidden).map((tr) => tr.dataset.jugador);
}

function crearControles() {
  const cont = $("#botones-posicion");
  const opciones = [{ codigo: "todas", nombre: "Todas" }, ...POSICIONES.filter((p) => p.codigo !== "N/D")];
  cont.innerHTML = opciones
    .map((p) => `<button type="button" data-valor="${p.codigo}" aria-pressed="${p.codigo === "todas"}">${p.nombre}</button>`)
    .join("");

  $("#fila-cabecera").innerHTML =
    '<th scope="col">Jugador</th><th scope="col">Equipo</th><th scope="col">Pos.</th>' +
    COLUMNAS_TABLA.map((c) => {
      const m = metrica(c);
      return `<th scope="col" data-metrica="${c}"><button type="button" title="Ordenar por ${m.etiqueta}">${m.corta}</button></th>`;
    }).join("");
}

function renderTabla() {
  const lados = { [ESTADO.equipoA]: "A", [ESTADO.equipoB]: "B" };
  const lista = [...jugadoresDe(ESTADO.equipoA), ...jugadoresDe(ESTADO.equipoB)].sort(
    (x, y) => (lados[x.equipo] === lados[y.equipo] ? y.pts - x.pts : lados[x.equipo] === "A" ? -1 : 1)
  );

  cuerpoTabla.innerHTML = "";
  for (const j of lista) {
    const tr = document.createElement("tr");
    const lado = lados[j.equipo];
    tr.dataset.componente = "fila-jugador";
    tr.dataset.id = j.id;
    tr.dataset.jugador = j.nombre;
    tr.dataset.equipo = j.equipo;
    tr.dataset.lado = lado;
    tr.dataset.posicion = j.posicion;
    for (const m of METRICAS) tr.dataset[m.dato] = String(+j[m.clave].toFixed(2));
    tr.dataset.visible = "true";
    tr.dataset.resaltado = "false";

    tr.innerHTML =
      `<td>${escaparHTML(j.nombre)}</td>` +
      `<td><span class="chip ${lado}" title="${escaparHTML(nombreEquipo(j.equipo))}">${j.equipo}</span></td>` +
      `<td title="${nombrePosicion(j.posicion)}">${j.posicion}</td>` +
      COLUMNAS_TABLA.map((c) => `<td data-metrica="${c}">${formatear(j[c], metrica(c))}</td>`).join("");
    cuerpoTabla.appendChild(tr);
  }
  filasOriginales = [...cuerpoTabla.rows];

  $("#lista-jugadores").innerHTML = lista.map((j) => `<option value="${escaparHTML(j.nombre)}"></option>`).join("");
  $("#btn-vista-a").textContent = nombreEquipo(ESTADO.equipoA);
  $("#btn-vista-b").textContent = nombreEquipo(ESTADO.equipoB);
}

function agregados(equipo, posicion) {
  const js = jugadoresDe(equipo, posicion);
  const g = PARTIDOS_EQUIPO[equipo] || 1;
  const suma = (f) => js.reduce((acc, j) => acc + f(j) * j.pj, 0);
  const t3a = suma((j) => j.t3a);
  const tca = suma((j) => j.tca);
  const minutos = suma((j) => j.min);
  const top = (clave) => js.reduce((mejor, j) => (!mejor || j[clave] > mejor[clave] ? j : mejor), null);
  return {
    jugadores: js.length,
    partidos: g,
    pts: suma((j) => j.pts) / g,
    reb: suma((j) => j.reb) / g,
    ast: suma((j) => j.ast) / g,
    t3m: suma((j) => j.t3m) / g,
    t3pct: t3a ? (suma((j) => j.t3m) / t3a) * 100 : 0,
    tcpct: tca ? (suma((j) => j.tcm) / tca) * 100 : 0,
    rob: suma((j) => j.rob) / g,
    tap: suma((j) => j.tap) / g,
    tov: suma((j) => j.tov) / g,
    per: minutos ? suma((j) => j.per * j.min) / minutos : 0,
    lideres: { pts: top("pts"), reb: top("reb"), ast: top("ast"), per: top("per"), maxPts: top("maxPts") }
  };
}

function renderTarjetaEquipo(el, codigo, ag) {
  const lider = (j, clave) =>
    j ? `${escaparHTML(j.nombre)} <span>(${formatear(j[clave], metrica(clave))})</span>` : "—";
  el.dataset.equipo = codigo;
  el.innerHTML = `
    <h3>${escaparHTML(nombreEquipo(codigo))}</h3>
    <p class="meta">${codigo} · ${ag.partidos} partidos · ${ag.jugadores} jugadores en la selección</p>
    <dl>
      <dt>Máx. anotador</dt><dd data-lider="pts">${lider(ag.lideres.pts, "pts")}</dd>
      <dt>Reboteador</dt><dd data-lider="reb">${lider(ag.lideres.reb, "reb")}</dd>
      <dt>Asistente</dt><dd data-lider="ast">${lider(ag.lideres.ast, "ast")}</dd>
      <dt>Mejor PER</dt><dd data-lider="per">${lider(ag.lideres.per, "per")}</dd>
      <dt>Récord en un partido</dt><dd data-lider="maxPts">${lider(ag.lideres.maxPts, "maxPts")}</dd>
    </dl>`;
}

function renderComparativa() {
  const pos = ESTADO.posicion;
  const agA = agregados(ESTADO.equipoA, pos);
  const agB = agregados(ESTADO.equipoB, pos);

  $("#ayuda-comparativa").textContent = pos === "todas"
    ? "Producción por partido de toda la plantilla (media × partidos jugados ÷ partidos del equipo). En negrita, quien tiene ventaja."
    : `Producción por partido de los jugadores en posición ${nombrePosicion(pos)} de cada equipo. En negrita, quien tiene ventaja.`;

  renderTarjetaEquipo($("#card-equipo-a"), ESTADO.equipoA, agA);
  renderTarjetaEquipo($("#card-equipo-b"), ESTADO.equipoB, agB);

  $("#barras-comparativa").innerHTML = METRICAS_COMPARATIVA.map((clave) => {
    const m = metrica(clave);
    const a = agA[clave], b = agB[clave];
    const max = Math.max(a, b) || 1;
    let ventaja = "empate";
    if (Math.abs(a - b) > 1e-9) ventaja = (m.menosEsMejor ? a < b : a > b) ? "A" : "B";
    const etiqueta = clave === "per" ? "PER medio" : m.etiqueta + (m.menosEsMejor ? " (↓ mejor)" : "");
    return `
      <div class="barra-fila" role="listitem" data-metrica="${clave}" data-valor-a="${a.toFixed(2)}"
           data-valor-b="${b.toFixed(2)}" data-ventaja="${ventaja}">
        <span class="valor a">${formatear(a, m)}</span>
        <span class="pista a"><span class="relleno a" style="width:${(a / max) * 100}%"></span></span>
        <span class="etiqueta">${etiqueta}</span>
        <span class="pista"><span class="relleno b" style="width:${(b / max) * 100}%"></span></span>
        <span class="valor b">${formatear(b, m)}</span>
      </div>`;
  }).join("");
}

function renderDuelos() {
  const posiciones = POSICIONES.filter((p) => p.codigo !== "N/D" && (ESTADO.posicion === "todas" || p.codigo === ESTADO.posicion));
  const titular = (equipo, pos) => jugadoresDe(equipo, pos).sort((x, y) => y.min - x.min)[0];
  const mini = (j, lado) => j
    ? `<div class="jugador-mini" data-lado="${lado}" data-id="${j.id}" data-jugador="${escaparHTML(j.nombre)}">
         <strong>${escaparHTML(j.nombre)}</strong>
         <span>${formatear(j.min, metrica("min"))} min · ${formatear(j.pts, metrica("pts"))} pts · ${formatear(j.reb, metrica("reb"))} reb · ${formatear(j.ast, metrica("ast"))} ast · PER ${formatear(j.per, metrica("per"))}</span>
       </div>`
    : `<div class="jugador-mini vacio" data-lado="${lado}">Sin jugador en esta posición</div>`;

  $("#duelos").innerHTML = posiciones.map((p) => `
    <div class="duelo" data-posicion="${p.codigo}">
      ${mini(titular(ESTADO.equipoA, p.codigo), "A")}
      <div class="pos">${p.nombre}</div>
      ${mini(titular(ESTADO.equipoB, p.codigo), "B")}
    </div>`).join("");
  aplicarResaltado();
}

function aplicarFiltros() {
  for (const tr of cuerpoTabla.rows) {
    const okPos = ESTADO.posicion === "todas" || tr.dataset.posicion === ESTADO.posicion;
    const okVista = ESTADO.vista === "ambos" || tr.dataset.lado === ESTADO.vista;
    tr.hidden = !(okPos && okVista);
    tr.dataset.visible = String(!tr.hidden);
  }
  renderComparativa();
  renderDuelos();
  sincronizarEstado();
}

function aplicarResaltado() {
  const q = normalizar(ESTADO.resaltado);
  document.querySelectorAll("[data-jugador]").forEach((el) => {
    if (el === panel) return;
    const activo = Boolean(q) && normalizar(el.dataset.jugador) === q;
    el.classList.toggle("resaltado", activo);
    if (el.tagName === "TR") el.dataset.resaltado = String(activo);
  });
}

window.seleccionarEquipos = function (equipoA, equipoB) {
  const a = resolverEquipo(equipoA);
  const b = resolverEquipo(equipoB);
  const disponibles = Object.keys(PARTIDOS_EQUIPO).map((c) => `${c} (${nombreEquipo(c)})`);
  if (!a || !b) {
    const msg = `Equipo no encontrado: ${!a ? equipoA : equipoB}.`;
    $("#error-equipos").textContent = msg;
    return { ok: false, mensaje: msg, equiposDisponibles: disponibles };
  }
  if (a === b) {
    const msg = "Elige dos equipos distintos.";
    $("#error-equipos").textContent = msg;
    return { ok: false, mensaje: msg };
  }
  $("#error-equipos").textContent = "";
  ESTADO.equipoA = a;
  ESTADO.equipoB = b;
  $("#sel-equipo-a").value = a;
  $("#sel-equipo-b").value = b;
  renderTabla();
  ["#seccion-comparativa", "#seccion-duelos", "#seccion-jugadores"].forEach((s) => ($(s).hidden = false));
  window.limpiarFiltros();
  return {
    ok: true,
    mensaje: `Comparando ${nombreEquipo(a)} (A) con ${nombreEquipo(b)} (B).`,
    equipoA: a, equipoB: b,
    jugadores: cuerpoTabla.rows.length
  };
};

window.filtrarPorPosicion = function (posicion) {
  if (!equiposSeleccionados()) return faltanEquipos();
  const codigo = resolverPosicion(posicion);
  if (!codigo) {
    return { ok: false, mensaje: `Posición no válida: "${posicion}". Usa Base, Escolta, Alero, Ala-pívot, Pívot o todas.` };
  }
  ESTADO.posicion = codigo;
  aplicarFiltros();
  return { ok: true, posicion: codigo, nombrePosicion: codigo === "todas" ? "Todas" : nombrePosicion(codigo), visibles: nombresVisibles() };
};

window.filtrarPorEquipo = function (equipo) {
  if (!equiposSeleccionados()) return faltanEquipos();
  const v = normalizar(equipo);
  let vista = null;
  if (["", "ambos", "todos", "los dos"].includes(v)) vista = "ambos";
  else if (v === "a") vista = "A";
  else if (v === "b") vista = "B";
  else {
    const c = resolverEquipo(equipo);
    if (c === ESTADO.equipoA) vista = "A";
    else if (c === ESTADO.equipoB) vista = "B";
  }
  if (!vista) return { ok: false, mensaje: `"${equipo}" no es uno de los equipos seleccionados.` };
  ESTADO.vista = vista;
  aplicarFiltros();
  return { ok: true, vista, visibles: nombresVisibles() };
};

window.ordenarPorEstadistica = function (metricaPedida, direccion = "desc") {
  if (!equiposSeleccionados()) return faltanEquipos();
  const clave = resolverMetrica(metricaPedida);
  if (!clave) {
    return { ok: false, mensaje: `Métrica no válida: "${metricaPedida}".`, metricasDisponibles: METRICAS.map((m) => m.etiqueta) };
  }
  const dir = normalizar(direccion) === "asc" ? "asc" : "desc";
  const dato = metrica(clave).dato;
  const filas = [...cuerpoTabla.rows].sort((x, y) => {
    const d = parseFloat(x.dataset[dato]) - parseFloat(y.dataset[dato]);
    return dir === "asc" ? d : -d;
  });
  filas.forEach((tr) => cuerpoTabla.appendChild(tr));
  ESTADO.orden = clave;
  ESTADO.direccion = dir;
  sincronizarEstado();
  return {
    ok: true, metrica: metrica(clave).etiqueta, direccion: dir,
    top5: filas.filter((tr) => !tr.hidden).slice(0, 5).map((tr) => ({ jugador: tr.dataset.jugador, equipo: tr.dataset.equipo, valor: parseFloat(tr.dataset[dato]) }))
  };
};

window.resaltarJugador = function (nombre) {
  if (!equiposSeleccionados()) return faltanEquipos();
  const q = normalizar(nombre);
  if (!q) {
    ESTADO.resaltado = null;
    aplicarResaltado();
    sincronizarEstado();
    return { ok: true, mensaje: "Resaltado eliminado." };
  }
  const filas = [...cuerpoTabla.rows];
  const exacta = filas.find((tr) => normalizar(tr.dataset.jugador) === q);
  const parciales = filas.filter((tr) => normalizar(tr.dataset.jugador).includes(q));
  const fila = exacta || parciales[0];
  if (!fila) return { ok: false, mensaje: `No hay ningún jugador "${nombre}" en los equipos seleccionados.` };
  if (!exacta && parciales.length > 1) {
    return { ok: false, mensaje: `"${nombre}" es ambiguo.`, coincidencias: parciales.map((tr) => tr.dataset.jugador) };
  }
  ESTADO.resaltado = fila.dataset.jugador;
  aplicarResaltado();
  sincronizarEstado();
  if (!fila.hidden) fila.scrollIntoView({ behavior: "smooth", block: "center" });
  return {
    ok: true,
    jugador: fila.dataset.jugador,
    equipo: fila.dataset.equipo,
    posicion: fila.dataset.posicion,
    ocultoPorFiltros: fila.hidden,
    estadisticas: Object.fromEntries(METRICAS.map((m) => [m.etiqueta, parseFloat(fila.dataset[m.dato])]))
  };
};

window.limpiarFiltros = function () {
  if (!equiposSeleccionados()) return faltanEquipos();
  ESTADO.posicion = "todas";
  ESTADO.vista = "ambos";
  ESTADO.orden = null;
  ESTADO.direccion = "desc";
  ESTADO.resaltado = null;
  filasOriginales.forEach((tr) => cuerpoTabla.appendChild(tr));
  $("#input-resaltar").value = "";
  aplicarFiltros();
  aplicarResaltado();
  sincronizarEstado();
  return { ok: true, mensaje: "Filtros, orden y resaltado restablecidos.", visibles: cuerpoTabla.rows.length };
};

window.obtenerEstado = function () {
  return {
    ...ESTADO,
    nombreEquipoA: ESTADO.equipoA ? nombreEquipo(ESTADO.equipoA) : null,
    nombreEquipoB: ESTADO.equipoB ? nombreEquipo(ESTADO.equipoB) : null,
    jugadoresVisibles: [...cuerpoTabla.rows].filter((tr) => !tr.hidden).map((tr) => ({ ...tr.dataset })),
    comparativa: [...document.querySelectorAll("#barras-comparativa .barra-fila")].map((f) => ({ ...f.dataset }))
  };
};

$("#form-equipos").addEventListener("submit", (e) => {
  e.preventDefault();
  const a = $("#sel-equipo-a").value;
  const b = $("#sel-equipo-b").value;
  const resultado = datosListos
    .then(() => !a || !b
      ? { ok: false, mensaje: "Selecciona los dos equipos." }
      : window.seleccionarEquipos(a, b))
    .catch(() => ({ ok: false, mensaje: "No se pudieron cargar los datos de jugadores." }));
  resultado.then((r) => { if (!r.ok) $("#error-equipos").textContent = r.mensaje; });
  if (e.agentInvoked) e.respondWith(resultado);
});

$("#form-orden").addEventListener("submit", (e) => {
  e.preventDefault();
  const metricaPedida = $("#sel-orden").value;
  const direccion = $("#sel-direccion").value;
  let resultado;
  if (!equiposSeleccionados()) resultado = faltanEquipos();
  else if (metricaPedida) resultado = window.ordenarPorEstadistica(metricaPedida, direccion);
  else {
    filasOriginales.forEach((tr) => cuerpoTabla.appendChild(tr));
    ESTADO.orden = null;
    ESTADO.direccion = direccion;
    sincronizarEstado();
    resultado = { ok: true, mensaje: "Orden original restaurado.", visibles: nombresVisibles() };
  }
  if (e.agentInvoked) e.respondWith(Promise.resolve(resultado));
});

$("#botones-posicion").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-valor]");
  if (b) window.filtrarPorPosicion(b.dataset.valor);
});

$("#botones-vista").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-valor]");
  if (b) window.filtrarPorEquipo(b.dataset.valor);
});

for (const sel of ["#sel-orden", "#sel-direccion"]) {
  $(sel).addEventListener("change", () => $("#form-orden").requestSubmit());
}

$("#fila-cabecera").addEventListener("click", (e) => {
  const th = e.target.closest("th[data-metrica]");
  if (!th) return;
  const dir = ESTADO.orden === th.dataset.metrica && ESTADO.direccion === "desc" ? "asc" : "desc";
  window.ordenarPorEstadistica(th.dataset.metrica, dir);
});

$("#input-resaltar").addEventListener("change", (e) => window.resaltarJugador(e.target.value));
$("#input-resaltar").addEventListener("search", (e) => { if (!e.target.value) window.resaltarJugador(""); });

$("#btn-limpiar").addEventListener("click", () => window.limpiarFiltros());

/* WebMCP Tool Registration - Imperative Approach */
async function registrarHerramientasWebMCP() {
  const contexto = document.modelContext ?? navigator.modelContext;
  if (!contexto) return;

  const requiereEquipos = "Requiere haber seleccionado equipos con seleccionar-equipos.";
  const posiciones = POSICIONES.filter((p) => p.codigo !== "N/D");
  const herramientas = [
    /*{ 
      name: '',
      description: '',
      inputSchema: {
        type: "object",
        properties: {
          posicion: {
            type: "string",
            enum: ["todas", ...posiciones.map((p) => p.codigo)],
            description: `${posiciones.map((p) => `${p.codigo} = ${p.nombre}`).join(", ")}, todas = sin filtro.`
          }
        },
        required: ["posicion"]
      },
      execute: async ({ posicion }) => window.filtrarPorPosicion(posicion)
    },*/
    /*{
      name: '',
      description: '',
      inputSchema: {
        type: "object",
        properties: {
          equipo: {
            type: "string",
            enum: ["ambos", "A", "B"],
            description: "A = equipo A (nuestro), B = equipo B (rival), ambos = sin filtro."
          }
        },
        required: ["equipo"]
      },
      execute: async ({ equipo }) => window.filtrarPorEquipo(equipo)
    },*/
    /*{
      name: '',
      description: '',
      inputSchema: {
        type: "object",
        properties: {
          nombre: {
            type: "string",
            description: "Nombre completo o parcial del jugador. Una cadena vacía quita el resaltado."
          }
        },
        required: ["nombre"]
      },
      execute: async ({ nombre }) => window.resaltarJugador(nombre)
    },*/
    /*{
      name: '',
      description: '',
      inputSchema: { type: "object", properties: {} },
      execute: async () => window.limpiarFiltros()
    }*/
  ];
  
  for (const herramienta of herramientas) {
    try {
      await contexto.registerTool(herramienta);
    } catch (err) {
      console.warn(`No se pudo registrar la herramienta ${herramienta.name}:`, err);
    }
  }
}

crearControles();
registrarHerramientasWebMCP();
const datosListos = cargarJugadores();
datosListos
  .catch((e) => {
    console.error("No se pudieron leer los datos de jugadores:", e);
    $("#error-equipos").textContent = "No se pudieron cargar los datos de jugadores.";
  });
