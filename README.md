# Prepara tu web para la era de la IA agéntica
**Taller Hands-On para DevFest Ourense 2026**

En este taller práctico vamos a desarrollar una aplicación que esté lista para el uso agéntico. Usando WebMCP APIs declarativas e imperativas, vamos a exponer la funcionalidad de esta web para que los agentes de IA puedan interactuar con ella de una forma más eficaz, rápida, barata y consistente.

Creado por: [Sergi Olives](https://www.linkedin.com/in/sergiolives/)

[Google Slides](https://docs.google.com/presentation/d/1_hfSLmokd8vSZfXU8BTfPn1qBoyGoG0WuBFW4zgo6Ww/edit?usp=sharing)

## 🛠️ Set-up
1. **Descarga este repositorio:** vamos a trabajar con la carpeta **start** - recomiendo hacer un **fork** del repositorio si tienes github
2. **Chrome:** Versión 150 (Revisa la versión en [chrome://settings/help](chrome://settings/help)).
3. **Activa las WebMCP Flags:** Copia y pega este texto en el navegador de chrome y activalo:
[chrome://flags/#enable-webmcp-testing](chrome://flags/#enable-webmcp-testing)
4. **Instala [WebMCP Model Context Tools Inspector](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd?pli=1)**
5. **Gemini API Key**: To use the Gemini integration of the extension, you will need a Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/api-keys).
6. **Inicia la web en un servidor HTTP**

Opciones:
1. Usando Python
```
python3 -m http.server 8000
```
2. Usando NPX
```
npx http-server --port=8080 -c-1
```
3. Usa la extensión en tu IDE de [LiveServer](https://open-vsx.org/extension/ritwickdey/LiveServer)

> [!IMPORTANT]
> * **Carpeta de trabajo:** Todo el código práctico del taller debe hacerse dentro del directorio [`start/`](start/).
> * **Soluciones de referencia:** Si te atascas o quieres ver una implementación funcional, tienes las soluciones completas en el directorio [`agent-ready/`](agent-ready/). Cada tarea es modular: puedes cambiarte a la carpeta `agent-ready/` en cualquier momento sin perder el ritmo.


> [!TIP]
> * **Gemini API Key:** Si usas una API Key gratuita, Google podría limitarte los usos, esperate un minuto para volver a usarla. Si usas una API Key de pago, podrás hacer llamadas ilimitadas.

## Demos previas
### Le Petit Bistro - Reserva en tu restaurante favorito (imperative)
[Demo](https://googlechromelabs.github.io/webmcp-tools/demos/french-bistro/)

[Repositorio](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/french-bistro)

### zaMaker! - Haz tu propia pizza con WebMCP (declarative)
[Demo](https://googlechromelabs.github.io/webmcp-tools/demos/pizza-maker/)

[Repositorio](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/pizza-maker)

### Proxx - Hasta el buscaminas es agent-ready (declarative)
[Demo](https://googlechromelabs.github.io/webmcp-tools/demos/proxx-lite/)

[Repositorio](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/proxx-lite)


## Declarative WebMCP

**Elegir equipos.**
En [`start/index.html`](start/index.html) añade al formulario `#form-equipos`:
   ```html
   <form id="form-equipos"
         toolname="seleccionar-equipos"
         tooldescription="Selecciona los dos equipos de Primera FEB a comparar..."
         toolautosubmit>
     <select id="sel-equipo-a" name="equipoA" required
             toolparamdescription="Código del equipo A (nuestro equipo o local), p. ej. OUR"></select>
     ...
   ```
   * `toolname` / `tooldescription`: nombre y descripción de la herramienta.
   * `name` + `toolparamdescription`: cada campo es un parámetro del esquema.
   * `toolautosubmit`: true/false el agente envía el formulario sin esperar a que el usuario pulse el botón.
  

> [!TIP]
> * **¿Ya ves tu herramienta en la extensión de WebMCP?** Implementa el filtro por estadísticas con programación declarativa

## Imperative WebMCP

1. **Detecta la API** y regístrala al cargar la página:
   ```js
   const contexto = document.modelContext ?? navigator.modelContext;
   if (!contexto) return;
   ```
2. **Registra una herramienta por intención** con `registerTool`. El esquema se construye a partir de las constantes de la app (`POSICIONES`) para que no se desincronice, y `execute` reutiliza las funciones que ya usa la UI:
   ```js
   await contexto.registerTool({
     name: "filtrar-por-posicion",
     description: "Muestra solo los jugadores de una posición... Requiere haber seleccionado equipos con seleccionar-equipos.",
     inputSchema: {
       type: "object",
       properties: {
         posicion: { type: "string", enum: ["todas", "PG", "SG", "SF", "PF", "C"] }
       },
       required: ["posicion"]
     },
     execute: async ({ posicion }) => window.filtrarPorPosicion(posicion)
   });
   ```
3. Repite para `filtrar-por-equipo` (`enum: ["ambos", "A", "B"]`), `resaltar-jugador` (`nombre: string`) y `limpiar-filtros` (sin parámetros).
4. **Comprueba** con WebMCP Model Context Tools Inspector que aparecen 6 herramientas y pide a Gemini, por ejemplo: *"Compara Ourense con Estudiantes, solo pívots, ordenados por PER de menor a mayor"*.

## Lighthouse Evaluation
Si tienes tu servidor local, puedes evaluar tus cambios.
De no ser así puedes usar las versión inicial y la final en estos links:

[App sin herramientas agenticas](https://webmcp-basketball-team-comparator.vercel.app/start/)

[App agent-ready](https://webmcp-basketball-team-comparator.vercel.app/agent-ready/)

1. Abre el inspector de Chrome
    * Ctrl + Shift + I en Windows
    * Option + CMD + I
2. Ves a la pestaña de Lighthouse
3. Selecciona los siguientes parametros:
    * Navigation
    * Desktop
    * Agentic Browsing

## Recursos Extra
* [Collection of WebMCP Tools](https://github.com/GoogleChromeLabs/webmcp-tools)
* [Website explaining how WebMCP Tools work](https://googlechromelabs.github.io/webmcp-tools/demos/explainer/)
* [Le French Bistro Repository](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/french-bistro)
* [Pizza Maker!](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/pizza-maker)
* [Proxx Game - Minesweeper](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/proxx-lite)