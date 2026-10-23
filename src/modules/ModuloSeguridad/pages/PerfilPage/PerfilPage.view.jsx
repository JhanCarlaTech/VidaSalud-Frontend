import { Alert } from '../../../../shared/components/ui/Alert'
import { Badge } from '../../../../shared/components/ui/Badge'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { etiquetaRol, formatearFecha, iniciales } from '../../../../shared/utils/formatters'
import { CambiarContrasenaForm } from './components/CambiarContrasenaForm'
import { DatosPersonalesForm } from './components/DatosPersonalesForm'
import { PreferenciasForm } from './components/PreferenciasForm'
import { SeguridadCuenta } from './components/SeguridadCuenta'
import { PESTANAS, usePerfilPage } from './PerfilPage'

/**
 * CU05 – Configurar Perfil Personal.
 */
export function PerfilPage() {
  const pagina = usePerfilPage()
  const { perfil } = pagina

  if (!perfil) {
    return pagina.error ? <Alert variante="error">{pagina.error}</Alert> : <Spinner pantallaCompleta mensaje="Cargando perfil…" />
  }

  const { usuario, preferencias } = perfil

  return (
    <section className="flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Mi perfil</h1>
        <p className="text-suave">Administre sus datos, la seguridad de su cuenta y sus notificaciones.</p>
      </header>

      {/* Resumen de la cuenta */}
      <div className="flex flex-col gap-4 rounded-md border border-borde bg-white p-6 sm:flex-row sm:items-center">
        <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-primario text-lg font-semibold text-white">
          {iniciales(usuario)}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-lg font-semibold">{usuario.nombre_completo}</p>
          <p className="truncate text-sm text-suave">{usuario.correo}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {usuario.roles.map((rol) => (
              <Badge key={rol.id}>{etiquetaRol(rol.nombre)}</Badge>
            ))}
            <span className="text-xs text-suave">Miembro desde el {formatearFecha(usuario.fecha_creacion)}</span>
          </div>
        </div>
      </div>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}

      {/* Pestañas */}
      <div role="tablist" aria-label="Secciones del perfil" className="flex gap-1 overflow-x-auto border-b border-borde">
        {PESTANAS.map(({ clave, etiqueta }) => {
          const activa = pagina.pestana === clave
          return (
            <button
              key={clave}
              type="button"
              role="tab"
              id={`pestana-${clave}`}
              aria-selected={activa}
              aria-controls={`panel-${clave}`}
              onClick={() => pagina.cambiarPestana(clave)}
              className={`-mb-px cursor-pointer border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activa ? 'border-primario text-texto' : 'border-transparent text-suave hover:text-texto'}`}
            >
              {etiqueta}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={`panel-${pagina.pestana}`} aria-labelledby={`pestana-${pagina.pestana}`}>
        {pagina.pestana === 'datos' && <DatosPersonalesForm key={usuario.id} usuario={usuario} onGuardado={pagina.alGuardarDatos} />}

        {pagina.pestana === 'seguridad' && (
          <div className="flex flex-col gap-8">
            <CambiarContrasenaForm onCambiada={pagina.mostrarAviso} />
            <SeguridadCuenta onAviso={pagina.mostrarAviso} />
          </div>
        )}

        {pagina.pestana === 'notificaciones' && (
          <PreferenciasForm preferencias={preferencias} onGuardado={pagina.alGuardarPreferencias} />
        )}
      </div>
    </section>
  )
}
