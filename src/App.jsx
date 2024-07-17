import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home.jsx";
import Contact from "./components/pages/Contact.jsx";
import Company from "./components/pages/Company.jsx";
import NewProject from "./components/pages/NewProject.jsx";
import Projects from "./components/pages/Projects.jsx"

import Conteiner from './components/layout/Conteiner.jsx';
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Project from "./components/pages/Project.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Conteiner customClass="min-height">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </Conteiner>
      <Footer />
    </Router>
  );
}

export default App;
