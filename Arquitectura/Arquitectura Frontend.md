frontend-vidasalud/
├── index.html, vite.config.js, tailwind.config.js
└── src/
    ├── main.jsx                        → Punto de entrada (monta React y BrowserRouter)
    ├── App.jsx                         → Providers globales y definición de rutas (App.jsx)
    ├── styles/index.css                → Estilos globales con Tailwind CSS
    ├── assets/
    │   ├── images/                     → Logo de la clínica e imágenes sanitarias
    │   └── icons/                      → SVGs e iconos de la aplicación
    │
    ├── core/                           → Infraestructura base de la app (transversal)
    │   ├── api/
    │   │   ├── http-client.js          → Instancia Axios con Interceptores (Bearer Token JWT/Sanctum + auto-logout 401)
    │   │   ├── error-handler.js        → Normalizador de errores API (extrae mensajes de Laravel)
    │   │   └── voice-recognizer.js     → API Web Speech (reconocimiento de voz nativo para CU22)
    │   ├── providers/
    │   │   ├── ThemeProvider.jsx       → Tema claro/oscuro
    │   │   └── SwrProvider.jsx         → Configuración global de re-intentos y caché de SWR
    │   └── store/
    │       └── appStore.js             → Store global con Zustand (sidebar, modales activos, estado de carga)
    │
    ├── modules/                        → MÓDULOS DE NEGOCIO (Mismos nombres que el Backend)
    │   │
    │   ├── ModuloSeguridad/            → Módulo 1: CU01–CU06 (Autenticación, Usuarios, Roles, Bitácora)
    │   │   ├── services/               → auth.service.js, usuario.service.js, rol.service.js, bitacora.service.js
    │   │   ├── hooks/                  → useAuth.js, useUsuarios.js, useRoles.js, useBitacora.js
    │   │   ├── context/                → AuthContext.jsx (sesión activa, token y helper canAccess('citas_programar'))
    │   │   ├── components/
    │   │   │   └── ProtectedRoute.jsx  → Control de acceso por sesión y roles (RBAC)
    │   │   └── pages/
    │   │       ├── LoginPage/          → LoginPage.js + LoginPage.view.jsx + index.js (CU01)
    │   │       ├── UsuariosPage/       → UsuariosPage.js + UsuariosPage.view.jsx + components/ (CU02)
    │   │       ├── RolesPage/          → RolesPage.js + RolesPage.view.jsx (CU03)
    │   │       ├── CargaLotesPage/     → CargaLotesPage.js + CargaLotesPage.view.jsx (CU04)
    │   │       ├── PerfilPage/         → PerfilPage.js + PerfilPage.view.jsx (CU05)[cite: 2]
    │   │       └── BitacoraPage/       → BitacoraPage.js + BitacoraPage.view.jsx (CU06)[cite: 2]
    │   │
    │   ├── ModuloPersonalMedico/       → Módulo 2: CU07–CU10 (Especialidades, Médicos, Horarios, Licencias)[cite: 2]
    │   │   ├── services/               → especialidades.service.js, medicos.service.js, horarios.service.js
    │   │   ├── hooks/                  → useEspecialidades.js, useMedicos.js, useHorarios.js, useLicencias.js
    │   │   ├── components/             → MedicoCard.jsx, HorarioGrid.jsx
    │   │   └── pages/
    │   │       ├── EspecialidadesPage/ → EspecialidadesPage.js + EspecialidadesPage.view.jsx (CU07)[cite: 2]
    │   │       ├── MedicosPage/        → MedicosPage.js + MedicosPage.view.jsx (CU08)[cite: 2]
    │   │       ├── HorariosPage/       → HorariosPage.js + HorariosPage.view.jsx (CU09)[cite: 2]
    │   │       └── BloqueosAgendaPage/ → BloqueosAgendaPage.js + BloqueosAgendaPage.view.jsx (CU10 - Licencias)[cite: 2]
    │   │
    │   ├── ModuloPacientes/            → Módulo 3: CU11–CU12 (Pacientes y Catálogo de Enfermedades)[cite: 2]
    │   │   ├── services/               → pacientes.service.js, enfermedades.service.js
    │   │   ├── hooks/                  → usePacientes.js, useEnfermedades.js
    │   │   ├── components/             → ContactoEmergenciaModal.jsx
    │   │   └── pages/
    │   │       ├── PacientesPage/      → PacientesPage.js + PacientesPage.view.jsx (CU11)[cite: 2]
    │   │       └── EnfermedadesPage/   → EnfermedadesPage.js + EnfermedadesPage.view.jsx (CU12)[cite: 2]
    │   │
    │   ├── ModuloOperacionCitas/       → Módulo 4: CU13–CU16, CU24 (Citas, Modalidad, Reprogramación, Asistencia, Pasarela)[cite: 2]
    │   │   ├── services/               → citas.service.js, asistencia.service.js, pasarelaPago.service.js
    │   │   ├── hooks/                  → useCitas.js, useAgenda.js, usePasarelaPago.js
    │   │   ├── components/             → SlotPicker.jsx, QrPaymentModal.jsx, TicketPdfButton.jsx
    │   │   └── pages/
    │   │       ├── AgendarCitaPage/    → AgendarCitaPage.js + AgendarCitaPage.view.jsx (CU13)[cite: 2]
    │   │       ├── AgendaMedicaPage/   → AgendaMedicaPage.js + AgendaMedicaPage.view.jsx (CU16)[cite: 2]
    │   │       ├── AsistenciaPage/     → AsistenciaPage.js + AsistenciaPage.view.jsx (CU15 - Check-in)[cite: 2]
    │   │       └── PasarelaPagoPage/   → PasarelaPagoPage.js + PasarelaPagoPage.view.jsx (CU24 - Pago QR/Tarjeta)[cite: 2]
    │   │
    │   ├── ModuloAtencionClinica/      → Módulo 5: CU17–CU19 (Consulta Médica, Recetas e Historial)[cite: 2]
    │   │   ├── services/               → consultas.service.js, recetas.service.js, historial.service.js
    │   │   ├── hooks/                  → useConsultaMedica.js, useRecetas.js, useHistorialClinico.js
    │   │   ├── components/             → ImcCalculator.jsx, RecetaBuilder.jsx, ExpedienteViewer.jsx
    │   │   └── pages/
    │   │       ├── ConsultaMedicaPage/ → ConsultaMedicaPage.js + ConsultaMedicaPage.view.jsx (CU17 - Anamnesis e IMC)[cite: 2]
    │   │       ├── EmitirRecetaPage/   → EmitirRecetaPage.js + EmitirRecetaPage.view.jsx (CU18 - Detalle Fármacos)[cite: 2]
    │   │       └── HistorialClinicoPage/ → HistorialClinicoPage.js + HistorialClinicoPage.view.jsx (CU19 - Expediente)[cite: 2]
    │   │
    │   └── ModuloInteligenciaReportes/ → Módulo 6: CU20–CU23 (Notificaciones, Reportes PDF, Voz e IA, Dashboard)[cite: 2]
    │       ├── services/               → notificaciones.service.js, reportes.service.js, voiceIa.service.js, dashboard.service.js
    │       ├── hooks/                  → useNotificaciones.js, useVoiceReport.js, useDashboard.js
    │       ├── components/             → VoiceMicButton.jsx, KpiCard.jsx, ChartContainer.jsx
    │       └── pages/
    │           ├── NotificacionesPage/ → NotificacionesPage.js + NotificacionesPage.view.jsx (CU20)[cite: 2]
    │           ├── ReportesPage/       → ReportesPage.js + ReportesPage.view.jsx (CU21 - PDF/CSV)[cite: 2]
    │           ├── ReporteVozPage/     → ReporteVozPage.js + ReporteVozPage.view.jsx (CU22 - Comandos de voz e IA)[cite: 2]
    │           └── DashboardPage/      → DashboardPage.js + DashboardPage.view.jsx (CU23 - Métricas)[cite: 2]
    │
    └── shared/                         → Piezas transversales reutilizables por todos los módulos
        ├── components/
        │   ├── layout/                 → MainLayout.jsx, Header.jsx, Sidebar.jsx, Footer.jsx
        │   └── ui/                     → Button.jsx, Input.jsx, Modal.jsx, Badge.jsx, DataTable.jsx, Spinner.jsx
        ├── hooks/                      → useModal.js, useDebounce.js, usePagination.js
        └── utils/                      → formatters.js (fechas, BOB, CI), constants.js