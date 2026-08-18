import './TarjetaCancion.css';

export default function TarjetaCancion({ nombre, artista, enlaceYouTube }) {
  return (
    <div className="tarjeta-cancion">
      <div className="contenido-tarjeta">
        <h3 className="nombre-cancion">{nombre}</h3>
        <p className="artista-cancion">{artista}</p>
      </div>
      <a 
        href={enlaceYouTube} 
        target="_blank" 
        rel="noopener noreferrer"
        className="enlace-youtube"
      >
        ▶ Escuchar en YouTube
      </a>
    </div>
  );
}
