# FloorZap → AromazZap — Inventario de funcionalidades (blueprint para Claude Code)

Documento base para **reconstruir en AromazZap** el sistema que Aroma'z Home usa hoy en **FloorZap** (`https://aromazhome.floorzap.com/admin/`).
FloorZap es un ERP/CRM para empresas de pisos e instalación (flooring). Aquí se documentan los módulos, su función, las entidades de datos y los endpoints internos observados, para replicar las herramientas que el negocio realmente usa.

> Estado de la fuente: mapeado desde el panel admin con sesión de Marco Baeza. Las secciones marcadas con ⚠️ requieren una pasada más profunda con sesión activa para detallar campos/fl-ujos finos.

---

## 0. Stack objetivo sugerido (AromazZap)
- **DB:** Supabase (PostgreSQL) — ya existe el proyecto `aromazmkt-dot's Project` (`wdaohtarqknelmnelxeg`) con el esquema base y datos migrados (clientes, leads, invoices, work_orders, products, payments).
- **App:** a definir (Next.js + supabase-js recomendado para escalar; hoy hay un MVP single-file `aromaz-erp.html`).
- **Auth:** Supabase Auth (pendiente) con roles (admin, vendedor, instalador, bodega).
- Ver `Simulador/CLAUDE.md` para el esquema de datos y la conexión.

---

## 1. Mapa de módulos (barra lateral de FloorZap)

