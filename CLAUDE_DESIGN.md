# Aromaz Home Improvement — Plataforma de Métricas con IA
## Sistema de Diseño (Claude Design Brief)

> **Documento:** Sistema de diseño para Claude Design (Fase 1 — Frontend / UX-UI)
> **Cliente:** Aromaz Home Improvement (New Jersey, USA)
> **Stakeholders:** Marco Baeza (General Manager), Esteban González (Arquitecto IA)
> **Fecha:** Mayo 2026
> **Estado:** v1.0 — Listo para entrar en mockups
> **Idioma UI:** Bilingüe (EN/ES) con switcher
> **Theme:** Light + Dark desde el día 1

---

## 0. Cómo usar este documento

Este Markdown es la **única fuente de verdad** del sistema visual. Está pensado para alimentar tanto a Claude Design (mockups, wireframes, prototipos) como, en una segunda fase, a Claude Code (implementación con tokens consistentes).

Todo lo que aparece aquí se expresa como **design tokens** (variables semánticas: `color.surface.primary`, no `#FFFFFF`) para que migrar a Tailwind, CSS variables, Figma Tokens Studio o cualquier otro stack sea trivial.

**Reglas de oro:**
1. Si no está en este documento, no existe. Cualquier excepción se discute y se incorpora aquí primero.
2. Todo componente debe funcionar en light + dark y en EN + ES.
3. Toda métrica visible debe tener un estado de Condición (Peligro/Emergencia/Normal/Afluencia/Poder) — el sistema visual está construido alrededor de esto.
4. Mobile-first para data-entry (vendedores en terreno). Desktop-first para dashboard GM.

---

## 1. Brand DNA y propósito

### 1.1 Quién es Aromaz Home
Empresa de **carpet & flooring + remodelación residencial** con sede en New Jersey. ~USD $13M de facturación anual, múltiples ubicaciones, equipo distribuido entre Ventas, Marketing, Finanzas, Operaciones, Customer Service y Productos. Marca con 15+ años de oficio, identidad visual basada en colores fuertes (azul + rojo) y tipografía robusta tipo "American contractor".

### 1.2 Qué NO es esta plataforma
- **No** es un sitio comercial. No hay clientes externos navegando.
- **No** es un CRM (eso es FloorZap).
- **No** es un BI tipo Tableau/Power BI genérico.

### 1.3 Qué SÍ es
Una **cabina de mando interna** para que el GM y los líderes vean en tiempo real el pulso de la empresa, y para que cada empleado tenga un espejo de su propio desempeño. El asistente de IA es el copiloto que traduce números en acciones (Fórmulas de Condiciones de Hubbard).

### 1.4 Personalidad visual
| Atributo | Sí | No |
|---|---|---|
| Tono | Profesional, decidido, claro | Lúdico, infantil, "fintech morado" |
| Densidad | Alta densidad de datos legibles | Whitespace excesivo tipo landing |
| Color | Acentos Aromaz (azul/rojo) sobre base neutra oscura/clara | Pasteles, gradientes saturados |
| Tipografía | Sans moderna + mono para números | Serif decorativa, scripts |
| Forma | Cards rectangulares con esquinas levemente redondeadas | Glassmorphism, neumorfismo |
| Movimiento | Microtransiciones funcionales (150–250ms) | Animaciones espectaculares |

**Una frase:** *"Bloomberg Terminal con el alma de un contratista de Jersey."*

---

## 2. Identidad de marca (extraída del logo real)

### 2.1 Colores de marca observados
Del logo `aromaz-logo-2022-11.png`:

| Token | Hex | RGB | Uso original en logo |
|---|---|---|---|
| `brand.blue` | **#1E7FCC** | 30, 127, 204 | Letras "AROMA'Z" |
| `brand.red` | **#E11D24** | 225, 29, 36 | Techo de la casa (símbolo) |
| `brand.black` | **#0A0A0A** | 10, 10, 10 | Letras "HOME" y "CARPET & FLOORING" |
| `brand.accent-1` | **#E11D24** | 225, 29, 36 | Bloque 1 del separador |
| `brand.accent-2` | **#EE5523** | 238, 85, 35 | Bloque 2 |
| `brand.accent-3` | **#F37920** | 243, 121, 32 | Bloque 3 |
| `brand.accent-4` | **#F9B233** | 249, 178, 51 | Bloque 4 (amarillo-naranja) |

Estos bloques rojo→naranja→amarillo del logo son **oro puro para visualización de datos**: ya forman una escala térmica natural que vamos a explotar más adelante.

### 2.2 Logo en producto
- **App icon / favicon:** isotipo (la "A" con techo rojo) sobre fondo blanco o transparente.
- **Sidebar collapsed:** isotipo color completo, 32×32px.
- **Sidebar expanded:** logo horizontal completo, altura 28px.
- **Login screen:** logo a color sobre fondo blanco/dark surface; tagline opcional debajo.
- **No usar nunca** versión "Carpet & Flooring" larga dentro de la app (demasiado peso visual). Usar solo `aromaz-logo-2022-11` recortado al "AROMA'Z HOME".

### 2.3 Tagline interno (sugerido)
- EN: *"Run the numbers. Run the business."*
- ES: *"Los números mandan. Tú decides."*

(Opcional, para login screen. Definir con Marco.)

---

## 3. Sistema de color completo

### 3.1 Filosofía
Trabajamos con **tokens semánticos**, no colores literales. Cada componente referencia un rol (`surface.primary`, `text.subtle`, `border.default`), no un valor hex. Esto permite que dark y light sean el mismo componente con distinta tabla de tokens.

### 3.2 Paleta primitiva (raw palette)

#### Brand (los 4 colores ancla del logo)
```
brand.blue.50    #E8F2FB
brand.blue.100   #C5DCF3
brand.blue.300   #5FA3DA
brand.blue.500   #1E7FCC   ← color marca
brand.blue.700   #155A91
brand.blue.900   #0C3556

brand.red.50     #FCE8E9
brand.red.100    #F8C5C8
brand.red.300    #ED6469
brand.red.500    #E11D24   ← color marca
brand.red.700    #A0151A
brand.red.900    #5F0D10

brand.amber.50   #FEF6E6
brand.amber.500  #F9B233   ← accent-4
brand.amber.700  #B07C18

brand.orange.500 #F37920   ← accent-3
brand.orange.700 #B0561300
```

#### Neutros (slate ligeramente tibio para no enfriar la marca)
```
neutral.0    #FFFFFF
neutral.50   #F8FAFC
neutral.100  #F1F5F9
neutral.200  #E2E8F0
neutral.300  #CBD5E1
neutral.400  #94A3B8
neutral.500  #64748B
neutral.600  #475569
neutral.700  #334155
neutral.800  #1E293B
neutral.900  #0F172A
neutral.950  #020617
```

### 3.3 Tokens semánticos — Light Theme

