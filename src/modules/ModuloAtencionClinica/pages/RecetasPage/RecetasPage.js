import { useState } from 'react'
import { useAviso } from '../../../../shared/hooks/useAviso'
import { useConsulta } from '../../../../shared/hooks/useConsulta'
import { useDebounce } from '../../../../shared/hooks/useDebounce'
import { listarConsultasDelMedico } from '../../services/recetas.service'

/**
 * Lógica de la página de recetas del médico (CU18): sus consultas atendidas,
 * la emisión de recetas y la consulta de las ya emitidas.
 */
export function useRecetasPage() {
  const [buscar, setBuscar] = useState('')
  const [pagina, setPagina] = useState(1)
  // modal = null | { tipo: 'emitir' | 'recetas', consulta: object }
  const [modal, setModal] = useState(null)
  const [aviso, setAviso] = useAviso(6000)
  // Receta recién emitida, para ofrecer imprimirla de inmediato.
  const [ultimaReceta, setUltimaReceta] = useState(null)

  const termino = useDebounce(buscar.trim())
  const { datos, cargando, error, recargar } = useConsulta(
    () => listarConsultasDelMedico({ buscar: termino, page: pagina }),
    JSON.stringify([termino, pagina]),
  )

  function cambiarBusqueda(evento) {
    setBuscar(evento.target.value)
    setPagina(1)
  }

  function finalizarEmision(receta, mensaje) {
    setModal(null)
    setAviso(mensaje)
    setUltimaReceta(receta)
    recargar()
  }

  return {
    buscar,
    consultas: datos?.items ?? [],
    meta: datos?.meta ?? null,
    diasParaEmitir: datos?.dias_para_emitir ?? 7,
    cargando,
    error,
    aviso,
    ultimaReceta,
    modal,
    cambiarBusqueda,
    cambiarPagina: setPagina,
    abrirEmision: (consulta) => setModal({ tipo: 'emitir', consulta }),
    abrirRecetas: (consulta) => setModal({ tipo: 'recetas', consulta }),
    cerrarModal: () => setModal(null),
    cerrarUltimaReceta: () => setUltimaReceta(null),
    finalizarEmision,
  }
}
