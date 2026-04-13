# Calendario de vida por semanas

Aplicación web estática para visualizar una vida en semanas, con una fila por año y columnas dinámicas de 52 o 53 semanas según el cálculo real entre aniversarios.

## Características

- Entrada de `fecha de nacimiento` en formato `dd/mm/yyyy`.
- Configuración de `edad final` entre `1` y `100`.
- Semanas vividas en rojo, semanas futuras en blanco y celdas sobrantes en gris.
- Cálculo preciso por año de vida (52 o 53 semanas según corresponda).
- Metadata con desglose de semanas y porcentajes.
- Impresión optimizada para formato `60cm x 90cm`.

## Estructura del proyecto

- `calendario-vida.html`: estructura de la página.
- `styles.css`: estilos de pantalla e impresión.
- `app.js`: lógica de cálculo y renderizado.
- `AGENTS.md`: lineamientos de mantenimiento del proyecto.

## Requisitos

- Navegador moderno (Chrome, Firefox, Edge o Safari).
- No requiere servidor ni instalación de dependencias.

## Uso rápido

1. Abre `calendario-vida.html` directamente en el navegador.
2. Ingresa la fecha de nacimiento (`dd/mm/yyyy`) y la edad final.
3. Pulsa `Actualizar` para regenerar la tabla.
4. Pulsa `Imprimir / Guardar PDF` para exportar.

## Impresión

- Tamaño de página esperado: `60cm x 90cm`.
- La grilla está pensada para mantenerse centrada y legible.
- En `@media print` se conserva `margin-top: 10mm` en `.table-wrap`.

## Desarrollo y mantenimiento

- Mantener separación clara entre HTML/CSS/JS.
- Evitar frameworks o build tools salvo solicitud explícita.
- Preservar compatibilidad con apertura directa en navegador.

## Atribución

La idea base del concepto de life calendar está inspirada en el póster de Kurzgesagt:

https://shop-us.kurzgesagt.org/products/lifespan-calendar-poster-black-white?variant=40572569288752

El crédito conceptual de esa idea corresponde a Kurzgesagt. Esta implementación es una variación personal para uso propio.
