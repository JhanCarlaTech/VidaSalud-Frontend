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
  bitacora: 'Seguridad',
  medicos: 'Personal médico',
  pacientes: 'Pacientes',
  enfermedades: 'Pacientes',
  historial: 'Atención clínica',
  notificaciones: 'Notificaciones y reportes',
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
  SITIO: '/',
  LOGIN: '/login',
  REGISTRO: '/registro',
  SIN_ACCESO: '/sin-acceso',
  INICIO: '/inicio',
  PERFIL: '/perfil',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_USUARIOS_IMPORTAR: '/admin/usuarios/importar',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_BITACORA: '/admin/bitacora',
  ADMIN_ESPECIALIDADES: '/admin/especialidades',
  ADMIN_MEDICOS: '/admin/medicos',
  ADMIN_MEDICO_HORARIOS: '/admin/medicos/:id/horarios',
  MEDICO_HORARIOS: '/medico/horarios',
  ADMIN_LICENCIAS: '/admin/licencias',
  MEDICO_LICENCIAS: '/medico/licencias',
  PACIENTES: '/pacientes',
  PACIENTE_FICHA: '/paciente/ficha',
  ENFERMEDADES: '/enfermedades',
  MEDICO_RECETAS: '/medico/recetas',
  MEDICO_HISTORIAL: '/medico/historial',
  MEDICO_HISTORIAL_PACIENTE: '/medico/historial/:id',
  PACIENTE_HISTORIAL: '/paciente/historial',
  PACIENTE_RECETAS: '/paciente/recetas',
  NOTIFICACIONES: '/notificaciones',
  REPORTES: '/reportes',
  REPORTE_IMPRIMIR: '/reportes/imprimir',
  REPORTES_VOZ: '/reportes/voz',
  PACIENTE_NOTIFICACIONES: '/paciente/notificaciones',
  RECETA_IMPRIMIR: '/recetas/:id/imprimir',
  ANTECEDENTES: '/antecedentes',
  CITAS: '/citas',
  ASISTENCIA: '/asistencia',
  CITAS_NUEVA: '/citas/nueva',
  PACIENTE_CITAS: '/paciente/citas',
  PACIENTE_CITA_NUEVA: '/paciente/citas/nueva',
  MEDICO_AGENDA: '/medico/agenda',
  RECEPCION_AGENDA: '/recepcion/agenda',
  PACIENTE_INICIO: '/paciente/inicio',
  
  // --- RUTAS NUEVAS (CU16, CU17, CU24) ---
  AGENDA: '/agenda',
  CONSULTA_NUEVA: '/consultas/nueva',
  PAGO_NUEVO: '/pagos/nuevo',
})

/** Módulos del sistema, en el orden en que aparecen en el menú lateral. */
export const MODULOS = Object.freeze({
  SEGURIDAD: 'Acceso y seguridad',
  PERSONAL_MEDICO: 'Personal médico',
  PACIENTES: 'Pacientes',
  OPERACION_CITAS: 'Operación de citas',
  ATENCION_CLINICA: 'Atención clínica',
  INTELIGENCIA: 'Notificaciones y reportes',
})

/**
 * Opciones del menú lateral por rol. Cada caso de uso nuevo agrega aquí su entrada
 * con el módulo al que pertenece; las páginas de inicio no llevan módulo y van sueltas.
 */
