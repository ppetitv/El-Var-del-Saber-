# El VAR del Saber

Prototipo frontend de una trivia deportiva gamificada con foco mobile-first. El producto combina partidas cortas de fútbol, sistema de vidas, PR (Personal Record), ranking global y participación por un premio semanal.

Este README documenta el estado real actual del proyecto. No describe la visión ideal ni una futura integración backend, sino lo que hoy existe en la app.

## Stack
- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- Motion
- Lucide React

## Scripts
- `npm run dev`
  Inicia el servidor local en `http://localhost:3000`.
- `npm run build`
  Genera el build de producción.
- `npm run preview`
  Sirve el build generado.
- `npm run lint`
  Ejecuta `tsc --noEmit`.
- `npm run clean`
  Elimina `dist/`.

## Estado del prototipo

### Qué sí existe
- Vestuario / dashboard con variantes para invitado, usuario nuevo y usuario con historial.
- Flujo completo de partida.
- Pantalla de resultado para invitado y usuario logueado.
- Ranking global mock.
- Pantalla de premio semanal.
- Modal de login / registro.
- Modal legal resumido.
- Countdown semanal calculado en frontend.
- UI optimizada principalmente para móvil.

### Qué sigue siendo mock o local
- Preguntas.
- Ranking.
- Perfil de usuario.
- Premio activo.
- Login real.
- Persistencia de datos.
- Términos legales completos.
- Backend / API / CMS.

## Arquitectura de pantallas

La navegación es una SPA simple controlada por estado local en `src/App.tsx`.

Pantallas disponibles:
- `vestuario`
- `match`
- `result`
- `ranking`
- `prize`
- `welcome`

Cada cambio de pantalla ejecuta `window.scrollTo(0, 0)`.

## Flujo principal

### Invitado
1. Entra al vestuario en modo abierto.
2. Puede jugar sin cuenta.
3. Si termina una partida con puntos, genera cupones pendientes.
4. En resultado se le invita a registrarse para guardar la partida y activar esos cupones.

### Usuario logueado
1. Entra al vestuario con resumen de progreso.
2. Juega consumiendo vidas.
3. Al terminar, suma cupones directamente a su cuenta.
4. Puede volver al vestuario, revisar ranking o ir al premio.

## Mecánicas actuales

### 1. Sistema de vidas
- El usuario empieza con `5` vidas.
- Iniciar una partida consume `1` vida inmediatamente.
- Si la última vida se consume al entrar al match, el badge puede mostrar `0/5` durante esa partida.
  Eso significa: no quedan vidas para la siguiente partida, no que la partida actual sea inválida.
- Si el usuario se queda en `0`, no puede iniciar una nueva partida directamente.
- En ese caso se abre un modal para ver un video sponsor simulado.
- Al completar ese video sponsor se recuperan `2` vidas.
- El máximo visible sigue siendo `5`.

### 2. Partida
- La partida actual usa `3` preguntas mock en `src/data/mockData.ts`.
- Cada pregunta tiene `15` segundos.
- Si el tiempo llega a `0`, la pregunta se da por cerrada y avanza.
- Hay una demora breve de transición entre preguntas (`500ms`).

### 3. Puntaje
- Una respuesta correcta suma:
  `100 + (timeLeft * 10)`
- Las respuestas incorrectas no suman.
- No existe hoy multiplicador de combo o racha dentro de la partida.
- El tiempo promedio mostrado al final se calcula sobre las preguntas del match actual.

### 4. Comodines
La partida tiene tres comodines de uso único por match:
- `El VAR`
  Elimina 2 opciones incorrectas.
- `Hinchada`
  Muestra porcentajes simulados de voto.
- `Cambio`
  Reemplaza la pregunta actual por una pregunta reserva fija.

### 5. Cupones Dorados
La lógica vigente está centralizada en `src/data/gameConfig.ts`.

Regla actual:
- Si el score final es `0`: `0` cupones.
- Si el score final es mayor a `0`: `1` cupón.
- Si el score final es mayor a `1000`: `3` cupones.

Comportamiento:
- Usuario logueado:
  los cupones se suman directo a `goldenCoupons`.
- Invitado:
  los cupones quedan en `pendingGoldenCoupons` hasta registrarse.

### 6. Premio semanal
- El premio activo actual es `PlayStation 5`.
- El ciclo del premio se presenta como `Sorteo semanal`.
- El countdown se calcula en frontend hacia el próximo cierre semanal.
- La fecha de cierre se calcula como el siguiente domingo a las `23:59`.
- La pantalla de premio y el banner del vestuario consumen la misma configuración local.

