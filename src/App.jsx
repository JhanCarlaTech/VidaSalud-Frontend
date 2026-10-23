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

/** Providers globales y definición de rutas. */
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Visitantes: "/" lleva al login, o al panel del rol si ya hay sesión */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to={RUTAS.LOGIN} replace />} />
          <Route path={RUTAS.LOGIN} element={<LoginPage />} />
          {/* CU11 – Autorregistro de pacientes */}
          <Route path={RUTAS.REGISTRO} element={<RegistroPage />} />
        </Route>

        {/* Usuarios autenticados */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute roles={[ROLES.ADMINISTRADOR]} />}>
              <Route
                path={RUTAS.ADMIN_DASHBOARD}
                element={<InicioPage titulo="Dashboard administrativo" descripcion="Configuración y supervisión general de la clínica." />}
              />
            </Route>

            {/* CU02 – Gestionar Usuarios y Asignar Roles */}
            <Route element={<ProtectedRoute permiso="usuarios_gestionar" />}>
              <Route path={RUTAS.ADMIN_USUARIOS} element={<UsuariosPage />} />
            </Route>

            {/* CU03 – Gestionar Roles y Asignar Permisos */}
            <Route element={<ProtectedRoute permiso="roles_gestionar" />}>
              <Route path={RUTAS.ADMIN_ROLES} element={<RolesPage />} />
            </Route>

            {/* CU07 – Gestionar Especialidades Médicas */}
            <Route element={<ProtectedRoute permiso="medicos_gestionar" />}>
              <Route path={RUTAS.ADMIN_ESPECIALIDADES} element={<EspecialidadesPage />} />
              {/* CU08 – Gestionar Personal Médico */}
              <Route path={RUTAS.ADMIN_MEDICOS} element={<MedicosPage />} />
              {/* CU09 – Horarios de cualquier médico (Administrador) */}
              <Route path={RUTAS.ADMIN_MEDICO_HORARIOS} element={<HorariosPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.MEDICO]} />}>
              <Route
                path={RUTAS.MEDICO_AGENDA}
                element={<InicioPage titulo="Mi agenda" descripcion="Sus citas asignadas y atenciones del día." />}
              />
              {/* CU09 – El médico gestiona su propia grilla */}
              <Route path={RUTAS.MEDICO_HORARIOS} element={<HorariosPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.RECEPCIONISTA]} />}>
              <Route
                path={RUTAS.RECEPCION_AGENDA}
                element={<InicioPage titulo="Agenda del día" descripcion="Citas programadas y control de asistencia." />}
              />
            </Route>

            <Route element={<ProtectedRoute roles={[ROLES.PACIENTE]} />}>
              <Route
                path={RUTAS.PACIENTE_INICIO}
                element={<InicioPage titulo="Mi espacio de salud" descripcion="Sus citas, reservas e historial de atenciones." />}
              />
              {/* CU11 – Mi ficha médica */}
              <Route path={RUTAS.PACIENTE_FICHA} element={<MiFichaPage />} />
              {/* CU13 – El paciente reserva y consulta sus citas */}
              <Route path={RUTAS.PACIENTE_CITA_NUEVA} element={<AgendarCitaPage />} />
              <Route path={RUTAS.PACIENTE_CITAS} element={<MisCitasPage />} />
            </Route>

            {/* CU11 – Gestionar Pacientes (Administrador y Recepcionista) */}
            <Route element={<ProtectedRoute permiso="pacientes_gestionar" />}>
              <Route path={RUTAS.PACIENTES} element={<PacientesPage />} />
            </Route>

            {/* CU13 y CU14 – El personal agenda, reprograma y cancela citas de cualquier paciente */}
            <Route element={<ProtectedRoute permiso="citas_programar" />}>
              <Route path={RUTAS.CITAS} element={<CitasPage />} />
              <Route path={RUTAS.CITAS_NUEVA} element={<AgendarCitaPage />} />
            </Route>

            {/* CU15 – Registrar Control de Asistencia */}
            <Route element={<ProtectedRoute permiso="asistencia_registrar" />}>
              <Route path={RUTAS.ASISTENCIA} element={<AsistenciaPage />} />
            </Route>

            {/* CU05 – Configurar Perfil Personal (todos los roles) */}
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
