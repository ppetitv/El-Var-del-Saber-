# Documentación Funcional - Trivia Deportiva RPP

Este documento detalla las especificaciones funcionales, mecánicas de juego y lógica de negocio para la implementación del aplicativo por parte del equipo de desarrollo (Frontend y Backend).

## 1. Visión General del Proyecto
Aplicación web progresiva (PWA) / Web App de trivia deportiva gamificada, diseñada para ofrecer partidas cortas, mejorar el PR (Personal Record) del usuario, competir en el ranking global y participar por premios físicos (ej. PS5).

### Stack Tecnológico (Frontend)
*   **Framework:** React 18+ (Vite)
*   **Estilos:** Tailwind CSS
*   **Animaciones:** Motion (Framer Motion)
*   **Iconografía:** Lucide React
*   **Navegación:** Renderizado condicional basado en estado (SPA sin router complejo, gestionado en `App.tsx`).

---

## 2. Entidades Principales (Modelos de Datos Sugeridos)

### Usuario (`User`)
*   `id`: UUID
*   `username`: String (Único)
*   `avatar`: String (Emoji o URL de imagen)
*   `pr` (Personal Record): Integer (Puntuación máxima histórica en una sola partida).
*   `rankingNational`: Integer (Posición actual en el ranking global).
*   `tickets`: Integer (Máximo 5).
*   `lastTicketRecharge`: Timestamp.
*   `goldenTickets`: Integer (Tickets premium).

### Partida (`Match`)
*   `id`: UUID
*   `userId`: UUID
*   `score`: Integer
*   `questionsAnswered`: Integer
*   `correctAnswers`: Integer
*   `timestamp`: Timestamp

---

## 3. Mecánicas Core y Lógica de Juego

### 3.1. Sistema de Energía (Tickets)
*   **Lógica Base:** Jugar 1 partida cuesta 1 Ticket normal.
*   **Límite Diario:** El usuario tiene un máximo de 5 tickets normales.
*   **Regeneración:** Se regeneran con el tiempo (ej. 1 ticket cada X horas) hasta llegar a 5.
*   **Recarga por Ads:** Si el usuario tiene 0 tickets, se le ofrece ver un anuncio publicitario (Ad) de un sponsor para obtener tickets extra inmediatamente.

### 3.2. El Partido (Gameplay)
*   **Estructura:** Una partida consta de una serie de preguntas (ej. 10 preguntas).
*   **Temporizador:** Cada pregunta tiene un tiempo límite (ej. 10 segundos).
*   **Sistema de Puntuación (Sugerido):**
    *   Puntos Base por acierto: 100 pts.
    *   Bono de Velocidad: +X pts por cada segundo sobrante.
    *   Racha (Combo): Multiplicador x1.2, x1.5, etc., por respuestas correctas consecutivas.
*   **Comodines:** Opciones como "50/50", "Hinchada" o "Cambio de pregunta".

### 3.3. Pantalla de Resultados y Retención
*   **Cálculo de PR:** Al terminar, el sistema compara el `score` obtenido con el `user.pr`.
    *   Si `score > user.pr`: Se actualiza el PR en la base de datos. La UI muestra "¡NUEVO RÉCORD!".
    *   Si `score <= user.pr`: La UI calcula la diferencia (`user.pr - score`) y muestra un mensaje motivacional ("A solo X pts de tu récord").
*   **Llamado a la Acción (CTA):** El botón principal es "JUGAR DE NUEVO". Valida instantáneamente si `tickets > 0`. Si es 0, cambia a la recarga de tickets.

---

## 4. Módulos Activos del Vestuario (Dashboard)

