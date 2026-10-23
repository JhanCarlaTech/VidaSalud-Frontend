import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { etiquetaRol, formatearPermiso } from '../../../../shared/utils/formatters'
import { CambiarEstadoRolModal } from './components/CambiarEstadoRolModal'
import { RolFormModal } from './components/RolFormModal'
import { useRolesPage } from './RolesPage'

/** Cantidad de permisos que se muestran como etiqueta antes de resumir con "+N". */
const PERMISOS_VISIBLES = 3

/**
 * CU03 – Gestionar Roles y Asignar Permisos.
 */
export function RolesPage() {
  const pagina = useRolesPage()
  const { modal } = pagina

  const columnas = [
    {
      clave: 'rol',
      titulo: 'Rol',
      render: (rol) => (
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 font-semibold">
            {etiquetaRol(rol.nombre)}
            {rol.es_sistema && <Badge variante="contorno">Sistema</Badge>}
          </span>
          {rol.descripcion && <span className="text-suave">{rol.descripcion}</span>}
        </div>
      ),
    },
    {
      clave: 'permisos',
      titulo: 'Permisos',
      render: (rol) =>
        rol.permisos.length === 0 ? (
          <span className="text-suave">Sin permisos</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {rol.permisos.slice(0, PERMISOS_VISIBLES).map((permiso) => (
              <Badge key={permiso.id}>{formatearPermiso(permiso.accion)}</Badge>
            ))}
            {rol.permisos.length > PERMISOS_VISIBLES && (
              <Badge variante="contorno">+{rol.permisos.length - PERMISOS_VISIBLES}</Badge>
            )}
          </div>
        ),
    },
    { clave: 'usuarios_count', titulo: 'Usuarios', className: 'text-center' },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (rol) => <Badge variante={rol.activo ? 'solido' : 'contorno'}>{rol.activo ? 'Activo' : 'Inactivo'}</Badge>,
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (rol) => (
        <div className="flex justify-end gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEdicion(rol)}>
            Editar
          </Button>
          <Button
            variante="secundario"
            tamano="sm"
            onClick={() => pagina.abrirCambioEstado(rol)}
            disabled={rol.es_sistema}
            title={rol.es_sistema ? 'Los roles del sistema no se pueden desactivar' : undefined}
          >
            {rol.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Roles y permisos</h1>
          <p className="text-suave">Defina los roles de la clínica y las acciones que cada uno puede realizar.</p>
        </div>
        <Button onClick={pagina.abrirNuevo}>Nuevo rol</Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <DataTable
        columnas={columnas}
        filas={pagina.roles}
        obtenerClave={(rol) => rol.id}
        cargando={pagina.cargando}
        mensajeVacio="Aún no hay roles registrados."
      />

      {modal?.tipo === 'formulario' && (
        <RolFormModal
          rol={modal.rol}
          permisos={pagina.permisos}
          onCerrar={pagina.cerrarModal}
          onGuardado={pagina.finalizarOperacion}
        />
      )}

      {modal?.tipo === 'estado' && (
        <CambiarEstadoRolModal rol={modal.rol} onCerrar={pagina.cerrarModal} onCambiado={pagina.finalizarOperacion} />
      )}
    </section>
  )
}
