import { Alert } from '../../../../shared/components/ui/Alert'
import { Button } from '../../../../shared/components/ui/Button'
import { Input } from '../../../../shared/components/ui/Input'
import { useRegistrarPagoPage } from './RegistrarPagoPage'

export function RegistrarPagoPage() {
  const pagina = useRegistrarPagoPage()

  return (
    <section className="flex flex-col gap-6 max-w-lg">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Procesar Pago de Cita</h1>
        <p className="text-suave">Registre la transacción para confirmar la reserva del paciente.</p>
      </header>

      {pagina.aviso && <Alert>{pagina.aviso}</Alert>}
      {pagina.error && <Alert variante="error">{pagina.error}</Alert>}

      <form onSubmit={pagina.handleSubmit} className="flex flex-col gap-5 rounded-xl border border-borde bg-superficie p-6 shadow-suave">
        
        <Input 
          etiqueta="ID de la Cita a Pagar" 
          type="number" 
          name="id_cita" 
          value={pagina.formData.id_cita} 
          onChange={pagina.handleChange} 
          required 
          placeholder="Ej. 2"
        />
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Método de Pago</label>
          <select 
            name="id_metodo_pago" 
            value={pagina.formData.id_metodo_pago} 
            onChange={pagina.handleChange} 
            className="min-h-11 rounded-lg border border-borde bg-superficie px-3.5 py-2.5 text-texto focus:border-primario focus:outline-none focus:ring-2 focus:ring-primario/20"
          >
            {pagina.metodos.map((metodo) => (
              <option key={metodo.id} value={metodo.id}>
                {metodo.nombre}
              </option>
            ))}
          </select>
        </div>

        <Input 
          etiqueta="Monto (Bs)" 
          type="number" 
          step="0.01" 
          name="monto" 
          value={pagina.formData.monto} 
          onChange={pagina.handleChange} 
          required 
          placeholder="Ej. 150.00"
        />

        <Input 
          etiqueta="Código de Transacción (Opcional)" 
          type="text" 
          name="codigo_transaccion" 
          value={pagina.formData.codigo_transaccion} 
          onChange={pagina.handleChange} 
          placeholder="Ej. TXN-123456"
        />

        <div className="flex justify-end mt-2">
          <Button type="submit" variante="primario" cargando={pagina.guardando}>
            Procesar Pago
          </Button>
        </div>
      </form>
    </section>
  )
}