### WORKFLOW (operación diaria)
| Módulo | Ruta | Qué hace |
|---|---|---|
| Dashboard | `/admin/default` | KPIs de ventas, comisiones, facturas abiertas, tareas. Tabs: My Sales, Overview, Sales Breakdown, Sales Conversions, Sales Team Rankings. |
| Leads | `/admin/Leads` | Prospectos antes de ser cliente. Pipeline por `Stage`, origen (`lead_source`), estado, fecha. |
| Customers | `/admin/Customers` | Ficha de clientes: contacto, dirección, origen, estado, saldo. |
| Tasks | `/admin/CustomerTask` | Tareas/seguimientos asociados a cliente. ⚠️ |
| Measurements | `/admin/measurements` | Mediciones del trabajo (m²/áreas) por cliente/cotización. ⚠️ |
| Quotes | `/admin/Quotes?qs=` | Cotizaciones. Vistas: Todas (`qs=0`), En progreso (`qs=1`), Convertidas (`qs=3`), Anuladas (`qs=2`). |
| Invoices / Contracts | `/admin/Invoices` | Facturas y contratos (misma entidad que la cotización en otra etapa). |
| Work Orders | `/admin/WorkOrders` | Órdenes de trabajo / ejecución. Estados: In Progress, Completed, Cancelled, Void. |
| Order Material | `/admin/OrderMaterialsByProducts` | Pedido de materiales por producto. Estados: Ordered, Back Ordered, Cancelled, Pending, Complete. |
| Schedule | (calendario) | Agenda/calendario de instalaciones y visitas. ⚠️ |
| Payments | (submenú) | Pagos — ver detalle abajo. |
| Warehouse | `/admin/WareHouse` | Bodegas. |
| Warehouse Actions | `/Mobile/InventoryMobile` | Acciones de bodega móvil (recepción, picking). ⚠️ |
| Non-Inventory Products | `/admin/OnDemandProduct` | Catálogo de productos "a pedido" (catálogo global de proveedores, ~266k SKUs). |
| Inventory Products | `/admin/InventoryProduct` | Catálogo propio en stock (402 ítems de Aroma'z). |
| Purchase Orders | `/admin/PurchaseOrders` | Órdenes de compra a proveedores. ⚠️ |
| WO Change Requests | `/admin/InvoiceChangeRequest` | Solicitudes de cambio sobre órdenes/facturas. ⚠️ |
| Documents Manager | `/admin/DocumentsManager` | Gestor de documentos/archivos. ⚠️ |
| ZapAssist AI | `/admin/AIAgent` | Asistente IA propio de FloorZap. ⚠️ |
| Reports | (submenú) | Reportes de ventas, comisiones, inventario, etc. ⚠️ |
| Accounting | `/admin/IntegratedAccounting` | Contabilidad integrada (sync con QuickBooks: campos `QBReferenceID`, `IsSyncedWithQuickBooks`). ⚠️ |

### SETUP (configuración)
| Módulo | Qué hace |
|---|---|
| Settings | Config general: ubicaciones (locations), tipos de trabajo, métodos de pago, impuestos (`TaxRate`/`TotalPSTTax`), plantillas. ⚠️ |
| Marketing | Campañas / orígenes de lead / referidos. ⚠️ |
| System Users | Usuarios y roles (vendedores, instaladores, admin). ⚠️ |
| Board | Tablero tipo kanban del sistema. ⚠️ |

---

## 2. Submenús detallados observados

**Quotes:** Create Quote (`/admin/quoterefactor?action=add_quote`), Create Repair Quote (`action=add_repair`), All Quotes, In Progress, Converted, Voided.

**Order Material:** Order by Product, Ordered, Back Ordered, Cancelled, Pending, Complete.

**Payments:**
- Enroll In Payments (`/admin/EnrollInPayments`)
- Payment by Job → **Customer Payments** (`/admin/CustomerPayments`)
- Payment by Invoice (`/admin/CustomerPayAction`)
- Receive Payment / Manufacturer Adjustment (`/admin/ManufacturerAdjustmentPayment` + History)
- Expense Payments (`/admin/ExpensePayments`)
- Contractor Payment (`/admin/ContractorPayment` + History)
- Company Payments (`/admin/Payments`) — pagos salientes.

**Products / Inventario:** Product List inventario (`/admin/InventoryProduct`), Product List no-inventario (`/admin/OnDemandProduct`), Product Stock (`/admin/ProductStock`), Inventory Jobs (`/admin/InventoryProductJobs`), Non-Inventory Jobs (`/admin/OnDemandProductJobs`), Inventory Transfer (`/admin/InventoryTransfer`), Import Products (`/admin/importproducts`), Inventory Skids (`/admin/InventorySkids`), Product Inventory (`/admin/ProductInventory`), Product by Category (`/admin/InventoryList`), Monthly Product Stock (`/Admin/MonthlyProductStock`), Inventory PO Adjusted (`/admin/InvPOAdjustmentReport`), Warehouses (`/admin/WareHouse`), Product Labels (`/admin/LabelPrintSetting`), Product QR.

---

## 3. Entidades de datos y endpoints internos (API Kendo)

Las grillas (Telerik/Kendo UI) cargan vía `POST /api/...` con body JSON `{...filtros, PaginationModel:{Page,PageSize,Skip,Take,Sorting,Filter}}` y devuelven JSON. Útiles para extraer/migrar:

| Entidad | Endpoint | Notas de body |
|---|---|---|
| Customers | `/api/customer/SelectCustomerPaginatedForCustomerGrid` | Soporta `StartDate`/`EndDate`. |
| Leads | `/api/customer/getAllLeadsWithAddressGrid` | Misma estructura que customer. |
| Quotes/Invoices | `/api/InvoiceFeature/GetByInvoiceStatus` | `{SearchText, InvoiceStatus, VoidedInvoices, PaginationModel}` → `{GridData, GridSummary}`. |
| Work Orders | `/api/workorder/GetWorkOrdersForGrid` | `{SearchText, PaginationModel}` → `{WorkOrders, WorkOrdersSummary}`. |
| Inventory Products | `/api/Product/ProductSelectAllInStockPaginated` | Deduplicar por `ProductID` (varios lotes). |
| Customer Payments | `/api/CustomerPayments/GetAllPaginatedCustomerPayments` | `Status:"ALL"`. Montos poco fiables → derivar de invoices. |
| Notif. count | `/api/invoiceNotification/GetAllNotificationCount` | Badges del topbar. |

### Campos por entidad (de las grillas reales)

**Customer / Lead:** CustomerID, CompanyName, FirstName, LastName, FullName, SpouseFirstName, HomePhone, CellPhone, Email, CCEmail, FullAddress, Neighborhood, County, LocationName, FoundThroughTitle (origen), ContactType, CustomerStatus, Stage/StageId/StageColor, LeadTrackerID, LeadDate, LeadStatus, PreQualifiedAmount, InvoiceBalance, CreatedDate, CreatedByFullName, LostReason/LostNotes, LivingArea, EstimatedSqft, ZillowLink, IsActive.

**Invoice / Quote:** InvoiceID, QuoteID, RepairInvoiceID, InvoiceNumber, LocationID, CustomerID, InvoiceStatus (código 2-5), InvoiceTypeName (Material and Labor / Material Only / Labor Only), InvoicePaidStatus, CreatedDate, SignedDate, ConfirmedDate, InvoiceDate, TotalCost, TotalSale, TotalTax, TotalProfit, ProfitPercent, TotalLabor, TotalMaterialSale, TotalLaborSale, Discount, TotalPayment, Balance, IsPaid, IsInvoiceSigned, SalesMan, JobTypeName, JobAddress, QuoteInvoiceName, EnableProgressiveInvoicing, InvoicingPercent, QBReferenceID, IsSyncedWithQuickBooks.

**Work Order:** InvoiceID, QuoteID, InvoiceNumber, CustomerID, WorkOrderStatus, ScheduleDate(s), ContractorName, JobAddress, JobTypeName, SalesMan, TotalCost, TotalSale, TotalPayments, Balance, Profit, MaterialReadyForOrder, MaterialOrderedPercent, ContractorsCount/ScheduledContractorsPercent, MaterialPaymentStatus, ContractorPaymentStatus, SalesmanPaymentStatus, ReadyToComplete, ReadyToSchedule, CertificateSignedPercent, InvoiceDate.

**Product (inventario):** ProductID, InventoryProductID, VendorID/VendorTitle, ProductCategoryID/Title, SKU, UPC, ProductName, Style, Color, Description, UnitCost, SalesPrice, ProductQuantity, AvailableQuantity, RemainingQuantity, ReservedQty, UnitMeasure/UOMTitle, Coverage, IsStock, Discontinued, Visible, MinimumQuantityThreshhold, CreatedDate.

**Customer Payment:** InvoiceNumber, Customer, CompanyName, PaymentMethodName, CardType/CardInfo/ACHInfo, AmountPaid, InvoicePaymentAmount, TotalInvoiceAmount, LastPaymentDate, InvoiceDate, InvoiceDueDate, PaymentStatus, PaymentReference, QBReferenceID, IsChargedOnline, CCFees.

---

## 4. Reglas de negocio clave (a replicar)
- **Ciclo de vida documento:** Lead → Quote → (convertida) Invoice/Contract → Work Order → Payments. La misma entidad cambia de etapa (`InvoiceStatus`).
- **Tipos de trabajo:** Material and Labor / Material Only / Labor Only.
- **Cálculo de margen:** `TotalProfit / TotalSale` (~48% en el negocio actual).
- **Inventario:** un producto puede tener varios lotes (skids); stock disponible = suma de lotes; umbral mínimo dispara aviso (`Notify`).
- **Pagos:** a nivel de factura (`TotalPayment`, `Balance`, `IsPaid`); además pagos a contratistas (salientes) y gastos.
- **Multi-ubicación:** locations (sucursales: ej. Cinnaminson) afectan numeración (prefijos ARO-, CIN-, HAM-, HIC-, HIH-).
- **Comisiones:** por vendedor (`SalesMan`, `SalesmanAmountToBePaid`, targets de bono).
- **Contabilidad:** sincronización con QuickBooks (campos QB*).

---

## 5. Roadmap de reconstrucción en AromazZap (para Claude Code)

**Fase 1 — Núcleo (ya iniciado en Supabase):**
1. Auth + roles (admin, vendedor, instalador, bodega) con RLS.
2. CRUD Clientes y Leads (con pipeline/stages).
3. Cotizaciones → conversión a Factura (líneas de ítems, impuestos, descuentos, totales).
4. Órdenes de Trabajo (estados, agenda, asignación de instalador).
5. Registro de Pagos y saldo por factura.

**Fase 2 — Inventario y compras:**
6. Catálogo de productos propios + categorías + proveedores.
7. Stock por bodega/lote, transferencias, umbrales y avisos.
8. Órdenes de compra y pedido de materiales por trabajo.

**Fase 3 — Gestión y reportes:**
9. Agenda/calendario de instalaciones.
10. Tareas y seguimientos por cliente.
11. Documentos adjuntos por entidad.
12. Reportes (ventas por mes/vendedor/ubicación, cobros, márgenes, inventario).
13. Comisiones de vendedores.

**Fase 4 — Extras:**
14. Generación de PDF (cotización/factura/orden) con firma del cliente.
15. Integración contable (exportación o QuickBooks).
16. Asistente IA (equivalente a ZapAssist) sobre los datos.

---

## 6. Cómo profundizar / actualizar este inventario
Con sesión activa en FloorZap, abrir cada módulo marcado ⚠️ y capturar: campos del formulario, endpoint de su grilla (`jQuery('[data-role=grid]').data('kendoGrid').dataSource.transport.options.read.url`) y reglas visibles. Ver el método de extracción documentado en `Simulador/CLAUDE.md` (sección 7).

---

### Archivos relacionados
- `Simulador/CLAUDE.md` — esquema de datos + conexión Supabase + método de extracción.
- `Simulador/DISENO.md` — brief de diseño de la UI.
- `Simulador/aromaz-erp.html` — MVP funcional (dashboard + módulos, solo lectura).
- `Simulador/aromaz_database.zip` — export de la base (SQL + CSV).
