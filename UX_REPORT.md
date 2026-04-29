# Reporte UX/UI

## Proyecto
El VAR del Saber

## Enfoque
Auditoría UX con criterio de producto interactivo mobile-first, evaluando narrativa, arquitectura de pantallas, claridad de CTAs, consistencia visual, accesibilidad básica, estados y prolijidad responsive.

## Lectura General
La propuesta tiene una base fuerte: una idea clara, una motivación entendible y una interfaz con intención visual. El producto ya transmite "juego + premio + competencia" con bastante rapidez. La dirección de arte glassmorphism/light-premium se siente más cuidada que un prototipo estándar y hay señales positivas de ritmo, jerarquía y gamificación.

El punto a trabajar no es la falta de identidad, sino la disciplina del sistema. Hoy la experiencia tiene buenos momentos, pero aún no llega a una ejecución 100% prolija en móvil porque conviven tres capas que se pisan entre sí: una estética luminosa, textos heredados de una UI oscura y reglas de layout que a veces priorizan el desktop o el efecto visual antes que la limpieza móvil.

## Fortalezas

### 1. Propuesta de valor clara
- El core loop se entiende rápido: jugar, sumar puntaje, mejorar PR, competir y ganar cupones.
- La narrativa del premio semanal agrega retorno y urgencia sin complicar demasiado el modelo mental.
- La app evita navegación compleja y mantiene foco.

### 2. Dirección visual con intención
- El sistema de fondos, capas, blur y gradientes da una sensación más editorial/premium que la media.
- Hay buena presencia de marca en chips, badges, héroes y tarjetas.
- La PS5 funciona como ancla aspiracional visible y memorable.

### 3. Buena densidad de producto
- El vestuario concentra estado, progreso, premio y acción principal.
- El match tiene un flujo corto, entendible y con suficiente tensión.
- El onboarding contextual intenta acompañar sin obligar a pasar por una pantalla separada.

### 4. Gamificación bien planteada
- PR, ranking, vidas y cupones forman un ecosistema fácil de entender.
- El resultado post-partida está pensado para retención, repetición y conversión.
- La lógica de “probar sin cuenta” y luego capturar registro está bien orientada.

## Oportunidades de mejora

### Críticas

#### 1. Inconsistencia severa entre tema claro y clases de texto oscuro/claro
Gran parte de la interfaz pasó a una estética clara, pero muchos textos siguen usando `text-white`, `text-gray-300`, `text-gray-400` o tokens pensados para fondos oscuros. Esto genera contraste irregular, jerarquías poco finas y una sensación de interfaz “mezclada”.

Impacto:
- Reduce legibilidad.
- Hace que varias cards se vean menos premium de lo que podrían.
- Resta prolijidad, especialmente en móvil donde el texto es más chico.

Ejemplos:
- `src/views/VestuarioScreen.tsx`
- `src/views/PrizeScreen.tsx`
- `src/views/RankingScreen.tsx`
- `src/App.tsx`

#### 2. Mobile-first real todavía incompleto en componentes clave
Hay varias decisiones correctas para móvil, pero otras todavía se sienten “adaptadas” y no “nacidas para móvil”.

Síntomas:
- CTA fijo inferior en vestuario compite con contenido y overlays.
- Algunas tarjetas tienen demasiados elementos por bloque para pantallas angostas.
- El podio de ranking usa una composición visual atractiva, pero exigente para ancho reducido.
- Algunas áreas usan texto muy pequeño (`9px`, `10px`, `11px`), lo que se vuelve frágil en móviles reales.

Impacto:
- Sensación de interfaz comprimida.
- Menor escaneabilidad.
- Más riesgo de solapamiento perceptual aunque técnicamente no rompa.

#### 3. La experiencia tiene demasiados mensajes simultáneos en primera vista
El vestuario reúne perfil, vidas, stats, premio, ranking, tutorial, onboarding y CTA fijo. El contenido es útil, pero la primera carga no respira lo suficiente.

Impacto:
- Reduce claridad del “siguiente paso”.
- Baja sensación premium.
- En móvil, cada bloque compite por protagonismo.

### Importantes

#### 4. Jerarquía de CTA mejorable
Hay muchos botones “fuertes” repartidos por pantalla. El producto necesita un protagonista inequívoco por vista.

Observaciones:
- En vestuario, premio, ranking y resultado aparecen varios llamados con pesos similares.
- En resultado para invitado, registro, replay y seguir sin cuenta compiten demasiado cerca.

Recomendación:
- Definir un CTA principal por pantalla.
- Los secundarios deben bajar visualmente un escalón completo.

#### 5. Contenido mock y promesas de sistema no alineadas
El README habla de 10 preguntas, regeneración temporal, endpoints reales y premios dinámicos, pero la UI actual corre con 3 preguntas, contador fijo de premio y varias cifras simuladas.

Impacto:
- En review interna esto resta credibilidad.
- En UX, la promesa del sistema parece más madura que la experiencia real.

#### 6. Accesibilidad y affordance mejorables
- Hay botones sin acción real clara como “Ver términos y condiciones”.
- El botón de volver en `MatchScreen` no tiene `onClick`.
- Uso de `alert()` para Instagram.
- Falta una capa más robusta de accesibilidad semántica y estados de foco visibles.

