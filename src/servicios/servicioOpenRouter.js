import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = (import.meta.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';

const normalizarJSON = (texto) => {
  let textoLimpio = texto.trim();

  if (textoLimpio.startsWith('```')) {
    const sinMarkdown = textoLimpio.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    textoLimpio = sinMarkdown;
  }

  const datos = JSON.parse(textoLimpio);

  if (Array.isArray(datos)) {
    return datos;
  }

  if (datos && Array.isArray(datos.canciones)) {
    return datos.canciones;
  }

  if (datos && Array.isArray(datos.songs)) {
    return datos.songs;
  }

  throw new Error('Respuesta de la IA no tiene el formato esperado.');
};

export const generarRecomendaciones = async (estadoAnimo) => {
  try {
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.trim() === '') {
      throw new Error('VITE_OPENROUTER_API_KEY no está configurada correctamente en .env.local');
    }

    const prompt = `Dame exactamente 12 recomendaciones de canciones para alguien que se siente "${estadoAnimo}".
Responde SOLO con un JSON válido sin explicaciones adicionales ni markdown. Estructura exacta:
{"canciones":[{"nombre":"Nombre Canción","artista":"Nombre Artista"},{"nombre":"Otra Canción","artista":"Otro Artista"}]}`;

    const respuesta = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: OPENROUTER_MODEL,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Mood Music'
        },
        timeout: 20000
      }
    );

    const contenido = respuesta.data?.choices?.[0]?.message?.content;

    if (!contenido) {
      throw new Error('La IA no devolvió contenido útil.');
    }

    const cancionesJSON = normalizarJSON(contenido);

    if (!Array.isArray(cancionesJSON) || cancionesJSON.length === 0) {
      throw new Error('La IA devolvió un array vacío.');
    }

    return cancionesJSON.map((cancion) => ({
      nombre: cancion.nombre || cancion.title || 'Sin título',
      artista: cancion.artista || cancion.artist || 'Artista desconocido',
      estadoAnimo
    }));
  } catch (error) {
    console.error('Error completo en servicioOpenRouter:', error);

    if (error.response?.status === 400) {
      throw new Error('Error 400: Solicitud inválida a la IA alternativa. Verifica la clave, el modelo y el formato del prompt.');
    }
    if (error.response?.status === 401) {
      throw new Error('Error 401: La API key de la IA no es válida, no tiene permisos o está vencida.');
    }
    if (error.response?.status === 404) {
      throw new Error('Error 404: El endpoint de la IA alternativa no está disponible. Revisa la URL base o el nombre del modelo.');
    }
    if (error.response?.status === 429) {
      throw new Error('Error 429: Límite de peticiones excedido. Intenta de nuevo más tarde.');
    }

    throw new Error(`Error al generar recomendaciones: ${error.message}`, { cause: error });
  }
};