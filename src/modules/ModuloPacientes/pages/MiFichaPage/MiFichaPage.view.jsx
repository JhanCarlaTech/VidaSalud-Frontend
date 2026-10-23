import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Spinner } from '../../../../shared/components/ui/Spinner'
import { RUTAS } from '../../../../shared/utils/constants'
import { formatearFecha } from '../../../../shared/utils/formatters'
import { CamposContactoEmergencia, CamposDatosMedicos } from '../../components/CamposPaciente'
import { useFormularioFicha, useMiFichaPage } from './MiFichaPage'

function Dato({ etiqueta, children }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium tracking-wider text-suave uppercase">{etiqueta}</dt>
      <dd className="text-lg font-semibold">{children}</dd>
    </div>
  )
}

function FormularioFicha({ ficha, onGuardado }) {
  const formulario = useFormularioFicha(ficha, onGuardado)

  return (
    <form onSubmit={formulario.manejarEnvio} noValidate className="flex flex-col gap-6">
      {formulario.errorGeneral && <Alert variante="error">{formulario.errorGeneral}</Alert>}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Datos médicos</h2>
        <CamposDatosMedicos
          valores={{ tipo_sangre: formulario.tipoSangre }}
          errores={formulario.errores}
          onCambio={formulario.cambiarTipoSangre}
          conFechaNacimiento={false}
          deshabilitado={formulario.enviando}
        />
      </section>

      <section className="border-t border-borde pt-5">
        <CamposContactoEmergencia
          contacto={formulario.contacto}
          errores={formulario.errores}
          onCambio={formulario.cambiarContacto}
          deshabilitado={formulario.enviando}
        />
      </section>

      <div className="flex justify-end">
        <Button type="submit" cargando={formulario.enviando}>
          Guardar ficha
        </Button>
      </div>
    </form>
  )
}

/**
 * CU11 – Mi ficha médica (Paciente).
 */
export function MiFichaPage() {
  const { ficha, error, aviso, alGuardar } = useMiFichaPage()

  if (!ficha) {
    return error ? <Alert variante="error">{error}</Alert> : <Spinner pantallaCompleta mensaje="Cargando ficha…" />
  }

  return (
    <section className="flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Mi ficha médica</h1>
        <p className="text-suave">
          Mantenga actualizados sus datos médicos y su contacto de emergencia. Sus datos personales se editan en{' '}
          <Link to={RUTAS.PERFIL} className="font-semibold text-texto underline-offset-2 hover:underline">
            Mi perfil
          </Link>
          .
        </p>
      </header>

      <dl className="grid gap-4 rounded-md border border-borde bg-white p-6 sm:grid-cols-3">
        <Dato etiqueta="Código">{ficha.codigo}</Dato>
        <Dato etiqueta="Edad">{ficha.edad} años</Dato>
        <Dato etiqueta="Fecha de nacimiento">{formatearFecha(`${ficha.fecha_nacimiento}T00:00`)}</Dato>
      </dl>
      <p className="-mt-3 text-xs text-suave">Si su fecha de nacimiento es incorrecta, solicite la corrección en recepción.</p>

      {aviso && <Alert>{aviso}</Alert>}

      {/* La clave reinicia el formulario con los datos guardados tras cada actualización. */}
      <FormularioFicha key={JSON.stringify([ficha.tipo_sangre, ficha.contacto])} ficha={ficha} onGuardado={alGuardar} />
    </section>
  )
}
