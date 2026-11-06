# Prepara tu web para la era de la IA agéntica
**Taller Hands-On para DevFest Ourense 2026**

En este taller práctico vamos a desarrollar una aplicación que esté lista para el uso agéntico. Usando WebMCP APIs declarativas e imperativas, vamos a exponer la funcionalidad de esta web para que los agentes de IA puedan interactuar con ella de una forma más eficaz, rápida, barata y consistente.

Creado por: [Sergi Olives](https://www.linkedin.com/in/sergiolives/)

[Google Slides](https://docs.google.com/presentation/d/1Ul1tQYMZodUqa-noJB60eDFFNd6UaU45ygP9c6SmAos/edit?usp=sharing)

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

## Declarative WebMCP


## Imperative WebMCP


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