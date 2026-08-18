import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

// Caché en memoria para evitar búsquedas duplicadas
const cacheYouTube = {};

export const buscarCancionEnYouTube = async (nombre, artista) => {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('VITE_YOUTUBE_API_KEY no está configurada');
      // Fallback: URL de búsqueda genérica
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(nombre + ' ' + artista)}`;
    }

    const clave = `${nombre}---${artista}`;

    // Si está en caché, retornar
    if (cacheYouTube[clave]) {
      return cacheYouTube[clave];
    }

    const respuesta = await axios.get(YOUTUBE_API_URL, {
      params: {
        q: `${nombre} ${artista}`,
        key: YOUTUBE_API_KEY,
        part: 'snippet',
        type: 'video',
        maxResults: 1
      }
    });

    if (respuesta.data.items && respuesta.data.items.length > 0) {
      const videoId = respuesta.data.items[0].id.videoId;
      const enlace = `https://www.youtube.com/watch?v=${videoId}`;
      
      // Guardar en caché
      cacheYouTube[clave] = enlace;
      
      return enlace;
    } else {
      // Si no encuentra, fallback a búsqueda genérica
      const enlaceFallback = `https://www.youtube.com/results?search_query=${encodeURIComponent(nombre + ' ' + artista)}`;
      cacheYouTube[clave] = enlaceFallback;
      return enlaceFallback;
    }

  } catch (error) {
    console.error('Error en servicioYouTube:', error);
    // Fallback silencioso a búsqueda genérica
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(nombre + ' ' + artista)}`;
  }
};