### Medias

#### 7. Exceso de micro-estéticas distintas
El producto mezcla premium glass, gaming, dashboard editorial y promo retail. Funciona por momentos, pero todavía no se consolidó una sola gramática visual.

#### 8. Tipografía secundaria demasiado pequeña
Muchos labels operan en 9-11px. En una propuesta premium mobile-first, conviene subir el piso tipográfico.

#### 9. El onboarding puede sentirse invasivo
El spotlight está bien ejecutado en intención, pero en móvil puede competir con el CTA fijo, el scroll y el contenido largo.

## Revisión por pantalla

### Vestuario
Lo mejor resuelto del proyecto a nivel producto. Tiene una lectura rica y vende bien el ecosistema. Aun así, necesita poda. Recomiendo concentrar la portada en tres bloques:
- estado del jugador
- acción principal
- incentivo semanal

Todo lo demás debería quedar como profundidad progresiva.

### Match
Es la pantalla con mejor foco funcional. La estructura pregunta-opciones-comodines está clara. El mayor problema no es el flujo, sino la semántica incompleta:
- el back no funciona
- el texto sigue estilado como si el fondo fuera oscuro
- algunas piezas ocupan demasiado alto visual en móvil

### Resultados
Tiene buena intención emocional y de retención. Para invitado, sin embargo, se recarga de mensajes:
- top %
- correctas/promedio
- compartir
- premio
- registro
- replay
- seguir sin cuenta

Aquí conviene simplificar para que la conversión al registro sea más nítida.

### Ranking
Visualmente vistoso. El podio tiene impacto. En móvil, sin embargo, es más una pieza de exhibición que una herramienta de lectura rápida. El listado funciona mejor que el podio en términos de utilidad.

### Premio
La pantalla más “Awwwards-ready” del proyecto por intención visual. El héroe comunica bien. Lo que falta es credibilidad sistémica:
- contador real
- términos reales
- reglas cerradas
- menos premios/reglas mock que aún no existen en la lógica

## Hallazgos técnicos con impacto UX

### 1. El proyecto builda pero no pasa typecheck
`npm run build` funciona, pero `npm run lint` falla por tipado de imagen:
- `src/components/PrizeProduct.tsx`

Error:
- falta declaración de módulo para `png`

Esto no es solo técnico; también afecta confianza del entregable.

### 2. Peso del CSS y JS alto para la escala actual
Build actual:
- CSS: `83.66 kB`
- JS: `414.91 kB`

Para una app corta y mobile-first, todavía hay margen para optimizar percepción de carga y limpieza estructural.

### 3. Navegación sin router
Para prototipo está bien. Para crecimiento, puede complicar persistencia de scroll, deep links, analytics y estado.

## Prioridades recomendadas

### Prioridad 1
- Unificar el sistema cromático y de contraste para el nuevo tema claro.
- Subir el piso tipográfico móvil.
- Reducir ruido en vestuario y resultado.
- Resolver affordances rotos: back, términos, feedback de compartir.

### Prioridad 2
- Replantear ranking mobile para lectura más compacta.
- Simplificar onboarding en móvil.
- Alinear UI con reglas reales del sistema.

### Prioridad 3
- Optimizar peso visual y técnico.
- Consolidar tokens de spacing, tamaño de texto, estados y elevación.
- Preparar arquitectura para datos reales.

## Recomendaciones de diseño concretas

### Sistema visual
- Definir una sola base tonal clara y rehacer todos los textos sobre esa lógica.
- Reservar `text-white` solo para fondos realmente oscuros o CTAs sólidos.
- Reducir el número de variantes de tarjeta.

### Mobile-first
- Trabajar primero en ancho `360-390px`.
- Subir textos pequeños a un mínimo visual más cómodo.
- Revalidar spacing vertical: menos bloques, más aire.
- Revisar el CTA fijo para que no tape contenido ni compita con overlays.

### Conversión
- En invitado, una sola promesa principal: “regístrate para guardar y participar”.
- Bajar todo lo demás a soporte.
- Reemplazar mensajes múltiples por una secuencia más simple.

### Ranking
- Mantener podio como highlight, pero acortarlo o volverlo scrollable/horizontal en móvil.
- Priorizar lista legible, posición del usuario y progreso contra rivales cercanos.

### Premio
- Convertir la vista en una landing más confiable y menos mock.
- Añadir fecha real, legal visible y reglas resumidas con lenguaje claro.

## Veredicto
El proyecto ya tiene personalidad, una base de gamificación sólida y una dirección estética que puede crecer muy bien. No lo veo como un problema de creatividad, sino de refinamiento. La experiencia necesita una pasada fuerte de sistema, contraste, contenido y priorización móvil para pasar de “prototipo atractivo” a “interactivo realmente pulido”.

## Score UX actual
- Propuesta de valor: 8.5/10
- Dirección visual: 8/10
- Claridad de interacción: 7/10
- Consistencia del sistema: 6.5/10
- Mobile-first real: 6.5/10
- Prolijidad general: 7/10

## Score potencial tras refinamiento
8.7/10 a 9/10 si se resuelven contraste, poda de contenido, consistencia visual y disciplina mobile-first.
