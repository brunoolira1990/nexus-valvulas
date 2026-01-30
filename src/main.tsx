import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { reportWebVitals } from "./lib/web-vitals.ts";
import { initGA } from "@/components/Analytics";

// GA4: defina VITE_GA_MEASUREMENT_ID no .env ou substitua em Analytics.tsx
initGA();

// Inicializar AOS
AOS.init({
  // Configurações globais
  duration: 600, // duração da animação
  easing: "ease-out-cubic", // tipo de easing
  once: false, // permitir replay
  mirror: true, // animar ao rolar para cima também
  offset: 120, // offset (em pixels) do elemento antes de ser animado
  delay: 0, // delay inicial
});

// Reportar Web Vitals
reportWebVitals(console.log);

// Verificar se o módulo é carregado corretamente
if (import.meta.env.DEV) {
  console.log("Running in development mode");
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