### 4.1. Ranking Contextual
*   **Objetivo:** Mostrar competencia directa y alcanzable.
*   **Lógica Backend:** El endpoint debe devolver al usuario actual, al usuario inmediatamente superior (`ranking = user.ranking - 1`) y al inmediatamente inferior (`ranking = user.ranking + 1`).
*   **UI:** El contenedor del número de ranking tiene un ancho fijo (`w-12 flex-shrink-0`) para evitar que números grandes (ej. #10542) se solapen con el avatar.

### 4.2. Ranking Global
*   **Vista Simplificada:** Una sola tabla global (se eliminaron pestañas regionales/amigos para concentrar la competencia).
*   **Estructura:** Podio destacado (Top 1, 2, 3) y lista vertical para el resto.

### 4.3. Sorteo Semanal
*   **Objetivo:** Añadir un incentivo claro para volver a jugar sin introducir más capas de progresión.
*   **Lógica Base:** El usuario gana Cupones Dorados al jugar partidas, y esos cupones cuentan como participaciones para el premio semanal.
*   **UI:** Banner en el dashboard, contador visible de cupones y pantalla de detalle del premio.

---

## 5. Consideraciones de UX/UI
*   **Mobile-First:** La interfaz está optimizada para móviles, con un CTA fijo en la parte inferior en la vista de Vestuario si el usuario no ha jugado.
*   **Scroll Management:** (A implementar por el equipo) Asegurar que al cambiar de "pantalla" (cambio de estado en `App.tsx`), se ejecute `window.scrollTo(0, 0)` para evitar que el usuario quede a mitad de página.
*   **Prevención de Errores:** Botones deshabilitados visualmente o con redirecciones claras cuando faltan recursos (ej. sin tickets).

## 6. Endpoints Sugeridos (Para el equipo Backend)
1.  `GET /api/user/profile` -> Devuelve datos del usuario, tickets, PR y ranking.
2.  `GET /api/user/dashboard` -> Devuelve datos del ranking contextual y estado del sorteo semanal.
3.  `POST /api/match/start` -> Consume 1 ticket, devuelve las preguntas.
4.  `POST /api/match/end` -> Recibe respuestas/tiempo, calcula score, actualiza PR si aplica, devuelve resultados.
5.  `POST /api/inventory/watch-ad` -> Otorga tickets tras validar visualización de anuncio.
6.  `GET /api/ranking/global` -> Devuelve el Top 50/100 global.
7.  `GET /api/prizes/current` -> Devuelve la información del premio de la semana (título, imagen, fecha de fin).

---

## 7. Gestión de Contenido (Preguntas y Premios)

Actualmente, al ser una versión de prototipo frontend, los datos están simulados en código. Para pasar a producción, el equipo backend debe implementar lo siguiente:

### 7.1. Banco de Preguntas y Múltiples Tests
*   **Estado actual:** Hardcodeado en `src/data/mockData.ts` (`mockQuestions`) como una lista plana.
*   **Implementación requerida (Múltiples Tests):** Para permitir que el usuario juegue varias veces al día sin repetir contenido, la base de datos debe estructurarse mediante "Tests" o "Campañas".
    *   **Modelo de Datos:** Entidad `Quiz` o `Test` (ej. "Especial Champions", "Test Diario #45") que contiene una relación de 1 a N con la entidad `Question`.
    *   **Lógica de Selección:** Al hacer clic en "Jugar", el sistema puede:
        1.  *Opción A (Temáticos):* Mostrar un carrusel en el Vestuario para que el usuario elija qué test jugar.
        2.  *Opción B (Piscina Infinita):* El backend selecciona aleatoriamente 10 preguntas activas que el usuario *no haya respondido previamente* en las últimas 24 horas.
*   **CMS:** El panel de administración debe permitir agrupar preguntas en "Tests", asignarles un título, una fecha de publicación y un estado (Activo/Inactivo) para rotar el contenido dinámicamente.

### 7.2. Sorteos y Premios
*   **Estado actual:** El premio ("PlayStation 5") y el contador de tiempo están hardcodeados en la vista `src/views/PrizeScreen.tsx`.
*   **Implementación requerida:** El frontend debe consumir el endpoint `GET /api/prizes/current` para pintar dinámicamente el nombre del premio, la imagen de fondo y calcular el tiempo restante (`TERMINA EN: X Días`).
*   **CMS:** El panel de administración debe permitir configurar el "Premio de la Semana", estableciendo su fecha de inicio y fin.
