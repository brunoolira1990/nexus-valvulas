import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traduções
const resources = {
  pt: {
    translation: {
      "navigation": {
        "home": "Início",
        "products": "Produtos",
        "about": "Sobre",
        "contact": "Contato",
        "blog": "Blog",
        "admin": "Admin"
      },
      "home": {
        "title": "Nexus Válvulas E Conexões Industriais",
        "subtitle": "Com mais de 20 anos de experiência no mercado, a Nexus é uma das principais fornecedoras de válvulas e conexões industriais no Brasil.",
        "learn_more": "Saiba Mais",
        "segments": "Segmentos Atendidos",
        "segments_description": "Atendemos diversos setores industriais com soluções especializadas e produtos de alta qualidade",
        "why_choose": "Por que escolher a Nexus?",
        "quality": "Qualidade",
        "service": "Atendimento",
        "delivery": "Entrega"
      },
      "products": {
        "title": "Nossos Produtos",
        "description": "Oferecemos uma linha completa de válvulas industriais para atender às mais diversas necessidades do setor industrial",
        "view_products": "Ver produtos →"
      },
      "contact": {
        "title": "Entre em Contato",
        "description": "Nossa equipe está pronta para ajudar você a encontrar a solução ideal para sua aplicação",
        "form_title": "Envie sua Mensagem",
        "name": "Nome",
        "company": "Empresa",
        "email": "E-mail",
        "phone": "Telefone",
        "subject": "Assunto",
        "message": "Mensagem",
        "send": "Enviar Mensagem",
        "info_title": "Informações de Contato",
        "address": "Endereço",
        "hours": "Horário de Atendimento",
        "hours_detail": "Segunda a Sexta: 8h às 18h"
      }
    }
  },
  en: {
    translation: {
      "navigation": {
        "home": "Home",
        "products": "Products",
        "about": "About",
        "contact": "Contact",
        "blog": "Blog",
        "admin": "Admin"
      },
      "home": {
        "title": "Nexus Industrial Valves and Fittings",
        "subtitle": "With over 20 years of experience in the market, Nexus is one of Brazil's leading suppliers of industrial valves and fittings.",
        "learn_more": "Learn More",
        "segments": "Served Segments",
        "segments_description": "We serve various industrial sectors with specialized solutions and high-quality products",
        "why_choose": "Why choose Nexus?",
        "quality": "Quality",
        "service": "Service",
        "delivery": "Delivery"
      },
      "products": {
        "title": "Our Products",
        "description": "We offer a complete line of industrial valves to meet the diverse needs of the industrial sector",
        "view_products": "View products →"
      },
      "contact": {
        "title": "Contact Us",
        "description": "Our team is ready to help you find the ideal solution for your application",
        "form_title": "Send your Message",
        "name": "Name",
        "company": "Company",
        "email": "Email",
        "phone": "Phone",
        "subject": "Subject",
        "message": "Message",
        "send": "Send Message",
        "info_title": "Contact Information",
        "address": "Address",
        "hours": "Business Hours",
        "hours_detail": "Monday to Friday: 8am to 6pm"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;