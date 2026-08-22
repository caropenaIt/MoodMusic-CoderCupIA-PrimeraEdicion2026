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
      <p>Cuéntanos cómo te sientes y te recomendaremos canciones</p>
      <div className="instrucciones">
       <h4>Instrucciones y recomendaciones</h4>
       <ol>
        <li>Escribe en el cuadro gris tus sentimientos. A veces tendrás que desarrollar un poquito si quieres recomendaciones de mejor calidad.</li>
        <li>Clickea o toca el botón "Recomendar canciones". Puede tardar unos segundos en emitir respuesta ya que la IA está procesando tu solicitud. Si aparece un error de demora, intente otra vez.</li>
        <li>Aparecerá un listado de 12 canciones acorde a tu prompt(petición) con el nombre del artista, la canción, y un enlace directo al Youtube oficial del cantante/banda.</li>
        <li>Debajo podrás en "Ver historial", las peticiones previas, que también puedes borrar por completo(registra hasta 20 peticiones).</li>
        <li>¡Disfruta de conocer canciones que enriquecerán tu experiencia de conocer música que vaya a la par de lo que sientes!</li>
       </ol>
      </div>
      <form onSubmit={manejarEnvio}>
        <textarea
          className="textarea-animo"
          placeholder="Ejemplo: Estoy triste pero quiero animarme, o me siento nostálgico..."
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
      {/* <footer>
        <p>Creado y desarrollado por Carolina Pena para CoderCup IA. Agosto 2026. Todos los derechos reservados 2026.</p>
      </footer> */}
    </div>
  );
}