| Token | Valor | Uso |
|---|---|---|
| `surface.canvas` | `neutral.50` (#F8FAFC) | Fondo de la app |
| `surface.primary` | `neutral.0` (#FFFFFF) | Cards, modales, paneles |
| `surface.secondary` | `neutral.100` (#F1F5F9) | Hover de filas, secciones secundarias |
| `surface.inverse` | `neutral.900` (#0F172A) | Tooltips, notificaciones |
| `surface.brand` | `brand.blue.500` (#1E7FCC) | Header / sidebar activo |
| `border.subtle` | `neutral.200` (#E2E8F0) | Bordes de cards, divisores |
| `border.default` | `neutral.300` (#CBD5E1) | Inputs, separadores fuertes |
| `border.focus` | `brand.blue.500` | Estados focus accesibles |
| `text.primary` | `neutral.900` (#0F172A) | Titulares, números clave |
| `text.secondary` | `neutral.700` (#334155) | Body, labels |
| `text.subtle` | `neutral.500` (#64748B) | Helper text, captions |
| `text.disabled` | `neutral.400` (#94A3B8) | Estados disabled |
| `text.inverse` | `neutral.0` | Texto sobre surfaces oscuras |
| `text.brand` | `brand.blue.700` (#155A91) | Links, CTAs textuales |
| `text.danger` | `brand.red.700` (#A0151A) | Errores |
| `accent.primary` | `brand.blue.500` | CTA primario |
| `accent.danger` | `brand.red.500` | Destructive actions |

### 3.4 Tokens semánticos — Dark Theme

| Token | Valor | Uso |
|---|---|---|
| `surface.canvas` | `neutral.950` (#020617) | Fondo de la app |
| `surface.primary` | `neutral.900` (#0F172A) | Cards, modales |
| `surface.secondary` | `neutral.800` (#1E293B) | Hover, secciones secundarias |
| `surface.inverse` | `neutral.100` (#F1F5F9) | Tooltips claros sobre dark |
| `surface.brand` | `brand.blue.700` (#155A91) | Header / sidebar activo |
| `border.subtle` | `neutral.800` (#1E293B) | Bordes de cards |
| `border.default` | `neutral.700` (#334155) | Inputs, separadores |
| `border.focus` | `brand.blue.300` (#5FA3DA) | Focus visible sobre dark |
| `text.primary` | `neutral.50` (#F8FAFC) | Titulares, números clave |
| `text.secondary` | `neutral.300` (#CBD5E1) | Body, labels |
| `text.subtle` | `neutral.400` (#94A3B8) | Helper text |
| `text.disabled` | `neutral.600` (#475569) | Disabled |
| `text.inverse` | `neutral.900` | Texto sobre surfaces claras |
| `text.brand` | `brand.blue.300` (#5FA3DA) | Links sobre dark |
| `text.danger` | `brand.red.300` (#ED6469) | Errores |
| `accent.primary` | `brand.blue.500` | CTA primario (mantiene contraste) |
| `accent.danger` | `brand.red.500` | Destructive |

### 3.5 Sistema de condiciones (5 colores semáforo expandido)

Este es el **componente más importante** del producto. Cada métrica tiene siempre un estado de condición visible y reconocible a la distancia. La paleta está optimizada para:
- Contraste AA en ambos themes
- Daltonismo (rojo/verde diferenciados con luminancia + iconografía)
- Lectura periférica (un GM debe identificar la condición sin leer el número)

| # | Condición | Token | Light hex | Dark hex | Icono | Significado |
|---|---|---|---|---|---|---|
| 1 | **Peligro** | `condition.danger` | `#B91C1C` | `#F87171` | `siren` / `alert-octagon` | Crítico. Intervención inmediata del GM. |
| 2 | **Emergencia** | `condition.emergency` | `#EA580C` | `#FB923C` | `alert-triangle` | Bajo el mínimo. Acción urgente. |
| 3 | **Normal** | `condition.normal` | `#16A34A` | `#4ADE80` | `check-circle` | Dentro de rango. Mantener. |
| 4 | **Afluencia** | `condition.affluence` | `#0284C7` | `#38BDF8` | `trending-up` | Sobre lo esperado. Reforzar. |
| 5 | **Poder** | `condition.power` | `#7C3AED` | `#A78BFA` | `crown` / `award` | Excepcional. Modelo a seguir. |

**Decisiones explicadas:**
- **Por qué Poder = violeta** (y no dorado): el violeta tiene mayor contraste en dark mode y se diferencia mejor del amber del logo. Si Marco prefiere dorado, alternativa = `#B45309` / `#F59E0B`.
- **Por qué Afluencia = celeste** (y no verde claro): evita confusión con Normal. La progresión visual es **cálido→frío→violeta** que se lee naturalmente como "de mal a excelente".
- **Iconografía obligatoria:** color solo no basta para accesibilidad. Cada chip de condición lleva un ícono.

#### Aplicación del chip de condición
```
┌──────────────────────────────────┐
│ ⚠ EMERGENCIA   $12,400 / $18,000 │
│                ↓ 31% bajo meta    │
└──────────────────────────────────┘
   ^^^ borde izquierdo 4px color condition.emergency
       background: condition.emergency con 8% alpha
```

### 3.6 Otros estados semánticos

| Token | Light | Dark | Uso |
|---|---|---|---|
| `state.success` | `#16A34A` | `#4ADE80` | Confirmaciones (idéntico a Normal pero contextualmente distinto) |
| `state.warning` | `#F59E0B` | `#FBBF24` | Warnings sistémicos (no de condición de métrica) |
| `state.info` | `brand.blue.500` | `brand.blue.300` | Tips, banners informativos |
| `state.neutral` | `neutral.500` | `neutral.400` | Sin dato, N/A |

### 3.7 Paleta de visualización de datos (gráficos)

Inspirada en los bloques rojo→amarillo del logo. Optimizada para series múltiples y daltonismo.

**Categórica (hasta 8 series):**
```
chart.cat.1   #1E7FCC   ← brand blue
chart.cat.2   #E11D24   ← brand red
chart.cat.3   #16A34A   ← green
chart.cat.4   #7C3AED   ← purple
chart.cat.5   #F37920   ← orange
chart.cat.6   #0891B2   ← teal
chart.cat.7   #BE185D   ← magenta
chart.cat.8   #65A30D   ← lime
```

**Secuencial (heatmaps, intensidad):**
Gradiente derivado del logo: `#FEF6E6` → `#F9B233` → `#F37920` → `#EE5523` → `#E11D24` → `#7A0E12`

**Divergente (real vs meta):**
`#B91C1C` (negativo fuerte) → `#94A3B8` (neutro) → `#16A34A` (positivo fuerte)

**Goal line / meta:**
Línea punteada `text.subtle`, grosor 1.5px, dashes 4-4.

---

## 4. Tipografía

### 4.1 Familias

| Rol | Familia | Fallback | Notas |
|---|---|---|---|
| Sans (UI) | **Inter** | `system-ui, -apple-system, "Segoe UI", Roboto` | Variable font, soporta tabular nums |
| Mono (números, datos) | **JetBrains Mono** | `"SF Mono", Consolas, monospace` | Solo para tablas de datos densos y código si aparece |
| Display (opcional, dashboards H1) | **Inter** con `font-feature-settings: "ss01"` | — | No introducir tercera familia |

**Por qué no usar la tipografía del logo (Compacta/Industrial):** es perfecta para branding y signage de tienda, pero impráctica para densidad de datos. Mantenemos Inter como caballo de batalla.

### 4.2 Escala tipográfica

| Token | Size | Line | Weight | Uso |
|---|---|---|---|---|
| `text.display.lg` | 48px / 3rem | 56 | 700 | KPI hero (1 por pantalla) |
| `text.display.md` | 36px / 2.25rem | 44 | 700 | Número grande de KPI card |
| `text.display.sm` | 28px / 1.75rem | 36 | 600 | Headers de sección |
| `text.heading.lg` | 22px / 1.375rem | 30 | 600 | Títulos de card |
| `text.heading.md` | 18px / 1.125rem | 26 | 600 | Subtítulos |
| `text.heading.sm` | 16px / 1rem | 24 | 600 | Labels de grupo |
| `text.body.lg` | 16px | 24 | 400 | Body por defecto |
| `text.body.md` | 14px | 20 | 400 | Tablas, body denso |
| `text.body.sm` | 13px | 18 | 400 | Helper, captions |
| `text.label.md` | 12px | 16 | 600 | UPPERCASE etiquetas, letter-spacing 0.05em |
| `text.label.sm` | 11px | 14 | 600 | Chips, badges |
| `text.mono.md` | 14px JBMono | 20 | 500 | Tabular numbers en tablas |
| `text.mono.sm` | 13px JBMono | 18 | 500 | Datos en chips |

### 4.3 Reglas tipográficas
- **Tabular numbers obligatorio** en cualquier número que se compare en una columna: `font-variant-numeric: tabular-nums`.
- **Mayúsculas** solo para `text.label.*` (chips, etiquetas de sección). Nunca para body ni números.
- **Truncado:** `text.heading.*` con `text-overflow: ellipsis` y tooltip si supera 1 línea. Body con `-webkit-line-clamp` máximo 2 líneas en cards.
- **Bilingüe:** todos los strings con clave i18n. Considerar que español es ~25% más largo que inglés — los componentes deben acomodar overflow sin romper layout.

---

## 5. Espaciado, layout y grid

### 5.1 Sistema de espaciado (base 4)
```
space.0   0px
space.1   4px
space.2   8px
space.3   12px
space.4   16px   ← base de gutter
space.5   20px
space.6   24px   ← gutter de cards
space.8   32px
space.10  40px
space.12  48px
space.16  64px
space.20  80px
space.24  96px
```

### 5.2 Border radius
```
radius.sm   4px    chips, badges, inputs
radius.md   8px    cards, buttons
radius.lg   12px   modales, paneles grandes
radius.xl   16px   elementos decorativos (raro)
radius.full 9999px avatars, pills
```

### 5.3 Sombras / elevación

Light theme:
```
elevation.0   none                                       (flush)
elevation.1   0 1px 2px rgba(15,23,42,0.06)              cards reposo
elevation.2   0 4px 8px rgba(15,23,42,0.08)              cards hover, dropdowns
elevation.3   0 8px 16px rgba(15,23,42,0.10)             modales, popovers
elevation.4   0 20px 40px rgba(15,23,42,0.18)            command palette, dialogs hero
```

Dark theme:
```
elevation.0   none
elevation.1   0 1px 2px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.04)
elevation.2   0 4px 8px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.06)
elevation.3   0 8px 16px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)
elevation.4   0 20px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.10)
```

### 5.4 Layout principal — Desktop

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR  64px                                                    │
├──────────┬──────────────────────────────────────────────────────┤
│          │  CONTENT AREA                                        │
│ SIDEBAR  │   max-width: 1440px                                  │
│ 248px    │   padding: 32px                                      │
│          │                                                      │
│ (colap.) │   ┌─────────┬─────────┬─────────┬─────────┐         │
│  72px    │   │ KPI 1   │ KPI 2   │ KPI 3   │ KPI 4   │  Grid  │
│          │   └─────────┴─────────┴─────────┴─────────┘  12 col │
│          │   ┌───────────────────────┬───────────────┐         │
│          │   │ Chart principal       │ Lista lateral │         │
│          │   │ (8 cols)              │ (4 cols)      │         │
│          │   └───────────────────────┴───────────────┘         │
│          │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
```

**Sidebar:**
- Expandida: 248px, mostrando ícono + label
- Colapsada: 72px, solo íconos con tooltip
- Comportamiento: persiste por usuario en localStorage

**Topbar:**
- Logo (solo en mobile o cuando sidebar está colapsada)
- Buscador global (cmd+K)
- Selector de período (Semana actual / Mes / Trimestre / YTD / Custom)
- Toggle theme
- Switcher de idioma (EN/ES)
- Avatar + menú usuario
- Bell de notificaciones (alertas de condición)

**Content grid:** 12 columnas, gutter 24px, container max 1440px (en pantallas >1600 el contenido se centra con márgenes laterales).

### 5.5 Layout — Mobile (data entry)

Móvil es prioridad para que vendedores ingresen datos diarios sin fricción. Pantalla típica:

```
┌──────────────────┐
│ ← Mis Métricas   │  ← topbar 56px, back + título
├──────────────────┤
│ Semana 21        │
│ 17–23 Mayo       │
├──────────────────┤
│                  │
│  Métrica         │
│  ┌────────────┐  │
│  │ Field      │  │  ← input 56px height (touch-friendly)
│  └────────────┘  │
│                  │
│  Métrica         │
│  ┌────────────┐  │
│  │ Field      │  │
│  └────────────┘  │
│                  │
│  ...             │
│                  │
├──────────────────┤
│ [Guardar]        │  ← sticky bottom CTA
└──────────────────┘
```

Breakpoints:
```
sm   ≥ 640px
md   ≥ 768px   ← sidebar reaparece
lg   ≥ 1024px  ← layout 2 columnas
xl   ≥ 1280px
2xl  ≥ 1536px
```

---

## 6. Iconografía

**Librería:** [Lucide](https://lucide.dev) (open-source, ~1300 íconos, peso óptimo, consistente con shadcn/ui que probablemente usemos en build).

**Estilo:** stroke 1.75–2px, esquinas redondeadas. Tamaños canónicos: 16, 20, 24, 32px.

**Set crítico de íconos por contexto:**

| Contexto | Icono Lucide |
|---|---|
| Dashboard | `layout-dashboard` |
| Ventas | `dollar-sign` |
| Marketing | `megaphone` |
| Finanzas | `wallet` |
| Operaciones | `wrench` |
| Productos | `package` |
| Customer Service | `headphones` |
| Reportes | `file-bar-chart` |
| Metas / PPF | `target` |
| Equipo | `users` |
| Alertas | `bell` |
| Configuración | `settings` |
| Condición Peligro | `siren` |
| Condición Emergencia | `alert-triangle` |
| Condición Normal | `check-circle-2` |
| Condición Afluencia | `trending-up` |
| Condición Poder | `crown` |
| IA / Reporte | `sparkles` |
| Aprobar | `check` |
| Editar | `pencil` |
| Eliminar | `trash-2` |
| Filtrar | `sliders-horizontal` |
| Período | `calendar-range` |

---

## 7. Sistema de componentes

### 7.1 Botones

5 variantes × 3 tamaños × estados (default/hover/active/focus/disabled/loading).

| Variante | Background | Border | Text | Uso |
|---|---|---|---|---|
| `primary` | `accent.primary` (brand blue) | — | `text.inverse` | Acción principal (1 por vista) |
| `secondary` | `surface.primary` | `border.default` | `text.primary` | Acciones secundarias |
| `ghost` | transparente | — | `text.primary` | Acciones terciarias, toolbar |
| `danger` | `accent.danger` (brand red) | — | `text.inverse` | Eliminar, desactivar |
| `link` | transparente | — | `text.brand` con underline en hover | Navegación inline |

**Tamaños:**
- `sm`: 32px h, padding-x 12, font 13
- `md`: 40px h, padding-x 16, font 14 (default)
- `lg`: 48px h, padding-x 20, font 16

**Estados:**
- Focus: ring 2px `border.focus`, offset 2px
- Loading: spinner sustituye contenido, ancho preservado
- Icon-only: cuadrado (mismo h y w)

### 7.2 Inputs y formularios

Todos los inputs heredan:
- Altura: 40px (md), 48px (lg para móvil/data-entry)
- Radius: `radius.md` (8px)
- Border default: `border.default` 1px
- Border focus: `border.focus` 2px (inset, sin desplazar layout)
- Padding-x: 12px
- Label arriba (no placeholder-as-label)
- Helper text debajo, `text.subtle`
- Error: borde + helper text en `text.danger` + ícono `alert-circle` inline

Tipos contemplados:
- `text`, `email`, `password`, `number`
- `textarea` (auto-resize entre 80–240px)
- `select` y `combobox` (con búsqueda)
- `date` y `date-range` (selector de período)
- `radio`, `checkbox`, `switch`
- `slider` (rangos de condición — ver §10)
- `file-upload` (drag&drop para imports CSV)

### 7.3 Cards

**Anatomía estándar:**
```
┌─────────────────────────────────────────┐
│ TÍTULO DE LA CARD            • • •      │  ← header: title + menú
│ Subtítulo opcional                      │
├─────────────────────────────────────────┤
│                                         │
│            CONTENIDO                    │  ← body
│                                         │
├─────────────────────────────────────────┤
│ Footer opcional (CTAs, links)           │  ← footer
└─────────────────────────────────────────┘
```

Padding interno: 24px. Border: `border.subtle` 1px. Background: `surface.primary`. Elevation: 1 default, 2 en hover si es clickeable.

### 7.4 KPI Card (componente clave del producto)

El elemento más repetido en toda la app. Diseño riguroso:

```
┌─────────────────────────────────────────┐
│ ⓘ TOTAL DE VENTAS                       │  ← label 11px UPPER + info tooltip
│                                         │
│ $84,320                                 │  ← display.md, mono tabular
│ ▲ +12.4%  vs. semana anterior           │  ← delta + comparativo
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━░░░░░ 78%          │  ← progress vs meta
│ Meta: $108,000                          │
│                                         │
├─────────────────────────────────────────┤
│ 🟢 NORMAL   actualizado hace 2h         │  ← chip condición + timestamp
└─────────────────────────────────────────┘
```

**Reglas:**
- Borde izquierdo 4px del color de la condición actual (subliminal, lectura periférica)
- Click → drill-down a vista detalle de la métrica
- Sin condición asignada → borde gris, chip "Sin meta"

### 7.5 Tablas

Tabla densa estilo Bloomberg/Linear. Densidades:
- `compact`: filas 32px (data-heavy)
- `comfortable`: filas 44px (default)
- `relaxed`: filas 56px (con avatares/contenido rico)

Features obligatorias:
- Sticky header
- Sortable por click en columna
- Sticky first column (en mobile)
- Filtros por columna (popover)
- Selección múltiple (checkbox)
- Bulk actions bar (aparece al seleccionar)
- Paginación o virtualización (>200 filas → virtualizar)
- Densidad ajustable por usuario
- Exportar CSV / PDF

Tipografía en tabla:
- Headers: `text.label.md` UPPER
- Cells de texto: `text.body.md`
- Cells de números: `text.mono.md` tabular, alineados a la derecha
- Cells de fecha: `text.body.md`, formato local del usuario

### 7.6 Badges / Chips

```
[ Peligro ]   bg condition.danger @ 12% alpha, text condition.danger, ícono
[ +12.4%  ]   bg state.success @ 12%, text state.success, sin ícono
[ Vendedor ]  bg neutral, text.secondary, role-tag
```

Padding: 4 6, radius `sm`, font `label.sm`.

### 7.7 Sidebar (navegación)

```
┌──────────────┐
│ [LOGO]       │  ← 64px header
├──────────────┤
│ ▣ Dashboard  │  ← item activo: bg surface.secondary, border-l 3px brand.blue
│ 💰 Ventas    │
│ 📢 Marketing │
│ 💼 Finanzas  │
│ 🔧 Operac.   │
│ 📦 Productos │
│ 🎧 Customer  │
│ ─────────    │
│ 👥 Equipo    │  ← solo GM y líderes
│ 🎯 Mis Metas │  ← PPF
│ 📊 Reportes  │
│ ─────────    │
│ ✨ Asistente │  ← chat IA
│ ⚙ Configurar │
├──────────────┤
│ [Avatar]     │  ← user card abajo
│ Marco B.     │
│ General Mgr  │
└──────────────┘
```

### 7.8 Topbar

Componentes de izquierda a derecha:
1. Botón colapsar sidebar (hamburger en mobile)
2. Breadcrumb dinámico
3. (spacer)
4. Buscador global (cmd+K)
5. Selector de período global
6. Botón "Nuevo registro" (contextual al rol)
7. Switcher idioma EN/ES
8. Toggle theme (sun/moon)
9. Bell de notificaciones (con badge contador rojo)
10. Avatar + menú usuario

### 7.9 Empty states

Cada lista, tabla y dashboard debe tener empty state diseñado:
- Ilustración o ícono grande (`text.subtle`)
- Headline (`text.heading.md`)
- Body explicativo (`text.body.md text.secondary`)
- CTA primario para resolver el vacío

Ej: "Aún no has registrado ventas esta semana" + botón "Registrar mi primera venta".

### 7.10 Toasts y notificaciones

Posición: bottom-right (desktop), top (mobile).
Tipos: `success`, `error`, `warning`, `info`.
Duración: 5s success/info, 8s warning, persistente para error.
Anatomía: ícono + título + (descripción) + CTA opcional + cerrar.

### 7.11 Modales y drawers

- **Modal**: confirmaciones, formularios pequeños. Max-width 480/640/800.
- **Drawer (lateral derecho)**: detalles de métrica, edición de registro, asistente IA.
- **Drawer (bottom mobile)**: data entry rápido en móvil.
- **Command palette (cmd+K)**: navegación rápida, búsqueda global, acciones.

### 7.12 Date picker / Period selector

Componente crítico (la app es 100% time-based). Presets predefinidos:
- Hoy
- Ayer
- Esta semana / Semana pasada
- Este mes / Mes pasado
- Este trimestre
- YTD (año a la fecha)
- Últimos 7/30/90 días
- Año pasado
- Custom range (calendario doble panel)

El período seleccionado **persiste** en URL como query param para que dashboards sean shareables.

---

## 8. Visualización de datos

### 8.1 Reglas generales
- **Líneas, no áreas**, para tendencias largas (menor ruido visual).
- **Barras agrupadas** para comparativas categóricas.
- **Donut/stacked** solo cuando hay máximo 4-5 categorías.
- **Mapa de calor** para densidad temporal (días × semanas).
- **Sparklines** dentro de KPI cards y tablas (16–24px alto).
- **Goal line punteada** siempre que exista meta.
- **Banda de objetivo** (área tinted) cuando hay rango aceptable.

### 8.2 Anatomía de un chart card

```
┌────────────────────────────────────────────────┐
│ Ventas semanales — Equipo Comercial            │  ← title
│ Últimas 12 semanas                             │  ← context
├────────────────────────────────────────────────┤
│  $120k ┤        ╱╲                             │
│  $100k ┤ ───────╲────────  ← goal line         │
│   $80k ┤   ╱──╲╱  ╲   ╱╲                       │
│   $60k ┤  ╱       ╲ ╱   ╲                      │
│   $40k ┤ ╱                                     │
│        └──────────────────────────────         │
│         W10 W11 W12 W13 W14 W15 ...            │
├────────────────────────────────────────────────┤
│ ● Real  ─ ─ Meta   [Última semana]  [▼ Export] │
└────────────────────────────────────────────────┘
```

### 8.3 Librerías sugeridas (para Fase 2)
- **Recharts** (React, simple, suficiente para 80% de casos)
- **ECharts** (alternativa más potente para heatmaps, geo)
- **Tremor** (componentes pre-armados que ya usan tokens — ideal si vamos con Next.js/Tailwind)

### 8.4 Densidad de información por dashboard
- **GM dashboard**: 8–12 KPIs + 4–6 charts en una vista
- **Departamento**: 5–8 KPIs + 3–4 charts
- **Individual (vendedor)**: 4–6 KPIs + 2–3 charts + ranking del equipo

---

## 9. Sistema de las 5 Condiciones — UX completo

Esta es **la mecánica diferenciadora** del producto. No es solo color: es un sistema completo de cómo el usuario percibe el estado de su trabajo y cómo la IA actúa sobre él.

### 9.1 Cómo se calcula la condición de una métrica

Cada métrica tiene definidos 4 umbrales (configurables por el GM):

```
     │ PELIGRO │ EMERGENCIA │ NORMAL │ AFLUENCIA │ PODER │
─────┼─────────┼────────────┼────────┼───────────┼───────┼──→ % de meta
     0%       50%          85%      105%        125%
```

Valores default sugeridos (Marco los puede ajustar por métrica):
- **Peligro**: < 50% de la meta
- **Emergencia**: 50–84% de la meta
- **Normal**: 85–104% de la meta
- **Afluencia**: 105–124% de la meta
- **Poder**: ≥ 125% de la meta

UI para editar umbrales (GM): slider de 5 segmentos con drag handles. Vista previa en vivo de dónde caería el valor actual.

### 9.2 Cuándo se notifica

Cuando una métrica **cambia de condición** (no en cada update). Ejemplo: vendedor estaba en Normal y bajó a Emergencia → trigger.

### 9.3 Flujo del Motor de IA (Capa 1 + Capa 2)

```
[Métrica cambia de condición]
            │
            ▼
[IA genera reporte automático con fórmula de Hubbard correspondiente]
            │
            ├──────────── Capa 2: GM (Marco) recibe en su inbox ──┐
            │                                                       │
            ▼                                                       │
[Capa 1: Reporte queda en "Pending Review"]                        │
            │                                                       │
            │              ┌─────────────────────────────┐         │
            │              │ Marco revisa el reporte:    │◄────────┘
            │              │  - Aprobar y enviar         │
            │              │  - Editar y enviar          │
            │              │  - Rechazar                 │
            │              │  - Diferir (snooze)         │
            │              └─────────────────────────────┘
            │                            │
            └─────────► Enviado al responsable (push + email + in-app)
```

### 9.4 UI del reporte IA

Pantalla de detalle del reporte:

```
┌──────────────────────────────────────────────────────────┐
│ ✨ Reporte automático — Ventas John Smith                │
│ Generado: 21 May 2026, 09:14 · Pending Review            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Métrica:  Cotizaciones enviadas (semanal)                │
│ Estado:   🟠 EMERGENCIA (desde 🟢 NORMAL)                │
│ Valor:    14 / 25  (56% de meta)                         │
│ Tendencia: ▼ 3 semanas consecutivas en descenso          │
│                                                          │
│ ─────────  Análisis  ─────────                           │
│ John ha reducido su volumen de cotizaciones en un 42%    │
│ respecto al promedio trimestral. Los follow-ups también  │
│ bajaron (8 vs 18 promedio). No se observan factores      │
│ externos (período normal, sin licencia registrada).      │
│                                                          │
│ ─────────  Plan de acción (Fórmula Emergencia)  ───────  │
│ 1. PROMOTE — Reactivar contactos de los últimos 60 días  │
│    en pipeline con prioridad alta.                       │
│ 2. CHANGE OPERATIONAL BASIS — Revisar agenda diaria      │
│    para asegurar bloques de prospección de 90min.        │
│ 3. ECONOMIZE — Pausar actividades que no generen         │
│    cotizaciones esta semana.                             │
│ 4. PREPARE FOR FUTURE — Revisar pipeline con líder       │
│    comercial el viernes.                                 │
│                                                          │
│ ─────────  Notas del GM  ─────────                       │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ [Marco escribe aquí instrucciones específicas]       │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ [✕ Rechazar]  [✏ Editar]  [⏰ Diferir 24h]  [✓ Enviar]  │
└──────────────────────────────────────────────────────────┘
```

### 9.5 Inbox del GM

Sección dedicada `/inbox` con:
- Reportes pendientes (orden por urgencia: Peligro > Emergencia > Afluencia > Poder)
- Filtros por departamento, empleado, fecha
- Bulk approve (aprobar varios sin editar, con confirmación)
- Histórico de reportes enviados

### 9.6 Vista del empleado al recibir el reporte

Notificación in-app + email + (opcional) push móvil. Al abrir:
- Banner superior con condición actual
- Reporte completo legible
- Sección "Mi plan de acción de esta semana" donde el empleado puede marcar progreso
- Conversación tipo Slack para preguntar al GM dudas sobre el reporte

---

## 10. Sitemap / Arquitectura de información

### 10.1 Mapa completo

```
/                                Login
/auth/forgot                     Recuperar password
/onboarding                      Primer login (selección de idioma, theme, perfil)

/ (autenticado)                  Redirect según rol
│
├── /dashboard                   Vista principal (varía según rol)
│   ├── /dashboard/gm            GM: vista compañía completa
│   ├── /dashboard/department    Líder: vista del departamento
│   └── /dashboard/me            Empleado: vista personal
│
├── /sales                       Departamento Ventas
│   ├── /sales/overview          Resumen del depto
│   ├── /sales/team              Tabla de vendedores con condición
│   ├── /sales/team/:userId      Vista detallada de un vendedor
│   ├── /sales/quotes            Cotizaciones (desde FloorZap)
│   ├── /sales/funnel            Embudo de conversión
│   └── /sales/battle-plan       Battle plans semanales
│
├── /marketing                   Departamento Marketing
│   ├── /marketing/overview
│   ├── /marketing/google-ads    Datos de Google Ads
│   ├── /marketing/channels      Por canal/ubicación
│   ├── /marketing/cpa           Costo por adquisición
│   └── /marketing/roas
│
├── /finance                     Departamento Finanzas
│   ├── /finance/overview
│   ├── /finance/cashflow
│   ├── /finance/receivables     Cuentas por cobrar
│   ├── /finance/payables        Cuentas por pagar
│   └── /finance/rpe             Revenue per Employee
│
├── /products                    Productos
│   ├── /products/inventory
│   ├── /products/top-selling
│   └── /products/restock
│
├── /customer-service
│   ├── /customer-service/claims
│   ├── /customer-service/warranty
│   └── /customer-service/installer-ranking
│
├── /team                        (GM + Líderes)
│   ├── /team/list               Tabla equipo completo
│   ├── /team/:userId            Perfil completo
│   ├── /team/:userId/ppf        Metas PPF (Cardone)
│   ├── /team/:userId/history    Histórico de desempeño
│   └── /team/structure          Organigrama AH Structure
│
├── /metrics                     Configuración de métricas (GM)
│   ├── /metrics/catalog         Catálogo de todas las métricas
│   ├── /metrics/:metricId       Editor de métrica (umbrales, fórmulas)
│   └── /metrics/manual-entry    Pantalla rápida de entrada manual (empleados)
│
├── /reports                     Reportes IA
│   ├── /reports/inbox           Pending review (GM)
│   ├── /reports/sent            Enviados
│   ├── /reports/received        Recibidos (empleado)
│   └── /reports/:reportId       Detalle
│
├── /assistant                   Chat IA conversacional
│
├── /integrations                (Admin)
│   ├── /integrations/floorzap
│   ├── /integrations/google-ads
│   └── /integrations/facebook   (futuro)
│
└── /settings
    ├── /settings/profile
    ├── /settings/notifications
    ├── /settings/security       2FA, sesiones
    ├── /settings/team           (admin) gestión usuarios y roles
    └── /settings/billing        (futuro)
```

### 10.2 Roles y permisos visualmente

| Sección | GM (Marco) | Líder Depto | Empleado |
|---|---|---|---|
| Dashboard GM (compañía) | ✅ | — | — |
| Dashboard Depto | ✅ (todos) | ✅ (el suyo) | — |
| Dashboard personal | ✅ | ✅ | ✅ |
| Ver otros depto | ✅ | — | — |
| Editar umbrales métricas | ✅ | ⚠ propuestas | — |
| Revisar reportes IA | ✅ | ✅ (los del depto) | — |
| Recibir reportes IA | — | ✅ | ✅ |
| Gestión equipo | ✅ | ✅ (su equipo) | — |
| Integraciones | ✅ | — | — |
| Metas PPF de otros | ✅ | ✅ (su equipo) | — |
| Mi PPF | ✅ | ✅ | ✅ |

---

## 11. Wireframes textuales — Pantallas clave

### 11.1 Dashboard del GM (la pantalla más importante)

```
┌─ TOPBAR ────────────────────────────────────────────────────────────────┐
│ ☰  Aromaz · GM Dashboard   🔍   [📅 Semana 21 ▼]  +Nuevo  EN/ES  🌙  🔔3  👤Marco │
└──────────────────────────────────────────────────────────────────────────┘
┌─ SIDEBAR ─┬─ HERO STRIP ────────────────────────────────────────────────┐
│ ⌂ Dashb.  │ 🟢 Compañía: Normal · 28 métricas verde · 4 amarillas · 1 roja │
│ 💰 Ventas │ ╰─ "1 métrica crítica requiere tu atención" → [Ver inbox]    │
│ 📢 Mktg.  ├─────────────────────────────────────────────────────────────┤
│ 💼 Fin.   │                                                              │
│ 🔧 Oper.  │ ┌─KPI──────┐ ┌─KPI──────┐ ┌─KPI──────┐ ┌─KPI──────┐         │
│ 📦 Prod.  │ │ Sales WTD│ │ Quotes   │ │ Cost/Lead│ │ Cash     │         │
│ 🎧 CX     │ │ $84,320  │ │   142    │ │  $87     │ │ $312k    │         │
│ ────      │ │ ▲ 12.4%  │ │ ▼ 8%     │ │ ▲ 3%     │ │ ─ flat   │         │
│ 👥 Equipo │ │ ━━━━━░ 78%│ │ ━━━░░ 60%│ │ ━━━━─ 92%│ │ ━━━━━ 95%│         │
│ 🎯 PPF    │ │ 🟢 Normal│ │ 🟠 Emerg.│ │ 🟢 Normal│ │ 🟢 Normal│         │
│ 📊 Reps   │ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│ ────      │                                                              │
│ ✨ AI     │ ┌─CHART: Ventas semanales últimas 12 semanas ─────┐ ┌─Inbox─┐│
│ ⚙ Conf.   │ │  ......curva real vs goal line.......           │ │ 1 🔴  ││
│           │ │                                                  │ │ 3 🟠  ││
│ ───       │ │                                                  │ │ 2 🟢↑ ││
│ 👤 Marco  │ └──────────────────────────────────────────────────┘ └───────┘│
│ GM        │                                                              │
└───────────┴──────────────────────────────────────────────────────────────┘
              ┌─SECCIÓN: Departamentos ──────────────────────────────────┐
              │ Tabla: Depto | Líder | Score | Métricas | Condición      │
              │ Ventas   | ...  | 82%   | 8/10 verdes |  🟢              │
              │ Mktg     | ...  | 71%   | 5/8 verdes  |  🟠              │
              │ Fin      | ...  | 95%   | 9/9 verdes  |  🔵 Afluencia    │
              │ Oper     | ...  | 88%   | 7/8 verdes  |  🟢              │
              │ Prod     | ...  | 78%   | 4/5 verdes  |  🟢              │
              │ CX       | ...  | 65%   | 3/6 verdes  |  🔴 Peligro      │
              └──────────────────────────────────────────────────────────┘
```

### 11.2 Dashboard del Vendedor (espejo personal)

```
┌─ "Hola John, esta es tu semana" ────────────────────────────────────┐
│                                                                      │
│ ┌─Estado general────────────────────────────────────────┐           │
│ │ 🟢 Estás en NORMAL                                    │           │
│ │ 5 de 7 métricas verdes · 2 en emergencia              │           │
│ │ Próxima reunión PPF: 28 mayo (Marco)                  │           │
│ └───────────────────────────────────────────────────────┘           │
│                                                                      │
│ ┌─KPI: Sales WTD─┐ ┌─KPI: Quotes─┐ ┌─KPI: Conv Rate─┐ ┌─Follow-ups─┐│
│ │ $18,400        │ │  12         │ │ 32%             │ │  14         ││
│ │ ━━━━━░ 75%     │ │ ━━━░░ 60%   │ │ ━━━━━ Normal    │ │ ━━━━━ 100%  ││
│ │ 🟢             │ │ 🟠          │ │ 🟢              │ │ 🔵 Afluencia││
│ └────────────────┘ └─────────────┘ └─────────────────┘ └─────────────┘│
│                                                                      │
│ ┌─Tu plan esta semana ────────────────────────────────────────────┐ │
│ │ [✓] Llamar 30 leads del último mes                              │ │
│ │ [✓] Enviar 5 cotizaciones nuevas                                │ │
│ │ [ ] Cerrar visita en domicilio del cliente XYZ                  │ │
│ │ [ ] Reunión 1:1 con Marco — viernes 16:00                       │ │
│ └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│ ┌─Tu posición en el equipo ────────────────────────────────────────┐│
│ │ 1. 🥇 Sarah        $24,100   🔵 Afluencia                        ││
│ │ 2. 🥈 You (John)   $18,400   🟢 Normal                           ││
│ │ 3.    Mike         $14,200   🟠 Emergencia                       ││
│ └──────────────────────────────────────────────────────────────────┘│
│                                                                      │
│ [+ Registrar mis métricas de esta semana]                            │
└──────────────────────────────────────────────────────────────────────┘
```

### 11.3 Pantalla de entrada manual (mobile-first)

```
┌──────────────────────┐
│ ← Mis métricas       │
├──────────────────────┤
│                      │
│ Semana 21            │
│ 17–23 Mayo 2026      │
│                      │
│ ━━━━━━━━━━━━━━━━━    │
│ Ventas cerradas      │
│ ┌──────────────────┐ │
│ │ $ 18,400         │ │
│ └──────────────────┘ │
│ Meta: $25,000        │
│                      │
│ ━━━━━━━━━━━━━━━━━    │
│ Follow-ups realiz.   │
│ ┌──────────────────┐ │
│ │   14             │ │
│ └──────────────────┘ │
│ Meta: 12  🔵 +16%    │
│                      │
│ ━━━━━━━━━━━━━━━━━    │
│ Cotizaciones env.    │
│ ┌──────────────────┐ │
│ │   12             │ │
│ └──────────────────┘ │
│ Meta: 20             │
│                      │
│ ━━━━━━━━━━━━━━━━━    │
│ Errores cometidos    │
│ ┌──────────────────┐ │
│ │   2              │ │
│ └──────────────────┘ │
│ Comentario:          │
│ ┌──────────────────┐ │
│ │ Medidas erradas  │ │
│ │ cliente Pérez    │ │
│ └──────────────────┘ │
│                      │
├──────────────────────┤
│   [Guardar cambios]  │  ← sticky
└──────────────────────┘
```

UX clave:
- Solo métricas que **NO** se extraen automáticamente
- Pre-rellenado con último valor para que sea editar, no escribir desde cero
- Autosave cada 5 segundos
- Confirmación visual al guardar (toast + animación leve en card)
- Bottom sheet de "Excelente, completaste todas tus métricas de la semana" al terminar

### 11.4 Inbox del GM (reportes IA pendientes)

```
┌─ Reportes pendientes de revisión (12) ──────────────────────────────┐
│ Filtros: [Todos ▼] [Esta semana ▼] [Todas las condiciones ▼]        │
├─────────────────────────────────────────────────────────────────────┤
│ 🔴 PELIGRO  Ventas — Sarah K.       Conv rate cayó 38%   hace 2h    │
│             ↳ [Revisar]                                              │
├─────────────────────────────────────────────────────────────────────┤
│ 🟠 EMERG.   Mktg — Google Ads NJ-2  CPA subió 220%       hace 4h    │
│             ↳ [Revisar]                                              │
├─────────────────────────────────────────────────────────────────────┤
│ 🟠 EMERG.   Ventas — John S.        Cotizaciones -42%    hace 5h    │
│             ↳ [Revisar]                                              │
├─────────────────────────────────────────────────────────────────────┤
│ 🟣 PODER    Ventas — Mike T.        Sales WTD +147%      hace 1d    │
│             ↳ [Revisar y reconocer]                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.5 Editor de umbrales (configuración de métrica)

Pantalla solo accesible al GM. Slider visual de 5 segmentos.

```
┌─ Métrica: Total de ventas semanales (vendedor) ────────────────────┐
│                                                                     │
│ Unidad: USD ($)    Frecuencia: Semanal    Tipo: Higher-is-better    │
│                                                                     │
│ Meta semanal por vendedor: $ [25,000]                               │
│                                                                     │
│ ─── Umbrales de condición ───────────────────────────────────────  │
│                                                                     │
│  Peligro   Emerg.    Normal    Afluencia    Poder                  │
│  ▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░          │
│  $0      $12,500  $21,250  $26,250    $31,250  →$$$                │
│  (0%)    (50%)    (85%)    (105%)     (125%)                       │
│                                                                     │
│  [Reset a defaults]                                                 │
│                                                                     │
│ ─── Valor actual del vendedor seleccionado ─────                   │
│ John Smith:  $18,400  →  🟢 Normal                                  │
│                                                                     │
│                              [Cancelar]  [Guardar]                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.6 Detalle de reporte IA (ya descrito en §9.4)

### 11.7 Pantalla de perfil PPF de un empleado

```
┌─ John Smith — Senior Sales Representative ─────────────────────────┐
│ ┌──────┐                                                            │
│ │ JS   │  Senior Sales Rep — Ventas                                 │
│ └──────┘  En Aromaz desde: Marzo 2022 · Ubicación: Edison NJ        │
│                                                                     │
│ Tabs: [ Resumen ] [ Métricas ] [ Histórico ] [ PPF ] [ Reportes ]   │
│                                                                     │
│ ─ PPF (Personal · Professional · Financial Goals) ──                │
│                                                                     │
│ 🎯 PERSONAL                                                         │
│ "Comprar mi primera casa en Plainfield antes de 2028"               │
│ Progreso: 38% del fondo inicial ahorrado                            │
│                                                                     │
│ 🎯 PROFESSIONAL                                                     │
│ "Convertirme en Sales Lead del territorio sur antes de fin 2026"   │
│ Skills gap: Manejo de equipos (en curso) · CRM avanzado (pendiente) │
│                                                                     │
│ 🎯 FINANCIAL                                                        │
│ "Alcanzar ingreso bruto de $95k en 2026"                            │
│ YTD: $32k · Proyección: $88k · ▼ $7k bajo objetivo                  │
│                                                                     │
│ ─ Resumen objetivo (data) ────────────────                          │
│ Condición promedio últimos 90d: Normal (3.2/5)                      │
│ Reportes recibidos: 12 (8 Normal, 3 Emergencia, 1 Afluencia)        │
│ Cumplimiento de planes de acción: 76%                               │
│                                                                     │
│ ─ Próxima reunión 1:1 ────                                          │
│ Viernes 28 mayo, 16:00 · Marco Baeza                                │
│                                                                     │
│           [Agendar 1:1]   [Generar reporte para reunión]            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 12. Estados, motion y microinteracciones

### 12.1 Estados de cada componente
Todo componente interactivo tiene 6 estados visibles diseñados:
- **Default**
- **Hover** (en desktop): lift sutil + color shift
- **Focus visible**: ring 2px `border.focus`
- **Active / pressed**: scale 0.98 + shadow inset
- **Disabled**: opacity 0.5, cursor not-allowed, sin hover
- **Loading**: spinner sustituyendo contenido

### 12.2 Estados de datos
Toda vista que consume datos tiene 4 estados:
- **Loading**: skeleton (no spinners salvo en botones)
- **Empty**: ilustración + headline + CTA
- **Error**: ilustración + mensaje + CTA reintentar
- **Success**: el render normal

### 12.3 Motion tokens

```
duration.instant   0ms
duration.fast      150ms   ← hovers, color shifts
duration.normal    250ms   ← drawers, modales abriendo
duration.slow      400ms   ← page transitions
duration.deliberate 600ms  ← onboarding, primera vez

easing.standard    cubic-bezier(0.4, 0, 0.2, 1)
easing.decelerate  cubic-bezier(0, 0, 0.2, 1)
easing.accelerate  cubic-bezier(0.4, 0, 1, 1)
easing.spring      cubic-bezier(0.34, 1.56, 0.64, 1)
```

### 12.4 Reglas de motion
- **Respeta `prefers-reduced-motion`**: animaciones críticas (transición de página) se reducen a opacidad.
- **Nada anima más de 400ms** salvo onboarding.
- **Skeletons pulsan** a 2s/ciclo, no shimmer agresivo.
- **Cambio de condición** de una métrica: micro-animación de 600ms con scale leve + color transition. El usuario NOTA que cambió.

---

## 13. Accesibilidad (WCAG 2.1 AA mínimo)

### 13.1 Contraste
- Texto sobre fondo: 4.5:1 mínimo (AA), 7:1 deseable (AAA) para body
- Texto grande (≥18px): 3:1 mínimo
- Componentes no textuales (íconos, bordes de inputs): 3:1
- **Verificado para los 5 colores de condición en light y dark**

### 13.2 Navegación por teclado
- Tab order lógico en todas las vistas
- Focus visible siempre
- Skip-link al main content
- Atajos:
  - `cmd/ctrl + K`: command palette
  - `cmd/ctrl + /`: shortcuts list
  - `g + d`: ir a dashboard
  - `g + i`: ir a inbox (GM)
  - `n`: nuevo registro contextual
  - `?`: ayuda

### 13.3 Screen readers
- Todo ícono con texto: `aria-label`
- Chart cards: tabla equivalente accesible por toggle
- Toasts: `aria-live="polite"`
- Errores de form: `aria-describedby` apuntando al helper text
- Skip-links para usuarios de lector de pantalla

### 13.4 Color
- Nunca solo color para comunicar estado. Siempre color + ícono + texto.
- Modo daltonismo: las 5 condiciones funcionan en deuteranopia, protanopia y tritanopia (verificado en el set propuesto).

---

## 14. i18n — Bilingüe EN/ES

### 14.1 Configuración
- Default según browser locale, override por usuario
- Persiste en perfil de usuario (BD) y localStorage
- Selector en topbar visible siempre
- Toggle no requiere reload (cliente)

### 14.2 Diccionario inicial (claves críticas)

```
common.dashboard       Dashboard            Dashboard
common.sales           Sales                Ventas
common.marketing       Marketing            Marketing
common.finance         Finance              Finanzas
common.operations      Operations           Operaciones
common.products        Products             Productos
common.customer-service Customer Service    Servicio al Cliente
common.team            Team                 Equipo
common.reports         Reports              Reportes
common.assistant       AI Assistant         Asistente IA
common.settings        Settings             Configuración

period.this-week       This week            Esta semana
period.last-week       Last week            Semana pasada
period.this-month      This month           Este mes
period.ytd             YTD                  YTD (Año a la fecha)

condition.danger       Danger               Peligro
condition.emergency    Emergency            Emergencia
condition.normal       Normal               Normal
condition.affluence    Affluence            Afluencia
condition.power        Power                Poder

action.save            Save                 Guardar
action.cancel          Cancel               Cancelar
action.edit            Edit                 Editar
action.delete          Delete               Eliminar
action.approve         Approve & Send       Aprobar y enviar
action.reject          Reject               Rechazar

kpi.sales-wtd          Sales WTD            Ventas semana
kpi.quotes-sent        Quotes Sent          Cotizaciones
kpi.conv-rate          Conversion Rate      Tasa conversión
kpi.follow-ups         Follow-ups           Seguimientos
kpi.cpa                Cost / Acquisition   Costo / Adq.
kpi.roas               ROAS                 ROAS
kpi.rpe                Rev / Employee       Ingreso / Empleado
```

### 14.3 Formato de números y fechas
- Números: locale-aware (`Intl.NumberFormat`)
  - EN: `$84,320.50`
  - ES: `$84,320.50` (mantenemos formato US por ser empresa US, pero label en español)
- Fechas: `Intl.DateTimeFormat`
  - EN: `May 21, 2026`
  - ES: `21 May 2026`
- Moneda: USD siempre con `$`, no `USD` (es empresa US, no genera ambigüedad)

### 14.4 Reglas para textos
- Mantener strings cortos (los componentes están dimensionados para EN; ES típicamente +20%).
- Nada de concatenación de strings. Solo plantillas con variables: `"Hola {{name}}"`.
- Plurales con ICU: `"{count, plural, =0 {sin reportes} one {1 reporte} other {# reportes}}"`.

---

## 15. Responsive — Breakpoints y comportamiento

### 15.1 Comportamiento por breakpoint

| Componente | Mobile (<768) | Tablet (768–1024) | Desktop (≥1024) |
|---|---|---|---|
| Sidebar | Drawer overlay | Colapsada (íconos) | Expandida |
| Topbar | Compacta (logo + menú) | Compacta | Completa |
| Grid KPIs | 1 col | 2 cols | 4 cols |
| Charts | Stack vertical | 1 col grande | 2 cols (8+4) |
| Tablas | Scroll horizontal + sticky first col | Igual | Completas |
| Data entry | Una métrica por pantalla con next/prev | Lista compacta | Tabla editable |
| Modales | Bottom sheet full-width | Modal centrado | Modal centrado |
| Period selector | Bottom sheet | Popover | Popover |
| Notificaciones | Top banner | Toast bottom-right | Toast bottom-right |

### 15.2 Touch targets
- Mínimo 44×44px (Apple HIG) en mobile
- Inputs 48px de altura en mobile (vs 40px desktop)
- Botones primarios 48px en mobile

### 15.3 Mobile-first features
- Inputs numéricos abren teclado numérico (`inputmode="decimal"`)
- Botones de acción principales en bottom sticky bar
- Pull-to-refresh en dashboards
- Skeleton loading para conexiones lentas (4G/3G)

---

## 16. Naming conventions

### 16.1 Tokens y CSS variables
```
--color-surface-primary
--color-text-secondary
--color-condition-danger
--space-4
--radius-md
--elevation-2
--duration-normal
--text-heading-lg-size
--text-heading-lg-line
--text-heading-lg-weight
```

### 16.2 Tailwind config (sugerencia)
Cuando llegue Claude Code, configurar `tailwind.config.ts` con estos tokens en `theme.extend`:
- `colors`: el árbol semántico completo (`surface`, `text`, `accent`, `state`, `condition`)
- `fontFamily`: `sans` Inter, `mono` JetBrains Mono
- `fontSize`: la escala completa
- `spacing`: base 4 ya viene en Tailwind
- `borderRadius`: tokens nombrados
- `boxShadow`: elevations
- Plugins: `@tailwindcss/forms`, `@tailwindcss/typography`, `tailwind-variants`

### 16.3 Componentes
PascalCase con prefijo de dominio cuando aplica:
- `KPICard`, `ConditionBadge`, `MetricEditor`, `AIReportPanel`
- `SalesDashboard`, `GMInbox`, `EmployeeProfile`

---

## 17. Decisiones abiertas que necesitan input de Marco

Antes de pasar a Claude Code, idealmente resolvemos:

| # | Decisión | Opciones | Mi recomendación |
|---|---|---|---|
| D1 | Color de "Poder" | Violeta `#7C3AED` vs Dorado `#B45309` | Violeta (mejor contraste dark) |
| D2 | ¿Mostrar dinero en USD siempre o respetar locale? | USD-fijo / locale-aware | USD-fijo (empresa US) |
| D3 | ¿Empleado puede ver al resto del equipo? | Sí (gamificación) / No (privacidad) | Sí con leaderboard opt-in |
| D4 | ¿Notificaciones push móvil? | Sí (PWA) / No (solo email + in-app) | Sí en v2; v1 solo email + in-app |
| D5 | ¿Login con SSO Google o solo email/pass? | Google SSO / Email-pass / Ambos | Ambos (Google preferente, contraseña fallback) |
| D6 | ¿Histórico mínimo cargado al lanzar? | 0 (empezar limpio) / 90d / 1 año | 90 días desde FloorZap para piloto Ventas |
| D7 | ¿Cuándo se dispara la IA? | Cambio de condición / Cada update / Diario | Solo cambio de condición + digest diario al GM |

---

## 18. Próximos pasos (post-aprobación de este documento)

1. **Marco aprueba o ajusta** este sistema de diseño (especialmente decisiones D1–D7).
2. **Mockups en Figma / Claude Design**:
   - Login + onboarding
   - Dashboard GM
   - Dashboard Vendedor (perfil con menos privilegios)
   - Pantalla de entrada manual mobile
   - Inbox GM con reportes IA pendientes
   - Detalle de reporte IA (vista GM aprobando)
   - Editor de umbrales de condición
   - Perfil de empleado con PPF
3. **Prototipo navegable** con los 8 flujos críticos.
4. **Spec técnica (PRD)** firmado entre Marco y Esteban.
5. **Claude Code Fase 1**: setup stack (Next.js 15 + Tailwind + shadcn + Supabase/Postgres sugerido), tokens, auth, componentes base.
6. **Claude Code Fase 2**: módulo Ventas end-to-end como piloto (datos FloorZap + entrada manual + condiciones + un primer reporte IA básico).

---

## 19. Anexo — Inventario de assets necesarios

| Asset | Estado | Acción |
|---|---|---|
| Logo color completo | ✅ disponible | `Logos/aromaz-logo-2022-11.png` |
| Logo blanco (dark mode) | ✅ disponible | `Logos/aromaz-logo-2022-blanco.png` |
| Isotipo color | ✅ disponible | `Logos/isotipo-AROMAZ.png` |
| Isotipo blanco | ✅ disponible | `Logos/isotipo-AROMAZ-blanco.png` |
| Favicon set (16/32/180/512) | ⚠ falta exportar | Generar desde isotipo color |
| OG image (1200×630) | ⚠ falta diseñar | Logo + tagline sobre fondo brand.blue |
| Ilustraciones empty state | ⚠ a crear | 6 ilustraciones simples line-art (sin datos, sin reportes, sin equipo, error, success, onboarding) |
| Avatares default | ⚠ a crear | Iniciales sobre fondos brand (rotación de 8 colores) |
| Iconos custom (si Lucide no cubre) | — | Evaluar al diseñar |

---

## 20. Glosario de términos del producto

| Término | Definición |
|---|---|
| **GM** | General Manager (Marco Baeza) |
| **PPF** | Personal, Professional, Financial Goals (Cardone Ventures) |
| **Battle Plan** | Cotizaciones que el vendedor espera cerrar esta semana |
| **Follow-up** | Seguimiento a un cliente que ya cotizó |
| **Condición** | Estado de una métrica según fórmulas de Hubbard (5 niveles) |
| **Fórmula de Condición** | Plan de acción asociado a cada nivel (Hubbard College of Administration) |
| **AH Structure** | Aromaz Home Structure Project: iniciativa de profesionalización |
| **SOP** | Standard Operating Procedure |
| **FloorZap** | CRM/ERP actual de Aromaz |
| **Capa 1 / Capa 2** | Reporte IA: directo al empleado / pasando por GM |
| **WTD / MTD / YTD** | Week-to-Date, Month-to-Date, Year-to-Date |
| **CPA** | Cost Per Acquisition |
| **ROAS** | Return on Ad Spend |
| **RPE** | Revenue Per Employee |

---

**Documento preparado por:** Esteban González con Claude
**Para:** Marco Baeza (GM, Aromaz Home Improvement)
**Versión:** 1.0
**Próxima revisión:** tras feedback de Marco sobre decisiones D1–D7
