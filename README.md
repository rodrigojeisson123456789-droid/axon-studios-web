# Axon Studios

Web de presentación de **páginas web, apps Android y bases de datos**. Sitio estático en español con HTML, CSS y JavaScript. No necesita backend, framework ni compilación para mostrarse.

## Ver la página

Descarga el repositorio y abre `index.html`. Para una revisión local más completa, desde la carpeta del proyecto ejecuta:

```sh
python3 -m http.server 8000
```

Abre `http://localhost:8000`. El envío del formulario depende del servicio externo FormSubmit; la vista local no demuestra que el correo llegue.

## Decisiones de la mejora

- **Enfoque:** tres servicios actuales en lugar de una oferta general de software, IA y cloud.
- **Identidad:** conservamos la marca, el fondo oscuro y el azul. La nueva composición muestra web, Android y datos mediante ilustraciones en HTML y CSS.
- **Contenido verificable:** los ejemplos se identifican como conceptos. No son proyectos reales, testimonios ni resultados de clientes.
- **Consulta útil:** cada enlace de servicio preselecciona el tema del formulario. Se eliminó el estimador automático de plazos: faltaban requisitos para respaldar sus cifras.
- **Menos distracciones:** sin cursor personalizado, canvas de partículas, marquesina ni bucles de animación. El texto principal está disponible sin JavaScript.
- **Interacción accesible:** menú con estado y cierre mediante Escape; ejemplos con pestañas y navegación de teclado; preguntas frecuentes nativas; foco visible y respeto por movimiento reducido.
- **Contacto:** validación de correo, mensaje y adjuntos; bloqueo de envíos simultáneos; confirmación solo con respuesta positiva del proveedor; conservación del mensaje ante errores; tiempo máximo de espera de 25 segundos.

Mantener HTML/CSS/JavaScript es deliberado: la web presenta servicios y recoge consultas. Migrar a un framework añadiría mantenimiento sin resolver una necesidad actual. Los lenguajes y herramientas de los proyectos Android o de bases de datos se eligen según cada proyecto, no según la tecnología de esta web.

## Pruebas

Node.js 22.13+ o 24+ recomendado. Las dependencias son solo para pruebas, no para servir la web:

```sh
npm ci
npm test
```

Las ocho pruebas usan un DOM simulado y respuestas de red simuladas. Verifican estructura, archivos, enlaces, menú, pestañas, selección de servicio y éxito/error del formulario, incluidos adjuntos y duplicados. No envían consultas reales y **no sustituyen las pruebas en navegador**, de accesibilidad con lector de pantalla ni de entrega de correo.

## Antes de publicar

1. Revisar la composición en un navegador real, en celular y escritorio, incluidos zoom, teclado, foco y posibles desbordamientos.
2. Confirmar que el destino de FormSubmit pertenece al negocio y está activado. Enviar una consulta de prueba con permiso, verificar recepción y probar un adjunto permitido. Se conservó el identificador del sitio original.
3. Ajustar el aviso de privacidad a las prácticas reales del negocio. El formulario informa que el envío usa FormSubmit. La validación del navegador mejora la experiencia, pero el servicio receptor es responsable de las verificaciones del lado servidor.
4. Al tener un dominio definitivo, configurar URL canónica, `og:url` y direcciones absolutas para `og:image` y `twitter:image`. Evitamos inventar un dominio.
5. Incorporar proyectos reales con permiso de sus propietarios y una vía alternativa de contacto verificada. No se añadieron teléfonos o correos que no fueron proporcionados.
6. Acordar con cada cliente alcance, plazo, presupuesto, propiedad de entregables, publicación y soporte. La página no los promete como condiciones universales.

## Archivos

- `index.html`: contenido, estructura, metadatos y formulario.
- `styles.css`: identidad visual, ilustraciones y tamaños adaptables.
- `script.js`: menú, pestañas, selección del servicio y envío de consulta.
- `img/`: imágenes originales de la marca.
- `tests/site.test.cjs`: pruebas de estructura e interacción.

No se configuró publicación ni alojamiento desde esta mejora.
