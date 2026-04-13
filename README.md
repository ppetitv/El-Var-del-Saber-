# Documentación Funcional - Trivia Deportiva RPP

Este documento detalla las especificaciones funcionales, mecánicas de juego y lógica de negocio para la implementación del aplicativo por parte del equipo de desarrollo (Frontend y Backend).

## 1. Visión General del Proyecto
Aplicación web progresiva (PWA) / Web App de trivia deportiva altamente gamificada, diseñada para maximizar la retención de usuarios y la adquisición orgánica mediante mecánicas virales. El objetivo final del usuario es acumular puntos (PR - Personal Record) para escalar en el ranking global y optar por premios físicos (ej. PS5).

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
*   `division`: String (Ej. "Amateur", "Profesional", "Leyenda").
*   `tickets`: Integer (Máximo 5).
*   `lastTicketRecharge`: Timestamp.
*   `goldenTickets`: Integer (Tickets premium).
*   `shares_count`: Integer (Contador para el trofeo Influencer).

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
*   **Inventario / Ads:** Si el usuario tiene 0 tickets, se le redirige al Inventario. Allí puede ver un anuncio publicitario (Ad) de un sponsor para obtener tickets extra inmediatamente.

### 3.2. El Partido (Gameplay)
*   **Estructura:** Una partida consta de una serie de preguntas (ej. 10 preguntas).
*   **Temporizador:** Cada pregunta tiene un tiempo límite (ej. 10 segundos).
*   **Sistema de Puntuación (Sugerido):**
    *   Puntos Base por acierto: 100 pts.
    *   Bono de Velocidad: +X pts por cada segundo sobrante.
    *   Racha (Combo): Multiplicador x1.2, x1.5, etc., por respuestas correctas consecutivas.
*   **Comodines:** (Mencionados en trofeos). Opciones como "50/50", "Tiempo Extra".

### 3.3. Pantalla de Resultados y Retención
*   **Cálculo de PR:** Al terminar, el sistema compara el `score` obtenido con el `user.pr`.
    *   Si `score > user.pr`: Se actualiza el PR en la base de datos. La UI muestra "¡NUEVO RÉCORD!".
    *   Si `score <= user.pr`: La UI calcula la diferencia (`user.pr - score`) y muestra un mensaje motivacional ("A solo X pts de tu récord").
*   **Llamado a la Acción (CTA):** El botón principal es "JUGAR DE NUEVO". Valida instantáneamente si `tickets > 0`. Si es 0, cambia a "CONSEGUIR TICKETS" y redirige al Inventario.

---

## 4. Mecánicas de Growth Hacking (Viralidad)

### 4.1. Retos por Enlace (Stateless)
*   **Generación del Enlace:** Al hacer clic en "Retar Amigo", el frontend genera una URL con parámetros: `https://app.com/?challenger=NombreUsuario&score=PuntajeObtenido`.
*   **API de Compartir:** Utiliza `navigator.share()`. Si falla o el navegador no lo soporta, hace fallback a `navigator.clipboard.writeText()`.
*   **Recepción del Enlace:** En el `useEffect` principal de `App.tsx`, el sistema lee los parámetros de la URL al cargar. Si existen, levanta un Modal de Desafío ("¡NombreUsuario te ha retado a superar X puntos!").
*   **Métrica de Influencer:** Al ejecutarse con éxito la promesa de compartir/copiar, el frontend debe llamar al endpoint `POST /api/users/share-intent` para sumar +1 al `shares_count` del usuario (para desbloquear el trofeo "Influencer").

---

## 5. Gamificación y Módulos del Vestuario (Dashboard)

### 5.1. Tu Zona de Ascenso (Ranking Contextual)
*   **Objetivo:** Mostrar competencia directa y alcanzable.
*   **Lógica Backend:** El endpoint debe devolver al usuario actual, al usuario inmediatamente superior (`ranking = user.ranking - 1`) y al inmediatamente inferior (`ranking = user.ranking + 1`).
*   **UI:** El contenedor del número de ranking tiene un ancho fijo (`w-12 flex-shrink-0`) para evitar que números grandes (ej. #10542) se solapen con el avatar.

### 5.2. Misiones Diarias
*   **Objetivo:** Retención a corto plazo (D1, D7).
*   **Lógica:** 3 misiones que se reinician cada 24h a medianoche (hora servidor).
*   **Ejemplos:** "Juega 3 partidos", "Acierta 10 preguntas", "Supera 2000 pts".
*   **Estado:** El backend debe proveer el progreso actual de cada misión para pintar las barras de progreso en el frontend.

### 5.3. Trofeos (Badges)
*   Sistema de logros persistentes.
*   **Goleador:** Gana 10 partidas consecutivas.
*   **Rayo:** Responde 5 preguntas en < 3s cada una.
*   **Influencer:** Comparte el enlace de reto 5 veces (medido por intención de clic, no por conversión).
*   **Erudito:** 50 partidas perfectas sin comodines.
*   **Invencible:** Alcanzar división Leyenda.
*   **Veterano:** Jugar 30 días seguidos.

### 5.4. Ranking Global
*   **Vista Simplificada:** Una sola tabla global (se eliminaron pestañas regionales/amigos para concentrar la competencia).
*   **Estructura:** Podio destacado (Top 1, 2, 3) y lista vertical para el resto.

---

## 6. Consideraciones de UX/UI
*   **Mobile-First:** La interfaz está optimizada para móviles, con un CTA fijo en la parte inferior en la vista de Vestuario si el usuario no ha jugado.
*   **Scroll Management:** (A implementar por el equipo) Asegurar que al cambiar de "pantalla" (cambio de estado en `App.tsx`), se ejecute `window.scrollTo(0, 0)` para evitar que el usuario quede a mitad de página.
*   **Prevención de Errores:** Botones deshabilitados visualmente o con redirecciones claras cuando faltan recursos (ej. sin tickets).

## 7. Endpoints Sugeridos (Para el equipo Backend)
1.  `GET /api/user/profile` -> Devuelve datos del usuario, tickets, PR, división.
2.  `GET /api/user/dashboard` -> Devuelve progreso de misiones diarias y datos de la Zona de Ascenso.
3.  `POST /api/match/start` -> Consume 1 ticket, devuelve las preguntas.
4.  `POST /api/match/end` -> Recibe respuestas/tiempo, calcula score, actualiza PR si aplica, devuelve resultados.
5.  `POST /api/user/share-intent` -> Incrementa el contador de compartidos (+1).
6.  `POST /api/inventory/watch-ad` -> Otorga tickets tras validar visualización de anuncio.
7.  `GET /api/ranking/global` -> Devuelve el Top 50/100 global.
