import { Route, Routes } from 'react-router-dom'
import { HistorialPage } from './modules/ModuloAtencionClinica/pages/HistorialPage'
import { MisRecetasPage } from './modules/ModuloAtencionClinica/pages/MisRecetasPage'
import { MisPacientesPage } from './modules/ModuloAtencionClinica/pages/MisPacientesPage'
import { RecetaImprimiblePage } from './modules/ModuloAtencionClinica/pages/RecetaImprimiblePage'
import { RecetasPage } from './modules/ModuloAtencionClinica/pages/RecetasPage'
import { DashboardPage } from './modules/ModuloInteligenciaReportes/pages/DashboardPage'
import { MisNotificacionesPage } from './modules/ModuloInteligenciaReportes/pages/MisNotificacionesPage'
import { NotificacionesPage } from './modules/ModuloInteligenciaReportes/pages/NotificacionesPage'
import { ReporteImprimiblePage } from './modules/ModuloInteligenciaReportes/pages/ReporteImprimiblePage'
import { ReportesPage } from './modules/ModuloInteligenciaReportes/pages/ReportesPage'
import { ReportesVozPage } from './modules/ModuloInteligenciaReportes/pages/ReportesVozPage'
import { AgendarCitaPage } from './modules/ModuloOperacionCitas/pages/AgendarCitaPage'
import { AsistenciaPage } from './modules/ModuloOperacionCitas/pages/AsistenciaPage'
import { CitasPage } from './modules/ModuloOperacionCitas/pages/CitasPage'
import { MisCitasPage } from './modules/ModuloOperacionCitas/pages/MisCitasPage'
import { AntecedentesPage } from './modules/ModuloPacientes/pages/AntecedentesPage'
import { EnfermedadesPage } from './modules/ModuloPacientes/pages/EnfermedadesPage'
import { MiFichaPage } from './modules/ModuloPacientes/pages/MiFichaPage'
import { PacientesPage } from './modules/ModuloPacientes/pages/PacientesPage'
import { RegistroPage } from './modules/ModuloPacientes/pages/RegistroPage'
import { EspecialidadesPage } from './modules/ModuloPersonalMedico/pages/EspecialidadesPage'
import { HorariosPage } from './modules/ModuloPersonalMedico/pages/HorariosPage'
import { LicenciasPage } from './modules/ModuloPersonalMedico/pages/LicenciasPage'
import { MedicosPage } from './modules/ModuloPersonalMedico/pages/MedicosPage'
import { ProtectedRoute } from './modules/ModuloSeguridad/components/ProtectedRoute'
import { PublicRoute } from './modules/ModuloSeguridad/components/PublicRoute'
import { AuthProvider } from './modules/ModuloSeguridad/context/AuthContext'
import { BitacoraPage } from './modules/ModuloSeguridad/pages/BitacoraPage'
import { CargaLotesPage } from './modules/ModuloSeguridad/pages/CargaLotesPage'
import { InicioPage } from './modules/ModuloSeguridad/pages/InicioPage'
import { LoginPage } from './modules/ModuloSeguridad/pages/LoginPage'
import { PerfilPage } from './modules/ModuloSeguridad/pages/PerfilPage'
import { RolesPage } from './modules/ModuloSeguridad/pages/RolesPage'
import { UsuariosPage } from './modules/ModuloSeguridad/pages/UsuariosPage'
import { LandingPage } from './modules/SitioPublico/pages/LandingPage'
import { MainLayout } from './shared/components/layout/MainLayout'
import { NoEncontradaPage } from './shared/pages/NoEncontradaPage'
import { SinAccesoPage } from './shared/pages/SinAccesoPage'
import { ROLES, RUTAS } from './shared/utils/constants'