export const MENU_POR_ROL = Object.freeze({
  [ROLES.ADMINISTRADOR]: [
    { ruta: RUTAS.ADMIN_DASHBOARD, etiqueta: 'Dashboard' },
    { ruta: RUTAS.ADMIN_USUARIOS, etiqueta: 'Usuarios', modulo: MODULOS.SEGURIDAD },
    { ruta: RUTAS.ADMIN_ROLES, etiqueta: 'Roles y permisos', modulo: MODULOS.SEGURIDAD },
    { ruta: RUTAS.ADMIN_BITACORA, etiqueta: 'Bitácora', modulo: MODULOS.SEGURIDAD },
    { ruta: RUTAS.ADMIN_ESPECIALIDADES, etiqueta: 'Especialidades', modulo: MODULOS.PERSONAL_MEDICO },
    { ruta: RUTAS.ADMIN_MEDICOS, etiqueta: 'Médicos', modulo: MODULOS.PERSONAL_MEDICO },
    { ruta: RUTAS.ADMIN_LICENCIAS, etiqueta: 'Licencias', modulo: MODULOS.PERSONAL_MEDICO },
    { ruta: RUTAS.PACIENTES, etiqueta: 'Pacientes', modulo: MODULOS.PACIENTES },
    { ruta: RUTAS.ANTECEDENTES, etiqueta: 'Antecedentes', modulo: MODULOS.PACIENTES },
    { ruta: RUTAS.ENFERMEDADES, etiqueta: 'Enfermedades', modulo: MODULOS.PACIENTES },
    { ruta: RUTAS.AGENDA, etiqueta: 'Agenda Médica', modulo: MODULOS.OPERACION_CITAS }, // NUEVO CU16
    { ruta: RUTAS.CITAS, etiqueta: 'Citas', modulo: MODULOS.OPERACION_CITAS },
    { ruta: RUTAS.ASISTENCIA, etiqueta: 'Asistencia', modulo: MODULOS.OPERACION_CITAS },
    { ruta: RUTAS.PAGO_NUEVO, etiqueta: 'Registrar Pago', modulo: MODULOS.OPERACION_CITAS }, // NUEVO CU24
    { ruta: RUTAS.NOTIFICACIONES, etiqueta: 'Notificaciones', modulo: MODULOS.INTELIGENCIA },
    { ruta: RUTAS.REPORTES, etiqueta: 'Reportes', modulo: MODULOS.INTELIGENCIA },
    { ruta: RUTAS.REPORTES_VOZ, etiqueta: 'Reportes por voz', modulo: MODULOS.INTELIGENCIA },
  ],
  [ROLES.MEDICO]: [
    { ruta: RUTAS.MEDICO_AGENDA, etiqueta: 'Mi agenda' },
    { ruta: RUTAS.AGENDA, etiqueta: 'Consultar Agenda', modulo: MODULOS.OPERACION_CITAS }, // NUEVO CU16
    { ruta: RUTAS.CONSULTA_NUEVA, etiqueta: 'Registrar Consulta', modulo: MODULOS.OPERACION_CITAS }, // NUEVO CU17
    { ruta: RUTAS.MEDICO_HISTORIAL, etiqueta: 'Mis pacientes', modulo: MODULOS.ATENCION_CLINICA },
    { ruta: RUTAS.MEDICO_RECETAS, etiqueta: 'Recetas', modulo: MODULOS.ATENCION_CLINICA },
    // CU21: el médico ve solo sus propios reportes (alcance personal en el servidor).
    { ruta: RUTAS.REPORTES, etiqueta: 'Mis reportes', modulo: MODULOS.INTELIGENCIA },
    { ruta: RUTAS.REPORTES_VOZ, etiqueta: 'Reportes por voz', modulo: MODULOS.INTELIGENCIA },
    { ruta: RUTAS.MEDICO_HORARIOS, etiqueta: 'Mis horarios', modulo: MODULOS.PERSONAL_MEDICO },
    { ruta: RUTAS.MEDICO_LICENCIAS, etiqueta: 'Mis licencias', modulo: MODULOS.PERSONAL_MEDICO },
    { ruta: RUTAS.ANTECEDENTES, etiqueta: 'Antecedentes', modulo: MODULOS.PACIENTES },
    { ruta: RUTAS.ENFERMEDADES, etiqueta: 'Enfermedades', modulo: MODULOS.PACIENTES },
  ],
  [ROLES.RECEPCIONISTA]: [
    { ruta: RUTAS.RECEPCION_AGENDA, etiqueta: 'Agenda del día' },
    { ruta: RUTAS.AGENDA, etiqueta: 'Consultar Agenda', modulo: MODULOS.OPERACION_CITAS }, // NUEVO CU16
    { ruta: RUTAS.ASISTENCIA, etiqueta: 'Asistencia', modulo: MODULOS.OPERACION_CITAS },
    { ruta: RUTAS.CITAS, etiqueta: 'Citas', modulo: MODULOS.OPERACION_CITAS },
    { ruta: RUTAS.PACIENTES, etiqueta: 'Pacientes', modulo: MODULOS.PACIENTES },
    { ruta: RUTAS.PAGO_NUEVO, etiqueta: 'Registrar Pago', modulo: MODULOS.OPERACION_CITAS }, // NUEVO CU24
    { ruta: RUTAS.NOTIFICACIONES, etiqueta: 'Notificaciones', modulo: MODULOS.INTELIGENCIA },
    { ruta: RUTAS.REPORTES, etiqueta: 'Reportes', modulo: MODULOS.INTELIGENCIA },
    { ruta: RUTAS.REPORTES_VOZ, etiqueta: 'Reportes por voz', modulo: MODULOS.INTELIGENCIA },
  ],
  [ROLES.PACIENTE]: [
    { ruta: RUTAS.PACIENTE_INICIO, etiqueta: 'Inicio' },
    // CU20: siempre visible, con el número de notificaciones sin leer.
    { ruta: RUTAS.PACIENTE_NOTIFICACIONES, etiqueta: 'Notificaciones', contador: 'notificaciones' },
    { ruta: RUTAS.PACIENTE_CITA_NUEVA, etiqueta: 'Reservar cita', modulo: MODULOS.OPERACION_CITAS },
    { ruta: RUTAS.PACIENTE_CITAS, etiqueta: 'Mis citas', modulo: MODULOS.OPERACION_CITAS },
    { ruta: RUTAS.PACIENTE_FICHA, etiqueta: 'Mi ficha médica', modulo: MODULOS.PACIENTES },
    { ruta: RUTAS.PACIENTE_HISTORIAL, etiqueta: 'Mi historial', modulo: MODULOS.ATENCION_CLINICA },
    { ruta: RUTAS.PACIENTE_RECETAS, etiqueta: 'Mis recetas', modulo: MODULOS.ATENCION_CLINICA },
  ],
})