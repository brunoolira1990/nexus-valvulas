import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Inicializar AOS
AOS.init({
  // Configurações globais
  duration: 600, // duração da animação
  easing: 'ease-out-cubic', // tipo de easing
  once: false, // permitir replay
  mirror: true, // animar ao rolar para cima também
  offset: 120, // offset (em pixels) do elemento antes de ser animado
  delay: 0, // delay inicial
});

createRoot(document.getElementById("root")!).render(<App />);