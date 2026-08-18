import { useEffect, useState } from 'react';
import { obtenerHistorial, limpiarHistorial } from '../../servicios/categoryStorage';
import './HistorialRecomendaciones.css';

export default function HistorialRecomendaciones({ visible }) {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    if (visible) {
      const datos = obtenerHistorial();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHistorial(datos);
    } else {
      setHistorial([]);
    }
  }, [visible]);

  const manejarLimpiar = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
      limpiarHistorial();
      setHistorial([]);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="historial-recomendaciones">
      <div className="header-historial">
        <h3>📚 Historial de búsquedas</h3>
        {historial.length > 0 && (
          <button className="boton-limpiar" onClick={manejarLimpiar}>
            Limpiar historial
          </button>
        )}
      </div>

      {historial.length === 0 ? (
        <p className="vacio">No hay búsquedas en el historial</p>
      ) : (
        <ul className="lista-historial">
          {historial.map((item) => (
            <li key={item.id} className="item-historial">
              <strong>{item.estadoAnimo}</strong>
              <span className="fecha">{item.fechaCreacion}</span>
              <span className="cantidad">({item.canciones.length} canciones)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
