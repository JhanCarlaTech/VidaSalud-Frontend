import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Button } from '../../../../shared/components/ui/Button'
import { DataTable } from '../../../../shared/components/ui/DataTable'
import { Input } from '../../../../shared/components/ui/Input'
import { Pagination } from '../../../../shared/components/ui/Pagination'
import { Select } from '../../../../shared/components/ui/Select'
import { etiquetaRol } from '../../../../shared/utils/formatters'
import { useAuth } from '../../hooks/useAuth'
import { CambiarEstadoModal } from './components/CambiarEstadoModal'
import { UsuarioFormModal } from './components/UsuarioFormModal'
import { useUsuariosPage } from './UsuariosPage'

const OPCIONES_ESTADO = [
  { valor: '', etiqueta: 'Todos' },
  { valor: '1', etiqueta: 'Activos' },
  { valor: '0', etiqueta: 'Inactivos' },
]

/**
 * CU02 – Gestionar Usuarios y Asignar Roles.
 */
export function UsuariosPage() {
  const { usuario: usuarioActual } = useAuth()
  const pagina = useUsuariosPage()
  const { filtros, roles, modal } = pagina

  const columnas = [
    {
      clave: 'usuario',
      titulo: 'Usuario',
      render: (usuario) => (
        <div className="flex flex-col">
          <span className="font-semibold">
            {usuario.nombre_completo}
            {usuario.id === usuarioActual.id && <span className="ml-2 text-xs font-normal text-suave">(usted)</span>}
          </span>
          <span className="text-suave">{usuario.correo}</span>
        </div>
      ),
    },
    { clave: 'ci', titulo: 'CI' },
    {
      clave: 'roles',
      titulo: 'Roles',
      render: (usuario) => (
        <div className="flex flex-wrap gap-1">
          {usuario.roles.map((rol) => (
            <Badge key={rol.id}>{etiquetaRol(rol.nombre)}</Badge>
          ))}
        </div>
      ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (usuario) => (
        <Badge variante={usuario.activo ? 'solido' : 'contorno'}>{usuario.activo ? 'Activo' : 'Inactivo'}</Badge>
      ),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      className: 'text-right',
      render: (usuario) => (
        <div className="flex justify-end gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => pagina.abrirEdicion(usuario)}>
            Editar
          </Button>
          <Button
            variante="secundario"
            tamano="sm"
            onClick={() => pagina.abrirCambioEstado(usuario)}
            disabled={usuario.id === usuarioActual.id}
            title={usuario.id === usuarioActual.id ? 'No puede desactivar su propia cuenta' : undefined}
          >
            {usuario.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Usuarios</h1>
          <p className="text-suave">Registre cuentas, asigne roles y controle el acceso al sistema.</p>
        </div>
        <Button onClick={pagina.abrirNuevo}>Nuevo usuario</Button>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
        <Input
          etiqueta="Buscar"
          name="buscar"
          type="search"
          placeholder="CI, nombre o correo"
          value={filtros.buscar}
          onChange={pagina.cambiarFiltro}
        />
        <Select
          etiqueta="Rol"
          name="rol"
          value={filtros.rol}
          onChange={pagina.cambiarFiltro}
          opciones={[{ valor: '', etiqueta: 'Todos' }, ...roles.map((rol) => ({ valor: rol.id, etiqueta: etiquetaRol(rol.nombre) }))]}
        />
        <Select etiqueta="Estado" name="activo" value={filtros.activo} onChange={pagina.cambiarFiltro} opciones={OPCIONES_ESTADO} />
        <Button variante="secundario" onClick={pagina.limpiarFiltros} disabled={!pagina.hayFiltros}>
          Limpiar
        </Button>
      </div>

      <DataTable
        columnas={columnas}
        filas={pagina.usuarios}
        obtenerClave={(usuario) => usuario.id}
        cargando={pagina.cargando}
        mensajeVacio={pagina.hayFiltros ? 'Ningún usuario coincide con los filtros.' : 'Aún no hay usuarios registrados.'}
      />

      <Pagination meta={pagina.meta} onCambiarPagina={pagina.cambiarPagina} deshabilitado={pagina.cargando} />

      {modal?.tipo === 'formulario' && (
        <UsuarioFormModal
          usuario={modal.usuario}
          roles={roles}
          esUsuarioActual={modal.usuario?.id === usuarioActual.id}
          onCerrar={pagina.cerrarModal}
          onGuardado={pagina.finalizarOperacion}
        />
      )}

      {modal?.tipo === 'estado' && (
        <CambiarEstadoModal usuario={modal.usuario} onCerrar={pagina.cerrarModal} onCambiado={pagina.finalizarOperacion} />
      )}
    </section>
  )
}
