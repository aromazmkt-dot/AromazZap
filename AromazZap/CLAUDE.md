# AromazZap — Documento maestro (handoff para Claude Code)

**Objetivo del proyecto:** reconstruir en **AromazZap** (plataforma propia de Aroma'z Home) todo lo que el negocio usa hoy en **FloorZap** (`https://aromazhome.floorzap.com/admin/`), con su propia base de datos. Este documento concentra TODO: lo que se hizo, lo que se recopiló de FloorZap, cómo funciona, qué usa Aroma'z, qué tiene la plataforma y el plan para rehacerlo.

> Documentos complementarios:
> - `FLOORZAP_FUNCIONALIDADES.md` (esta carpeta) — detalle de módulos, endpoints y campos.
> - `../../Simulador/CLAUDE.md` — esquema de datos + método de extracción.
> - `../../Simulador/DISENO.md` — brief de diseño de UI.
> - `../../Simulador/aromaz-erp.html` — MVP funcional (dashboard + módulos, solo lectura).
> - `../../Simulador/aromaz_database.zip` — export de la base (SQL + CSV).

---

## 1. Qué es FloorZap y qué hace Aroma'z con él

FloorZap es un **ERP/CRM vertical para empresas de pisos e instalación** (flooring). Aroma'z Home lo usa para todo el ciclo comercial y operativo:

**Ciclo de negocio (flujo principal):**
`Lead → Cotización (Quote) → Factura/Contrato (Invoice) → Orden de Trabajo (Work Order) → Pedido de Material → Agenda/Instalación → Pagos → Cierre/Contabilidad`

La misma entidad cambia de etapa: una cotización aprobada se convierte en factura; la factura genera una orden de trabajo. Por eso en la base `invoices` contiene cotizaciones y facturas (se distinguen por estado/tipo).

**Roles que operan:** Administrador (Marco Baeza), vendedores (sales reps con comisión), instaladores/contratistas (subs), bodega.

**Multi-ubicación:** Aroma'z maneja varias sucursales (locations) — la numeración de documentos usa prefijos por ubicación (ARO-, CIN-, HAM-, HIC-, HIH-).

---

## 2. Lo que se hizo (estado actual)

1. **Acceso y análisis** del panel FloorZap con sesión real; mapeo de módulos y de los endpoints internos (grillas Kendo `POST /api/...`).
2. **Base de datos propia** en Supabase con esquema relacional (6 tablas) — proyecto del cliente (ver §3).
3. **Migración del histórico COMPLETO** (desde el inicio de Aroma'z en FloorZap hasta hoy):

   | Tabla | Registros |
   |---|---|
   | customers | 11.432 |
   | leads | 1.157 |
   | invoices (cotizaciones+facturas) | 3.460 |
   | work_orders | 3.267 |
   | products (inventario propio) | 405 |
   | payments (derivados de facturas) | 3.078 |

   Totales de control: **Ventas $17.696.014 · Recibido $15.499.390 · Por cobrar $2.196.694**.
4. **App MVP** (`Simulador/aromaz-erp.html`): dashboard con KPIs y gráficos + módulos navegables (solo lectura) leyendo en vivo de Supabase.
5. **Exportación** de la base (`aromaz_database.zip`: schema.sql, data.sql, full dump y CSV por tabla).
6. **Documentación**: este maestro + funcionalidades + diseño.

**Método de migración (para repetir/actualizar):** FloorZap bloquea conexiones externas por CSP, así que se extrajo navegando el mismo tab al origen de Supabase y pasando los datos por `window.name` para insertarlos vía REST. Detalle en `Simulador/CLAUDE.md §7`.

---

## 3. Base de datos nueva (Supabase)

```
Proyecto    : aromazmkt-dot's Project (organización propia de Aroma'z)
Project ref : wdaohtarqknelmnelxeg
REST URL    : https://wdaohtarqknelmnelxeg.supabase.co
Anon key    : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYW9odGFycWtuZWxtbmVseGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTc3NjcsImV4cCI6MjA5NjE3Mzc2N30.VV9nGQUzPtUZlu0J8ihxzGXOPYcBGQnxBpyrMpo3tx0
```
- **service_role key:** NO está aquí; gestionarla desde el panel de Supabase.
- **RLS:** activado con política permisiva (`anon` lee/escribe). **MVP** — reemplazar por Auth + políticas por rol antes de producción.

### Esquema (tablas en `public`)
- **customers** — PK `customer_id`. Contacto, dirección, origen (`lead_source`), `status`, `stage`, `invoice_balance`.
- **leads** — PK `id`. Prospectos (`lead_status`, `stage`, `lead_date`).
- **invoices** — PK `invoice_id`. Cotizaciones y facturas. Montos: `total_sale/total_cost/total_profit/total_payment/balance`; `invoice_type_name`, `paid_status`.
- **work_orders** — PK `invoice_id`. `work_order_status`, fechas, contratista, totales.
- **products** — PK `(product_type, source_product_id)`. Hoy `product_type='inventory'`.
- **payments** — PK `id`. Pago por factura (`amount`, `payment_date`).

Cada tabla tiene `raw jsonb` (hoy NULL) reservada para el objeto FloorZap original. DDL completo en `aromaz_database.zip → schema.sql`.

### Notas de calidad de datos
- Usar **`COALESCE(invoice_date, created_date)`** (muchos `invoice_date` NULL).
- `invoice_status` es código numérico (2-5); para UI usar `paid_status`/`invoice_type_name`.
- `payments` se derivó de `invoices` con `total_payment>0` (la grilla nativa de pagos da montos en cero).
- Catálogo **no-inventario** (266k SKUs B2B genéricos) NO se migró: no son datos propios.

---

## 4. Inventario COMPLETO de la plataforma (qué tiene/usa Aroma'z)

Surface real observado en el panel (≈297 enlaces). Rutas relativas a `/admin/`.

### 4.1 Workflow (operación)
- **Dashboard** (`default`) — KPIs ventas/comisiones/cobros, tabs My Sales, Overview, Sales Breakdown, Conversions, Team Rankings.
- **Leads** (`Leads`) — prospectos, pipeline por etapa.
- **Customers** (`Customers`) — clientes.
- **Tasks** (`CustomerTask`) — tareas/seguimientos por cliente.
- **Measurements** (`measurements`) — mediciones del trabajo (integración Measure Square / Stack).
- **Quotes** (`Quotes`, `quoterefactor`) — crear cotización / cotización de reparación; vistas Todas/En progreso/Convertidas/Anuladas.
- **Invoices / Contracts** (`Invoices`) + **Receivables** (`InvoiceAllVersions`).
- **Work Orders** (`WorkOrders`) + **WO Change Requests** (`InvoiceChangeRequest`).

### 4.2 Materiales y compras
- **Order Material:** por vendedor (`OrderMaterialByManufacturer`), por producto (`OrderMaterialsByProducts`), por nº de orden (`OrderedMaterial`), Material Jobs.
- **Purchase Orders** (`PurchaseOrder`) + **PO History**.
- **Inventario:** Product List (`InventoryProduct`), Non-Inventory (`OnDemandProduct`), Overview por bodega (`InventoryByWarehouse`), Product Stock, Inventory Jobs, Inventory Transfer, Inventory Skids, Product Inventory, Product by Category, Monthly Product Stock, Import (materials/products/B2B), Warehouse Actions móvil (`InventoryMobile`).

### 4.3 Agenda
- **Schedule List** (`ScheduleList`), **Employee Calendar** (`mycalendar`), **Contractor Timeline**.

### 4.4 Pagos y ajustes
- Cobros a cliente: **Payment by Job** (`CustomerPayments`), **Payment by Invoice** (`CustomerPayAction`), Enroll In Payments, Refunds/Adjustments.
- Egresos: **Expense Payments**, **Contractor Payment**, pagos a vendedores (comisiones), Freight Shipper, Tax Journal.
- Historiales de pagos (inventario/no-inventario/material).

### 4.5 Reportes (lo que el negocio mide)
Ventas (Sales Report, Total Sales By Month `InvoiceBymonthreport`, Sales By City, Sales & Projection), **Profit/Loss** (`income`), **Margen Inv/WO** (`MarginReport`), **Comisiones** (`commissionReports`, `Salesmanjob`, `salesmanreport`), Customer Revenue, Revenue By Service, Leads/Lead Source/Referral, Interaction/Surveys, Labor Income, Materials Sold/Cost/Return, Assets, Accounts Payable, Transactions, Tax Reports (Detailed/Cash), Customer/Employee Payments, User Activity, Sent Emails/Messages, Samples.

### 4.6 Setup / Configuración (entidades base a replicar)
- **System Settings** (`companyinformation`), **Locations** (sucursales), **Employees** (`staff`), **Contractor/Subs**, **Vendors** (`manufacturers`), **Warehouses**, **Bank/Credit Accounts**.
- **Comisiones** (Commission Settings, `StaffCommission`), **Labor Cost List**, **Dynamic Pricing**.
- **Plantillas:** Contract Templates, Service Templates, Completion Checklist, Quote/Invoice Groups y Bundles, Task Reminders, **Lead Stage** (etapas del pipeline), Payment Terms, Expenses List, Product Labels, QuickBooks Classes.
- **Permisos:** User Permissions (`AccessByPage`), Notification Permissions.

### 4.7 Integraciones
QuickBooks (contabilidad), Google Calendar, Measure Square / Stack (medición), Twilio (SMS 2 vías), Zapier, Website Lead capture, Mobile App, Product QR/Freight, Payment Processing, Campaigns (`zapcampaign`), Follow Up.

> Endpoints internos y campos por entidad: ver `FLOORZAP_FUNCIONALIDADES.md §3`.

---

## 5. Roadmap de reconstrucción en AromazZap

**Fase 1 — Núcleo (datos ya migrados):** Auth+roles (admin/vendedor/instalador/bodega) con RLS · CRUD Clientes y Leads con pipeline (Lead Stage) · Cotización → Factura (líneas, impuestos, descuentos) · Órdenes de trabajo · Registro de pagos y saldos.

**Fase 2 — Inventario y compras:** catálogo propio + categorías + vendors · stock por bodega/lote/skid + transferencias + umbrales · órdenes de compra y pedido de material por trabajo.

**Fase 3 — Agenda y gestión:** calendario de instalaciones (empleados/contratistas) · tareas y recordatorios · documentos por entidad · plantillas (contratos/servicios/checklist).

**Fase 4 — Reportes y dinero:** ventas por mes/vendedor/ubicación/servicio · P&L y márgenes · comisiones · cobros y cuentas por pagar · reportes de impuestos.

**Fase 5 — Extras/integraciones:** PDF cotización/factura/orden con firma · QuickBooks · Measure Square · SMS/Email · captura de leads web · app móvil · asistente IA (equivalente ZapAssist) sobre los datos.

**Stack sugerido:** Next.js + `@supabase/supabase-js`, Supabase Auth, RLS por rol. Mantener el MVP `aromaz-erp.html` como referencia visual/funcional.

---

## 6. Pendientes / decisiones abiertas
- **Seguridad:** implementar Auth y cerrar RLS (hoy abierto con anon).
- **Diseño:** aplicar `DISENO.md` (extraer paleta/logo reales de aromazhome.com).
- **Profundizar** (con sesión FloorZap): formularios y reglas finas de Settings (Locations, Lead Stage, Commission, Templates), Reports y Accounting.
- **Re-migración detallada (opcional):** traer columna `raw` y entidades aún no migradas (tasks, measurements, schedule, purchase orders, líneas de ítems de factura) si se van a usar.
