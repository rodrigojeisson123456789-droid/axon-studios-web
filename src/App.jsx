import { ExperienceProvider } from "./experience.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import Examples from "./components/Examples.jsx";
import Configurator from "./components/Configurator.jsx";
import Contact from "./components/Contact.jsx";
import { Process, FAQ, Footer } from "./components/StaticSections.jsx";
export default function App() {
  return (
    <ExperienceProvider>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        <Services />
        <Examples />
        <Process />
        <Configurator />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </ExperienceProvider>
  );
}
