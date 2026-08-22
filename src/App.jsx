import { useState } from 'react';
import FormulaEstadoAnimo from './componentes/FormulaEstadoAnimo/FormulaEstadoAnimo';
import ListaCanciones from './componentes/ListaCanciones/ListaCanciones';
import HistorialRecomendaciones from './componentes/HistorialRecomendaciones/HistorialRecomendaciones';
import { guardarRecomendacion } from './servicios/categoryStorage';
import Footer from './componentes/Footer/Footer';
import './App.css';

export default function App() {
  const [recomendacionesActuales, setRecomendacionesActuales] = useState([]);
  const [historialVisible, setHistorialVisible] = useState(false);

  const manejarRecomendacionesGeneradas = (canciones) => {
    setRecomendacionesActuales(canciones);
    
    // Guardar en historial
    const estadoAnimo = canciones[0]?.estadoAnimo || '';
    guardarRecomendacion(estadoAnimo, canciones);
  };

  return (
    <div className="app-container">
      <FormulaEstadoAnimo onRecomendacionesGeneradas={manejarRecomendacionesGeneradas} />
      
      <ListaCanciones canciones={recomendacionesActuales} />
      
      <div className="boton-historial-container">
        <button 
          className="boton-historial"
          onClick={() => setHistorialVisible(!historialVisible)}
        >
          {historialVisible ? '✕ Cerrar historial' : '📜 Ver historial'}
        </button>
      </div>

      <HistorialRecomendaciones visible={historialVisible} />
      <Footer />
    </div>
  );
}
