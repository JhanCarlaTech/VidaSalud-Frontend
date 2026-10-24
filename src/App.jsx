import { Navigate, Route, Routes } from 'react-router-dom'
import { AgendarCitaPage } from './modules/ModuloOperacionCitas/pages/AgendarCitaPage'
import { AsistenciaPage } from './modules/ModuloOperacionCitas/pages/AsistenciaPage'
import { CitasPage } from './modules/ModuloOperacionCitas/pages/CitasPage'
import { MisCitasPage } from './modules/ModuloOperacionCitas/pages/MisCitasPage'
import { MiFichaPage } from './modules/ModuloPacientes/pages/MiFichaPage'
import { PacientesPage } from './modules/ModuloPacientes/pages/PacientesPage'
import { RegistroPage } from './modules/ModuloPacientes/pages/RegistroPage'
import { EspecialidadesPage } from './modules/ModuloPersonalMedico/pages/EspecialidadesPage'
import { HorariosPage } from './modules/ModuloPersonalMedico/pages/HorariosPage'
import { MedicosPage } from './modules/ModuloPersonalMedico/pages/MedicosPage'
import { ProtectedRoute } from './modules/ModuloSeguridad/components/ProtectedRoute'
import { PublicRoute } from './modules/ModuloSeguridad/components/PublicRoute'
import { AuthProvider } from './modules/ModuloSeguridad/context/AuthContext'
import { InicioPage } from './modules/ModuloSeguridad/pages/InicioPage'
import { LoginPage } from './modules/ModuloSeguridad/pages/LoginPage'
import { PerfilPage } from './modules/ModuloSeguridad/pages/PerfilPage'
import { RolesPage } from './modules/ModuloSeguridad/pages/RolesPage'
import { UsuariosPage } from './modules/ModuloSeguridad/pages/UsuariosPage'
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
        {/* Visitantes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to={RUTAS.LOGIN} replace />} />
          <Route path={RUTAS.LOGIN} element={<LoginPage />} />
          <Route path={RUTAS.REGISTRO} element={<RegistroPage />} />
        </Route>

        {/* Usuarios autenticados */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute roles={[ROLES.ADMINISTRADOR]} />}>
              <Route path={RUTAS.ADMIN_DASHBOARD} element={<InicioPage titulo="Dashboard administrativo" descripcion="Configuración y supervisión general de la clínica." />} />
            </Route>

            <Route element={<ProtectedRoute permiso="usuarios_gestionar" />}>
              <Route path={RUTAS.ADMIN_USUARIOS} element={<UsuariosPage />} />
            </Route>

            <Route element={<ProtectedRoute permiso="roles_gestionar" />}>
              <Route path={RUTAS.ADMIN_ROLES} element={<RolesPage />} />
            </Route>

            <Route element={<ProtectedRoute permiso="medicos_gestionar" />}>
              <Route path={RUTAS.ADMIN_ESPECIALIDADES} element={<EspecialidadesPage />} />
              <Route path={RUTAS.ADMIN_MEDICOS} element={<MedicosPage />} />
              <Route path={RUTAS.ADMIN_MEDICO_HORARIOS} element={<HorariosPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.MEDICO]} />}>
              <Route path={RUTAS.MEDICO_AGENDA} element={<InicioPage titulo="Mi agenda" descripcion="Sus citas asignadas y atenciones del día." />} />
              <Route path={RUTAS.MEDICO_HORARIOS} element={<HorariosPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.RECEPCIONISTA]} />}>
              <Route path={RUTAS.RECEPCION_AGENDA} element={<InicioPage titulo="Agenda del día" descripcion="Citas programadas y control de asistencia." />} />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.PACIENTE]} />}>
              <Route path={RUTAS.PACIENTE_INICIO} element={<InicioPage titulo="Mi espacio de salud" descripcion="Sus citas, reservas e historial de atenciones." />} />
              <Route path={RUTAS.PACIENTE_FICHA} element={<MiFichaPage />} />
              <Route path={RUTAS.PACIENTE_CITA_NUEVA} element={<AgendarCitaPage />} />
              <Route path={RUTAS.PACIENTE_CITAS} element={<MisCitasPage />} />
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

            {/* CU24 */}
            <Route element={<ProtectedRoute roles={[ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA, ROLES.PACIENTE]} />}>
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