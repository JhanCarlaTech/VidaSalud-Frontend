import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Input } from '../../../../shared/components/ui/Input'
import { BotonTema } from '../../../../shared/components/ui/BotonTema'
import { Logo } from '../../../../shared/components/ui/Logo'
import { RUTAS } from '../../../../shared/utils/constants'
import { fechaISO } from '../../../../shared/utils/formatters'
import { CamposContrasena, CamposDatosPersonales } from '../../../ModuloSeguridad/components/CamposCuenta'
import { useRegistroPage } from './RegistroPage'

/**
 * CU11 – Autorregistro público de pacientes.
 */
export function RegistroPage() {
  const { valores, errores, errorGeneral, enviando, manejarCambio, manejarEnvio } = useRegistroPage()

  return (
    <div className="grid min-h-full lg:grid-cols-[2fr_3fr]">
      <aside className="hidden flex-col justify-between bg-marca p-12 text-sobre-marca lg:flex">
        <Link to={RUTAS.SITIO} className="w-fit" aria-label="Vida Salud, ir a la página principal">
          <Logo invertido />
        </Link>
        <div className="flex max-w-md flex-col gap-4">
          <h2 className="text-4xl leading-tight font-semibold">Su salud, a un clic.</h2>
          <p className="text-sobre-marca/70">Cree su cuenta para reservar citas, seguir sus atenciones y consultar su historial.</p>
        </div>
        <p className="text-xs text-sobre-marca/70">© {new Date().getFullYear()} Clínica Vida Salud</p>
      </aside>

      <main className="relative flex justify-center px-4 py-10">
        <BotonTema className="absolute top-4 right-4" />
        <form className="flex w-full max-w-xl flex-col gap-6" onSubmit={manejarEnvio} noValidate>
          <div className="lg:hidden">
            <Logo />
          </div>

          <Link to={RUTAS.SITIO} className="w-fit text-sm font-semibold text-suave underline-offset-2 hover:text-texto hover:underline">
            ← Volver a la página principal
          </Link>

          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Crear cuenta de paciente</h1>
            <p className="text-sm text-suave">
              ¿Ya tiene una cuenta?{' '}
              <Link to={RUTAS.LOGIN} className="font-semibold text-texto underline-offset-2 hover:underline">
                Inicie sesión
              </Link>
            </p>
          </header>

          {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

          <CamposDatosPersonales valores={valores} errores={errores} onCambio={manejarCambio} deshabilitado={enviando} />

          <div className="sm:w-1/2 sm:pr-2">
            <Input
              etiqueta="Fecha de nacimiento"
              name="fecha_nacimiento"
              type="date"
              max={fechaISO(-1)}
              min="1900-01-02"
              value={valores.fecha_nacimiento}
              onChange={manejarCambio}
              error={errores.fecha_nacimiento}
              disabled={enviando}
            />
          </div>

          <CamposContrasena valores={valores} errores={errores} onCambio={manejarCambio} esNuevo deshabilitado={enviando} />

          <p className="text-xs text-suave">
            Después podrá completar su tipo de sangre y su contacto de emergencia en "Mi ficha médica".
          </p>

          <Button type="submit" bloque cargando={enviando}>
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </form>
      </main>
    </div>
  )
}