### 7. Registro / activación de cuenta
- No existe autenticación real.
- El login es simulado desde el modal.
- Si un invitado se registra después de jugar:
  - la partida se considera guardada
  - los cupones pendientes pasan a la cuenta
  - se muestra una pantalla de bienvenida / activación

## Pantallas y comportamiento

### Vestuario
Archivo principal:
- `src/views/VestuarioScreen.tsx`

Estados:
- Invitado.
- Usuario logueado sin partidas.
- Usuario logueado con historial.

Elementos relevantes:
- Header mobile-first.
- CTA sticky inferior en móvil.
- Banner de premio semanal.
- Snapshot de progreso en móvil.
- Ranking cercano contextual.
- Tutorial / onboarding contextual.

### Match
Archivo principal:
- `src/views/MatchScreen.tsx`

Incluye:
- Modal de instrucciones inicial.
- Header sticky.
- Timer por pregunta.
- Comodines.
- Confirmación al intentar salir de la partida.

### Resultado
Se renderiza desde:
- `src/App.tsx`

Estados:
- Usuario logueado.
- Invitado.

Incluye:
- Puntaje final.
- Cupones ganados.
- Estado relativo del día.
- CTA para volver a jugar.
- CTA de registro para invitado.
- Acciones de share.

### Ranking
Archivo principal:
- `src/views/RankingScreen.tsx`

Incluye:
- Podio top 3.
- Lista global mock.
- Card especial del usuario en mobile.

### Premio
Archivo principal:
- `src/views/PrizeScreen.tsx`

Incluye:
- Hero con countdown.
- Resumen de cupones.
- Reglas reales del prototipo.
- FAQ.
- Acceso a términos resumidos.

## Mobile-first y criterios UX actuales

La UI fue refinada con foco explícito en:
- jerarquía clara del CTA principal en móvil
- reducción de ruido en el vestuario
- mayor coherencia entre tema claro y textos
- header mobile con personalidad propia
- componentes más compactos en end screen
- navegación secundaria menos competitiva que el sticky CTA

También existen mejoras de accesibilidad y polish:
- `focus-visible` en interacciones clave
- soporte para `prefers-reduced-motion`
- feedback inline en share a Instagram

## Archivos clave
- `src/App.tsx`
  Orquesta navegación, vidas, cupones, resultados y modales.
- `src/views/VestuarioScreen.tsx`
  Dashboard principal y entrada al producto.
- `src/views/MatchScreen.tsx`
  Gameplay.
- `src/views/PrizeScreen.tsx`
  Premio semanal.
- `src/views/RankingScreen.tsx`
  Ranking global mock.
- `src/components/LoginModal.tsx`
  Registro / login simulado.
- `src/components/InfoModal.tsx`
  Modal informativo / legal resumido.
- `src/data/gameConfig.ts`
  Configuración local del premio y reglas de cupones.
- `src/data/mockData.ts`
  Preguntas, usuario y ranking mock.

## Limitaciones actuales
- No hay router real.
- No hay backend.
- No hay autenticación real.
- No hay persistencia entre sesiones.
- No hay regeneración automática de vidas por tiempo.
  La UI la menciona como promesa de sistema, pero hoy no está implementada.
- No hay términos legales definitivos.
- El ranking contextual y global son simulados.
- El premio activo sigue siendo configuración local.

## Qué habría que hacer para pasar a producción

### Producto / negocio
- Definir reglas finales del premio semanal.
- Confirmar si los cupones se resetean cada semana a nivel real.
- Cerrar condiciones legales y T&C.
- Definir si la regeneración de vidas por tiempo será real o se eliminará del copy.

### Backend
- Perfil de usuario.
- Persistencia de partidas.
- Persistencia de vidas.
- Persistencia de PR y ranking.
- Premio semanal dinámico.
- Banco de preguntas dinámico.
- Sorteos / cupones reales.

### Frontend
- Router real.
- Estado persistente.
- Integración con API.
- Manejo de loading / empty / error states.
- QA real en dispositivos móviles y tablets.

## Verificación local

Último estado validado:
- `npm run lint` pasa.
- `npm run build` pasa.

## Nota final
Este repositorio documenta un prototipo funcional y refinado de UX/UI, no una implementación full-stack terminada. El valor del proyecto hoy está en la calidad del flujo, la claridad del producto y la dirección visual, con reglas locales coherentes entre sí.
