import { useEffect, useState } from 'react';
import { buscarCancionEnYouTube } from '../../servicios/servicioYouTube';
import TarjetaCancion from '../TarjetaCancion/TarjetaCancion';
import './ListaCanciones.css';

export default function ListaCanciones({ canciones }) {
  const [cancionesConEnlaces, setCancionesConEnlaces] = useState([]);
  const [estaCargando, setEstaCargando] = useState(false);

  useEffect(() => {
    const tieneContenido = canciones && canciones.length > 0;

    if (!tieneContenido) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCancionesConEnlaces([]);
      return;
    }

    let estaActivo = true;
    setEstaCargando(true);

    const obtenerEnlaces = async () => {
      try {
        const cancionesEnlazadas = await Promise.all(
          canciones.map(async (cancion) => ({
            ...cancion,
            enlaceYouTube: await buscarCancionEnYouTube(cancion.nombre, cancion.artista)
          }))
        );
        
        if (estaActivo) {
          setCancionesConEnlaces(cancionesEnlazadas);
        }
      } catch (error) {
        console.error('Error al buscar enlaces de YouTube:', error);
      } finally {
        if (estaActivo) {
          setEstaCargando(false);
        }
      }
    };

    obtenerEnlaces();

    return () => {
      estaActivo = false;
    };
  }, [canciones]);

  if (canciones.length === 0) {
    return null;
  }

  return (
    <div className="lista-canciones">
      {estaCargando && <p className="cargando">Buscando en YouTube...</p>}
      
      {cancionesConEnlaces.length > 0 && (
        <>
          <h2>Tus recomendaciones de acuerdo a tu estado de ánimo🎶</h2>
          <div className="grid-canciones">
            {cancionesConEnlaces.map((cancion, index) => (
              <TarjetaCancion
                key={index}
                nombre={cancion.nombre}
                artista={cancion.artista}
                enlaceYouTube={cancion.enlaceYouTube}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
