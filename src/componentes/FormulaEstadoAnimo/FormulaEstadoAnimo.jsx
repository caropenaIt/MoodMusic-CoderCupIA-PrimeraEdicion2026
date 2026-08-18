import { useState } from 'react';
import { generarRecomendaciones } from '../../servicios/servicioOpenRouter';
import './FormulaEstadoAnimo.css';
import logo from '/assets/mmLogo.jpg';

export default function FormulaEstadoAnimo({ onRecomendacionesGeneradas }) {
  const [estadoAnimo, setEstadoAnimo] = useState('');
  const [estaCargando, setEstaCargando] = useState(false);
  const [error, setError] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!estadoAnimo.trim()) {
      setError('Por favor describe tu estado de ánimo');
      return;
    }

    setError('');
    setEstaCargando(true);

    try {
      const recomendaciones = await generarRecomendaciones(estadoAnimo);
      onRecomendacionesGeneradas(recomendaciones);
      setEstadoAnimo('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="formula-estado-animo">
      <img src={logo} alt="Logo Mood Music" className="logo" />
      <h1>Mood Music</h1>
      {/* <p className="subtitulo">Cuéntanos cómo te sientes y te recomendaremos canciones</p> */}
      <div className="instrucciones">
       <h4>Instrucciones</h4>
       <ol>
        <li>f</li>
        <li>f</li>
        <li>f</li>
        <li>f</li>
        <li>f</li>
       </ol>
      </div>
      <form onSubmit={manejarEnvio}>
        <textarea
          className="textarea-animo"
          placeholder="Ej: Estoy triste pero quiero animarme, o me siento nostálgico..."
          value={estadoAnimo}
          onChange={(e) => setEstadoAnimo(e.target.value)}
          disabled={estaCargando}
          rows="4"
        />
        
        <button 
          type="submit" 
          className="boton-recomendar"
          disabled={estaCargando}
        >
          {estaCargando ? 'Buscando canciones...' : 'Recomendar canciones'}
        </button>
      </form>

      {error && <div className="error-mensaje">{error}</div>}
    </div>
  );
}
