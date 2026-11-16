# Axon Studios — React

Web de presentación en español para **páginas web, apps Android y bases de datos**. Conserva la portada “Creamos lo que sigue”, el logo blanco, la red de partículas y el configurador que se eligieron en la versión original.

## Verla en tu computadora

Necesitas **Node.js 22.12+**; se recomienda Node 24, la versión usada para validar esta entrega.

Desde la carpeta del proyecto:

```sh
npm ci
npm run dev
```

Abre la dirección que indique Vite en la terminal. A diferencia de la versión anterior, **el `index.html` del código fuente no se abre directamente haciendo doble clic**: React usa módulos que se sirven con Vite.

Para comprobar la versión de producción:

```sh
npm run build
npm run preview
```

`npm run build` genera `dist/`. Esa carpeta es la que se publica en un alojamiento estático. **No necesita un servidor Node en producción.** No se ha configurado publicación ni se ha desplegado desde esta mejora.

## Qué cambió

- React divide la web en componentes independientes: navegación, portada, servicios, ejemplos, proceso, configurador, preguntas frecuentes y contacto.
- Motion aporta transiciones de pestañas, cambios de distribución y respuestas suaves de las tarjetas y la portada al movimiento del puntero. CSS anima el logo, las órbitas, la red de puntos y las conexiones del diagrama.
- Las demos son interactivas: formato de escritorio/celular en la web, filtros de pedidos en Android y relaciones cliente/pedidos en datos. **Todos los datos son ficticios y no se presentan como proyectos de clientes.**
- El configurador usa estado de React. Sus opciones actualizan módulos y referencia de semanas, y se transfieren al formulario sin reemplazar el mensaje escrito.
- Los estilos se separan en base, composición, componentes y movimiento. Las imágenes de marca originales se conservan en `public/img/`.
- La compilación prerenderiza la página como HTML y React la hidrata. En **producción**, el contenido principal, la navegación, las preguntas frecuentes y el formulario nativo están disponibles incluso antes de cargar JavaScript. El configurador y las demos interactivas sí lo necesitan.

React no mejora el diseño por sí mismo. Se eligió para organizar y hacer evolucionar estas interacciones. Node se usa para desarrollo, pruebas y compilación; no se añadió un backend innecesario.

## Movimiento y accesibilidad

- Control visible para pausar/reanudar y preferencia manual local cuando el navegador permite almacenamiento.
- Respeto por movimiento reducido del sistema, incluidos cambios durante la visita. Las respuestas al puntero se limitan a dispositivos que admiten un puntero fino.
- Animaciones CSS pausadas al ocultar la pestaña o salir la portada de pantalla. No hay canvas ni bucles manuales de `requestAnimationFrame`.
- El contenido no depende de animaciones para mostrarse. Las entradas al recorrer la página tienen alternativa cuando no existen observadores, y recibir foco revela el contenido inmediatamente.
- Pestañas con teclado, campos etiquetados, foco visible y estructura semántica.

## Configurador: hipótesis, no promesas

La referencia orientativa parte de 4 semanas para web, 8 para Android y 3 para datos. Aplica un factor por alcance y suma esfuerzo por diseño, integraciones, panel y datos. No suma semanas por soporte posterior ni cuenta dos veces una base de datos ya incluida.

Estas hipótesis son **referencias para complejidad baja o media** que deben calibrarse con la capacidad y experiencia reales de Axon. No constituyen cotización ni compromiso de plazo. El alcance, presupuesto y tiempo se confirman después de revisar requisitos.

## Contacto

Se conserva el destino original de FormSubmit. El envío valida correo, mensaje y adjuntos, bloquea duplicados, espera confirmación positiva del proveedor y conserva los datos ante errores. Una consulta que supera 25 segundos se aborta con un mensaje que evita afirmar que el envío falló definitivamente. La configuración se adjunta como un campo separado y puede quitarse o limpiarse al cambiar de servicio.

La validación del cliente mejora la experiencia; las verificaciones del lado servidor corresponden al servicio receptor. Antes de publicar, confirmar activación y recepción real de FormSubmit, revisar sus límites y ajustar el aviso de privacidad a las prácticas reales del negocio. **Las pruebas no envían correos.**

## Pruebas

```sh
npm test
npm run build
```

Vitest, Testing Library y jsdom verifican navegación, teclado, demos, preferencias de movimiento, configurador, hidratación y estados de envío. La compilación verifica también el HTML prerenderizado sin ejecutar JavaScript, sus enlaces y los assets locales.

Las pruebas de DOM **no comprueban el aspecto visual, la fluidez real ni las medidas de rendimiento de un navegador**. La herramienta de vista previa del entorno no está disponible en esta entrega. Quedan pendientes revisión visual en móvil y escritorio, zoom, lector de pantalla y entrega real del formulario.

Como referencia de tamaño, la primera compilación produjo aproximadamente 125 kB gzip de JavaScript y 11 kB gzip de CSS. Son tamaños del build, no mediciones de velocidad o puntuaciones de Lighthouse. React y Motion incorporan más JavaScript que la versión estática anterior.

## Estructura

```text
src/
  App.jsx                 Composición de la página
  experience.jsx          Movimiento y selección de contacto compartidos
  data.js                 Servicios e hipótesis del configurador
  components/             Componentes de React
  styles/                 Diseño y animaciones
  main.jsx                Entrada e hidratación del cliente
  entry-server.jsx        HTML para la compilación
public/img/               Imágenes originales
scripts/                  Prerender y verificación de producción
tests/                    Pruebas de comportamiento
```

Al tener un dominio definitivo, completar URL canónica, `og:url` e imágenes sociales con direcciones absolutas. Incorporar proyectos reales y vías de contacto adicionales cuando existan datos verificados; no se inventaron clientes, cifras ni testimonios.
