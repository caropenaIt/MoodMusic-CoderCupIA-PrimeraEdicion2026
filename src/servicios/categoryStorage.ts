interface Cancion {
  nombre: string;
  artista: string;
  enlaceYouTube?: string;
  estadoAnimo?: string;
}

interface Recomendacion {
  id: string;
  estadoAnimo: string;
  canciones: Cancion[];
  fechaCreacion: string;
}

const CLAVE_STORAGE = 'moodmusic_historial';

export const guardarRecomendacion = (estadoAnimo: string, canciones: Cancion[]): void => {
  try {
    const historial = obtenerHistorial();
    
    const nuevaRecomendacion: Recomendacion = {
      id: Date.now().toString(),
      estadoAnimo,
      canciones,
      fechaCreacion: new Date().toLocaleString('es-ES')
    };

    historial.push(nuevaRecomendacion);
    
    // Guardar máximo 20 recomendaciones
    if (historial.length > 20) {
      historial.shift();
    }

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(historial));
  } catch (error) {
    console.error('Error al guardar recomendación:', error);
  }
};

export const obtenerHistorial = (): Recomendacion[] => {
  try {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return [];
  }
};

export const limpiarHistorial = (): void => {
  try {
    localStorage.removeItem(CLAVE_STORAGE);
  } catch (error) {
    console.error('Error al limpiar historial:', error);
  }
};
