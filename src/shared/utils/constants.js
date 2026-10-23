/** Nombres de rol tal como están en la tabla `rol`. */
export const ROLES = Object.freeze({
  ADMINISTRADOR: 'Administrador',
  MEDICO: 'Medico',
  RECEPCIONISTA: 'Recepcionista',
  PACIENTE: 'Paciente',
})

/** Roles de los que depende la lógica del sistema: no se renombran ni desactivan (CU03, RN02). */
export const ROLES_SISTEMA = Object.freeze(Object.values(ROLES))

/** Permisos que el rol Administrador debe conservar siempre (CU03, RN03). */
export const PERMISOS_OBLIGATORIOS_ADMIN = Object.freeze(['usuarios_gestionar', 'roles_gestionar'])

/** Módulo al que pertenece cada permiso según el prefijo de su acción ('citas_programar' → 'citas'). */
export const GRUPO_PERMISO = Object.freeze({
  usuarios: 'Seguridad',
  roles: 'Seguridad',
  medicos: 'Personal médico',
  pacientes: 'Pacientes',
  citas: 'Citas médicas',
  reportes: 'Reportes',
})

/** Valores de 'sexo_enum' para los formularios de datos personales. */
export const OPCIONES_SEXO = Object.freeze([
  { valor: '', etiqueta: 'Sin especificar' },
  { valor: 'F', etiqueta: 'Femenino' },
  { valor: 'M', etiqueta: 'Masculino' },
  { valor: 'O', etiqueta: 'Otro' },
])

/** Días de la semana según ISO-8601, como 'horario_atencion.dia_semana' (1 = lunes). */
export const DIAS_SEMANA = Object.freeze([
  { valor: 1, etiqueta: 'Lunes' },
  { valor: 2, etiqueta: 'Martes' },
  { valor: 3, etiqueta: 'Miércoles' },
  { valor: 4, etiqueta: 'Jueves' },
  { valor: 5, etiqueta: 'Viernes' },
  { valor: 6, etiqueta: 'Sábado' },
  { valor: 7, etiqueta: 'Domingo' },
])

/** Duraciones de turno permitidas, en minutos (CU09, RN01). */
export const DURACIONES_TURNO = Object.freeze([15, 20, 30, 45, 60])

/** Alcance máximo de la consulta de disponibilidad (CU09, RN06). */
export const DIAS_MAXIMOS_DISPONIBILIDAD = 90

/** Etiqueta legible de cada rol para la interfaz. */
export const ETIQUETA_ROL = Object.freeze({
  [ROLES.ADMINISTRADOR]: 'Administrador',
  [ROLES.MEDICO]: 'Médico',
  [ROLES.RECEPCIONISTA]: 'Recepcionista',
  [ROLES.PACIENTE]: 'Paciente',
})

/**
 * Rutas de la aplicación. Las de inicio por rol deben coincidir con las que
 * devuelve el backend en `ruta_inicio` (AuthService::RUTAS_INICIO).
 */
export const RUTAS = Object.freeze({
  LOGIN: '/login',
  REGISTRO: '/registro',
  SIN_ACCESO: '/sin-acceso',
  INICIO: '/inicio',
  PERFIL: '/perfil',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_ESPECIALIDADES: '/admin/especialidades',
  ADMIN_MEDICOS: '/admin/medicos',
  ADMIN_MEDICO_HORARIOS: '/admin/medicos/:id/horarios',
  MEDICO_HORARIOS: '/medico/horarios',
  PACIENTES: '/pacientes',
  PACIENTE_FICHA: '/paciente/ficha',
  CITAS: '/citas',
  ASISTENCIA: '/asistencia',
  CITAS_NUEVA: '/citas/nueva',
  PACIENTE_CITAS: '/paciente/citas',
  PACIENTE_CITA_NUEVA: '/paciente/citas/nueva',
  MEDICO_AGENDA: '/medico/agenda',
  RECEPCION_AGENDA: '/recepcion/agenda',
  PACIENTE_INICIO: '/paciente/inicio',
})

/** Opciones del menú lateral por rol. Cada caso de uso nuevo agrega aquí su entrada. */
export const MENU_POR_ROL = Object.freeze({
  [ROLES.ADMINISTRADOR]: [
    { ruta: RUTAS.ADMIN_DASHBOARD, etiqueta: 'Dashboard' },
    { ruta: RUTAS.ADMIN_USUARIOS, etiqueta: 'Usuarios' },
    { ruta: RUTAS.ADMIN_ROLES, etiqueta: 'Roles y permisos' },
    { ruta: RUTAS.ADMIN_ESPECIALIDADES, etiqueta: 'Especialidades' },
    { ruta: RUTAS.ADMIN_MEDICOS, etiqueta: 'Médicos' },
    { ruta: RUTAS.PACIENTES, etiqueta: 'Pacientes' },
    { ruta: RUTAS.CITAS, etiqueta: 'Citas' },
    { ruta: RUTAS.ASISTENCIA, etiqueta: 'Asistencia' },
  ],
  [ROLES.MEDICO]: [
    { ruta: RUTAS.MEDICO_AGENDA, etiqueta: 'Mi agenda' },
    { ruta: RUTAS.MEDICO_HORARIOS, etiqueta: 'Mis horarios' },
  ],
  [ROLES.RECEPCIONISTA]: [
    { ruta: RUTAS.RECEPCION_AGENDA, etiqueta: 'Agenda del día' },
    { ruta: RUTAS.ASISTENCIA, etiqueta: 'Asistencia' },
    { ruta: RUTAS.CITAS, etiqueta: 'Citas' },
    { ruta: RUTAS.PACIENTES, etiqueta: 'Pacientes' },
  ],
  [ROLES.PACIENTE]: [
    { ruta: RUTAS.PACIENTE_INICIO, etiqueta: 'Inicio' },
    { ruta: RUTAS.PACIENTE_CITA_NUEVA, etiqueta: 'Reservar cita' },
    { ruta: RUTAS.PACIENTE_CITAS, etiqueta: 'Mis citas' },
    { ruta: RUTAS.PACIENTE_FICHA, etiqueta: 'Mi ficha médica' },
  ],
})