// Importaciones normales
import { AgendaPage } from './modules/ModuloOperacionCitas/pages/AgendaPage'
import { RegistrarConsultaPage } from './modules/ModuloOperacionCitas/pages/RegistrarConsultaPage'
import { RegistrarPagoPage } from './modules/ModuloOperacionCitas/pages/RegistrarPagoPage' // <-- NUEVO

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Página principal: visitantes y usuarios con sesión */}
        <Route path={RUTAS.SITIO} element={<LandingPage />} />

        {/* Visitantes */}
        <Route element={<PublicRoute />}>
          <Route path={RUTAS.LOGIN} element={<LoginPage />} />
          <Route path={RUTAS.REGISTRO} element={<RegistroPage />} />
        </Route>

        {/* Usuarios autenticados */}
        <Route element={<ProtectedRoute />}>
          {/* CU18: receta imprimible, sin el menú ni la barra superior. La ven el médico y el paciente (RN05). */}
          <Route path={RUTAS.RECETA_IMPRIMIR} element={<RecetaImprimiblePage />} />
          {/* CU21: reporte imprimible, también fuera del diseño principal */}
          <Route element={<ProtectedRoute permiso="reportes_ver" />}>
            <Route path={RUTAS.REPORTE_IMPRIMIR} element={<ReporteImprimiblePage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute roles={[ROLES.ADMINISTRADOR]} />}>
              {/* CU23 (el servidor exige además el permiso 'dashboard_ver') */}
              <Route path={RUTAS.ADMIN_DASHBOARD} element={<DashboardPage />} />
            </Route>

            <Route element={<ProtectedRoute permiso="usuarios_gestionar" />}>
              <Route path={RUTAS.ADMIN_USUARIOS} element={<UsuariosPage />} />
            </Route>

            {/* CU04 */}
            <Route element={<ProtectedRoute permiso="usuarios_importar" />}>
              <Route path={RUTAS.ADMIN_USUARIOS_IMPORTAR} element={<CargaLotesPage />} />
            </Route>

            {/* CU06 */}
            <Route element={<ProtectedRoute permiso="bitacora_consultar" />}>
              <Route path={RUTAS.ADMIN_BITACORA} element={<BitacoraPage />} />
            </Route>

            <Route element={<ProtectedRoute permiso="roles_gestionar" />}>
              <Route path={RUTAS.ADMIN_ROLES} element={<RolesPage />} />
            </Route>

            <Route element={<ProtectedRoute permiso="medicos_gestionar" />}>
              <Route path={RUTAS.ADMIN_ESPECIALIDADES} element={<EspecialidadesPage />} />
              <Route path={RUTAS.ADMIN_MEDICOS} element={<MedicosPage />} />
              <Route path={RUTAS.ADMIN_MEDICO_HORARIOS} element={<HorariosPage />} />
              {/* CU10 */}
              <Route path={RUTAS.ADMIN_LICENCIAS} element={<LicenciasPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.MEDICO]} />}>
              <Route path={RUTAS.MEDICO_AGENDA} element={<InicioPage titulo="Mi agenda" descripcion="Sus citas asignadas y atenciones del día." />} />
              <Route path={RUTAS.MEDICO_HORARIOS} element={<HorariosPage />} />
              <Route path={RUTAS.MEDICO_LICENCIAS} element={<LicenciasPage propias />} />
              {/* CU18 */}
              <Route path={RUTAS.MEDICO_RECETAS} element={<RecetasPage />} />
            </Route>

            {/* CU20 */}
            <Route element={<ProtectedRoute permiso="notificaciones_gestionar" />}>
              <Route path={RUTAS.NOTIFICACIONES} element={<NotificacionesPage />} />
            </Route>

            {/* CU21 */}
            <Route element={<ProtectedRoute permiso="reportes_ver" />}>
              <Route path={RUTAS.REPORTES} element={<ReportesPage />} />
              {/* CU22 */}
              <Route path={RUTAS.REPORTES_VOZ} element={<ReportesVozPage />} />
            </Route>

            {/* CU19: historial de los pacientes que atiende el médico (regla D4 en el servidor) */}
            <Route element={<ProtectedRoute permiso="historial_consultar" />}>
              <Route path={RUTAS.MEDICO_HISTORIAL} element={<MisPacientesPage />} />
              <Route path={RUTAS.MEDICO_HISTORIAL_PACIENTE} element={<HistorialPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.RECEPCIONISTA]} />}>
              <Route path={RUTAS.RECEPCION_AGENDA} element={<InicioPage titulo="Agenda del día" descripcion="Citas programadas y control de asistencia." />} />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.PACIENTE]} />}>
              <Route path={RUTAS.PACIENTE_INICIO} element={<InicioPage titulo="Mi espacio de salud" descripcion="Sus citas, reservas e historial de atenciones." />} />
              <Route path={RUTAS.PACIENTE_FICHA} element={<MiFichaPage />} />
              <Route path={RUTAS.PACIENTE_HISTORIAL} element={<HistorialPage propio />} />
              <Route path={RUTAS.PACIENTE_RECETAS} element={<MisRecetasPage />} />
              <Route path={RUTAS.PACIENTE_NOTIFICACIONES} element={<MisNotificacionesPage />} />
              <Route path={RUTAS.PACIENTE_CITA_NUEVA} element={<AgendarCitaPage />} />
              <Route path={RUTAS.PACIENTE_CITAS} element={<MisCitasPage />} />
            </Route>

            {/* CU12 */}
            <Route element={<ProtectedRoute permiso="enfermedades_gestionar" />}>
              <Route path={RUTAS.ENFERMEDADES} element={<EnfermedadesPage />} />
              <Route path={RUTAS.ANTECEDENTES} element={<AntecedentesPage />} />
            </Route>

            <Route element={<ProtectedRoute permiso="pacientes_gestionar" />}>
              <Route path={RUTAS.PACIENTES} element={<PacientesPage />} />
            </Route>

            <Route element={<ProtectedRoute permiso="citas_programar" />}>
              <Route path={RUTAS.CITAS} element={<CitasPage />} />
              <Route path={RUTAS.CITAS_NUEVA} element={<AgendarCitaPage />} />
            </Route>

            <Route element={<ProtectedRoute permiso="asistencia_registrar" />}>
              <Route path={RUTAS.ASISTENCIA} element={<AsistenciaPage />} />
            </Route>

            {/* CU16 */}
            <Route element={<ProtectedRoute roles={[ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA, ROLES.MEDICO]} />}>
              <Route path={RUTAS.AGENDA} element={<AgendaPage />} />
            </Route>

            {/* CU17 */}
            <Route element={<ProtectedRoute permiso="citas_atender" />}>
              <Route path={RUTAS.CONSULTA_NUEVA} element={<RegistrarConsultaPage />} />
            </Route>

            {/* CU24 – Registro manual de pagos verificados (recepción). El paciente paga desde "Mis citas". */}
            <Route element={<ProtectedRoute roles={[ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA]} />}>
              <Route path={RUTAS.PAGO_NUEVO} element={<RegistrarPagoPage />} />
            </Route>

            <Route path={RUTAS.PERFIL} element={<PerfilPage />} />
            <Route path={RUTAS.INICIO} element={<InicioPage titulo="Inicio" descripcion="Panel principal del sistema." />} />
          </Route>
        </Route>

        <Route path={RUTAS.SIN_ACCESO} element={<SinAccesoPage />} />
        <Route path="*" element={<NoEncontradaPage />} />
      </Routes>
    </AuthProvider>
  )
}