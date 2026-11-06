import { RUTAS } from '../../../shared/utils/constants'

/** Ruta de la versión imprimible de una receta (CU18). */
export const rutaImprimir = (idReceta) => RUTAS.RECETA_IMPRIMIR.replace(':id', idReceta)
