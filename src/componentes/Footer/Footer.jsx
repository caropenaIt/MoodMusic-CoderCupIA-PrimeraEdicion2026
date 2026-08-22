import react from 'react';
import './Footer.css';
import waterMark from '/assets/logo-tres.png';

export default function Footer() {
 

  return (
    <div>

      <footer>
        <img src={waterMark} alt="marca de agua" />
        <p>Creado y desarrollado por <a href="https://www.linkedin.com/in/carolina-pena-astigarraga" target="_blank" rel="noopener noreferrer">Carolina Alejandra Pena Astigarraga</a> para CoderCup IA. Agosto 2026. Todos los derechos reservados 2026.</p>
      </footer>
    </div>
    
  );

        

};

