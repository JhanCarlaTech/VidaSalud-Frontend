import { EncabezadoSeccion } from './Encabezado'
import { EspacioImagen } from './EspacioImagen'
import { Revelar } from './Revelar'
import { IMAGENES_SITIO } from '../utils/sitio'

const VALORES = [
  { titulo: 'Especialistas certificados', texto: 'Médicos con experiencia y formación continua en cada especialidad.' },
  { titulo: 'Reserva sin filas', texto: 'Elija médico y horario desde su celular y reciba su código de cita al instante.' },
  { titulo: 'Historial en un solo lugar', texto: 'Sus citas, atenciones y ficha médica disponibles en su cuenta.' },
  { titulo: 'Pago en línea', texto: 'Pague con QR, tarjeta o transferencia, o si prefiere, en recepción.' },
]

const GALERIA = ['Consultorios', 'Laboratorio', 'Equipamiento']

/** Presentación de la clínica, sus valores y una galería de instalaciones. */
export function SeccionNosotros() {
  return (
    <section id="nosotros" className="scroll-mt-16 border-b border-borde bg-superficie-subtil">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Revelar className="aspect-[4/3] w-full">
            <EspacioImagen src={IMAGENES_SITIO.nosotros} descripcion="Recepción o sala de espera" tamano="1200 × 900" />
          </Revelar>

          <Revelar retraso={120} className="flex flex-col gap-8">
            <EncabezadoSeccion
              antetitulo="Nosotros"
              titulo="Cuidamos su salud con cercanía y precisión"
              descripcion="En Vida Salud combinamos la atención humana de siempre con herramientas digitales que le ahorran tiempo: desde la reserva hasta el seguimiento de su tratamiento."
            />
            <ul className="grid gap-5 sm:grid-cols-2">
              {VALORES.map((valor) => (
                <li key={valor.titulo} className="flex flex-col gap-1 border-l-2 border-primario pl-4">
                  <h3 className="font-semibold">{valor.titulo}</h3>
                  <p className="text-sm text-suave">{valor.texto}</p>
                </li>
              ))}
            </ul>
          </Revelar>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3" aria-label="Nuestras instalaciones">
          {GALERIA.map((nombre, indice) => (
            <Revelar as="li" key={nombre} retraso={indice * 90} className="aspect-[4/3]">
              <EspacioImagen src={IMAGENES_SITIO.galeria[indice]} descripcion={nombre} tamano="800 × 600" />
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}
