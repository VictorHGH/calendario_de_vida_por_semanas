# AGENTS.md

## Contexto del proyecto

Este proyecto es una pagina estatica para visualizar un calendario de vida por semanas y prepararlo para impresion en formato grande.

## Objetivo funcional

- Mostrar una fila por ano de vida.
- Calcular semanas por ano de forma precisa (52 o 53) usando aniversarios reales.
- Pintar semanas vividas, futuras y sobrantes.
- Permitir fecha de nacimiento y edad final por input.

## Reglas de mantenimiento

1. Mantener separacion clara:
   - HTML: estructura (`index.html`)
   - CSS: estilos (`styles.css`)
   - JS: logica (`app.js`)
2. No introducir frameworks ni build tools salvo solicitud explicita.
3. Mantener compatibilidad con apertura directa en navegador (sin servidor).
4. No romper la impresion `60cm x 90cm`.
5. Mantener `margin-top: 10mm` en `.table-wrap` dentro de `@media print`, salvo que el usuario pida cambiarlo.
6. Conservar la atribucion a Kurzgesagt en la pagina y en el README.

## Validacion rapida antes de cerrar cambios

- Abrir `index.html`.
- Verificar que cambiar fecha/edad regenere la tabla.
- Verificar que el conteo de anos con 52 y 53 se muestre en metadata.
- Verificar que impresion siga centrada y legible.

## Creditos y atribucion

La idea base del life calendar se atribuye a Kurzgesagt:

https://shop-us.kurzgesagt.org/products/lifespan-calendar-poster-black-white?variant=40572569288752
