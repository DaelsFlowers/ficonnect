import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traducciones de ejemplo
const resources = {
  en: {
    translation: {
      Login: "Login",
      Register: "Register",
      Welcome: "Welcome",
      Logout: "Logout",
      Email: "Email",
      ENG: "ENG",
      PASS: "Password",
      DONTACC: " Don't have an account?",
      CreateAccount: "Create Account",
      Name: "Name",
      ConPass: "Confirm password",
      Back: "Back",
      to: "to",
      succeslog: "You are logged in successfully",
    
      // Otros textos...
    },
  },
  es: {
    translation: {
      Login: "Iniciar Sesión",
      Register: "Registrarse",
      Welcome: "Bienvenido",
      Logout: "Cerrar sesión",
      ENG:"ESP",
      Email: "Correo",
      PASS: "Contraseña",
      DONTACC: "¿No tienes una cuenta?",
      CreateAccount: "Crear Cuenta",
      Name: "Nombre",
      ConPass: "Confirmar contraseña",
      Back: "Regresar",
      to: "a",
      succeslog: "Te has registrado con exito",
    
      
      // Otros textos...
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Idioma predeterminado
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React ya escapa por defecto
  },
});

export default i18n;
