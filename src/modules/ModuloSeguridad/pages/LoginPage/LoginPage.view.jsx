import { Link } from 'react-router-dom'
import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Input } from '../../../../shared/components/ui/Input'
import { Logo } from '../../../../shared/components/ui/Logo'
import { RUTAS } from '../../../../shared/utils/constants'
import { useLoginPage } from './LoginPage'

/**
 * CU01 – Portal de acceso único para todos los actores.
 */
export function LoginPage() {
  const {
    valores,
    errores,
    errorGeneral,
    enviando,
    verContrasena,
    manejarCambio,
    alternarVerContrasena,
    manejarEnvio,
  } = useLoginPage()

  return (
    <div className="grid min-h-full lg:grid-cols-2">
      {/* Panel de marca: negro puro, alto contraste (solo escritorio) */}
      <aside className="hidden flex-col justify-between bg-primario p-12 text-white lg:flex">
        <Logo invertido />
        <div className="flex max-w-md flex-col gap-4">
          <h2 className="text-4xl leading-tight font-semibold">Gestión clínica, simple y precisa.</h2>
          <p className="text-sutil">Citas, agenda médica, historial clínico y pagos en un solo lugar.</p>
        </div>
        <p className="text-xs text-sutil">© {new Date().getFullYear()} Clínica Vida Salud</p>
      </aside>

      <main className="flex items-center justify-center px-4 py-8">
        <form className="flex w-full max-w-[380px] flex-col gap-6" onSubmit={manejarEnvio} noValidate>
          <div className="lg:hidden">
            <Logo />
          </div>

          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Iniciar sesión</h1>
            <p className="text-sm text-suave">Ingrese con el correo y la contraseña de su cuenta.</p>
          </header>

          {errorGeneral && <Alert variante="error">{errorGeneral}</Alert>}

          <Input
            etiqueta="Correo electrónico"
            name="correo"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            value={valores.correo}
            onChange={manejarCambio}
            error={errores.correo}
            disabled={enviando}
            autoFocus
          />

          <Input
            etiqueta="Contraseña"
            name="contrasena"
            type={verContrasena ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={valores.contrasena}
            onChange={manejarCambio}
            error={errores.contrasena}
            disabled={enviando}
            adorno={
              <button
                type="button"
                onClick={alternarVerContrasena}
                aria-pressed={verContrasena}
                className="cursor-pointer rounded-sm px-2 py-1 text-xs font-semibold text-suave hover:text-texto"
              >
                {verContrasena ? 'Ocultar' : 'Mostrar'}
              </button>
            }
          />

          <Button type="submit" bloque cargando={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </Button>

          {/* CU11 – Autorregistro de pacientes */}
          <p className="text-center text-sm text-suave">
            ¿Es paciente y aún no tiene cuenta?{' '}
            <Link to={RUTAS.REGISTRO} className="font-semibold text-texto underline-offset-2 hover:underline">
              Crear cuenta
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
